#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any


def classify(score: float, keep: float, reject: float) -> str:
    if score >= keep:
        return "winner"
    if score <= reject:
        return "rejected"
    return "disputed"


def rejection_reason(metrics: dict[str, float]) -> str:
    if metrics.get("false_escalation", 0) >= 0.5:
        return "high_false_escalation"
    if metrics.get("mttr_gain", 0) <= 0:
        return "no_mttr_gain"
    return "score_below_reject_threshold"


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
    required = ("scorebook", "budget-tokens", "keep-threshold", "reject-threshold", "out-auction", "out-quarantine")
    if not all(key in args for key in required):
        usage()
    return args


def usage() -> None:
    print(
        "usage: decide.py --scorebook <path> --budget-tokens <int> --keep-threshold <f> --reject-threshold <f> --out-auction <path> --out-quarantine <path>",
        file=sys.stderr,
    )
    raise SystemExit(2)


def base_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "version": row["version"],
        "score": row["score"],
        "token_cost": row["token_cost"],
        "metrics": row["metrics"],
        "source_ref": row["source_ref"],
    }


def main() -> int:
    args = parse_args()
    budget_tokens = int(args["budget-tokens"])
    keep = float(args["keep-threshold"])
    reject = float(args["reject-threshold"])
    if reject >= keep:
        print("reject-threshold must be strictly less than keep-threshold", file=sys.stderr)
        return 2

    scorebook = json.loads(Path(args["scorebook"]).read_text(encoding="utf-8"))
    candidates = sorted(scorebook["candidates"], key=lambda row: row["score"], reverse=True)
    winners: list[dict[str, Any]] = []
    disputed: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []
    budget_left = budget_tokens

    for row in candidates:
        status = classify(row["score"], keep, reject)
        base = base_row(row)
        if status == "winner":
            if row["token_cost"] <= budget_left:
                budget_left -= row["token_cost"]
                winners.append({**base, "status": "winner", "budget_after": budget_left})
            else:
                disputed.append({**base, "status": "disputed", "reason": "over_budget"})
        elif status == "rejected":
            rejected.append({**base, "status": "rejected", "reason": rejection_reason(row["metrics"])})
        else:
            disputed.append({**base, "status": "disputed", "reason": "mid_score_needs_review"})

    auction = {
        "budget_tokens": budget_tokens,
        "budget_used": budget_tokens - budget_left,
        "budget_left": budget_left,
        "keep_threshold": keep,
        "reject_threshold": reject,
        "winners": winners,
    }
    quarantine = {
        "keep_threshold": keep,
        "reject_threshold": reject,
        "rejected": rejected,
        "disputed": disputed,
    }
    out_auction = Path(args["out-auction"])
    out_quarantine = Path(args["out-quarantine"])
    out_auction.parent.mkdir(parents=True, exist_ok=True)
    out_quarantine.parent.mkdir(parents=True, exist_ok=True)
    out_auction.write_text(json.dumps(auction, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    out_quarantine.write_text(json.dumps(quarantine, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"winners: {len(winners)}, disputed: {len(disputed)}, rejected: {len(rejected)}")
    print(f"budget used: {budget_tokens - budget_left}/{budget_tokens}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
