#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any

CHECKS = [
    ("false_escalation_rate", "false_escalation_rate_max", "<="),
    ("silent_p0_ratio", "silent_p0_ratio_max", "<="),
    ("rollback_flapping_per_hour", "rollback_flapping_per_hour_max", "<="),
    ("audit_trace_coverage", "audit_trace_coverage_min", ">="),
    ("mttr_p95_minutes", "mttr_p95_minutes_max", "<="),
]


def js_number(value: float) -> int | float:
    return int(value) if float(value).is_integer() else value


def evaluate(metric: float, threshold: float, op: str) -> bool:
    return metric <= threshold if op == "<=" else metric >= threshold


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
    if "metrics" not in args:
        usage()
    args.setdefault("out", "out/invariants.json")
    return args


def usage() -> None:
    print("usage: check_invariants.py --metrics <path> [--out <path>]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    payload = json.loads(Path(args["metrics"]).read_text(encoding="utf-8"))
    thresholds = payload["thresholds"]
    checks: list[dict[str, Any]] = []
    failed = 0

    for metric_key, threshold_key, op in CHECKS:
        metric = float(payload[metric_key])
        threshold = float(thresholds[threshold_key])
        ok = evaluate(metric, threshold, op)
        failed += int(not ok)
        metric_value = js_number(metric)
        threshold_value = js_number(threshold)
        checks.append({"metric": metric_key, "value": metric_value, "threshold": threshold_value, "op": op, "ok": ok})
        print(f"{'OK  ' if ok else 'FAIL'} {metric_key}={metric_value} {op} {threshold_value}", file=sys.stderr)

    report = {
        "session_id": payload.get("session_id"),
        "window": payload.get("window"),
        "checks": checks,
        "failed": failed,
        "verdict": "PASS" if failed == 0 else "FAIL",
    }
    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"invariants result written to {out_path}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
