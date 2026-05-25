#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from typing import Any, Callable

Op = str
OPS: dict[Op, Callable[[float, float], bool]] = {
    ">=": lambda a, b: a >= b,
    "<=": lambda a, b: a <= b,
    ">": lambda a, b: a > b,
    "<": lambda a, b: a < b,
    "==": lambda a, b: abs(a - b) < 1e-9,
}


def coerce(value: str) -> str | int | float:
    if value == "":
        return ""
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if re.fullmatch(r"-?\d+\.\d+", value):
        return float(value)
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    return value


def load_validation(path: str) -> dict[str, Any]:
    spec: dict[str, Any] = {"invariants": [], "checks": []}
    section: str | None = None
    item: dict[str, Any] | None = None
    list_field: str | None = None
    list_indent = -1

    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        stripped = line.lstrip()

        if indent == 0:
            key, value = [part.strip() for part in line.split(":", 1)]
            if key in ("invariants", "checks"):
                section = key
                item = None
                list_field = None
                continue
            section = None
            item = None
            list_field = None
            spec[key] = coerce(value)
            continue

        if section is None:
            continue

        if stripped.startswith("- ") and indent == 2:
            item = {}
            spec[section].append(item)
            list_field = None
            key, value = [part.strip() for part in stripped[2:].split(":", 1)]
            item[key] = coerce(value)
            continue

        if item is None:
            continue

        if list_field is not None and stripped.startswith("- ") and indent > list_indent:
            item[list_field].append(coerce(stripped[2:].strip()))
            continue

        if indent == 4:
            list_field = None
            key, value = [part.strip() for part in stripped.split(":", 1)]
            if value == "":
                item[key] = []
                list_field = key
                list_indent = indent
            else:
                item[key] = coerce(value)

    return spec


def evaluate_invariant(invariant: dict[str, Any], metrics: dict[str, Any]) -> tuple[bool, str]:
    metric = str(invariant["metric"])
    op = str(invariant["operator"])
    threshold = float(invariant["threshold"])
    if metric not in metrics:
        return False, f"missing metric {metric}"
    actual = float(metrics[metric])
    ok = OPS[op](actual, threshold)
    return ok, f"{metric}={actual:g} {op} {threshold:g} -> {'ok' if ok else 'violated'}"


def evaluate(spec: dict[str, Any], metrics: dict[str, Any]) -> dict[str, Any]:
    results: dict[str, Any] = {"invariants": [], "checks": [], "status": "PASS"}
    invariant_results: dict[str, bool] = {}

    for invariant in spec["invariants"]:
        ok, explanation = evaluate_invariant(invariant, metrics)
        invariant_results[str(invariant["name"])] = ok
        results["invariants"].append({"name": str(invariant["name"]), "ok": ok, "explanation": explanation})
        if not ok:
            results["status"] = "FAIL"

    for check in spec["checks"]:
        if check.get("mode") == "correlation_guard":
            results["checks"].append({"name": str(check["name"]), "skipped": True, "reason": "needs baseline; run compare_drift.py"})
            continue
        when_metric = str(check["when_metric"]) if check.get("when_metric") else None
        if not when_metric:
            continue
        when_op = str(check["when_operator"])
        when_threshold = float(check["when_threshold"])
        if when_metric not in metrics:
            results["checks"].append({"name": str(check["name"]), "triggered": False, "reason": f"missing metric {when_metric}"})
            continue
        triggered = OPS[when_op](float(metrics[when_metric]), when_threshold)
        if not triggered:
            results["checks"].append({"name": str(check["name"]), "triggered": False})
            continue
        assert_names = [str(name) for name in check.get("assert_invariants", [])]
        violated = [name for name in assert_names if not invariant_results.get(name)]
        ok = len(violated) == 0
        entry: dict[str, Any] = {"name": str(check["name"]), "triggered": True, "ok": ok, "violated_invariants": violated}
        if not ok:
            fail = str(check.get("fail", "FAIL"))
            entry["fail"] = fail
            results["status"] = fail
        results["checks"].append(entry)

    return results


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
    print("usage: run_validation.py --validation <path> --metrics <path> [--json]", file=sys.stderr)
    raise SystemExit(2)


def compact_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def main() -> int:
    args = parse_args()
    if "validation" not in args or "metrics" not in args:
        usage()
    spec = load_validation(str(args["validation"]))
    metrics = json.loads(Path(str(args["metrics"])).read_text(encoding="utf-8"))
    result = evaluate(spec, metrics)

    if args.get("json"):
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"status: {result['status']}")
        for invariant in result["invariants"]:
            print(f"  invariant {'OK  ' if invariant['ok'] else 'FAIL'} {invariant['name']}: {invariant['explanation']}")
        for check in result["checks"]:
            if check.get("skipped"):
                print(f"  check SKIP {check['name']}: {check.get('reason', '')}")
                continue
            if not check.get("triggered"):
                print(f"  check IDLE {check['name']}: condition not met")
                continue
            mark = "OK  " if check["ok"] else check.get("fail", "FAIL")
            print(f"  check {mark} {check['name']} triggered; violated={compact_json(check['violated_invariants'])}")
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
