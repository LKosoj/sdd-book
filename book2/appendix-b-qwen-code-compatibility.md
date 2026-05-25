# Приложение B. Совместимость с Qwen Code

Второй том описывает production-процессы вокруг Qwen Code. Часть этих процессов встроена в Qwen Code, а часть нужно реализовать в проекте как пользовательские команды, навыки (skills), хуки (hooks), MCP-серверы или обычные скрипты. Это приложение фиксирует границу, чтобы читатель не принимал проектируемый процесс за штатную CLI-команду.

## Каноническая шкала

Во втором томе используется три уровня зрелости. Это не оценка качества идеи, а граница ожиданий от читателя.

| Уровень | Что означает | Слой реализации |
|---|---|---|
| Стандарт | Можно повторять в обычном Qwen Code без дополнительной платформы. Это базовый материал курса. | Встроенные возможности Qwen Code |
| Рекомендация | Полезно оформить в проекте, если процесс повторяется. Требует файлов репозитория: пользовательские команды, навыки, хуки или скрипты. | Пользовательская команда, проектный скрипт |
| Фронтир | Production-оркестрация вокруг Qwen Code. Нужна только командам, которые реально подключают внешние API, SRE-процессы и бюджетирование моделей. | Внешний оркестратор, MCP, внешние сервисы |

Связь с четырьмя слоями такая: встроенные возможности Qwen Code относятся к **Стандарту**; пользовательские команды и проектные скрипты — к **Рекомендации**; внешний оркестратор — к **Фронтиру**. Если пример использует Kubernetes, Grafana, PagerDuty или отдельный исполнитель файлового арбитража, это фронтирный слой учебной модели, а не обязательное требование к прохождению тома.

## Встроенный слой Qwen Code

Используйте эти возможности как есть:

- `/plan` — режим планирования без правок и shell-выполнения.
- `/review` — встроенное ревью кода с детерминированными проверками и параллельными ревью-агентами.
- `/skills` — просмотр и явный запуск навыков.
- `/memory`, `/remember`, `/forget` — управление памятью и `QWEN.md` (`/dream` как явная команда консолидации может появиться в более поздних версиях; если в вашем релизе её нет, оформляйте консолидацию как пользовательскую команду).
- `/mcp` и `qwen mcp add` — подключение MCP-серверов.
- `@path` — добавление файла или каталога в контекст.
- `!command` — shell-команды внутри интерактивной сессии.
- `qwen -p "..."` — безголовый (headless) запуск для CI, пакетных проверок и скриптов.

## Пользовательские команды

Если вы хотите команды `/specify`, `/tasks`, `/validate`, `/constitution` или похожие, создайте их явно:

```text
.qwen/
  commands/
    sdd/
      specify.md
      tasks.md
      validate.md
      constitution.md
```

Тогда команды будут вызываться как `/sdd:specify`, `/sdd:tasks`, `/sdd:validate`, `/sdd:constitution`. Внутри Markdown-файла хранится подсказка с `{{args}}`, ссылками на `@specs/...` и правилами остановки.

Аналогично оформляется и `/clarify`: в первом томе эта команда использовалась как шаг уточнения требований до планирования, но она не встроена в Qwen Code. Во втором томе под тот же сценарий заведите проектную пользовательскую команду (например, `.qwen/commands/sdd/clarify.md`), которая вызывается как `/sdd:clarify`. Поведение и контракт остановки задавайте в подсказке, чтобы шаг `/clarify` из первого тома воспроизводился без неявных допущений.

## Проектные скрипты

Проверки, которые должны быть воспроизводимыми без модели, оформляйте как обычные скрипты:

```text
scripts/
  spec_ci/
    check_coverage.py
    validate_schema.py
  stress_mutator/
    mutate_specs.py
    fake_validator.py
    immunity_score.py
  tribunal/
    run_duel.py
    check_invariants.py
    write_judgment.py
  budget/
    compile.py
    simulate.py
    inspect.py
```

Qwen Code может помочь написать и запустить такие скрипты, но зелёный статус должен зависеть от кода проверки, а не от убедительности ответа модели.

## Хуки

Для ограждений (guardrails) используйте официальные события Qwen Code: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop`, `SubagentStop`, `Notification`, `PreCompact` и другие. В тексте второго тома используйте именно эти имена, а не свободные варианты вроде `pretooluse`. Точный список событий и формат конфигурации сверяйте с актуальной документацией Qwen Code (см. ссылки в конце приложения).

## MCP и внешние API

Production API не должны становиться неограниченными shell-командами. Для Grafana, PagerDuty, Kubernetes, Jira или внутреннего API лучше сделать MCP-сервер с разрешительным списком (allowlist) инструментов:

- только-чтение для triage и проверки;
- отдельные пишущие инструменты для безопасных действий;
- явные условия подтверждения и отката;
- запрет на передачу секретов в подсказках, следах и `QWEN.md`.

## Термины второго тома

| Термин в главах | Реализация в Qwen-проекте |
|---|---|
| Верификатор (Verifier) — голосует | `/review`, отдельная Qwen-сессия, под-агент или проектный скрипт |
| Имплементор (Implementor) — голосует | Qwen Code в режиме default/auto-edit после утверждённого плана |
| Safety — голосует с veto при `critical_risk` | отдельная Qwen-сессия с `safety_review` или проектный скрипт, проверяющий blast radius и условия отката |
| Координатор (Coordinator) — non-voting protocolist | человек, задача CI или внешний оркестратор |
| Файловый арбитраж (tribunal) | не встроенная команда; комбинация `/review`, скриптов, отчётов и правил в `validation.md` |
| Шлюз спецификации (Spec CI) | GitHub Actions или локальные скрипты, которые могут использовать `qwen -p` только как вспомогательный слой |
| Хранитель бюджета (budget keeper) | внешний сервис или скрипт; Qwen Code сам не управляет суточной квотой ярусов |

## Справочные ссылки

README прикладного тома оставлен короткой картой маршрута, поэтому внешние источники собраны здесь.

- Qwen Code commands: https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/
- Qwen Code headless mode: https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/
- Qwen Code hooks: https://qwenlm.github.io/qwen-code-docs/en/users/features/hooks/
- Qwen Code skills: https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/
- Qwen Code memory: https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
- Qwen Code MCP: https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/
- Qwen Code approval mode: https://qwenlm.github.io/qwen-code-docs/en/users/features/approval-mode/
- Qwen Code code review: https://qwenlm.github.io/qwen-code-docs/en/users/features/code-review/
- GitHub Spec Kit: https://github.com/github/spec-kit
- AWS Kiro documentation overview: https://aws.amazon.com/documentation-overview/kiro/
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Google SRE book: https://sre.google/sre-book/
- Goodhart's law: https://en.wikipedia.org/wiki/Goodhart%27s_law
