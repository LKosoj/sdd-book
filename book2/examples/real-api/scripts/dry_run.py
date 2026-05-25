#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


def extract_actions(spec_text: str) -> list[str]:
    match = re.search(r"##\s*Pre-approved actions\s*\n([\s\S]+?)(?:\n##|$)", spec_text)
    if not match:
        return []
    return re.findall(r"`([a-z_][a-z0-9_]*)`", match.group(1))


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
    if "spec" not in args or "action" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: dry_run.py --spec <path> --action <name>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    actions = extract_actions(Path(args["spec"]).read_text(encoding="utf-8"))

    if not actions:
        print(f"BLOCK: в {args['spec']} нет блока 'Pre-approved actions'", file=sys.stderr)
        return 1
    if args["action"] not in actions:
        print(f"BLOCK: action={json.dumps(args['action'], ensure_ascii=False)} не найден среди pre-approved: {json.dumps(actions, ensure_ascii=False)}", file=sys.stderr)
        return 1

    print(f"PASS: action={args['action']} разрешён ({len(actions)} actions в spec)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
