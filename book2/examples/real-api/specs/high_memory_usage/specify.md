# Specify — high_memory_usage

## Контекст

`appointments-api` в namespace `prod` показывает `memory_percent >= 90` дольше 10 минут. Источники: Grafana (метрика, 10m sustained), PagerDuty (severity P1).

## Зачем

Если ничего не делать, под исчерпает память и OOM-killer убьёт его в неконтролируемый момент. Это вызовет пик 5xx у пользователей. Контролируемый рестарт даёт меньшую вспышку 5xx и предотвращает каскад.

## Pre-approved actions

Допустимые действия для этого инцидента в текущей версии конституции:

- `restart_pod` — перезапуск конкретного пода через `kubectl rollout restart`.
- `scale_up_replicas_one` — добавление одной реплики (только если `remaining_quota >= 1`).

Любое другое действие требует ручного review и не может выполняться auto-remediation.

## За границами

- Не менять CPU/memory limits в Deployment.
- Не трогать соседние namespace.
- Не откатывать deploy без отдельного инцидента и спецификации.

## Что не должно измениться

- Маршрут `GET /agents` отвечает 200 после ремедиации.
- Доля 5xx за окно 5 минут после действия не превышает baseline+0.5%.

## Критерии успеха

- `memory_percent < 80` в течение 5 минут после действия.
- Нет новых P1 от того же сервиса в течение 15 минут.
- В audit trail есть запись с `incident_id`, `action`, `decision_diff`, `prompt_hash`.
