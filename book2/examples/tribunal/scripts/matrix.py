#!/usr/bin/env python3
"""A/B-матрица пар ярусов для одной спецификации.

Прогоняет один и тот же `judge()` из run_duel.py по нескольким парам
Имплементор/Верификатор и собирает таблицу вердиктов. Имитирует
разрыв между формами доказательств:

- Имплементор `local-coder` выдаёт `minimal_form` — `diagnostic_code` строкой.
- Имплементор `frontier-reviewer` выдаёт `extended_form` — структуру
  `evidence_by_invariant: {<id>: {status, value}}` без короткого
  `diagnostic_code`.
- Верификатор `local-coder` распознаёт только `minimal_form`.
- Верификатор `frontier-reviewer` распознаёт обе формы.

Поэтому одна и та же спецификация даёт разные вердикты по парам ярусов:
сильный Имплементор + слабый Верификатор (C2) проваливается, потому что
Верификатор не понимает развёрнутую форму. Это и есть учебный смысл матрицы.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))

from run_duel import judge, parse_mini_yaml  # type: ignore[import-not-found]


def to_minimal_form(base_result: dict[str, Any]) -> dict[str, Any]:
    """Слабый Имплементор: короткая форма доказательства."""
    return {
        "evidence_format": "minimal_form",
        "diagnostic_code": base_result["actual"]["diagnostic_code"],
        "allowed_delta": base_result["actual"]["allowed_delta"],
    }


def to_extended_form(base_result: dict[str, Any], spec: dict[str, Any]) -> dict[str, Any]:
    """Сильный Имплементор: длинная форма — по одному статусу на инвариант."""
    invariants = []
    raw = spec.get("then", {}).get("invariants", [])
    if isinstance(raw, list):
        invariants = [str(item) for item in raw]
    return {
        "evidence_format": "extended_form",
        "evidence_by_invariant": {
            f"inv_{idx}": {
                "statement": statement,
                "status": "satisfied" if base_result["verdict"] == "PASS" else "violated",
                "actual_value": base_result["actual"]["allowed_delta"],
            }
            for idx, statement in enumerate(invariants, start=1)
        },
    }


def verifier_check(evidence: dict[str, Any], verifier_tier: dict[str, Any]) -> tuple[str, list[str]]:
    """Возвращает (verdict, reasons) с точки зрения верификатора яруса."""
    recognized = verifier_tier.get("verif_recognizes", [])
    if not isinstance(recognized, list):
        recognized = [recognized]
    fmt = evidence.get("evidence_format")
    if fmt not in recognized:
        return (
            "FAIL",
            [f"verifier doesn't recognize evidence_format={fmt!r}, knows only {recognized}"],
        )

    if fmt == "minimal_form":
        if not evidence.get("diagnostic_code"):
            return "FAIL", ["minimal_form: пустой diagnostic_code"]
        return "PASS", []

    if fmt == "extended_form":
        invariants = evidence.get("evidence_by_invariant", {})
        if not invariants:
            return "FAIL", ["extended_form: нет ни одного инварианта"]
        violated = [
            inv_id
            for inv_id, payload in invariants.items()
            if payload.get("status") != "satisfied"
        ]
        if violated:
            return "FAIL", [f"extended_form: нарушены инварианты {violated}"]
        return "PASS", []

    return "FAIL", [f"неизвестный evidence_format={fmt!r}"]


def run_pair(
    pair: dict[str, Any],
    tiers: dict[str, Any],
    spec: dict[str, Any],
    cases: list[dict[str, Any]],
) -> dict[str, Any]:
    impl_tier = tiers[pair["impl"]]
    verif_tier = tiers[pair["verifier"]]

    case_results: list[dict[str, Any]] = []
    for case in cases:
        base = judge(case, spec)

        if impl_tier.get("impl_produces") == "extended_form":
            evidence = to_extended_form(base, spec)
        else:
            evidence = to_minimal_form(base)

        if base["verdict"] != "PASS":
            verdict = base["verdict"]
            reasons = list(base["reasons"])
        else:
            verdict, reasons = verifier_check(evidence, verif_tier)

        case_results.append(
            {
                "counterexample_id": case["counterexample_id"],
                "evidence_format": evidence["evidence_format"],
                "verdict": verdict,
                "reasons": reasons,
            }
        )

    overall = "PASS" if all(row["verdict"] == "PASS" for row in case_results) else "FAIL"

    return {
        "pair_id": pair["id"],
        "impl": pair["impl"],
        "verifier": pair["verifier"],
        "note": pair.get("note", ""),
        "verdict": overall,
        "cases": case_results,
    }


def parse_pairs_argument(text: str | None) -> list[str] | None:
    if not text:
        return None
    return [item.strip() for item in text.split(",") if item.strip()]


def filter_pairs(all_pairs: list[dict[str, Any]], wanted: list[str] | None) -> list[dict[str, Any]]:
    if not wanted:
        return all_pairs
    out: list[dict[str, Any]] = []
    for spec_pair in wanted:
        impl, _, verifier = spec_pair.partition("/")
        impl = impl.strip()
        verifier = verifier.strip()
        match = next(
            (p for p in all_pairs if p["impl"] == impl and p["verifier"] == verifier),
            None,
        )
        if match is None:
            raise SystemExit(f"пара {spec_pair!r} не найдена в tiers.yaml")
        out.append(match)
    return out


def summarize(pair_results: list[dict[str, Any]]) -> dict[str, Any]:
    by_verdict: dict[str, list[str]] = {"PASS": [], "FAIL": []}
    for row in pair_results:
        by_verdict[row["verdict"]].append(row["pair_id"])

    diverging = len(by_verdict["FAIL"]) > 0 and len(by_verdict["PASS"]) > 0
    signal = (
        "tier_dependent_spec"
        if diverging
        else ("uniform_pass" if not by_verdict["FAIL"] else "uniform_fail")
    )
    return {
        "signal": signal,
        "pass_pairs": by_verdict["PASS"],
        "fail_pairs": by_verdict["FAIL"],
        "diverging": diverging,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True)
    ap.add_argument("--cases", required=True)
    ap.add_argument("--tiers", required=True)
    ap.add_argument("--pairs", default=None, help='список пар "impl/verifier", через запятую')
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    spec = parse_mini_yaml(Path(args.spec).read_text(encoding="utf-8"))
    tiers_config = json.loads(Path(args.tiers).read_text(encoding="utf-8"))
    tiers = tiers_config["tiers"]
    all_pairs = tiers_config["pairs"]
    pairs = filter_pairs(all_pairs, parse_pairs_argument(args.pairs))

    cases: list[dict[str, Any]] = []
    for case_path in sorted(Path(args.cases).glob("*.json")):
        cases.append(json.loads(case_path.read_text(encoding="utf-8")))

    pair_results = [run_pair(pair, tiers, spec, cases) for pair in pairs]
    summary = summarize(pair_results)

    payload = {
        "spec_id": spec.get("spec_id"),
        "total_pairs": len(pair_results),
        "summary": summary,
        "pairs": pair_results,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    for row in pair_results:
        print(f"{row['pair_id']:<3} {row['verdict']:<5} {row['impl']} / {row['verifier']}", file=sys.stderr)
    print(f"signal: {summary['signal']}", file=sys.stderr)
    print(f"matrix written to {out_path}")

    return 0 if not summary["diverging"] else 1


if __name__ == "__main__":
    sys.exit(main())
