#!/usr/bin/env python3
import json
import math
import sys
from pathlib import Path
from typing import Any


def parse_mini_yaml(text: str) -> dict[str, Any]:
    root: dict[str, Any] = {}
    stack: list[tuple[int, Any]] = [(-1, root)]

    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue

        indent = len(line) - len(line.lstrip())
        content = line.strip()

        while stack and indent <= stack[-1][0] and stack[-1][0] >= 0:
            stack.pop()
        parent = stack[-1][1]

        if content.startswith("- "):
            value = content[2:].strip()
            if isinstance(parent, dict) and not parent:
                grand = stack[-2][1]
                if not isinstance(grand, dict):
                    raise ValueError(f"не нашёл ключ для списка: {line!r}")
                key_for_parent = next((key for key, val in grand.items() if val is parent), None)
                if key_for_parent is None:
                    raise ValueError(f"не нашёл ключ для списка: {line!r}")
                new_list: list[Any] = []
                grand[key_for_parent] = new_list
                stack[-1] = (stack[-1][0], new_list)
                parent = new_list
            if not isinstance(parent, list):
                raise ValueError(f"список вне списка: {line!r}")
            parent.append(value)
            continue

        if ":" not in content:
            raise ValueError(f"строка без ':' и без '- ': {line!r}")
        key, rest = [part.strip() for part in content.split(":", 1)]
        if not isinstance(parent, dict):
            raise ValueError(f"ключ вне mapping: {line!r}")
        if rest == "":
            child: dict[str, Any] = {}
            parent[key] = child
            stack.append((indent, child))
        else:
            parent[key] = rest

    return root


def num(value: Any) -> float:
    return value if isinstance(value, (int, float)) else float(value)


def simulate_allowed_delta(given: dict[str, Any], when: dict[str, Any]) -> dict[str, Any]:
    current = math.trunc(num(given["current_replicas"]))
    pod_cpu = num(given["pod_cpu"])
    quota = math.trunc(num(given["remaining_quota"]))
    max_replicas = math.trunc(num(given["max_replicas"]))
    clamp_policy = given.get("clamp_policy", "soft_clamp")

    scale_pct = math.trunc(num(when.get("scale_up_percent", 0)))
    requested_delta = math.floor((current * scale_pct) / 100)
    quota_delta = math.floor(quota / pod_cpu) if pod_cpu > 0 else 0
    headroom_delta = max(0, max_replicas - current)
    allowed_delta = min(requested_delta, quota_delta, headroom_delta)

    diagnostic_code = None
    if requested_delta > quota_delta:
        diagnostic_code = "QUOTA_EXCEEDED_AFTER_CLAMP"
    elif requested_delta > headroom_delta:
        diagnostic_code = "MAX_REPLICAS_REACHED"
    elif allowed_delta == 0 and requested_delta > 0:
        diagnostic_code = "NO_CAPACITY_LEFT"
    if clamp_policy == "hard_block" and allowed_delta < requested_delta:
        diagnostic_code = "HARD_BLOCK_REQUESTED_OVERSHOOT"

    return {
        "requested_delta": requested_delta,
        "quota_delta": quota_delta,
        "headroom_delta": headroom_delta,
        "allowed_delta": allowed_delta,
        "diagnostic_code": diagnostic_code,
    }


def simulate_dedup(case: dict[str, Any], given: dict[str, Any]) -> str | None:
    duplicate = case["when_payload"].get("duplicate_within_seconds")
    if duplicate is None:
        return None
    window = math.trunc(num(given.get("dedup_window_seconds", 0)))
    return "DUPLICATE_WEBHOOK_DEDUPED" if duplicate < window else None


def judge(case: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    sim = simulate_allowed_delta(case["given_snapshot"], case["when_payload"])
    actual_code = simulate_dedup(case, case["given_snapshot"]) or sim["diagnostic_code"]
    expected = case["expected_failure"]
    expected_code = expected.get("diagnostic_code")
    expected_upper = expected.get("executed_delta_upper_bound")

    reasons: list[str] = []
    if expected_code is not None and actual_code != expected_code:
        reasons.append(f"diagnostic_code: ожидали {json.dumps(expected_code, ensure_ascii=False)}, получили {json.dumps(actual_code, ensure_ascii=False)}")
    if expected_upper is not None and sim["allowed_delta"] > expected_upper:
        reasons.append(f"allowed_delta={sim['allowed_delta']} превышает upper_bound={expected_upper}")

    if not reasons:
        verdict = "PASS"
    elif actual_code is None:
        verdict = "FAIL"
    else:
        verdict = "DEFERRED"

    return {
        "counterexample_id": case["counterexample_id"],
        "assertion_id": case["assertion_id"],
        "spec_id": spec.get("spec_id"),
        "verdict": verdict,
        "actual": {
            "diagnostic_code": actual_code,
            "allowed_delta": sim["allowed_delta"],
            "requested_delta": sim["requested_delta"],
        },
        "expected": expected,
        "reasons": reasons,
    }


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
    if "spec" not in args or "cases" not in args:
        usage()
    args.setdefault("out", "out/duel.json")
    return args


def usage() -> None:
    print("usage: run_duel.py --spec <path> --cases <dir> [--out <path>]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    spec = parse_mini_yaml(Path(args["spec"]).read_text(encoding="utf-8"))
    cases_dir = Path(args["cases"])
    results: list[dict[str, Any]] = []

    for path in sorted(cases_dir.glob("*.json")):
        case = json.loads(path.read_text(encoding="utf-8"))
        result = judge(case, spec)
        results.append(result)
        print(f"{result['verdict']:<9} {result['counterexample_id']}", file=sys.stderr)
        for reason in result["reasons"]:
            print(f"          reason: {reason}", file=sys.stderr)

    summary = {
        "spec_id": spec.get("spec_id"),
        "total": len(results),
        "pass": sum(row["verdict"] == "PASS" for row in results),
        "fail": sum(row["verdict"] == "FAIL" for row in results),
        "deferred": sum(row["verdict"] == "DEFERRED" for row in results),
        "results": results,
    }
    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"duel result written to {out_path}")
    return 0 if summary["fail"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
