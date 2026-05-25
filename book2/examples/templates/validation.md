# Шаблон validation.md
<!-- Шаблон для глав 4, 8, 10 / book2/part-04-llm-duel.md,                -->
<!-- book2/part-08-multiagent-tribunal.md,                                -->
<!-- book2/part-10-goodhart-metrics.md                                    -->
<!-- Production-ориентированный шаблон проверки. Не путать с учебным       -->
<!-- validation.md из первого тома: здесь добавлены дрейф и трассировка.  -->

## artifact_inputs

- spec: `<путь к requirements.md или incident-spec.md>`
- plan: `<путь к plan.md>`
- traces: `<путь к qwen_trace.ndjson>`
- metric_network: `<путь к metric_network.json>`
- replay_data: `<glob, например data/replay_*.jsonl>`

## invariants

- id: `INV-001`
  description: `<инвариант, который не должен нарушаться даже при выполнении KPI>`
  expression: `<формальное условие, например silent_p0 <= 0.05>`
- id: `INV-002`
  description: `<...>`
  expression: `<...>`
- id: `INV-003`
  description: `<...>`
  expression: `<...>`

## checks

- id: `anti_goodhart_<имя>`
  if:
    all:
      - `<целевая метрика, которая улучшилась>`
      - `<вторая метрика, которая улучшилась>`
  then:
    fail_if:
      - `<инвариант 1, который должен сохраниться>`
      - `<инвариант 2>`
- id: `ecology_warn`
  if:
    any:
      - `<сигнал ранней деградации, например token_health_trend_5m < -0.12>`
      - `<...>`
  then:
    require:
      - `<требование, например manual_channel_open == true>`
      - `<...>`

## drift

- baseline_ref: `<путь к baseline-снимку metric_network>`
- max_edge_drift: `<допустимое отклонение ребра, например 0.12>`
- check_window: `<например, 24h>`
- alert_if:
  - `<условие, при котором drift считается значимым>`

## traces

- required_fields:
  - `trace_id`
  - `agent`
  - `prompt_hash`
  - `raw_alert_excerpt`
  - `decision`
  - `policy_version`
  - `diff_id`
  - `reasoning_delta`
  - `review_outcome`
  - `postmortem_label`
- min_coverage: `1.0`
- retention: `<например, 30d>`
