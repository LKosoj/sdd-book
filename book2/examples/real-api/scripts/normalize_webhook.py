#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


def normalize(grafana: dict[str, Any], pagerduty: dict[str, Any]) -> dict[str, Any]:
    if grafana["fingerprint"] != pagerduty["incident_key"]:
        print(
            f"FAIL: разные id инцидента: grafana={json.dumps(grafana['fingerprint'], ensure_ascii=False)}, "
            f"pagerduty={json.dumps(pagerduty['incident_key'], ensure_ascii=False)}",
            file=sys.stderr,
        )
        raise SystemExit(1)
    labels = grafana["labels"]
    values = grafana["values"]
    annotations = grafana["annotations"]
    return {
        "incident_id": grafana["fingerprint"],
        "service": labels["service"],
        "namespace": labels["namespace"],
        "pod": labels["pod"],
        "severity": labels["severity"],
        "window_minutes": values["window_minutes"],
        "metric_context": {"memory_percent": values["memory_percent"]},
        "source_refs": [annotations["dashboard"], pagerduty["html_url"]],
    }


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
    if "grafana" not in args or "pagerduty" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: normalize_webhook.py --grafana <path> --pagerduty <path> [--expected <path>]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    grafana = json.loads(Path(args["grafana"]).read_text(encoding="utf-8"))
    pagerduty = json.loads(Path(args["pagerduty"]).read_text(encoding="utf-8"))
    event = normalize(grafana, pagerduty)
    print(json.dumps(event, ensure_ascii=False, indent=2))

    if "expected" in args:
        expected = json.loads(Path(args["expected"]).read_text(encoding="utf-8"))
        if event != expected:
            print("\nFAIL: нормализованный event не совпал с ожидаемым.", file=sys.stderr)
            return 1
        print("\nOK: совпало с ожидаемым.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
