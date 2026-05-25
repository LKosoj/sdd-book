#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


def js_round(value: float, digits: int) -> float:
    return float(f"{value:.{digits}f}")


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0
    ordered = sorted(values)
    idx = max(0, min(len(ordered) - 1, round((pct / 100) * (len(ordered) - 1))))
    return ordered[idx]


def parse_args() -> dict[str, str]:
    args: dict[str, str] = {}
    argv = sys.argv[1:]
    if len(argv) % 2:
        usage()
    for i in range(0, len(argv), 2):
        key = argv[i].removeprefix("--")
        value = argv[i + 1]
        if not key:
            usage()
        args[key] = value
    if "validator-results" not in args or "expected" not in args:
        usage()
    args.setdefault("out", "out/immunity.json")
    return args


def usage() -> None:
    print("usage: immunity_score.py --validator-results <path> --expected <path> [--out <path>]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    results = json.loads(Path(args["validator-results"]).read_text(encoding="utf-8"))["results"]
    expected = json.loads(Path(args["expected"]).read_text(encoding="utf-8"))
    by_operator = expected["by_operator"]
    thresholds = expected["thresholds"]

    strict_hits = 0
    depths: list[float] = []
    times: list[float] = []
    per_mutation: list[dict[str, Any]] = []

    for row in results:
        exp = by_operator.get(row["operator"], {})
        expected_code = exp.get("diagnostic_code")
        expected_halt = exp.get("halt_before")
        strict = row.get("diagnostic_code") == expected_code and row.get("halt_before") == expected_halt
        strict_hits += int(strict)
        depths.append(row.get("depth", 0))
        times.append(row.get("elapsed_ms", 0))
        per_mutation.append(
            {
                "mutation_id": row["mutation_id"],
                "operator": row["operator"],
                "expected_code": expected_code,
                "actual_code": row.get("diagnostic_code"),
                "expected_halt": expected_halt,
                "actual_halt": row.get("halt_before"),
                "strict": strict,
            }
        )

    total = len(results)
    strict_rate = strict_hits / total if total else 0
    depth_avg = sum(depths) / len(depths) if depths else 0
    recovery_p95 = percentile(times, 95)

    checks = {
        "strict_reject_rate": {
            "value": js_round(strict_rate, 4),
            "threshold": thresholds["strict_reject_rate_min"],
            "op": ">=",
            "ok": strict_rate >= thresholds["strict_reject_rate_min"],
        },
        "depth_of_diagnostics": {
            "value": js_round(depth_avg, 2),
            "threshold": thresholds["depth_of_diagnostics_min"],
            "op": ">=",
            "ok": depth_avg >= thresholds["depth_of_diagnostics_min"],
        },
        "recovery_time_p95_ms": {
            "value": js_round(recovery_p95, 3),
            "threshold": thresholds["recovery_time_p95_ms_max"],
            "op": "<=",
            "ok": recovery_p95 <= thresholds["recovery_time_p95_ms_max"],
        },
    }
    failed = [name for name, check in checks.items() if not check["ok"]]
    verdict = "PASS" if not failed else "FAIL"
    report = {
        "total": total,
        "strict_hits": strict_hits,
        "checks": checks,
        "per_mutation": per_mutation,
        "verdict": verdict,
        "failed_checks": failed,
    }

    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"immunity report written to {out_path}")
    for name, check in checks.items():
        print(f"  {'OK  ' if check['ok'] else 'FAIL'} {name}={check['value']} {check['op']} {check['threshold']}")
    print(f"verdict: {verdict}")
    return 0 if verdict == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
