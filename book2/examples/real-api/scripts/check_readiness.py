#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any

THRESHOLD = 23
AXES = ("spec", "implementation", "verification", "process", "security")


def check(readiness: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    scores = readiness.get("scores", {})
    missing = [axis for axis in AXES if axis not in scores]
    if missing:
        failures.append(f"отсутствуют оси: {', '.join(missing)}")

    total = sum(scores.get(axis, 0) for axis in AXES)
    if total < THRESHOLD:
        failures.append(f"score {total}/25 ниже порога {THRESHOLD}")

    checks = readiness.get("checks", {})
    if checks.get("audit_trace_coverage", 0) < 1.0:
        failures.append(f"audit_trace_coverage={checks.get('audit_trace_coverage')} < 1.0 — обязательно полное покрытие")
    if not checks.get("rollback_condition_present"):
        failures.append("отсутствует rollback_condition")
    if not checks.get("blast_radius_known"):
        failures.append("неопределён blast_radius")
    if readiness.get("stateful") and not checks.get("backup_verified"):
        failures.append("stateful workload без подтверждённого бэкапа")

    return failures


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
    if "readiness" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: check_readiness.py --readiness <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    readiness = json.loads(Path(args["readiness"]).read_text(encoding="utf-8"))
    failures = check(readiness)
    total = sum(readiness.get("scores", {}).get(axis, 0) for axis in AXES)
    incident = readiness.get("incident_id", "?")

    if failures:
        print(f"BLOCK incident={incident} score={total}/25", file=sys.stderr)
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)
        return 1

    print(f"PASS incident={incident} score={total}/25")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
