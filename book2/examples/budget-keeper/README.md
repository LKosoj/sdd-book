# Минимальный пример budget-keeper

Этот пример сопровождает главу [Прикладная часть 9. Маршрутизация моделей и бюджет токенов](../../part-09-tier-budgeting.md) и показывает минимальную реализацию ярусного бюджета и переключения при отказе без внешних зависимостей.

## Что такое ярус

В SDD-конвейере `local-coder` обслуживает массовую рутину (`triage`, классификация, черновая диагностика), а `frontier-reviewer` — дорогие по риску решения (спорная диагностика, ремедиация, постмортем). Ярус — это не престиж модели, а граница восстановимости решения: если действие легко откатить и его можно проверить локальным валидатором, оно остаётся в дешёвом контуре; иначе требуется дорогой контур.

## Почему весь поток не должен мигрировать в дорогой контур

При падении `local-coder` соблазн перебросить всю очередь в `frontier-reviewer` создаёт второй каскад: дорогой ярус быстро исчерпает суточную квоту и потеряет способность обслуживать действительно критичные P0/P1. Поэтому `simulate.py` пропускает в дорогой ярус только долю задач с максимальным риском (`failover_to_frontier`), остальные остаются в `degraded_queue`, а после `manual_timeout_sec` секунд переходят в ручной канал.

## Как читать token_health

`token_health_min` — это запас устойчивости бюджета: 1.0 означает штатный режим, значения ниже 0.5 сигнализируют, что либо длительность отказа, либо размер очереди деградации превышают безопасные пороги. В этом примере `token_health_min` снижается пропорционально длительности отказа и размеру `degraded_queue`. Падение ниже `HEALTH_FLOOR` (0.3) должно включать аварийный режим.

## Что значит аварийный режим

Аварийный режим — отдельный режим управления, который хранитель бюджета включает, когда автоматическое переключение при отказе становится опасным. В главах он иногда называется «красной кнопкой», но условия включения должны быть формальными: два подряд окна с ростом риска `token_health`, очередь выше лимита, превышение SLA для критичных severity, падение endpoint дешёвого яруса. После срабатывания ручной канал открыт, `frontier-reviewer` зарезервирован под P0/P1, остальные задачи решаются человеком по тому же файловому протоколу, что и автоматические решения.

## Структура

```
budget-keeper/
  scripts/   compile.py, simulate.py, inspect.py — Python stdlib через python3
  specs/     budget_network.yaml — бюджет на сутки, 7 фаз
             budget_network_5m.yaml — калибровочный вариант 5M с теми же пропорциями
  scenarios/ fail_local_45m.json, fail_local_15m.json
  outputs/   образцы JSON для сравнения
```

## Запуск

Из каталога `book2/examples/budget-keeper`:

```bash
python3 scripts/compile.py \
  --budget-spec specs/budget_network.yaml \
  --out out/budget_plan.json

python3 scripts/simulate.py \
  --plan out/budget_plan.json \
  --scenario scenarios/fail_local_45m.json \
  --out out/fail_result.json

python3 scripts/inspect.py \
  --result out/fail_result.json \
  --query "failover_to_frontier==5 && degraded_queue==15 && manual_queue_after_120s==15 && token_health_min>=0.5"
```

Сравните содержимое `out/budget_plan.json` и `out/fail_result.json` с файлами из `outputs/`. На сценарии `fail_local_15m.json` те же счётчики, но `token_health_min` выше, потому что длительность отказа меньше: это и есть смысл daily budget-drill из части 9.

Для калибровки из части 9 используйте готовый 5M-вариант:

```bash
python3 scripts/compile.py \
  --budget-spec specs/budget_network_5m.yaml \
  --out out/budget_plan_5m.json

python3 scripts/simulate.py \
  --plan out/budget_plan_5m.json \
  --scenario scenarios/fail_local_45m.json \
  --out out/fail_result_5m.json

python3 scripts/inspect.py \
  --result out/fail_result_5m.json \
  --query "failover_to_frontier==2 && degraded_queue==18 && token_health_min>=0.5"
```

## Ограничения

Парсер YAML принимает только плоскую структуру `ключ: значение` и два уровня вложенности. Модель `simulate.py` намеренно упрощена: реальная политика учитывает радиус последствий, возраст инцидента, разрыв уверенности и SLA по фазам. Этот пример — каркас для собственной реализации, а не готовый production-сервис.
