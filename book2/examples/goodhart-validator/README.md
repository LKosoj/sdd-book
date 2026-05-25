# Валидатор Гудхарта

Минимальный runnable-пример к части 10 «Метрики Гудхарта». Показывает,
как отделить целевые KPI от инвариантов качества, как работает аварийный
режим при MTTR-слепоте и как поймать дрейф поведения triage, когда
KPI выглядят зелёными. Скрипты на Python, запуск через `python3`, без других
внешних зависимостей.

## Цель против инварианта

Цель оптимизации (например MTTR <= 300s) можно двигать в обе стороны
и она задаёт направление улучшения. Инвариант (например
`silent_p0 <= 0.05`, `manual_review_rate >= 0.15`,
`audit_trace_coverage == 1.0`) описывает минимально допустимое состояние
системы и не имеет права деградировать при оптимизации цели. Когда
команда давит на MTTR изолированно, модель учится закрывать инциденты
быстрее за счёт пропусков и снижения ручной верификации; именно эту
ситуацию ловит правило аварийного режима (`red_button_mttr_blindness`).

## Что делает аварийный режим

`red_button_mttr_blindness` срабатывает только при выполнении
`when_metric mttr_seconds < 300`. Условие триггера моделирует ситуацию
«MTTR улучшился, прорыв или ловушка?». При срабатывании проверяются
все перечисленные инварианты вместе; нарушение любого даёт `CI_BLOCK`.
Объединять проверки в одно правило важно: высокая audit-трассируемость
не компенсирует рост silent_p0, а ручная проверка бесполезна без
полного трейса.

## edge_drift

`compare_drift.py` сравнивает не сами KPI, а корреляции между парами
метрик (`edge_correlations` в fixtures). edge_drift — среднее
абсолютное изменение этих корреляций между baseline и new. Если KPI
почти не двинулись, но связи между ними переписаны (например связь
`manual_review_rate -> mttr` ослабла, а связь `mttr -> silent_p0`
размылась), значит triage сменил режим принятия решений. Такое
изменение блокируется даже при «зелёных» KPI.

## Структура

- `specs/validation.yaml` — три инварианта (manual_review_floor,
  silent_p0_cap, audit_trace_required) и два check'а
  (red_button_mttr_blindness, network_consistency).
- `fixtures/baseline_metrics.json` — здоровый baseline.
- `fixtures/new_metrics_good.json` — MTTR упал с 660s до 420s без
  деградации инвариантов и корреляций; PASS.
- `fixtures/new_metrics_bad.json` — MTTR=290s, silent_p0=0.18,
  manual_review_rate=0.12; FAIL по красной кнопке.
- `fixtures/new_metrics_drift.json` — KPI почти не менялись, но
  edge_drift=0.18; FAIL по drift.
- `outputs/report.example.md` — образец отчёта для ревью.

## Запуск

Из каталога `book2/examples/goodhart-validator`:

```bash
python3 scripts/run_validation.py \
  --validation specs/validation.yaml \
  --metrics fixtures/new_metrics_good.json

python3 scripts/run_validation.py \
  --validation specs/validation.yaml \
  --metrics fixtures/new_metrics_bad.json

python3 scripts/compare_drift.py \
  --baseline fixtures/baseline_metrics.json \
  --new fixtures/new_metrics_drift.json

python3 scripts/ci_gate.py \
  --validation specs/validation.yaml \
  --baseline fixtures/baseline_metrics.json \
  --new fixtures/new_metrics_bad.json
```

`run_validation.py` и `ci_gate.py` возвращают exit code 0 при PASS и 1
при FAIL/CI_BLOCK. Это поведение и есть смысл шлюза: pre-merge job
ломается, если аварийный режим сработал или drift превысил порог.
В блоке выше первая команда должна пройти, а остальные три команды показывают
ожидаемые блокировки.
