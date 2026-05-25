#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


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
    if "schema" not in args or "fixtures" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: validate_schema.py --schema <path> --fixtures <dir>", file=sys.stderr)
    raise SystemExit(2)


def validate(instance: dict[str, Any], schema: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    for field in schema.get("required", []):
        if field not in instance:
            errors.append(f"missing required property {field}")

    for field, rules in schema.get("properties", {}).items():
        if field not in instance:
            continue
        value = instance[field]
        if rules.get("type") == "string" and not isinstance(value, str):
            errors.append(f"{field} must be string")
            continue
        min_length = rules.get("minLength")
        if min_length and isinstance(value, str) and len(value) < min_length:
            errors.append(f"{field} is shorter than {min_length}")
        enum = rules.get("enum")
        if enum and value not in enum:
            errors.append(f"{field} must be one of {json.dumps(enum, ensure_ascii=False)}")

    return errors


def main() -> int:
    args = parse_args()
    schema = json.loads(Path(args["schema"]).read_text(encoding="utf-8"))
    fixtures_dir = Path(args["fixtures"])
    failed = False

    for path in sorted(fixtures_dir.glob("*.json")):
        instance = json.loads(path.read_text(encoding="utf-8"))
        expected_invalid = bool(instance.pop("_expected_invalid", False))
        errors = validate(instance, schema)

        if expected_invalid:
            if errors:
                print(f"{path.name}: expected invalid, rejected: {errors[0]}")
            else:
                print(f"{path.name}: expected invalid, accepted", file=sys.stderr)
                failed = True
        elif errors:
            print(f"{path.name}: expected valid, rejected: {json.dumps(errors, ensure_ascii=False)}", file=sys.stderr)
            failed = True
        else:
            print(f"{path.name}: valid")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
