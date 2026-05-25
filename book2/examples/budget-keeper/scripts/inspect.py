#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from typing import Any

CLAUSE_RE = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*(==|!=|<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$")


def evaluate(clause: str, result: dict[str, Any]) -> tuple[bool, str]:
    match = CLAUSE_RE.match(clause)
    if not match:
        return False, f"bad clause: {json.dumps(clause, ensure_ascii=False)}"
    name, op, literal = match.groups()
    if name not in result:
        return False, f"unknown field: {name}"
    value = result[name]
    if not isinstance(value, (int, float)):
        return False, f"field {name} is not numeric: {json.dumps(value, ensure_ascii=False)}"
    target = float(literal) if "." in literal else int(literal)
    ops = {
        "==": value == target,
        "!=": value != target,
        "<": value < target,
        "<=": value <= target,
        ">": value > target,
        ">=": value >= target,
    }
    ok = ops[op]
    return ok, f"{name}={value} {op} {target} -> {'ok' if ok else 'fail'}"


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
    if "result" not in args or "query" not in args:
        usage()
    return args


def usage() -> None:
    print('usage: inspect.py --result <path> --query "a==1 && b>=2"', file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    result = json.loads(Path(args["result"]).read_text(encoding="utf-8"))
    clauses = [clause.strip() for clause in args["query"].split("&&") if clause.strip()]
    if not clauses:
        print("empty query", file=sys.stderr)
        return 1

    all_ok = True
    for clause in clauses:
        ok, message = evaluate(clause, result)
        print(message, file=sys.stdout if ok else sys.stderr)
        all_ok = all_ok and ok
    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
