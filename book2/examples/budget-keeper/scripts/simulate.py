#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any

FAILOVER_FRONTIER_SHARE = 0.25
HIGH_RISK_SHARE = 0.25
BASE_TOKEN_HEALTH = 1.0
HEALTH_DROP_PER_MIN = 0.005
HEALTH_DROP_PER_DEGRADED = 0.01
HEALTH_FLOOR = 0.3
AVG_TASK_TOKENS = 50_000


def simulate(plan: dict[str, Any], scenario: dict[str, Any]) -> dict[str, Any]:
    queue = int(scenario["queue"])
    duration_min = int(scenario["duration_min"])
    manual_timeout_sec = int(scenario["manual_timeout_sec"])
    down_tier = scenario.get("down_tier", "local-coder")

    frontier_total = int(plan["totals"]["frontier"])
    reserve_capacity_tokens = int(frontier_total * FAILOVER_FRONTIER_SHARE)
    reserve_capacity_tasks = max(reserve_capacity_tokens // AVG_TASK_TOKENS, 0)

    high_risk = int(queue * HIGH_RISK_SHARE)
    failover_to_frontier = min(high_risk, reserve_capacity_tasks)
    degraded_queue = queue - failover_to_frontier
    manual_queue_after_timeout = degraded_queue if duration_min * 60 >= manual_timeout_sec else 0

    health_raw = BASE_TOKEN_HEALTH - HEALTH_DROP_PER_MIN * duration_min - HEALTH_DROP_PER_DEGRADED * degraded_queue
    token_health_min = max(float(f"{health_raw:.4f}"), HEALTH_FLOOR)

    return {
        "down_tier": down_tier,
        "duration_min": duration_min,
        "queue": queue,
        "manual_timeout_sec": manual_timeout_sec,
        "failover_to_frontier": failover_to_frontier,
        "degraded_queue": degraded_queue,
        "manual_queue_after_120s": manual_queue_after_timeout,
        "token_health_min": token_health_min,
        "reserve_capacity_tasks": reserve_capacity_tasks,
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
    if "plan" not in args or "scenario" not in args or "out" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: simulate.py --plan <path> --scenario <path> --out <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    plan = json.loads(Path(args["plan"]).read_text(encoding="utf-8"))
    scenario = json.loads(Path(args["scenario"]).read_text(encoding="utf-8"))
    try:
        result = simulate(plan, scenario)
    except Exception as exc:
        print(f"simulate failed: {exc}", file=sys.stderr)
        return 1

    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"simulated: failover={result['failover_to_frontier']} degraded={result['degraded_queue']} "
        f"manual_after_{result['manual_timeout_sec']}s={result['manual_queue_after_120s']} "
        f"token_health_min={result['token_health_min']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
