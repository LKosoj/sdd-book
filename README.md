# Разработка по спецификациям с Qwen Code CLI

Русскоязычный учебник по разработке по спецификациям (SDD) для работы с CLI-агентом Qwen Code.

Опирается на публичную документацию Qwen Code, GitHub Spec Kit, AWS Kiro, материалы по агентной памяти и открытые публикации по SDD.

**Версия:** v1.0 — проверено 2026-05-15. Историю изменений см. в [CHANGELOG.md](CHANGELOG.md). Лицензия: текст — CC BY-SA 4.0, код — MIT (см. [LICENSE](LICENSE)).

Материалы учебника находятся в каталоге [book/](book/).

## Как читать

1. Пройдите части 1–5, чтобы подготовить мышление, инструмент и проект.
2. В частях 6–13 выполните полный SDD-цикл на учебном проекте AgentClinic.
3. В частях 14–15 перенесите процесс в навыки Qwen Code, MCP и артефакты, независимые от агента.
4. В части 16 разберите командную работу и ревью кода.
5. В частях 17–18 настройте хуки Qwen Code и безопасность SDD-процесса.
6. В части 19 добавьте управляемую память агента на SQLite как продвинутый слой процесса.
7. В частях 20–22 закрепите материал через антипаттерны, итоговую схему и практический зачёт.

## Части

1. [Введение](book/part-01-introduction.md)
2. [Почему разработка по спецификациям](book/part-02-why-sdd.md)
3. [Обзор процесса](book/part-03-workflow-overview.md)
4. [Настройка окружения](book/part-04-environment.md)
5. [Первичная настройка проекта](book/part-05-setup.md)
6. [Создание конституции](book/part-06-constitution.md)
7. [Спецификация фичи](book/part-07-feature-specification.md)
8. [Реализация фичи](book/part-08-feature-implementation.md)
9. [Проверка фичи: от спецификаций к фактам](book/part-09-feature-validation.md)
10. [Перепланирование проекта](book/part-10-project-replanning.md)
11. [Вторая фаза фичи](book/part-11-second-feature-phase.md)
12. [MVP](book/part-12-mvp.md)
13. [Поддержка существующего проекта](book/part-13-legacy-support.md)
14. [Собственный процесс через навыки Qwen Code](book/part-14-build-your-own-workflow.md)
15. [Заменяемость агента](book/part-15-agent-replaceability.md)
16. [Командная работа и ревью кода](book/part-16-team-code-review.md)
17. [Хуки Qwen Code: автоматизация рабочего процесса](book/part-17-qwen-code-hooks.md)
18. [Безопасность SDD](book/part-18-sdd-security.md)
19. [Память агента на SQLite](book/part-19-agent-memory-sqlite.md)
20. [Антипаттерны SDD](book/part-20-sdd-antipatterns.md)
21. [Заключение и рабочая система](book/part-21-conclusion.md)
22. [Практический зачёт](book/part-22-quiz-and-capstone.md)

## Приложения

- [Приложение A. Как учебник соотносится со Spec Kit и Kiro](book/appendix-a-sdd-dialects.md)
- [Приложение B. Доменная карта AgentClinic](book/appendix-b-agentclinic-domain.md)
- [Приложение C. Чек-листы и шаблоны](book/appendix-c-checklists.md)

## Сопроводительные документы

- [Глоссарий](book/GLOSSARY.md) — единый список терминов учебника.
- [Заметка для преподавателя/тренера](book/INSTRUCTOR.md) — форматы проведения, рубрика зачёта, типичные ошибки слушателей.
- [Журнал изменений учебника](CHANGELOG.md) — версии и даты последней проверки фактов.

## Примеры кода

- [Примеры хуков Qwen Code](book/examples/hooks/) — защитный хук, журналирование инструментов, добавление короткого SDD-контекста и пример настроек для части 17.
- [Примеры памяти на SQLite](book/examples/sqlite-memory/) — схема, хуки Qwen Code, пример настроек, заготовка фонового обобщения и ручной SQL для части 19.

## Основные источники

- репозиторий Qwen Code: https://github.com/QwenLM/qwen-code
- документация Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/index
- команды Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/
- память Qwen Code / QWEN.md: https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
- навыки в Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/
- Qwen Code MCP: https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/
- Настройка Qwen Code в Qwen Cloud: https://docs.qwencloud.com/developer-guides/clients-and-developer-tools/qwen-code
- GitHub Spec Kit: https://github.github.io/spec-kit/
- быстрый старт GitHub Spec Kit: https://github.github.com/spec-kit/quickstart.html
- обзор документации Kiro: https://aws.amazon.com/documentation-overview/kiro/
- OWASP Top 10 for Large Language Model Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- материал VentureBeat о фоновом обобщении памяти в Anthropic: https://venturebeat.com/technology/anthropic-introduces-dreaming-a-system-that-lets-ai-agents-learn-from-their-own-mistakes
- статья Towards Data Science об общей памяти агентов через хуки: https://towardsdatascience.com/unified-agentic-memory-across-harnesses-using-hooks/
- хуки в Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/hooks/
- память Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
- статья Medium с критикой SDD через подход «сначала факты»: https://medium.com/@wasowski.jarek/stop-writing-specs-start-writing-facts-the-entire-sdd-movement-is-already-obsolete-9045f7061e26
