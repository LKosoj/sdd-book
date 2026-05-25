# Runnable-примеры прикладного тома

Эта папка содержит локальные учебные прогоны для второго тома. Все скрипты используют Python stdlib и запускаются через `python3`; внешние сервисы, Kubernetes, Grafana и PagerDuty не нужны.

Каталоги `out/` создаются при запуске примеров и игнорируются. Их не нужно коммитить: это локальные следы smoke-прогонов.

## Как читать примеры

Каждый пример показывает только учебный минимум главы. Если в тексте главы рядом стоит `[project script]`, это интерфейс будущего production-слоя, а не обязательная команда из этой папки.

Глава 13 не имеет отдельного runnable-каталога: её зачётный пакет собирается из уже пройденных примеров и шаблонов.

| Глава | Каталог | Что проверяет |
|---|---|---|
| 5 | `stress-mutator/` | детерминированные мутанты и метрика иммунитета |
| 6 | `shadow-auction/` | оценка теневых спецификаций, аукцион и блок для `QWEN.md` |
| 7 | `spec-ci/` | покрытие `requirements -> plan` и JSON Schema для фикстур |
| 8 | `tribunal/` | офлайн-дуэль, anti-Goodhart-инварианты и `judgment.md` |
| 9 | `budget-keeper/` | компиляция бюджета и отказ `local-coder` без сжигания `frontier` |
| 10 | `goodhart-validator/` | блокировка улучшенного MTTR при росте `silent_p0` |
| 11 | `real-api/` | нормализация вебхуков, readiness gate и dry-run действий |

## Быстрая проверка всех runnable-примеров

Для проверки всего набора используйте один smoke-скрипт из корня репозитория:

```bash
bash book2/examples/smoke_all.sh
```

Он копирует `book2/examples` во временный каталог, запускает основные команды ниже и добавляет expected-fail проверки для негативных фикстур. Рабочее дерево не загрязняется каталогами `out/` и `__pycache__`. Если негативная фикстура неожиданно проходит, smoke-прогон падает.

Если нужно пройти только одну главу, запускайте соответствующий блок из корня репозитория.

```bash
(
cd book2/examples/spec-ci
python3 scripts/check_coverage.py --requirements requirements.md --plan plan.md
python3 scripts/validate_schema.py --schema schemas/incident_payload.schema.json --fixtures fixtures
)
```

```bash
(
cd book2/examples/tribunal
python3 scripts/run_duel.py --spec specs/autoscale_spec.yaml --cases cases/ --out out/duel.json
python3 scripts/check_invariants.py --metrics metrics/validation_metrics.json --out out/invariants.json
python3 scripts/write_judgment.py --duel-out out/duel.json --invariants-out out/invariants.json --to out/judgment.md
)
```

```bash
(
cd book2/examples/stress-mutator
python3 scripts/mutate_specs.py --base base/base_spec.json --seed 20260517 --operators Nullify,FutureTime,EscalationCycle,PriorityContradiction --out out/mutations
diff out/mutations/manifest.json manifest.example.json
python3 scripts/fake_validator.py --mutations out/mutations --out out/validator_results.json
python3 scripts/immunity_score.py --validator-results out/validator_results.json --expected expected/expected_failures.json
)
```

```bash
(
cd book2/examples/shadow-auction
python3 scripts/score.py --candidates candidates/candidates.yaml --incidents data/incidents.jsonl --weights 0.5,0.3,0.2,0.4 --out out/scorebook.json
python3 scripts/decide.py --scorebook out/scorebook.json --budget-tokens 2000 --keep-threshold 0.70 --reject-threshold 0.40 --out-auction out/auction.json --out-quarantine out/quarantine.json
python3 scripts/write_qwen_block.py --auction out/auction.json --target-anchor "QWEN.md#incident-triage-shadow" --today 2026-05-17 --out out/qwen_block.md
diff -u outputs/scorebook.example.json out/scorebook.json
diff -u outputs/auction.example.json out/auction.json
diff -u outputs/quarantine.example.json out/quarantine.json
diff -u outputs/qwen_block.example.md out/qwen_block.md
)
```

```bash
(
cd book2/examples/budget-keeper
python3 scripts/compile.py --budget-spec specs/budget_network.yaml --out out/budget_plan.json
diff -u outputs/budget_plan.example.json out/budget_plan.json
python3 scripts/simulate.py --plan out/budget_plan.json --scenario scenarios/fail_local_45m.json --out out/fail_result.json
diff -u outputs/fail_result.example.json out/fail_result.json
python3 scripts/inspect.py --result out/fail_result.json --query "failover_to_frontier==5 && degraded_queue==15 && manual_queue_after_120s==15 && token_health_min>=0.5"
python3 scripts/simulate.py --plan out/budget_plan.json --scenario scenarios/fail_local_15m.json --out out/fail_15m_result.json
python3 scripts/inspect.py --result out/fail_15m_result.json --query "token_health_min>=0.7"
python3 scripts/compile.py --budget-spec specs/budget_network_5m.yaml --out out/budget_plan_5m.json
python3 scripts/simulate.py --plan out/budget_plan_5m.json --scenario scenarios/fail_local_45m.json --out out/fail_result_5m.json
python3 scripts/inspect.py --result out/fail_result_5m.json --query "failover_to_frontier==2 && degraded_queue==18 && token_health_min>=0.5"
)
```

```bash
(
cd book2/examples/goodhart-validator
python3 scripts/run_validation.py --validation specs/validation.yaml --metrics fixtures/new_metrics_good.json
python3 scripts/compare_drift.py --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_good.json
python3 scripts/ci_gate.py --validation specs/validation.yaml --baseline fixtures/baseline_metrics.json --new fixtures/new_metrics_good.json
# В общем smoke-прогоне дополнительно проверяются ожидаемые отказы:
# new_metrics_bad.json и new_metrics_drift.json должны блокироваться.
)
```

```bash
(
cd book2/examples/real-api
python3 scripts/normalize_webhook.py --grafana fixtures/webhook_grafana.json --pagerduty fixtures/webhook_pagerduty.json --expected fixtures/incident_event.expected.json
python3 scripts/check_readiness.py --readiness fixtures/readiness_pass.json
python3 scripts/dry_run.py --spec specs/high_memory_usage/specify.md --action restart_pod
# В общем smoke-прогоне дополнительно проверяются ожидаемые отказы:
# readiness_block_audit.json, readiness_block_stateful.json и delete_namespace должны блокироваться.
)
```

Отрицательные сценарии в главах намеренно возвращают код 1: например `new_metrics_bad.json`, `new_metrics_drift.json`, `readiness_block_audit.json`, `readiness_block_stateful.json` и `delete_namespace`. В общем smoke-прогоне они обёрнуты как expected-fail: проверка проходит только если эти сценарии действительно блокируются.
