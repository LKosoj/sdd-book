# Разработка по спецификациям с Qwen Code CLI. Базовый том

Русскоязычный учебник по разработке по спецификациям (SDD) для работы с CLI-агентом Qwen Code. Базовый том проводит полный SDD-цикл на учебном проекте AgentClinic.

Опирается на публичную документацию Qwen Code, GitHub Spec Kit, AWS Kiro, материалы по агентной памяти и открытые публикации по SDD.

**Версия базового тома:** v1.0 — проверено 2026-05-15. Историю изменений см. в [CHANGELOG.md](../CHANGELOG.md). Лицензия: текст — CC BY-SA 4.0, код — MIT (см. [LICENSE](../LICENSE)).

Этот каталог — первый из двух томов учебника. После базового цикла переходите к [прикладному тому](../book2/README.md), если хотите применять SDD в production-сценариях.

## Как читать

1. Пройдите части 1–5, чтобы подготовить мышление, инструмент и проект.
2. В частях 6–13 выполните полный SDD-цикл на учебном проекте AgentClinic.
3. В частях 14–15 перенесите процесс в навыки Qwen Code, MCP и артефакты, независимые от агента.
4. В части 16 разберите командную работу и ревью кода.
5. В частях 17–18 настройте хуки Qwen Code и безопасность SDD-процесса.
6. В части 19 добавьте управляемую память агента на SQLite как продвинутый слой процесса.
7. В частях 20–22 закрепите материал через антипаттерны, итоговую схему и практический зачёт.
8. После базового цикла переходите к [прикладному тому](../book2/README.md), если хотите применять SDD в production-сценариях: Spec CI, многоагентная проверка, метрики, инциденты, откат и итоговый production-зачёт.

## Части

1. [Введение](part-01-introduction.md)
2. [Почему разработка по спецификациям](part-02-why-sdd.md)
3. [Обзор процесса](part-03-workflow-overview.md)
4. [Настройка окружения](part-04-environment.md)
5. [Первичная настройка проекта](part-05-setup.md)
6. [Создание конституции](part-06-constitution.md)
7. [Спецификация фичи](part-07-feature-specification.md)
8. [Реализация фичи](part-08-feature-implementation.md)
9. [Проверка фичи: от спецификаций к фактам](part-09-feature-validation.md)
10. [Перепланирование проекта](part-10-project-replanning.md)
11. [Вторая фаза фичи](part-11-second-feature-phase.md)
12. [MVP](part-12-mvp.md)
13. [Поддержка существующего проекта](part-13-legacy-support.md)
14. [Собственный процесс через навыки Qwen Code](part-14-build-your-own-workflow.md)
15. [Заменяемость агента](part-15-agent-replaceability.md)
16. [Командная работа и ревью кода](part-16-team-code-review.md)
17. [Хуки Qwen Code: автоматизация рабочего процесса](part-17-qwen-code-hooks.md)
18. [Безопасность SDD](part-18-sdd-security.md)
19. [Память агента на SQLite](part-19-agent-memory-sqlite.md)
20. [Антипаттерны SDD](part-20-sdd-antipatterns.md)
21. [Заключение и рабочая система](part-21-conclusion.md)
22. [Практический зачёт](part-22-quiz-and-capstone.md)

## Приложения

- [Приложение A. Как учебник соотносится со Spec Kit и Kiro](appendix-a-sdd-dialects.md)
- [Приложение B. Доменная карта AgentClinic](appendix-b-agentclinic-domain.md)
- [Приложение C. Чек-листы и шаблоны](appendix-c-checklists.md)

## Сопроводительные документы

- [Глоссарий](GLOSSARY.md) — единый список терминов учебника.
- [Заметка для преподавателя/тренера](INSTRUCTOR.md) — форматы проведения, рубрика зачёта, типичные ошибки слушателей.
- [Журнал изменений учебника](../CHANGELOG.md) — версии и даты последней проверки фактов.

## Примеры кода

- [Примеры хуков Qwen Code](examples/hooks/) — защитный хук, журналирование инструментов, добавление короткого SDD-контекста и пример настроек для части 17.
- [Примеры памяти на SQLite](examples/sqlite-memory/) — схема, хуки Qwen Code, пример настроек, заготовка фонового обобщения и ручной SQL для части 19.

## Основные источники

- репозиторий Qwen Code: https://github.com/QwenLM/qwen-code
- документация Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/index
- команды Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/
- память Qwen Code / QWEN.md: https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
- навыки в Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/
- Qwen Code MCP: https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/
- Настройка Qwen Code в Qwen Cloud: https://docs.qwencloud.com/developer-guides/clients-and-developer-tools/qwen-code
- GitHub Spec Kit: https://github.github.io/spec-kit/
- быстрый старт GitHub Spec Kit: https://github.github.io/spec-kit/quickstart.html
- обзор документации Kiro: https://aws.amazon.com/documentation-overview/kiro/
- OWASP Top 10 for Large Language Model Applications (проект OWASP GenAI Security Project, версия 2025): https://genai.owasp.org/llm-top-10/
- материал VentureBeat о фоновом обобщении памяти в Anthropic: https://venturebeat.com/technology/anthropic-introduces-dreaming-a-system-that-lets-ai-agents-learn-from-their-own-mistakes
- статья Towards Data Science об общей памяти агентов через хуки: https://towardsdatascience.com/unified-agentic-memory-across-harnesses-using-hooks/
- хуки в Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/hooks/
- память Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
- статья Medium с критикой SDD через подход «сначала факты»: https://medium.com/@wasowski.jarek/stop-writing-specs-start-writing-facts-the-entire-sdd-movement-is-already-obsolete-9045f7061e26
