# CI-gate report (fixture: new_metrics_bad.json)

overall: FAIL
reasons: validation:CI_BLOCK

## Invariants

| name                  | ok    | explanation                                 |
|-----------------------|-------|---------------------------------------------|
| manual_review_floor   | FAIL  | manual_review_rate=0.12 >= 0.15 -> violated |
| silent_p0_cap         | FAIL  | silent_p0=0.18 <= 0.05 -> violated          |
| audit_trace_required  | OK    | audit_trace_coverage=1.0 == 1.0 -> ok       |

## Checks

- red_button_mttr_blindness: triggered (mttr_seconds=290 < 300), CI_BLOCK,
  violated invariants: manual_review_floor, silent_p0_cap.
- network_consistency: проверяется в compare_drift.py; на этом запуске
  edge_drift=0.045 <= 0.12, не блокирует.

## Trace links (учебные идентификаторы)

- trace_id: replay-300-2026-05-17
- prompt_hash: sha256:fixture-placeholder
- diff_id: spec-mttr-target-v1.2
- policy_version: validation.yaml@1
- postmortem_label: pending

## Решение

MTTR улучшился с 660s до 290s, но релиз заблокирован: silent_p0 вырос
до 18%, доля ручной проверки упала до 12%. Это классический Goodhart-
сценарий «MTTR 5 минут», когда модель учится закрывать инциденты быстрее
ценой пропуска критических. Перед повторной попыткой нужно явно изменить
порог silent_p0_cap через review-процесс validation.yaml, а не правкой
числа в YAML.
