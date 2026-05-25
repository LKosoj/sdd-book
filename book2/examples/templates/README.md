# Шаблоны прикладного тома

Здесь собраны шаблоны двух типов: **шаблоны артефактов** (`genealogy.md`, `judgment.md` и т.п.) — структуры данных, на которые ссылаются главы; **процедурные шаблоны** (`pr-template.md`, `retrospective.md`, `clear-prompt.md`, `replan-prompt.md`) — текстовые формы для рабочего процесса. Процедурные шаблоны расширяют [приложение C первого тома](../../../book/appendix-c-checklists.md) под production-сценарии.

Если вы проходите прикладной том впервые, начните с [capstone-dossier.md](capstone-dossier.md). Это не пустой шаблон, а заполненный минимальный пакет по `high_memory_usage`; он показывает, какого размера и уровня конкретности достаточно для зачёта.

## Шаблоны артефактов

| Глава | Шаблон | Что заполнить |
|---|---|---|
| [Часть 0. Лаборатория AgentClinic-production](../../part-00-production-lab.md) | [capstone-dossier.md](capstone-dossier.md) | Минимальная форма итогового пакета: один кейс, одна проверка, один блокер. |
| [Часть 1. Восстановление спецификаций из legacy](../../part-01-spec-archaeology.md) | [genealogy.md](genealogy.md) | Журнал провенанса восстановленных требований: источник, статус, уверенность, открытые вопросы. |
| [Часть 3. Конституция проекта](../../part-03-project-constitution.md) | [proposal.md](proposal.md) | Поправка в конституцию: контекст инцидента, голоса, `decision_hash`, `ttl`, условие отката (`rollback_condition`). |
| [Часть 4. LLM-дуэль](../../part-04-llm-duel.md) | [validation.md](validation.md) | Инварианты, anti-Goodhart-проверки, дрейф и поля трассировки для дуэли Верификатор против Имплементора. |
| [Часть 6. Отбор теневых спецификаций](../../part-06-shadow-specs.md) | [scorebook.json](scorebook.json) | Формула оценки, веса, бюджет, пороги и список кандидатов с компонентами скора. |
| [Часть 8. Файловый арбитраж спорного изменения](../../part-08-multiagent-tribunal.md) | [judgment.md](judgment.md) | Протокол сессии: участники, раунды, evidence_ref, final_verdict, отложенные пункты. |
| [Часть 8. Файловый арбитраж спорного изменения](../../part-08-multiagent-tribunal.md) | [precedents.md](precedents.md) | Список прецедентов: pattern, trigger, evidence, ruling, applies_to. |
| [Часть 8. Файловый арбитраж спорного изменения](../../part-08-multiagent-tribunal.md) | [validation.md](validation.md) | Тот же шаблон validation: инварианты ротации ролей, anti-Goodhart, поля трассировки сессии. |
| [Часть 9. Маршрутизация моделей и бюджет токенов](../../part-09-tier-budgeting.md) | [budget_network.yaml](budget_network.yaml) | Расширенный budget_network с комментариями над каждым полем и контролем суммы квот. |
| [Часть 10. Защита метрик от Гудхарта](../../part-10-goodhart-metrics.md) | [metric_network.json](metric_network.json) | Сеть метрик: узлы (KPI, инварианты), рёбра, веса, drift_budget, baseline. |
| [Часть 10. Защита метрик от Гудхарта](../../part-10-goodhart-metrics.md) | [validation.md](validation.md) | Production-проверка: входные артефакты, инварианты, проверки, дрейф и трассировка. |
| [Часть 13. Практический зачёт](../../part-13-capstone.md) | [capstone-dossier.md](capstone-dossier.md) | Заполненный минимальный пример итогового пакета: genealogy, poisoned/fixed spec, validation, judgment, readiness и аудит антипаттернов. |

## Процедурные шаблоны

| Когда применять | Шаблон | Что заполнить |
|---|---|---|
| Запрос на слияние с production-полями | [pr-template.md](pr-template.md) | Spec CI, дуэль, готовность, anti-Goodhart, ссылки на доказательства. |
| Ретроспектива после фазы / серии инцидентов | [retrospective.md](retrospective.md) | Что поймал Spec CI и дуэль, что обновить в конституции и `QWEN.md`. |
| Ревью реализации после `/clear` | [clear-prompt.md](clear-prompt.md) | Сравнение реализации со спецификацией, контрактом и теневыми спецификациями. |
| Перепланирование между фазами | [replan-prompt.md](replan-prompt.md) | Конституция, дорожная карта, прецеденты, ярусные бюджеты, anti-Goodhart. |
| Итоговый зачёт главы 13 | [capstone-dossier.md](capstone-dossier.md) и несколько шаблонов вместе | `genealogy.md`, `validation.md`, `judgment.md`, `budget-note.md`, `goodhart-note.md`, `readiness.md` образуют минимальный пакет; `precedents.md` и `retrospective.md` нужны только при повторяемом конфликте или полном треке. |

## Как использовать

1. Скопируйте нужный шаблон в каталог `.specify/`, `validation/`, `decisions/` или `evidence/` своего проекта.
2. Замените значения вида `<...>` на проектные данные, не удаляя комментарии-заголовки.
3. Для шаблонов артефактов подключите проверку к Spec CI: существование файла и непустые обязательные поля проверяются тривиальным скриптом, аналогичным [examples/spec-ci/scripts/validate_schema.py](../spec-ci/scripts/validate_schema.py).
4. Процедурные шаблоны не валидируются автоматически — их применяет человек.
