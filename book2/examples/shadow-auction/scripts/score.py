#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from typing import Any


def coerce(value: str) -> str | int | float:
    if value == "":
        return ""
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if re.fullmatch(r"-?\d+\.\d+", value):
        return float(value)
    return value


def parse_simple_yaml(text: str) -> dict[str, list[dict[str, str | int | float]]]:
    root: dict[str, list[dict[str, str | int | float]]] = {"candidates": []}
    current: dict[str, str | int | float] | None = None
    in_candidates = False

    for raw in text.splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        if line == "candidates:":
            in_candidates = True
            continue
        if not in_candidates:
            continue
        stripped = line.lstrip()
        indent = len(line) - len(stripped)
        if stripped.startswith("- "):
            current = {}
            root["candidates"].append(current)
            key, value = stripped[2:].split(":", 1)
            current[key.strip()] = coerce(value.strip())
            continue
        if current is None:
            continue
        if indent < 4:
            in_candidates = False
            continue
        key, value = stripped.split(":", 1)
        current[key.strip()] = coerce(value.strip())

    return root


def js_round(value: float, digits: int) -> float:
    return float(f"{value:.{digits}f}")


def score_candidate(candidate: dict[str, Any], incidents: list[dict[str, Any]]) -> dict[str, Any]:
    feature = str(candidate["feature_key"])
    matched = [inc for inc in incidents if feature in inc.get("observed_features", [])]
    gains: list[float] = []
    early_hits = 0
    false_positive_hits = 0

    for inc in matched:
        baseline = float(inc.get("baseline_mttr_minutes", 0))
        actual = float(inc.get("mttr_minutes", 0))
        if baseline > 0:
            gains.append((baseline - actual) / baseline)
        lead = inc.get("signal_lead_minutes", {}).get(feature, 0)
        if isinstance(lead, (int, float)) and lead > 0:
            early_hits += 1
        if inc.get("was_false_escalation"):
            false_positive_hits += 1

    mttr_gain = sum(gains) / len(gains) if gains else 0
    early_signal = early_hits / len(matched) if matched else 0
    coverage = len(matched) / len(incidents) if incidents else 0
    false_escalation = false_positive_hits / len(matched) if matched else 0

    return {
        "id": str(candidate["id"]),
        "version": str(candidate.get("version", "v1")),
        "feature_key": feature,
        "token_cost": int(candidate.get("token_cost", 0)),
        "target_severity": str(candidate.get("target_severity", "")),
        "source_ref": str(candidate.get("source_ref", "")),
        "matched_incidents": [inc["incident_id"] for inc in matched],
        "metrics": {
            "mttr_gain": js_round(mttr_gain, 4),
            "early_signal": js_round(early_signal, 4),
            "coverage": js_round(coverage, 4),
            "false_escalation": js_round(false_escalation, 4),
        },
    }


def apply_weights(metrics: dict[str, float], weights: tuple[float, float, float, float]) -> float:
    w_mttr, w_early, w_cov, w_fp = weights
    return w_mttr * metrics["mttr_gain"] + w_early * metrics["early_signal"] + w_cov * metrics["coverage"] - w_fp * metrics["false_escalation"]


def parse_weights(value: str) -> tuple[float, float, float, float]:
    parts = [float(part.strip()) for part in value.split(",")]
    if len(parts) != 4:
        raise ValueError("weights must have four values: w_mttr,w_early,w_cov,w_fp")
    return parts[0], parts[1], parts[2], parts[3]


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
    if not all(key in args for key in ("candidates", "incidents", "weights", "out")):
        usage()
    return args


def usage() -> None:
    print("usage: score.py --candidates <path> --incidents <path> --weights w1,w2,w3,w4 --out <path>", file=sys.stderr)
    raise SystemExit(2)


def main() -> int:
    args = parse_args()
    candidates = parse_simple_yaml(Path(args["candidates"]).read_text(encoding="utf-8"))["candidates"]
    if not candidates:
        print("no candidates parsed; check YAML format", file=sys.stderr)
        return 1
    incidents = [
        json.loads(line)
        for line in Path(args["incidents"]).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    weights = parse_weights(args["weights"])

    rows = []
    for candidate in candidates:
        row = score_candidate(candidate, incidents)
        row["score"] = js_round(apply_weights(row["metrics"], weights), 4)
        rows.append(row)
    rows.sort(key=lambda row: row["score"], reverse=True)

    scorebook = {
        "weights": {"w_mttr": weights[0], "w_early": weights[1], "w_cov": weights[2], "w_fp": weights[3]},
        "incident_count": len(incidents),
        "candidates": rows,
    }
    out_path = Path(args["out"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(scorebook, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"scored {len(rows)} candidates over {len(incidents)} incidents -> {out_path}")
    for row in rows:
        print(f"  {row['id']:<42} score={row['score']:.3f} cov={row['metrics']['coverage']:.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
