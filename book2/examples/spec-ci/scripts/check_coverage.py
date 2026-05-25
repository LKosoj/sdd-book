#!/usr/bin/env python3
import re
import sys
from pathlib import Path

REQ_RE = re.compile(r"\bREQ-\d{3}\b")
IMPLEMENTS_RE = re.compile(r"implements:\s*\[([^\]]*)\]")


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
    if "requirements" not in args or "plan" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: check_coverage.py --requirements <path> --plan <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    requirements_text = Path(args["requirements"]).read_text(encoding="utf-8")
    plan_text = Path(args["plan"]).read_text(encoding="utf-8")

    req_ids = sorted(set(REQ_RE.findall(requirements_text)))
    implemented: set[str] = set()
    rogue_tasks: list[str] = []

    for line in plan_text.splitlines():
        if "TASK-" not in line:
            continue
        match = IMPLEMENTS_RE.search(line)
        if not match:
            rogue_tasks.append(line.strip())
            continue
        implemented.update(REQ_RE.findall(match.group(1)))

    req_set = set(req_ids)
    missing = [req for req in req_ids if req not in implemented]
    unknown = sorted(req for req in implemented if req not in req_set)

    if missing or unknown or rogue_tasks:
        if missing:
            print(f"Missing requirements: {', '.join(missing)}", file=sys.stderr)
        if unknown:
            print(f"Unknown requirements in plan: {', '.join(unknown)}", file=sys.stderr)
        if rogue_tasks:
            print("Tasks without implements:\n- " + "\n- ".join(rogue_tasks), file=sys.stderr)
        return 1

    print(f"coverage ok: {len(req_ids)} requirements covered")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
