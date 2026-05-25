#!/usr/bin/env python3
import json
import sys
import time
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = ("service_id", "severity", "sla_minutes", "event_received_at", "response_timestamp")
SEVERITY_ENUM = {"P0", "P1", "P2", "P3"}


def has_cycle(nodes: list[str], edges: list[list[str]]) -> bool:
    graph = {node: [] for node in nodes}
    for a, b in edges:
        if a in graph and b in graph:
            graph[a].append(b)
    state = {node: "white" for node in nodes}

    def visit(node: str) -> bool:
        state[node] = "gray"
        for nxt in graph[node]:
            if state[nxt] == "gray":
                return True
            if state[nxt] == "white" and visit(nxt):
                return True
        state[node] = "black"
        return False

    return any(state[node] == "white" and visit(node) for node in nodes)


def priority_contradiction(rules: list[dict[str, Any]]) -> bool:
    pairs: set[str] = set()
    without_tie_breaker: list[tuple[Any, Any]] = []
    for rule in rules:
        if "tie_breaker" not in rule:
            without_tie_breaker.append((rule.get("from"), rule.get("to")))
            pairs.add(f"{rule.get('from')}->{rule.get('to')}")
    return any(f"{b}->{a}" in pairs and a != b for a, b in without_tie_breaker)


def validate(spec: dict[str, Any]) -> dict[str, Any]:
    for field in REQUIRED_FIELDS:
        if field not in spec:
            return {"diagnostic_code": "EMPTY_REQUIRED_FIELD", "halt_before": "When:evaluate_sla_window", "field": field, "depth": 3}
        value = spec[field]
        if isinstance(value, str) and value == "":
            return {"diagnostic_code": "EMPTY_REQUIRED_FIELD", "halt_before": "When:evaluate_sla_window", "field": field, "depth": 3}
        if field == "sla_minutes" and (not isinstance(value, int) or value <= 0):
            return {"diagnostic_code": "EMPTY_REQUIRED_FIELD", "halt_before": "When:evaluate_sla_window", "field": field, "depth": 3}

    if str(spec.get("severity")) not in SEVERITY_ENUM:
        return {"diagnostic_code": "INVALID_SEVERITY", "halt_before": "When:evaluate_sla_window", "field": "severity", "depth": 2}

    now = spec.get("now")
    response = spec.get("response_timestamp")
    if isinstance(now, str) and isinstance(response, str) and response > now:
        return {"diagnostic_code": "INVALID_TIME_ANCHOR", "halt_before": "When:evaluate_sla_window", "field": "response_timestamp", "depth": 4}

    graph = spec.get("escalation_graph") or {}
    if has_cycle(graph.get("nodes", []), graph.get("edges", [])):
        return {"diagnostic_code": "CYCLE_ESCALATION", "halt_before": "When:route_escalation", "field": "escalation_graph", "depth": 5}

    if priority_contradiction(spec.get("priority_rules", [])):
        return {"diagnostic_code": "PRIORITY_REVERSAL", "halt_before": "When:resolve_priority", "field": "priority_rules", "depth": 4}

    return {"diagnostic_code": None, "halt_before": None, "depth": 0}


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
    if "mutations" not in args:
        usage()
    args.setdefault("out", "out/validator_results.json")
    return args


def usage() -> None:
    print("usage: fake_validator.py --mutations <dir> [--out <path>]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    mutations_dir = Path(args["mutations"])
    manifest = json.loads((mutations_dir / "manifest.json").read_text(encoding="utf-8"))

    results: list[dict[str, Any]] = []
    for record in manifest["mutations"]:
        payload = json.loads((mutations_dir / f"{record['mutation_id']}.json").read_text(encoding="utf-8"))
        start = time.perf_counter()
        verdict = validate(payload["mutated_spec"])
        elapsed_ms = (time.perf_counter() - start) * 1000
        results.append(
            {
                "mutation_id": record["mutation_id"],
                "operator": record["operator"],
                "diagnostic_code": verdict["diagnostic_code"],
                "halt_before": verdict["halt_before"],
                "depth": verdict["depth"],
                "elapsed_ms": float(f"{elapsed_ms:.3f}"),
            }
        )

    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps({"results": results}, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"validator results written to {out_path}")
    for row in results:
        code = row["diagnostic_code"] or "PASS_THROUGH"
        print(f"  {row['mutation_id']:<55} {row['operator']:<25} {code}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
