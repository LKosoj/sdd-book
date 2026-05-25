#!/usr/bin/env python3
import json
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Any


def render_block(winners: list[dict[str, Any]], target_anchor: str, today: date) -> str:
    next_review = today + timedelta(days=90)
    lines = [
        "<!-- shadow-auction winners; generated; review before merge -->",
        f"<!-- target_anchor: {target_anchor} -->",
        f"<!-- generated_at: {today.isoformat()} -->",
        "",
    ]
    for winner in winners:
        metrics = winner["metrics"]
        lines.extend(
            [
                f"- id: {winner['id']}.{winner['version']}",
                "  status: winner",
                f"  score: {winner['score']}",
                f"  source_ref: \"{winner['source_ref']}\"",
                f"  valid_from: \"{today.isoformat()}\"",
                f"  next_review: \"{next_review.isoformat()}\"",
                f"  few_shot_target: \"{target_anchor}\"",
                "  metrics: "
                f"{{mttr_gain: {metrics['mttr_gain']}, early_signal: {metrics['early_signal']}, "
                f"coverage: {metrics['coverage']}, false_escalation: {metrics['false_escalation']}}}",
                "",
            ]
        )
    return "\n".join(lines)


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
    if "auction" not in args or "target-anchor" not in args or "out" not in args:
        usage()
    return args


def usage() -> None:
    print("usage: write_qwen_block.py --auction <path> --target-anchor <s> --out <path> [--today YYYY-MM-DD]", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    auction = json.loads(Path(args["auction"]).read_text(encoding="utf-8"))
    winners = auction.get("winners", [])
    if not winners:
        print("no winners; nothing to write")
        return 0
    today = date.fromisoformat(args["today"]) if "today" in args else date.today()
    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(render_block(winners, args["target-anchor"], today), encoding="utf-8")
    print(f"wrote {len(winners)} winner block(s) -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
