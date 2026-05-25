# Протокол файлового арбитража — autoscale_v1

Сессия: tribunal-2026-05-17
Окно: last_30_days

## Раунд 1. Дуэль Верификатора против Имплементора

Total: 2, PASS: 2, FAIL: 0, DEFERRED: 0

### autoscale_counter_200pct — PASS

- assertion: `allowed_delta_within_quota`
- expected diagnostic_code: `QUOTA_EXCEEDED_AFTER_CLAMP`
- actual diagnostic_code: `QUOTA_EXCEEDED_AFTER_CLAMP`
- allowed_delta=3, requested_delta=24

### duplicate_webhook_within_dedup_window — PASS

- assertion: `allowed_delta_within_quota`
- expected diagnostic_code: `DUPLICATE_WEBHOOK_DEDUPED`
- actual diagnostic_code: `DUPLICATE_WEBHOOK_DEDUPED`
- allowed_delta=5, requested_delta=5

## Раунд 2. Anti-Goodhart инварианты

Verdict: **PASS**, нарушено порогов: 0

| metric | value | op | threshold | status |
|---|---|---|---|---|
| false_escalation_rate | 0.032 | <= | 0.05 | OK |
| silent_p0_ratio | 0 | <= | 0 | OK |
| rollback_flapping_per_hour | 1.4 | <= | 3 | OK |
| audit_trace_coverage | 0.97 | >= | 0.95 | OK |
| mttr_p95_minutes | 4.6 | <= | 6 | OK |

## Итоговый вердикт

**PASS**

Координатор подтверждает результат: контрпримеры отклонены ожидаемо, anti-Goodhart инварианты соблюдены.
