#!/usr/bin/env python3
import copy
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Callable

REQUIRED_NULLIFY_FIELDS = ("service_id", "severity", "sla_minutes")


def op_nullify(spec: dict[str, Any], rnd: int) -> dict[str, Any]:
    field = REQUIRED_NULLIFY_FIELDS[rnd % len(REQUIRED_NULLIFY_FIELDS)]
    out = copy.deepcopy(spec)
    out[field] = 0 if field == "sla_minutes" else ""
    return {
        "operator": "Nullify",
        "target_step": "Given:incident_received",
        "json_schema_rule": f"$.properties.{field}.minLength",
        "diff": {"before": {field: spec.get(field)}, "after": {field: out[field]}},
        "mutated_spec": out,
    }


def op_future_time(spec: dict[str, Any], _rnd: int) -> dict[str, Any]:
    out = copy.deepcopy(spec)
    out["response_timestamp"] = "2099-01-01T00:00:00Z"
    return {
        "operator": "FutureTime",
        "target_step": "When:evaluate_sla_window",
        "json_schema_rule": "$.properties.response_timestamp.format+maximum(now)",
        "diff": {
            "before": {"response_timestamp": spec.get("response_timestamp")},
            "after": {"response_timestamp": out["response_timestamp"]},
        },
        "mutated_spec": out,
    }


def op_escalation_cycle(spec: dict[str, Any], rnd: int) -> dict[str, Any]:
    out = copy.deepcopy(spec)
    graph = out.get("escalation_graph")
    if not isinstance(graph, dict) or len(graph.get("nodes", [])) < 2:
        return op_nullify(spec, rnd)
    last = graph["nodes"][-1]
    first = graph["nodes"][0]
    graph["edges"].append([last, first])
    return {
        "operator": "EscalationCycle",
        "target_step": "When:route_escalation",
        "json_schema_rule": "$defs.escalation_graph.no_cycles",
        "diff": {
            "before": {"edges": spec.get("escalation_graph", {}).get("edges")},
            "after": {"edges": graph["edges"]},
        },
        "mutated_spec": out,
    }


def op_priority_contradiction(spec: dict[str, Any], _rnd: int) -> dict[str, Any]:
    out = copy.deepcopy(spec)
    out["priority_rules"] = [{"from": "P1", "to": "P2"}, {"from": "P2", "to": "P1"}]
    return {
        "operator": "PriorityContradiction",
        "target_step": "When:resolve_priority",
        "json_schema_rule": "$defs.priority_rules.tie_breaker_required",
        "diff": {
            "before": {"priority_rules": spec.get("priority_rules")},
            "after": {"priority_rules": out["priority_rules"]},
        },
        "mutated_spec": out,
    }


OPERATORS: dict[str, Callable[[dict[str, Any], int], dict[str, Any]]] = {
    "Nullify": op_nullify,
    "FutureTime": op_future_time,
    "EscalationCycle": op_escalation_cycle,
    "PriorityContradiction": op_priority_contradiction,
}


def make_mutation_id(seed: int, operator: str, index: int) -> str:
    digest = hashlib.sha1(f"{seed}:{operator}:{index}".encode("utf-8")).hexdigest()[:10]
    return f"m_{seed}_{operator.lower()}_{digest}"


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
    if "base" not in args or "seed" not in args:
        usage()
    args.setdefault("operators", "Nullify,FutureTime,EscalationCycle,PriorityContradiction")
    args.setdefault("out", "out/mutations")
    return args


def usage() -> None:
    print("usage: mutate_specs.py --base <path> --seed <int> [--operators a,b] [--out <dir>]", file=sys.stderr)
    raise SystemExit(2)


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    seed = int(args["seed"])
    base = json.loads(Path(args["base"]).read_text(encoding="utf-8"))
    requested = [op.strip() for op in args["operators"].split(",") if op.strip()]
    out_dir = Path(args["out"])
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest: list[dict[str, Any]] = []
    for idx, op_name in enumerate(requested):
        op = OPERATORS.get(op_name)
        if op is None:
            print(f"unknown operator: {op_name}", file=sys.stderr)
            return 1
        mutation = op(base, (seed + idx) % 1000)
        mutation_id = make_mutation_id(seed, op_name, idx)
        record = {
            "mutation_id": mutation_id,
            "operator": mutation["operator"],
            "target_step": mutation["target_step"],
            "json_schema_rule": mutation["json_schema_rule"],
            "diff": mutation["diff"],
        }
        manifest.append(record)
        write_json(out_dir / f"{mutation_id}.json", {**record, "mutated_spec": mutation["mutated_spec"]})

    write_json(
        out_dir / "manifest.json",
        {
            "seed": seed,
            "base_spec_id": base.get("spec_id"),
            "operators": requested,
            "mutations": manifest,
        },
    )

    print(f"wrote {len(manifest)} mutations to {out_dir}")
    for row in manifest:
        print(f"  {row['mutation_id']:<55} {row['operator']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
