#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any

from compare_drift import compute_drift
from run_validation import evaluate, load_validation


def parse_args() -> dict[str, Any]:
    args: dict[str, Any] = {}
    argv = sys.argv[1:]
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg == "--json":
            args["json"] = True
            i += 1
            continue
        if arg.startswith("--") and i + 1 < len(argv):
            args[arg[2:]] = argv[i + 1]
            i += 2
            continue
        usage()
    return args


def usage() -> None:
    print("usage: ci_gate.py --validation <path> --baseline <path> --new <path> [--drift-threshold f] [--json]", file=sys.stderr)
    raise SystemExit(2)


def compact_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def main() -> int:
    args = parse_args()
    if "validation" not in args or "baseline" not in args or "new" not in args:
        usage()
    drift_threshold = float(args.get("drift-threshold", 0.12))

    spec = load_validation(str(args["validation"]))
    new_metrics = json.loads(Path(str(args["new"])).read_text(encoding="utf-8"))
    baseline_metrics = json.loads(Path(str(args["baseline"])).read_text(encoding="utf-8"))

    validation_result = evaluate(spec, new_metrics)
    drift_report = compute_drift(baseline_metrics, new_metrics)
    drift_report["threshold"] = drift_threshold
    drift_report["status"] = "PASS" if drift_report["edge_drift"] <= drift_threshold else "FAIL"

    overall = "PASS"
    reasons: list[str] = []
    if validation_result["status"] != "PASS":
        overall = "FAIL"
        reasons.append(f"validation:{validation_result['status']}")
    if drift_report["status"] != "PASS":
        overall = "FAIL"
        reasons.append("drift:FAIL")

    combined = {"overall": overall, "reasons": reasons, "validation": validation_result, "drift": drift_report}
    if args.get("json"):
        print(json.dumps(combined, ensure_ascii=False, indent=2))
    else:
        print(f"ci_gate: {overall} reasons={compact_json(reasons or ['none'])}")
        print(f"  validation.status: {validation_result['status']}")
        for invariant in validation_result["invariants"]:
            print(f"    invariant {'OK' if invariant['ok'] else 'FAIL'} {invariant['name']}")
        for check in validation_result["checks"]:
            if check.get("skipped"):
                continue
            if not check.get("triggered"):
                print(f"    check IDLE {check['name']}")
                continue
            mark = "OK" if check["ok"] else check.get("fail", "FAIL")
            print(f"    check {mark} {check['name']}")
        print(f"  drift.status: {drift_report['status']} edge_drift={drift_report['edge_drift']}")
    return 0 if overall == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
