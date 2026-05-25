#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from typing import Any


def parse_scalar(raw: str) -> str | int:
    value = raw.strip()
    if re.fullmatch(r"\d+", value):
        return int(value)
    return value


def parse_budget_yaml(text: str) -> dict[str, Any]:
    result: dict[str, Any] = {}
    stack: list[tuple[int, dict[str, Any]]] = [(0, result)]

    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].rstrip()
        if not line.strip():
            continue
        indent = len(line) - len(line.lstrip())
        content = line.strip()
        while stack and stack[-1][0] > indent:
            stack.pop()
        container = stack[-1][1]
        if ":" not in content:
            raise ValueError(f"bad line: {raw_line!r}")
        key, value = [part.strip() for part in content.split(":", 1)]
        if value == "":
            child: dict[str, Any] = {}
            container[key] = child
            stack.append((indent + 2, child))
        else:
            container[key] = parse_scalar(value)

    return result


def compile_plan(spec: dict[str, Any]) -> dict[str, Any]:
    daily = spec.get("daily_budget_tokens")
    phases = spec.get("phases", {})
    if not isinstance(daily, int):
        raise ValueError("daily_budget_tokens must be integer")
    if not phases:
        raise ValueError("phases section is empty")

    totals = {"local": 0, "frontier": 0}
    flat: dict[str, Any] = {}
    for name, body in phases.items():
        if not isinstance(body, dict):
            raise ValueError(f"phase {name} must be a mapping")
        local = body.get("local-coder", 0)
        frontier = body.get("frontier-reviewer", 0)
        if not isinstance(local, int) or not isinstance(frontier, int):
            raise ValueError(f"phase {name}: quotas must be integers")
        totals["local"] += local
        totals["frontier"] += frontier
        flat[name] = {"local-coder": local, "frontier-reviewer": frontier, "sla_p95": body.get("sla_p95")}

    sum_total = totals["local"] + totals["frontier"]
    if sum_total != daily:
        raise ValueError(f"sum of phases {sum_total} != daily_budget_tokens {daily}")

    return {"daily_budget_tokens": daily, "totals": totals, "phases": flat}


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
    if "budget-spec" not in args or "out" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: compile.py --budget-spec <path> --out <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    spec = parse_budget_yaml(Path(args["budget-spec"]).read_text(encoding="utf-8"))
    try:
        plan = compile_plan(spec)
    except ValueError as exc:
        print(f"compile failed: {exc}", file=sys.stderr)
        return 1

    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"compiled: daily={plan['daily_budget_tokens']} local={plan['totals']['local']} frontier={plan['totals']['frontier']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
