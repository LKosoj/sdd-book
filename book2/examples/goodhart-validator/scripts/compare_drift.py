#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


def js_round(value: float, digits: int) -> float:
    return float(f"{value:.{digits}f}")


def compute_drift(baseline: dict[str, Any], next_metrics: dict[str, Any]) -> dict[str, Any]:
    base_edges = baseline.get("edge_correlations", {})
    new_edges = next_metrics.get("edge_correlations", {})
    keys = sorted(set(base_edges) | set(new_edges))
    per_edge: list[dict[str, Any]] = []
    diffs: list[float] = []

    for key in keys:
        if key not in base_edges:
            diff = abs(float(new_edges[key]))
            per_edge.append({"edge": key, "baseline": None, "new": new_edges[key], "delta": js_round(diff, 4)})
        elif key not in new_edges:
            diff = abs(float(base_edges[key]))
            per_edge.append({"edge": key, "baseline": base_edges[key], "new": None, "delta": js_round(diff, 4)})
        else:
            diff = abs(float(new_edges[key]) - float(base_edges[key]))
            per_edge.append({"edge": key, "baseline": base_edges[key], "new": new_edges[key], "delta": js_round(diff, 4)})
        diffs.append(diff)

    edge_drift = sum(diffs) / len(diffs) if diffs else 0
    return {"edge_drift": js_round(edge_drift, 4), "per_edge": per_edge}


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
    print("usage: compare_drift.py --baseline <path> --new <path> [--threshold f] [--json]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    if "baseline" not in args or "new" not in args:
        usage()
    threshold = float(args.get("threshold", 0.12))
    baseline = json.loads(Path(str(args["baseline"])).read_text(encoding="utf-8"))
    next_metrics = json.loads(Path(str(args["new"])).read_text(encoding="utf-8"))
    report = compute_drift(baseline, next_metrics)
    report["threshold"] = threshold
    report["status"] = "PASS" if report["edge_drift"] <= threshold else "FAIL"

    if args.get("json"):
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"edge_drift={report['edge_drift']} threshold={threshold:g} -> {report['status']}")
        for row in report["per_edge"]:
            print(f"  {row['edge']:<42} {row['baseline']} -> {row['new']} | Δ={row['delta']}")
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
