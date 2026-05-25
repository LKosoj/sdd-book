# Минимальный пример capstone-dossier

Этот файл показывает форму готового пакета из части 13. Это не обязательный шаблон для копирования один-в-один, а заполненный учебный минимум: один инцидент, один дефект спецификации, один исправленный путь, один readiness-вывод и один вердикт.

Кейс: `high_memory_usage` из [`examples/real-api/`](../real-api/README.md). Он соответствует лабораторной рамке из [части 0](../../part-00-production-lab.md): один incident-case, одна реально запущенная проверка, один блокер перед production-допуском.

## `capstone/README.md`

Инцидент `HM-2026-05-17-01`: `appointments-api` в namespace `prod` держит `memory_percent=93` дольше 10 минут. Допустимое действие — `restart_pod`, если readiness gate набрал не меньше 23/25, audit trail покрыт полностью и действие явно перечислено в спецификации.

Проверенные команды:

```bash
cd book2/examples/real-api
python3 scripts/normalize_webhook.py \
  --grafana fixtures/webhook_grafana.json \
  --pagerduty fixtures/webhook_pagerduty.json \
  --expected fixtures/incident_event.expected.json
python3 scripts/check_readiness.py --readiness fixtures/readiness_pass.json
python3 scripts/check_readiness.py --readiness fixtures/readiness_block_stateful.json
python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action restart_pod
python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action delete_namespace
```

Итоговый статус: `DEFERRED_TO_FIRST_RUN_REVIEW`. Авто-ремедиация описана и проверена, но первый production-запуск требует ручного подтверждения по правилу `human_review_for_first_run=true`.

Пять ответов для ревьюера:

- Требование восстановлено из Grafana/PagerDuty alert по `HM-2026-05-17-01`.
- Дефект — конфликт между разрешённым restart и ручным подтверждением.
- Реально запускались normalization, readiness gate, stateful-block и dry-run.
- Вердикт `DEFERRED`, потому что действует first-run human review.
- Блокер перед production — запись ручного подтверждения и повторный readiness/dry-run; для stateful-ветки отдельно нужен `backup_verified=true`.

## `capstone/genealogy.md`

| Claim | Source | Status | Confidence | Open question |
|---|---|---|---|---|
| `memory_percent >= 90` в течение 10 минут требует ремедиации | Grafana alert `api-mem`, PagerDuty `HM-2026-05-17-01` | approved | 0.86 | Нужно ли снижать порог для ночных окон? |
| `restart_pod` допустим только для stateless pod | `QWEN.md`, readiness fixture | approved | 0.8 | Где хранится список stateful исключений? |

Непроверенная устная практика не становится требованием без `evidence_ref`.

## `capstone/poisoned-spec.md`

Дефект: конфликт приоритета.

```text
REQ-MEM-01: если memory_percent >= 90 10 минут, выполнить restart_pod. priority=P1
REQ-MEM-02: перед любым restart_pod ждать ручного подтверждения. priority=P1
```

Ожидаемый симптом: `priority_conflict=true`, потому что auto-remediation одновременно разрешена и заблокирована без правила-исключения.

## `capstone/fixed-spec.md`

Исправление меняет правило, а не объяснение.

```text
REQ-MEM-01: если memory_percent >= 90 10 минут и pod stateless, restart_pod разрешён как pre-approved action.
REQ-MEM-02: первый production-запуск требует human_review_for_first_run=true.
REQ-MEM-03: stateful pod всегда блокируется до backup_verified=true.
```

Контрольная строка: `priority_conflict=false && action=restart_pod && human_review_for_first_run=true`.

## `capstone/constitution.md`

```yaml
immutable_principles:
  - id: manual_review_floor
    rule: "Первый production-запуск опасного действия требует ручного review."
  - id: bounded_blast_radius
    rule: "Авто-ремедиация не трогает соседние namespace."
mutable_rules:
  - id: restart_stateless_high_memory
    ttl: "30d"
    max_scope: "one pod in namespace prod"
    rollback_condition: "5xx_rate > baseline + 0.5% for 5m"
governance_protocol:
  decision_hash_required: true
  evidence_ref_required: true
```

## `capstone/validation.md`

| Проверка | Команда | Ожидание | Факт |
|---|---|---|---|
| Webhook normalization | `python3 scripts/normalize_webhook.py ...` | event matches expected fixture | PASS |
| Readiness gate | `python3 scripts/check_readiness.py --readiness fixtures/readiness_pass.json` | score >= 23 и нет блокеров готовности | PASS, score 24/25 |
| Stateful blocker | `python3 scripts/check_readiness.py --readiness fixtures/readiness_block_stateful.json` | stateful без backup блокируется | BLOCK |
| Action boundary | `python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action restart_pod` | action is pre-approved | PASS |
| Forbidden action | `python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action delete_namespace` | action отсутствует в pre-approved | BLOCK |

Блокирующий факт: `human_review_for_first_run=true`, поэтому production-запуск остаётся отложенным до записи первого ручного review.

## `capstone/judgment.md`

```yaml
session_id: capstone-HM-2026-05-17-01
verdict: DEFERRED
reason: "readiness прошёл, но immutable-правило manual_review_floor всё ещё действует"
evidence_ref:
  - "examples/real-api/fixtures/readiness_pass.json"
  - "examples/real-api/fixtures/readiness_block_stateful.json"
  - "examples/real-api/specs/high_memory_usage/specify.md"
next_step: "Записать first-run human review, затем повторить readiness и dry-run."
```

## `capstone/budget-note.md`

`local-coder` может подготовить spec и dry-run. `frontier-reviewer` нужен только для спорного изменения конституции или снижения `manual_review_floor`. Красная кнопка срабатывает, если `token_health < 0.2` или если агент предлагает действие вне `Pre-approved actions`.

## `capstone/goodhart-note.md`

Целевая метрика: `mttr_minutes`.

Риск Гудхарта: агент может снижать MTTR агрессивными рестартами.

Сторожевые метрики:

- `5xx_rate <= baseline + 0.5%`;
- `audit_trace_coverage == 1.0`;
- `repeat_incident_15m == false`;
- `manual_review_for_first_run == true`.

## `capstone/readiness.md`

Оценка readiness: `24/25`.

Не блокирует:

- спецификация есть;
- действие `restart_pod` перечислено в `Pre-approved actions`;
- audit trail покрыт полностью;
- pod stateless;
- rollback condition задан.

Блокирует автозапуск без человека: первый production-запуск всё ещё попадает под `manual_review_floor`.

Блокирует действие независимо от суммы баллов: stateful workload без `backup_verified=true`. Это проверяется фикстурой `readiness_block_stateful.json` и не должно обходиться высоким readiness-score.

## `capstone/antipattern-audit.md`

Проверены три риска из части 12:

1. **Auto-remediation без минимума ручной проверки.** Не найдено: `human_review_for_first_run=true`.
2. **Readiness 25/25 как ритуал.** Не найдено: решение опирается на blocking fact, а не на красивый балл.
3. **Trace без `evidence_ref`.** Не найдено: вердикт ссылается на readiness fixture и spec.

Следующее улучшение: добавить отдельный прецедент для stateful pod с `backup_verified=false`.
