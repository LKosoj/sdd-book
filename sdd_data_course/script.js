"use strict";

/* =========================================================
   SDD для Data Engineering с Qwen Code — мини-курс
   Курс из 14 уроков (13 + финальный обзор).
   Источники: Qwen Code docs, Qwen3-Coder blog, ODCS,
   ODPS 4.1, dbt model contracts, Data Contract CLI,
   GitHub Spec Kit и собранные материалы из sources.md.
   ========================================================= */

const COURSE = {
  title: "SDD для Data Engineering с Qwen Code",
  description: "Практический мини-курс о том, как строить data-пайплайны через Specification-Driven Development в Qwen Code: AGENTS.md, .qwen/commands, project skills, subagents, дата-контракты ODCS, ODPS 4.1, dbt contracts, CI-гейты и self-healing через PatchSpec.",
  lessons: [
    {
      id: 1,
      title: "SDD как контракт для данных",
      summary: "Почему в Data Engineering спецификация должна быть первичным артефактом, а код - производным результатом.",
      objectives: [
        "Объяснить, чем SDD отличается от vibe coding и обычной документации.",
        "Назвать артефакты, которые становятся source of truth в data-проекте.",
        "Понять роль Qwen Code как исполнителя контракта, а не автора намерений."
      ],
      body: [
        { type: "h3", text: "Главная инверсия" },
        { type: "p", text: "В классическом data-проекте код быстро становится источником истины: SQL-модель, PySpark job, DAG, ручной README. В SDD источник истины переносится в спецификацию: data contract, ODPS YAML, dbt model contract, model spec или ADR. Код становится build output, который можно сгенерировать, проверить и пересобрать." },
        { type: "p", text: "Для data engineering это особенно важно: ошибка в схеме, freshness, grain или nullable-семантике редко ломает только один файл. Она проходит через bronze, silver, gold, BI views, ML features, downstream jobs и отчеты. Поэтому спецификация должна быть машиночитаемой и проверяемой до merge." },
        { type: "h3", text: "Почему Qwen Code здесь уместен" },
        { type: "p", text: "Qwen Code - терминальный агент для разработки, изначально оптимизированный под Qwen Coder-модели, но multi-protocol: он работает и с OpenAI/Anthropic/Gemini-совместимыми API. Он умеет читать репозиторий, выполнять команды, использовать slash-команды, project skills, subagents, hooks и MCP. В SDD-режиме эти возможности не заменяют процесс, а исполняют его." },
        { type: "h3", text: "Три уровня зрелости" },
        { type: "ol", items: [
          "Spec-first: команда пишет YAML/Markdown-спецификацию до кода, а Qwen Code реализует строго по ней.",
          "Spec-anchored: спецификации живут в Git, подключены к CI и проверяют совместимость изменений.",
          "Spec-as-source: человек меняет контракт, а Qwen Code через команды, skills и subagents обновляет код, тесты, docs и migration plan."
        ]},
        { type: "callout", text: "<strong>Правило курса:</strong> Qwen Code не угадывает бизнес-смысл. Он читает AGENTS.md, спецификации и state-файлы, затем делает только те изменения, которые можно проверить командами." }
      ],
      flashcards: [
        { front: "Что является source of truth в SDD для Data Engineering?", back: "Спецификация: ODCS/ODPS/dbt YAML, Markdown model spec, state-файл или ADR. Код - производный артефакт." },
        { front: "Почему vibe coding опасен для данных?", back: "LLM может угадать код, но не бизнес-grain, SLA, nullable-семантику и downstream-совместимость. Эти решения должны быть явно специфицированы." },
        { front: "Роль Qwen Code в SDD", back: "Исполнитель и проверяющий контрактов: читает спецификации, редактирует код, запускает проверки, но не заменяет semantic approval." }
      ],
      quiz: [
        {
          prompt: "Что должно измениться первым при смене бизнес-правила в SDD-пайплайне?",
          options: [
            "SQL или PySpark-код",
            "BI-дашборд",
            "Спецификация или data contract",
            "Название ветки в Git"
          ],
          correct: 2,
          explain: "В SDD сначала меняется контракт, затем из него обновляются код, тесты и документация."
        },
        {
          prompt: "Какая формулировка лучше всего описывает Qwen Code в этом курсе?",
          options: [
            "Инструмент для свободного vibe coding.",
            "Агент-исполнитель, который работает внутри явно заданных спецификаций и проверок.",
            "BI-платформа для построения отчетов.",
            "Замена дата-инженера без human review."
          ],
          correct: 1,
          explain: "Курс ориентирован на agentic engineering: агент силен, но его работа ограничена спецификациями, гейтами и проверками."
        }
      ],
      sources: [
        { title: "Qwen Code overview", url: "https://qwenlm.github.io/qwen-code-docs/en/users/overview/", meta: "Qwen docs", desc: "Официальный обзор Qwen Code как терминального agentic coding tool." },
        { title: "GitHub Spec Kit", url: "https://github.com/github/spec-kit", meta: "GitHub", desc: "Шаблоны и CLI-подход к Specification-Driven Development." },
        { title: "Automating the Entire Data Engineering Lifecycle with AI", url: "https://medium.com/@nayan.j.paul/automating-the-entire-data-engineering-lifecycle-with-ai-an-ai-first-approach-to-tdlc-sdlc-and-cf0f5c9510d4", meta: "Nayan Paul · 2026", desc: "Источник паттерна stage-driven data pipeline. Оригинал описывает этот паттерн на Claude Code; в курсе он адаптирован под Qwen Code." }
      ]
    },
    {
      id: 2,
      title: "Рабочее пространство Qwen Code",
      summary: "AGENTS.md, .qwen/settings.json, commands, skills, subagents и hooks как каркас SDD-процесса.",
      objectives: [
        "Разобрать, какие файлы Qwen Code читает как проектный контекст.",
        "Понять разницу между slash-командами, skills и subagents.",
        "Собрать минимальную структуру .qwen для data-проекта."
      ],
      body: [
        { type: "h3", text: "Минимальная структура" },
        { type: "pre", text: "repo/\n  AGENTS.md\n  specs/\n    orders_product.odps.yaml\n    orders_contract.odcs.yaml\n    models/\n      fct_orders.md\n  .qwen/\n    settings.json\n    commands/\n      sdd/init.md\n      sdd/contract.md\n      sdd/build.md\n      sdd/verify.md\n    skills/\n      data-contract-review/SKILL.md\n    agents/\n      data-profiler.md\n      dbt-generator.md\n      data-quality-reviewer.md\n  .sdd/\n    state.json" },
        { type: "h3", text: "AGENTS.md" },
        { type: "p", text: "AGENTS.md задает неизменные правила проекта: стек, границы, naming conventions, запреты, обязательные проверки, формат ответа Qwen Code и правила human approval. Это не место для длинной методологии. Хороший AGENTS.md короткий, проверяемый и привязан к командам." },
        { type: "h3", text: "Slash-команды" },
        { type: "p", text: "Project commands лежат в .qwen/commands. Файл .qwen/commands/sdd/contract.md становится командой /sdd:contract. Команда нужна, когда человек явно запускает этап процесса: собрать контракт, сгенерировать модель, проверить drift." },
        { type: "h3", text: "Skills и subagents" },
        { type: "p", text: "Skill - модуль знаний, который Qwen Code может загрузить при релевантной задаче. Subagent - отдельный специалист с собственным prompt, набором tool permissions и контекстом. В SDD-пайплайне skill хранит правила, а subagent выполняет узкую работу: профилирование схемы, генерацию dbt, ревью data quality." },
        { type: "callout", text: "<strong>Разделение обязанностей:</strong> command отвечает за этап и диалог с человеком, skill - за методику, subagent - за изолированную работу с файлами и проверками." }
      ],
      flashcards: [
        { front: "Где хранить project commands Qwen Code?", back: ".qwen/commands/. Подпапки становятся namespace: .qwen/commands/sdd/build.md -> /sdd:build." },
        { front: "Skill vs subagent", back: "Skill - переиспользуемая инструкция и ресурсы. Subagent - специализированный автономный исполнитель с собственными tools и контекстом." },
        { front: "Для чего нужен AGENTS.md?", back: "Для проектных правил: границы, стек, проверки, формат работы, запреты, human approval. Это основной контекст агента." }
      ],
      quiz: [
        {
          prompt: "Какой файл даст команду /sdd:verify в Qwen Code?",
          options: [
            ".qwen/skills/sdd/verify.md",
            ".qwen/commands/sdd/verify.md",
            "specs/sdd/verify.yaml",
            "AGENTS.md"
          ],
          correct: 1,
          explain: "Qwen Code мапит project command из .qwen/commands/<namespace>/<name>.md в /namespace:name."
        },
        {
          prompt: "Что лучше положить в skill, а не в slash-команду?",
          options: [
            "Команду запуска конкретного этапа.",
            "Повторяемую методику ревью data contract с чеклистом и примерами.",
            "Единственный вопрос пользователю.",
            "Название текущей ветки."
          ],
          correct: 1,
          explain: "Skill хранит переиспользуемую экспертизу. Команда запускает этап процесса."
        }
      ],
      sources: [
        { title: "Qwen Code Commands", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/", meta: "Qwen docs", desc: "Slash, @, ! commands и custom project commands в .qwen/commands." },
        { title: "Qwen Code Agent Skills", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/skills/", meta: "Qwen docs", desc: "Формат SKILL.md, personal/project skills и path-gating." },
        { title: "Qwen Code Subagents", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/sub-agents/", meta: "Qwen docs", desc: "Named subagents, отдельный контекст, tool configuration и best practices." }
      ]
    },
    {
      id: 3,
      title: "Стандарты: ODCS, ODPS 4.1 и dbt",
      summary: "Как связать дата-контракт, data product spec и dbt model contract в одну цепочку.",
      objectives: [
        "Развести роли ODCS, ODPS и dbt contracts.",
        "Работать с актуальной ODPS 4.1 как спецификацией data product.",
        "Понять, какие части спецификации должен читать Qwen Code."
      ],
      body: [
        { type: "h3", text: "Три слоя спецификации" },
        { type: "ul", items: [
          "ODCS описывает технический data contract: schema, quality, SLA, roles, infrastructure.",
          "ODPS 4.1 описывает data product: назначение, owner, access, pricing, license, SLA, quality и productStrategy.",
          "dbt model contract фиксирует shape конкретной SQL-модели: names, data types и поддерживаемые constraints."
        ]},
        { type: "h3", text: "Почему ODPS 4.1 важна" },
        { type: "p", text: "В актуальной ветке Open Data Products latest-версией указана ODPS 4.1. Она добавляет productStrategy: цели, product KPIs и связь с business KPI. Для SDD это важное усиление: Qwen Code получает не только технический контракт, но и причину, почему продукт существует." },
        { type: "h3", text: "Связка файлов" },
        { type: "pre", text: "specs/\n  orders_product.odps.yaml      # product context, owner, SLA, productStrategy\n  orders_contract.odcs.yaml      # output port schema, DQ, roles, servers\n  models/fct_orders.md           # grain, joins, metrics, acceptance criteria\nmodels/marts/fct_orders.sql      # generated or maintained implementation\nmodels/marts/fct_orders.yml      # dbt contract and tests" },
        { type: "h3", text: "Что делает Qwen Code" },
        { type: "p", text: "Qwen Code должен читать все три слоя перед изменением модели. Если меняется ODCS schema, он обновляет dbt contract и downstream tests. Если меняется ODPS productStrategy, он проверяет метрики, documentation и exposure. Если меняется model spec, он обновляет SQL и проверки соответствия." },
        { type: "callout", text: "<strong>Ошибка архитектуры:</strong> использовать только dbt YAML как контракт. dbt contract защищает shape модели, но не объясняет consumer SLA, ownership, pricing, business KPI и стратегию продукта." }
      ],
      flashcards: [
        { front: "ODCS", back: "Технический контракт: schema, quality, SLA, roles, servers, infrastructure." },
        { front: "ODPS 4.1", back: "Спецификация data product с metadata, access, quality, SLA, license, pricing и productStrategy." },
        { front: "dbt model contract", back: "Контракт shape конкретной модели: column names, data types и constraints там, где платформа их поддерживает." }
      ],
      quiz: [
        {
          prompt: "Что из перечисленного относится к ODPS 4.1, но не является основной задачей dbt model contract?",
          options: [
            "column name",
            "data_type",
            "productStrategy и business KPI",
            "not_null constraint"
          ],
          correct: 2,
          explain: "productStrategy описывает бизнес-цель продукта данных. dbt contract ограничен формой модели."
        },
        {
          prompt: "Почему Qwen Code должен читать ODCS и ODPS до генерации SQL?",
          options: [
            "Чтобы выбрать цвет интерфейса.",
            "Чтобы не потерять schema, quality, SLA, owner, grain и бизнес-контекст продукта.",
            "Чтобы заменить Data Catalog.",
            "Чтобы не запускать dbt."
          ],
          correct: 1,
          explain: "SQL без контракта легко становится технически рабочим, но семантически неверным."
        }
      ],
      sources: [
        { title: "Open Data Contract Standard v3.1.0", url: "https://bitol-io.github.io/open-data-contract-standard/v3.1.0/", meta: "Bitol", desc: "Официальная структура ODCS: Fundamentals, Schema, Data Quality, SLA и другие разделы." },
        { title: "Open Data Products Standards Family", url: "https://opendataproducts.org/", meta: "Linux Foundation", desc: "Актуальная family-страница с ODPS 4.1 как latest production version." },
        { title: "dbt Model Contracts", url: "https://docs.getdbt.com/docs/mesh/govern/model-contracts", meta: "dbt Labs", desc: "Официальное описание model contracts, prerequisites и ограничений." }
      ]
    },
    {
      id: 4,
      title: "AGENTS.md для data-проекта",
      summary: "Как написать правила проекта так, чтобы Qwen Code не расширял scope и не ломал контракты.",
      objectives: [
        "Составить минимальный AGENTS.md для data-пайплайна.",
        "Задать границы автономии Qwen Code.",
        "Описать обязательные проверки после изменений."
      ],
      body: [
        { type: "h3", text: "Что должно быть в AGENTS.md" },
        { type: "ul", items: [
          "Scope: какие папки можно менять на конкретных этапах.",
          "Spec order: какие файлы читать до редактирования кода.",
          "Data rules: grain, naming, timezone, null policy, PII handling, partitioning.",
          "Verification: команды для YAML lint, datacontract test, dbt build, unit tests, docs generation.",
          "Human gates: где Qwen Code обязан остановиться и запросить approval."
        ]},
        { type: "h3", text: "Пример ядра" },
        { type: "pre", text: "# AGENTS.md\n\nBefore editing data pipeline code:\n1. Read specs/<product>.odps.yaml, specs/<contract>.odcs.yaml, and specs/models/<model>.md.\n2. State the contract fields affected by the change.\n3. Do not change grain, SLA, owner, PII policy, or partitioning without explicit approval.\n4. After editing, run: datacontract lint, datacontract test, dbt build --select <model>+, and pytest.\n5. Stop before merge if any check fails or if generated code changes contract semantics." },
        { type: "h3", text: "Слишком длинный AGENTS.md вреден" },
        { type: "p", text: "Если AGENTS.md превращается в учебник, Qwen Code будет тратить контекст на общие слова. Методики лучше вынести в .qwen/skills, stage prompts - в .qwen/commands, а AGENTS.md оставить как проектную конституцию и список hard rules." },
        { type: "h3", text: "Границы автономии" },
        { type: "p", text: "Для data engineering важно отдельно запретить: изменение production paths, удаление исторических данных, ослабление DQ rules, silent schema evolution, изменение PII classification и переписывание migration history. Эти действия требуют явного human approval." },
        { type: "callout", text: "<strong>Практика:</strong> если правило нельзя проверить командой или diff-ревью, оно должно быть сформулировано как human gate, а не как пожелание." }
      ],
      flashcards: [
        { front: "Что хранить в AGENTS.md?", back: "Короткие hard rules: scope, порядок чтения спецификаций, data conventions, verification commands, human gates." },
        { front: "Что вынести из AGENTS.md?", back: "Длинные методики, примеры, чеклисты ревью и domain playbooks. Для этого лучше подходят .qwen/skills." },
        { front: "Какие data-действия требуют approval?", back: "Изменение grain, SLA, PII policy, partitioning, production paths, DQ severity, schema evolution и migration history." }
      ],
      quiz: [
        {
          prompt: "Какое правило лучше всего подходит для AGENTS.md?",
          options: [
            "Большой обзор истории data mesh.",
            "Перед редактированием модели прочитать ODPS, ODCS и model spec; после правки запустить конкретные проверки.",
            "Список всех возможных SQL-антипаттернов на 30 страниц.",
            "Случайные заметки из прошлых проектов."
          ],
          correct: 1,
          explain: "AGENTS.md должен быть кратким и операционным: что читать, что можно менять и как проверять."
        },
        {
          prompt: "Что Qwen Code не должен менять без explicit approval?",
          options: [
            "Опечатку в комментарии.",
            "Форматирование локального README.",
            "PII classification или SLA output port.",
            "Имя временной переменной в тесте."
          ],
          correct: 2,
          explain: "PII и SLA - контрактные обязательства. Их нельзя менять как техническую мелочь."
        }
      ],
      sources: [
        { title: "Qwen Code Configuration", url: "https://qwenlm.github.io/qwen-code-docs/en/users/configuration/settings/", meta: "Qwen docs", desc: "context.fileName и настройки контекста проекта." },
        { title: "Qwen Code Weekly: AGENTS.md rename", url: "https://qwenlm.github.io/qwen-code-docs/en/blog/weekly-update-2026-03-27/", meta: "Qwen docs · 2026", desc: "Упоминание перехода от QWEN.md к AGENTS.md для совместимости." }
      ]
    },
    {
      id: 5,
      title: "Schema Manifest: мост от источника к контракту",
      summary: "Как Qwen Code должен профилировать источник и формировать промежуточный manifest до ODCS.",
      objectives: [
        "Понять назначение Schema Manifest.",
        "Разделить факты профилирования и бизнес-решения.",
        "Собрать prompt для data-profiler subagent."
      ],
      body: [
        { type: "h3", text: "Зачем нужен manifest" },
        { type: "p", text: "Сырой источник редко сразу превращается в хороший контракт. JDBC table, CSV, Kafka payload или REST response дают факты: field names, inferred types, null rates, cardinality, min/max, examples. Но contract требует решений: business key, grain, classifications, allowed ranges, SLA, DQ severity. Schema Manifest (авторская конвенция этого курса, а не встроенный механизм Qwen Code) отделяет наблюдение от решения." },
        { type: "h3", text: "Минимальная структура" },
        { type: "pre", text: "schema_manifest:\n  source: crm.orders\n  observed_at: 2026-06-24T09:00:00Z\n  fields:\n    - name: order_id\n      inferred_type: string\n      null_rate: 0\n      cardinality: high\n      candidate_role: primary_key\n    - name: email\n      inferred_type: string\n      null_rate: 0.03\n      classification_candidate: pii\n      quality_risks: [invalid_format, mixed_case]\n  candidate_grain: one row per order event\n  open_questions:\n    - Is order_id stable across source replays?\n    - Should email be exposed downstream or hashed?" },
        { type: "h3", text: "Subagent prompt" },
        { type: "p", text: "data-profiler subagent получает read-only доступ к samples, schema files и profiling commands. Он не пишет ODCS напрямую. Его выход - manifest с фактами, confidence и open questions. Это снижает риск, что Qwen Code сам назначит business meaning по похожему названию поля." },
        { type: "h3", text: "Гейт после manifest" },
        { type: "p", text: "После manifest человек подтверждает grain, business keys, PII policy и DQ severity. Только после этого запускается /sdd:contract, который превращает manifest в ODCS и ODPS output port." },
        { type: "callout", text: "<strong>Принцип:</strong> Qwen Code может предлагать семантику, но не должен утверждать ее без человека. Особенно для PII, ключей, дедупликации и bad-row policy." }
      ],
      flashcards: [
        { front: "Schema Manifest", back: "Промежуточный документ между source profiling и data contract: факты, кандидаты, риски, open questions." },
        { front: "Что manifest не должен делать?", back: "Финально утверждать business grain, PII policy, DQ severity и SLA без human approval." },
        { front: "Зачем нужен confidence?", back: "Чтобы отличать надежные факты профилирования от гипотез Qwen Code по названиям полей." }
      ],
      quiz: [
        {
          prompt: "Что лучше всего подходит для выхода data-profiler subagent?",
          options: [
            "Сразу измененный production SQL.",
            "Schema Manifest с фактами, confidence и open questions.",
            "Удаление подозрительных колонок.",
            "Commit в main."
          ],
          correct: 1,
          explain: "Профилирование должно дать материал для решения, а не молча менять пайплайн."
        },
        {
          prompt: "Какой пункт требует human gate после manifest?",
          options: [
            "Подсчет количества колонок.",
            "Определение PII classification и bad-row policy.",
            "Сохранение временного JSON.",
            "Сортировка полей по имени."
          ],
          correct: 1,
          explain: "PII и bad-row policy - доменные решения, которые нельзя утверждать автоматически."
        }
      ],
      sources: [
        { title: "From Spec to Pipeline: phData Toolkit", url: "https://www.phdata.io/blog/spec-to-pipeline-agentic-automation/", meta: "phData", desc: "Паттерн discovery + pipeline-build вокруг спецификации." },
        { title: "Qwen Code Subagents", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/sub-agents/", meta: "Qwen docs", desc: "Subagents как отдельные специалисты с контролируемыми tools." }
      ]
    },
    {
      id: 6,
      title: "ODCS-контракт в Qwen workflow",
      summary: "Как превратить manifest в технический data contract и подключить Data Contract CLI.",
      objectives: [
        "Составить ODCS-контракт из manifest и human decisions.",
        "Разобрать секции Schema, Data Quality, SLA, Team и Infrastructure.",
        "Подключить lint/test/changelog в Qwen Code и CI."
      ],
      body: [
        { type: "h3", text: "Контракт как API данных" },
        { type: "p", text: "ODCS описывает, что producer обещает consumer: поля, типы, quality rules, SLA, owners, roles, servers. Для Qwen Code это не справочник, а входной контракт. Агент должен ссылаться на ODCS при любом изменении ingest, transform, test или documentation." },
        { type: "h3", text: "Минимальный ODCS-фрагмент" },
        { type: "pre", text: "apiVersion: v3.1.0\nkind: DataContract\nid: orders.v1\nname: Orders Contract\nversion: 1.0.0\nschema:\n  - name: orders\n    physicalType: table\n    properties:\n      - name: order_id\n        physicalType: string\n        required: true\n        primaryKey: true\n      - name: order_total\n        physicalType: decimal\n        required: true\nquality:\n  - name: positive_order_total\n    type: sql\n    query: order_total >= 0\nsla:\n  freshness:\n    threshold: 2h" },
        { type: "h3", text: "Команда /sdd:contract" },
        { type: "p", text: "Команда должна прочитать Schema Manifest, задать только нерешенные вопросы, записать ODCS YAML, затем запустить datacontract lint. Если есть доступ к тестовой базе или sample-файлу, она запускает datacontract test. Если контракт меняется относительно предыдущей версии, команда должна показать changelog и пометить breaking changes." },
        { type: "h3", text: "Контрактные diff-правила" },
        { type: "ul", items: [
          "Удаление поля или смена типа - breaking change.",
          "Ослабление DQ rule - governance change, требует approval.",
          "Добавление nullable поля обычно backward compatible.",
          "Смена freshness SLA - product change, требует owner approval.",
          "Изменение PII classification - security/privacy gate."
        ]},
        { type: "callout", text: "<strong>Практический минимум:</strong> datacontract lint должен быть быстрым pre-merge gate. datacontract test можно запускать на nightly или на staging data, если нужен доступ к реальному источнику." }
      ],
      flashcards: [
        { front: "ODCS в SDD", back: "Технический API данных: schema, quality, SLA, roles, infrastructure. Qwen Code обязан читать его перед изменениями." },
        { front: "Breaking change в data contract", back: "Удаление поля, смена типа, ужесточение required semantics, смена key/grain или несовместимый SLA." },
        { front: "Data Contract CLI", back: "CLI для lint, test, changelog и export data contracts, включая ODCS." }
      ],
      quiz: [
        {
          prompt: "Что должна сделать команда /sdd:contract перед записью финального ODCS?",
          options: [
            "Автоматически угадать owner.",
            "Задать только нерешенные вопросы из manifest и human decisions.",
            "Сгенерировать dashboard.",
            "Удалить старые тесты."
          ],
          correct: 1,
          explain: "Хорошая команда не переспрашивает известное, но останавливается на нерешенной семантике."
        },
        {
          prompt: "Какой change почти всегда требует отдельного approval?",
          options: [
            "Добавить описание поля.",
            "Переупорядочить YAML-ключи.",
            "Изменить PII classification.",
            "Исправить опечатку в комментарии."
          ],
          correct: 2,
          explain: "PII classification влияет на privacy и доступ потребителей. Это governance gate."
        }
      ],
      sources: [
        { title: "ODCS v3.1.0 Definition", url: "https://bitol-io.github.io/open-data-contract-standard/v3.1.0/", meta: "Bitol", desc: "Официальные секции ODCS." },
        { title: "datacontract-cli on PyPI", url: "https://pypi.org/project/datacontract-cli/", meta: "PyPI · 2026", desc: "Data Contract CLI для lint, test, changelog и export." },
        { title: "Data Contract CLI docs", url: "https://cli.datacontract.com/", meta: "Data Contract CLI", desc: "Командная документация и quickstart." }
      ]
    },
    {
      id: 7,
      title: "ODPS 4.1: data product как цель",
      summary: "Как добавить business context, output ports и productStrategy, чтобы Qwen Code не генерировал бессмысленные таблицы.",
      objectives: [
        "Описать data product поверх технического контракта.",
        "Понять назначение productStrategy в ODPS 4.1.",
        "Связать output port с ODCS-контрактом."
      ],
      body: [
        { type: "h3", text: "Data product шире таблицы" },
        { type: "p", text: "Таблица отвечает на вопрос: какие строки и колонки существуют. Data product отвечает на вопрос: кто владелец, кто потребитель, какая ценность, какой SLA, какой доступ, какие KPI и какой contract обещает совместимость." },
        { type: "h3", text: "ODPS 4.1 и productStrategy" },
        { type: "p", text: "ODPS 4.1 усиливает связь data product с бизнес-результатом через productStrategy: objectives, product KPIs, contributesToKPI и strategic alignment. Для Qwen Code это контекст, который помогает не генерировать метрики и BI views в отрыве от цели продукта." },
        { type: "pre", text: "name: orders-product\nversion: 1.0.0\nowner:\n  name: Data Platform\noutputPorts:\n  - name: orders_curated\n    type: dataset\n    contractUrl: ./orders_contract.odcs.yaml\nsla:\n  freshness: 2h\nproductStrategy:\n  objectives:\n    - en: Enable reliable revenue reporting\n  productKPIs:\n    - id: KPI-ORDERS-001\n      name: Contract-compliant refreshes\n      target: 99.5\n      unit: percent" },
        { type: "h3", text: "Как Qwen Code использует ODPS" },
        { type: "ul", items: [
          "Перед генерацией BI view читает outputPorts и access rules.",
          "Перед изменением метрик читает productStrategy и KPI definitions.",
          "Перед изменением SLA останавливается на approval.",
          "При генерации README переносит owner, support и usage contract из ODPS.",
          "При добавлении нового output port требует отдельный ODCS или inline spec."
        ]},
        { type: "callout", text: "<strong>Критерий качества:</strong> после чтения ODPS новый инженер должен понимать, зачем существует data product, кто за него отвечает и какие обещания он дает." }
      ],
      flashcards: [
        { front: "ODPS", back: "Vendor-neutral machine-readable metadata model для data products: metadata, access, quality, SLA, license, pricing, strategy." },
        { front: "productStrategy", back: "Блок ODPS 4.1, который связывает продукт с objectives, product KPIs и более высоким business KPI." },
        { front: "outputPort contractUrl", back: "Ссылка output port на data contract, например ODCS YAML. Так продукт связывается с технической совместимостью." }
      ],
      quiz: [
        {
          prompt: "Что ODPS добавляет поверх ODCS?",
          options: [
            "Только синтаксис SQL.",
            "Контекст продукта: owner, usage, access, SLA, pricing, license, strategy и output ports.",
            "Формат Python package.",
            "Секреты подключения к базе."
          ],
          correct: 1,
          explain: "ODPS описывает продукт данных, а ODCS - технический контракт данных."
        },
        {
          prompt: "Почему productStrategy полезен для Qwen Code?",
          options: [
            "Он заменяет тесты.",
            "Он дает бизнес-цель и KPI, чтобы агент не генерировал метрики в вакууме.",
            "Он ускоряет npm install.",
            "Он запрещает YAML."
          ],
          correct: 1,
          explain: "SDD требует, чтобы implementation была связана с намерением. productStrategy делает это намерение машиночитаемым."
        }
      ],
      sources: [
        { title: "Open Data Products Standards Family", url: "https://opendataproducts.org/", meta: "Linux Foundation", desc: "ODPS 4.1 как latest production version и роль стандартов family." },
        { title: "Open Data Product Specification 4.1", url: "https://github.com/Open-Data-Product-Initiative/v4.1", meta: "GitHub", desc: "Описание productStrategy и целей ODPS 4.1." },
        { title: "ODPS 3.1 Data Contract Support", url: "https://opendataproducts.org/v3.1/", meta: "Open Data Products", desc: "Поддержка URL и inline data contracts в ODPS." }
      ]
    },
    {
      id: 8,
      title: "dbt contracts и model specs",
      summary: "Как совместить dbt enforced contracts, tests и Markdown-spec модели.",
      objectives: [
        "Разобрать, что реально проверяет dbt model contract.",
        "Понять ограничения materialization и platform constraints.",
        "Составить Qwen workflow для изменения dbt-модели."
      ],
      body: [
        { type: "h3", text: "Что проверяет dbt" },
        { type: "p", text: "dbt contract с enforced: true проверяет, что запрос возвращает колонки с ожидаемыми names и data types. Для table и incremental dbt может включить constraints в DDL, но фактическая enforceability зависит от платформы. Это защита shape, а не полная гарантия бизнес-семантики." },
        { type: "pre", text: "models:\n  - name: fct_orders\n    config:\n      materialized: incremental\n      on_schema_change: fail\n      contract:\n        enforced: true\n    columns:\n      - name: order_id\n        data_type: string\n        constraints:\n          - type: not_null\n      - name: order_total\n        data_type: numeric" },
        { type: "h3", text: "Что добавляет model spec" },
        { type: "p", text: "Markdown model spec хранит то, что dbt YAML не выражает удобно: grain, source assumptions, join rules, incremental strategy, late-arriving data policy, metric definitions, acceptance criteria и known risks. Qwen Code должен читать этот spec перед правкой SQL." },
        { type: "h3", text: "Workflow изменения модели" },
        { type: "ol", items: [
          "Qwen Code читает ODPS, ODCS и specs/models/<model>.md.",
          "Формулирует, какие contract fields затронуты.",
          "Меняет SQL и dbt YAML только в нужных файлах.",
          "Запускает dbt build --select <model>+ и tests.",
          "Если shape изменился, обновляет ODCS/ODPS или останавливается для approval."
        ]},
        { type: "callout", text: "<strong>Антипаттерн:</strong> просить Qwen Code просто починить dbt build. Правильный запрос: починить build без изменения grain, SLA и contract shape, либо явно показать, почему contract должен измениться." }
      ],
      flashcards: [
        { front: "dbt enforced contract", back: "Проверяет names и data types возвращаемого dataset; constraints зависят от materialization и платформы." },
        { front: "Что dbt contract не выражает полностью?", back: "Business grain, late-arriving policy, KPI intent, ownership, consumer SLA, data product strategy." },
        { front: "on_schema_change для incremental", back: "Для contract-friendly incremental моделей обычно нужен append_new_columns или fail; fail лучше для строгого SDD." }
      ],
      quiz: [
        {
          prompt: "Какая сущность лучше всего хранит grain и late-arriving policy модели?",
          options: [
            "Только compiled SQL.",
            "Markdown model spec рядом с dbt model contract.",
            "package-lock.json.",
            "CSS-файл курса."
          ],
          correct: 1,
          explain: "dbt YAML защищает shape, а model spec фиксирует семантику и поведение."
        },
        {
          prompt: "Что должен сделать Qwen Code, если исправление dbt build требует удаления колонки из контракта?",
          options: [
            "Удалить колонку молча.",
            "Остановиться и запросить approval как breaking contract change.",
            "Переименовать модель случайно.",
            "Отключить все тесты."
          ],
          correct: 1,
          explain: "Удаление колонки - потенциально breaking change для consumers."
        }
      ],
      sources: [
        { title: "dbt Model Contracts", url: "https://docs.getdbt.com/docs/mesh/govern/model-contracts", meta: "dbt Labs", desc: "Официальные prerequisites, enforcement behavior и ограничения." },
        { title: "dbt contract config", url: "https://docs.getdbt.com/reference/resource-configs/contract", meta: "dbt Labs", desc: "Reference по contract.enforced." }
      ]
    },
    {
      id: 9,
      title: "Команды SDD-пайплайна в Qwen",
      summary: "Как переложить stage-driven pipeline на .qwen/commands без привязки к чужому CLI.",
      objectives: [
        "Спроектировать набор project slash-команд для data pipeline.",
        "Разделить интерактивные вопросы и автономную генерацию.",
        "Использовать .sdd/state.json как durable context."
      ],
      body: [
        { type: "h3", text: "Команды как этапы" },
        { type: "p", text: "В Qwen Code stage-driven workflow удобно оформлять как project commands. Каждая команда - Markdown prompt с optional frontmatter. Она читает state, задает недостающие вопросы, вызывает подходящий skill/subagent и записывает следующий артефакт." },
        { type: "pre", text: ".qwen/commands/sdd/init.md       -> /sdd:init\n.qwen/commands/sdd/profile.md    -> /sdd:profile\n.qwen/commands/sdd/contract.md   -> /sdd:contract\n.qwen/commands/sdd/build.md      -> /sdd:build\n.qwen/commands/sdd/verify.md     -> /sdd:verify\n.qwen/commands/sdd/release.md    -> /sdd:release" },
        { type: "h3", text: "state.json" },
        { type: "p", text: ".sdd/state.json (конвенция этого курса, а не встроенный механизм Qwen Code) хранит решения, которые уже приняты: source type, approved grain, keys, DQ policy, output port, generated files, last verification result. Команды должны читать state перед вопросами и не заставлять пользователя повторять известное." },
        { type: "h3", text: "Шаблон команды" },
        { type: "pre", text: "---\ndescription: Generate or update the ODCS contract from approved profiling state.\n---\n\nRead AGENTS.md, .sdd/state.json, specs/schema_manifest.yaml, and any existing ODCS file.\nAsk only for missing semantic decisions.\nWrite the smallest contract update.\nRun datacontract lint.\nReport changed contract fields, checks run, and unresolved approvals." },
        { type: "h3", text: "Не все нужно автоматизировать" },
        { type: "p", text: "Команды не должны делать скрытую цепочку из десяти этапов. Лучше короткий pipeline с явными остановками: profile -> approve semantics -> contract -> build -> verify -> release. Так проще понять, где произошла ошибка и кто принял решение." },
        { type: "callout", text: "<strong>Стоп-условие:</strong> если команда меняет контрактную семантику или не может выполнить проверку, она прекращает генерацию и возвращает список решений для человека." }
      ],
      flashcards: [
        { front: "Project command path", back: ".qwen/commands/sdd/build.md превращается в /sdd:build." },
        { front: ".sdd/state.json", back: "Durable context между этапами: решения, артефакты, verification status, open questions." },
        { front: "Хорошая команда Qwen Code", back: "Читает правила и state, задает только недостающие вопросы, делает минимальный diff, запускает проверки, сообщает stop conditions." }
      ],
      quiz: [
        {
          prompt: "Зачем нужен .sdd/state.json?",
          options: [
            "Чтобы хранить API keys.",
            "Чтобы команды помнили уже утвержденные решения и не переспрашивали их.",
            "Чтобы заменить Git.",
            "Чтобы браузер открывал HTML."
          ],
          correct: 1,
          explain: "State связывает этапы пайплайна и делает workflow перезапускаемым."
        },
        {
          prompt: "Какой pipeline лучше для SDD?",
          options: [
            "Одна команда, которая молча делает все до release.",
            "Короткие команды с явными гейтами и проверками между этапами.",
            "Только ручные изменения без команд.",
            "Команда, которая удаляет state после каждого шага."
          ],
          correct: 1,
          explain: "SDD требует наблюдаемости и approval на semantic decisions."
        }
      ],
      sources: [
        { title: "Qwen Code Commands", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/", meta: "Qwen docs", desc: "Custom Markdown commands, namespaces и parameter processing." },
        { title: "Automating the Entire Data Engineering Lifecycle with AI", url: "https://medium.com/@nayan.j.paul/automating-the-entire-data-engineering-lifecycle-with-ai-an-ai-first-approach-to-tdlc-sdlc-and-cf0f5c9510d4", meta: "Nayan Paul · 2026", desc: "Семь стадий AI-first data pipeline, адаптированные под Qwen commands." }
      ]
    },
    {
      id: 10,
      title: "Subagents: специалисты по данным",
      summary: "Как разбить работу Qwen Code на data-profiler, contract-writer, pipeline-generator и reviewer.",
      objectives: [
        "Составить карту subagents для SDD data workflow.",
        "Определить tools и permissions для каждого subagent.",
        "Понять, когда explicit invocation лучше автоматической делегации."
      ],
      body: [
        { type: "h3", text: "Зачем subagents" },
        { type: "p", text: "Один агент в большом data-проекте быстро смешивает роли: профилирует источник, пишет контракт, генерирует SQL, исправляет тесты и делает ревью собственного кода. Subagents позволяют разделить контекст и ответственность." },
        { type: "h3", text: "Практичная карта" },
        { type: "ul", items: [
          "data-profiler: read-only профиль источника и Schema Manifest.",
          "contract-writer: ODCS/ODPS YAML из approved decisions.",
          "dbt-generator: SQL/YAML изменения в dbt models.",
          "quality-engineer: dbt tests, datacontract test, fixtures.",
          "data-reviewer: независимое ревью diff against spec.",
          "docs-writer: README, data dictionary, runbook."
        ]},
        { type: "h3", text: "Пример frontmatter" },
        { type: "pre", text: "---\nname: data-quality-reviewer\ndescription: Reviews data pipeline changes against ODCS, ODPS, dbt contracts, and project DQ rules\ntools:\n  - read_file\n  - grep_search\n  - run_shell_command\n---\n\nYou review only. Do not edit files. Compare the diff to specs and report contract drift, missing tests, unsafe schema evolution, and unverifiable claims." },
        { type: "h3", text: "Explicit invocation" },
        { type: "p", text: "Если нужен именно reviewer или profiler, командный prompt должен назвать его явно: use data-quality-reviewer to review the diff against specs. Но курс не должен обещать стопроцентную детерминированность выбора subagent: agentic routing остается вероятностным, поэтому command должен проверять результат." },
        { type: "callout", text: "<strong>Безопасное правило:</strong> генератор не должен быть единственным reviewer. Для контрактных изменений нужен отдельный review pass с read-only или ограниченными permissions." }
      ],
      flashcards: [
        { front: "Почему subagents полезны в data SDD?", back: "Они разделяют профилирование, генерацию, тестирование и ревью, уменьшая смешение контекста и self-review bias." },
        { front: "Каким должен быть data-reviewer?", back: "Read-only или почти read-only. Его задача - найти contract drift, missing tests и unsafe schema evolution, а не чинить код." },
        { front: "Explicit invocation", back: "Команда может просить использовать конкретный subagent, но должна проверять результат, а не полагаться на магическую детерминированность." }
      ],
      quiz: [
        {
          prompt: "Какой subagent должен писать Schema Manifest?",
          options: [
            "data-profiler",
            "docs-writer",
            "release-manager",
            "frontend-designer"
          ],
          correct: 0,
          explain: "Профилирование источника - отдельная read-only задача data-profiler."
        },
        {
          prompt: "Почему reviewer не должен быть тем же агентом, который сгенерировал код?",
          options: [
            "Потому что так дольше.",
            "Чтобы уменьшить self-review bias и проверить diff against spec независимым проходом.",
            "Потому что reviewer не умеет читать YAML.",
            "Потому что Qwen Code не поддерживает чтение файлов."
          ],
          correct: 1,
          explain: "Независимый reviewer лучше ловит несоответствие контракту и пропущенные проверки."
        }
      ],
      sources: [
        { title: "Qwen Code Subagents", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/sub-agents/", meta: "Qwen docs", desc: "Описание named subagents, fork subagent, tools и best practices." },
        { title: "Qwen Code README", url: "https://github.com/QwenLM/qwen-code", meta: "GitHub", desc: "Возможности Qwen Code: SubAgents, Agent Teams, MCP, Skills, Hooks и multi-protocol." }
      ]
    },
    {
      id: 11,
      title: "Adviser -> Gate -> Generator",
      summary: "Как перенести исходный hybrid pattern в Qwen Code без скрытого автопилота.",
      objectives: [
        "Разобрать три фазы паттерна.",
        "Понять, какие решения должен принимать человек.",
        "Собрать Qwen-совместимый процесс для curation и data product."
      ],
      body: [
        { type: "h3", text: "Фаза Adviser" },
        { type: "p", text: "Qwen Code или subagent предлагает рекомендации без записи production-кода: rename rules, casts, dedup keys, null handling, DQ checks, bad-row policy, KPI candidates, BI view filters. Выход должен быть JSON/Markdown с rationale и confidence." },
        { type: "h3", text: "Фаза Gate" },
        { type: "p", text: "Человек утверждает правила, отклоняет лишнее и фиксирует решения в .sdd/state.json или specs/. В этот момент решается, что является correct behavior. Qwen Code не должен обходить gate ради скорости." },
        { type: "h3", text: "Фаза Generator" },
        { type: "p", text: "После gate Qwen Code генерирует dbt/PySpark/DAG/tests/docs строго из approved rules. Если при реализации выяснилось, что правило невозможно или противоречит контракту, генератор возвращается к gate, а не чинит смысл сам." },
        { type: "h3", text: "Пример для curation" },
        { type: "ol", items: [
          "/sdd:profile создает Schema Manifest.",
          "/sdd:curate-advice предлагает правила rename/cast/null/dedup/DQ.",
          "Человек утверждает bad-row policy и severity.",
          "/sdd:build генерирует silver model и tests.",
          "/sdd:verify запускает dbt build, datacontract test и reviewer pass."
        ]},
        { type: "callout", text: "<strong>Ключевой запрет:</strong> adviser не пишет код, generator не принимает бизнес-решения, reviewer не переписывает контракт без approval." }
      ],
      flashcards: [
        { front: "Adviser", back: "Предлагает варианты и rationale, но не пишет production-код." },
        { front: "Gate", back: "Human approval на семантические решения: keys, DQ severity, bad-row policy, KPI meaning." },
        { front: "Generator", back: "Реализует только approved rules и возвращается к gate при противоречии." }
      ],
      quiz: [
        {
          prompt: "Что нарушает паттерн Adviser -> Gate -> Generator?",
          options: [
            "Adviser возвращает JSON-рекомендации.",
            "Человек утверждает bad-row policy.",
            "Generator сам меняет grain, чтобы тесты прошли.",
            "Reviewer сравнивает diff со спецификацией."
          ],
          correct: 2,
          explain: "Grain - семантическое решение. Generator не должен менять его без gate."
        },
        {
          prompt: "Где лучше хранить утвержденные решения между командами?",
          options: [
            ".sdd/state.json и specs/",
            "История терминала",
            "Случайный комментарий в SQL",
            "Только память текущей LLM-сессии"
          ],
          correct: 0,
          explain: "Durable state и specs делают workflow перезапускаемым и проверяемым."
        }
      ],
      sources: [
        { title: "Automating the Entire Data Engineering Lifecycle with AI", url: "https://medium.com/@nayan.j.paul/automating-the-entire-data-engineering-lifecycle-with-ai-an-ai-first-approach-to-tdlc-sdlc-and-cf0f5c9510d4", meta: "Nayan Paul · 2026", desc: "Источник hybrid pattern с adviser, human gate и generation stages." },
        { title: "Qwen Code Commands", url: "https://qwenlm.github.io/qwen-code-docs/en/users/features/commands/", meta: "Qwen docs", desc: "Механика project commands для явных этапов workflow." }
      ]
    },
    {
      id: 12,
      title: "Hooks, CI и проверяемость",
      summary: "Как заставить Qwen Code и CI проверять контракт, а не только компиляцию.",
      objectives: [
        "Разобрать Qwen hooks и их место в SDD.",
        "Составить набор локальных и CI-проверок для data contract.",
        "Понять, какие проверки должны блокировать merge."
      ],
      body: [
        { type: "h3", text: "Qwen hooks" },
        { type: "p", text: "Qwen Code поддерживает hooks: command, http, function и prompt executors. Для data-проекта практичны command hooks: перед записью файлов можно проверять forbidden paths, секреты, production data paths и изменение контрактных YAML без approval marker." },
        { type: "pre", text: "{\n  \"hooks\": {\n    \"PreToolUse\": [\n      {\n        \"matcher\": \"WriteFile\",\n        \"hooks\": [\n          {\n            \"type\": \"command\",\n            \"command\": \"$QWEN_PROJECT_DIR/.qwen/hooks/contract-guard.sh\",\n            \"name\": \"contract-guard\",\n            \"timeout\": 10000\n          }\n        ]\n      }\n    ]\n  }\n}" },
        { type: "h3", text: "Проверки после изменений" },
        { type: "ul", items: [
          "datacontract lint specs/*.odcs.yaml",
          "datacontract test specs/*.odcs.yaml against staging/sample data",
          "dbt parse и dbt build --select changed_model+",
          "unit/property tests для трансформаций",
          "schema diff и contract changelog",
          "data quality reviewer pass against ODPS/ODCS/model spec"
        ]},
        { type: "h3", text: "Merge gates" },
        { type: "p", text: "Блокировать merge должны: invalid contract YAML, failing dbt contract, failing DQ severity error, unapproved breaking contract change, PII exposure without approval, undocumented SLA change и отсутствие теста на новую бизнес-логику." },
        { type: "callout", text: "<strong>SDD не равен больше тестов:</strong> важно не количество проверок, а связь каждой проверки с конкретным обещанием из спецификации." }
      ],
      flashcards: [
        { front: "Qwen hook", back: "Скрипт или endpoint, который запускается на событиях Qwen Code, например перед tool execution или после него." },
        { front: "Что блокирует merge?", back: "Invalid contract, failing dbt build, unapproved breaking change, PII/SLA drift, missing tests for new behavior." },
        { front: "Contract guard", back: "Hook/CI-проверка, которая не дает менять контрактные YAML или production paths без approval." }
      ],
      quiz: [
        {
          prompt: "Какая проверка наиболее напрямую валидирует ODCS YAML?",
          options: [
            "npm test",
            "datacontract lint",
            "stylelint",
            "browser screenshot"
          ],
          correct: 1,
          explain: "datacontract lint проверяет структуру data contract."
        },
        {
          prompt: "Что не должно проходить merge без approval?",
          options: [
            "Исправление typo в README.",
            "Смена freshness SLA output port.",
            "Добавление локального комментария.",
            "Переименование временной переменной в тесте."
          ],
          correct: 1,
          explain: "SLA - часть обещания data product потребителям."
        }
      ],
      sources: [
        { title: "Qwen Code Hooks", url: "https://github.com/QwenLM/qwen-code/blob/main/docs/users/features/hooks.md", meta: "Qwen docs", desc: "Hook types, configuration and PreToolUse examples." },
        { title: "Data Contract CLI", url: "https://cli.datacontract.com/", meta: "Data Contract CLI", desc: "Документация по lint/test/changelog data contracts." },
        { title: "dbt Model Contracts", url: "https://docs.getdbt.com/docs/mesh/govern/model-contracts", meta: "dbt Labs", desc: "Проверка contracts при dbt build." }
      ]
    },
    {
      id: 13,
      title: "Self-healing через PatchSpec",
      summary: "Как чинить падения пайплайна через спецификацию патча, а не через случайный hotfix.",
      objectives: [
        "Описать PatchSpec как контролируемый repair artifact.",
        "Разделить automated diagnosis и approved patch.",
        "Понять, какие проверки нужны перед применением исправления."
      ],
      body: [
        { type: "h3", text: "Почему обычный hotfix опасен" },
        { type: "p", text: "Если пайплайн упал из-за drift источника, Qwen Code может быстро предложить кодовый фикс. Но такой фикс часто маскирует несовместимость: поле удалено, тип изменился, SLA невыполним, bad-row policy не определена. В SDD сначала описывается PatchSpec (авторская конвенция этого курса, а не стандарт или встроенная фича Qwen Code)." },
        { type: "h3", text: "PatchSpec" },
        { type: "pre", text: "patch_spec:\n  incident: orders_ingest_failed_2026_06_24\n  observed_failure: missing column customer_email\n  contract_impact:\n    odcs_field: orders.customer_email\n    breaking_change: true\n  proposed_options:\n    - keep_contract_and_quarantine_rows\n    - version_contract_to_v2\n  required_approvals:\n    - data_product_owner\n    - privacy_reviewer\n  verification:\n    - datacontract lint\n    - datacontract test staging\n    - dbt build --select fct_orders+\n    - data diff on last 7 days" },
        { type: "h3", text: "Qwen workflow" },
        { type: "ol", items: [
          "Qwen Code собирает error logs, failing checks и последние contract diffs.",
          "diagnosis subagent пишет PatchSpec без изменения production-кода.",
          "Человек выбирает repair strategy.",
          "Qwen Code реализует approved patch в минимальном scope.",
          "CI и reviewer pass подтверждают, что contract drift закрыт."
        ]},
        { type: "h3", text: "Версионирование" },
        { type: "p", text: "Если источник реально изменил API данных, правильный patch может быть не совместимым фиксированием, а новой версией контракта: orders.v2, migration notes, compatibility window, consumer notification. Qwen Code должен уметь предложить такой вариант." },
        { type: "callout", text: "<strong>Self-healing не означает self-approval:</strong> агент может диагностировать и подготовить patch, но breaking semantic changes проходят через owner gate." }
      ],
      flashcards: [
        { front: "PatchSpec", back: "Спецификация исправления: incident, observed failure, contract impact, options, approvals, verification." },
        { front: "Self-healing gate", back: "Автоматическая диагностика допустима; breaking semantic change требует human approval." },
        { front: "Когда нужен contract v2?", back: "Когда source/API изменился несовместимо и старое обещание потребителям больше нельзя сохранить честно." }
      ],
      quiz: [
        {
          prompt: "Что должен сделать Qwen Code при missing required field в источнике?",
          options: [
            "Удалить поле из контракта без обсуждения.",
            "Составить PatchSpec с contract impact и вариантами repair.",
            "Отключить datacontract test навсегда.",
            "Перезапустить браузер."
          ],
          correct: 1,
          explain: "Missing required field - контрактное событие. Сначала PatchSpec и approval, потом код."
        },
        {
          prompt: "Что означает self-healing в SDD?",
          options: [
            "Агент сам принимает все бизнес-решения.",
            "Агент готовит диагностированный и проверяемый patch, но semantic approvals остаются у людей.",
            "Тесты больше не нужны.",
            "Контракты можно удалить."
          ],
          correct: 1,
          explain: "Self-healing ускоряет repair loop, но не отменяет governance."
        }
      ],
      sources: [
        { title: "GitHub Spec Kit", url: "https://github.com/github/spec-kit", meta: "GitHub", desc: "Spec-driven repair и роль спецификаций как первичных артефактов." },
        { title: "Automating the Entire Data Engineering Lifecycle with AI", url: "https://medium.com/@nayan.j.paul/automating-the-entire-data-engineering-lifecycle-with-ai-an-ai-first-approach-to-tdlc-sdlc-and-cf0f5c9510d4", meta: "Nayan Paul · 2026", desc: "Идеи state-driven regeneration и self-healing для data pipeline." }
      ]
    },
    {
      id: 14,
      title: "Финальный запуск: capstone",
      summary: "Итоговая карта курса и практический план внедрения SDD data workflow в Qwen Code.",
      objectives: [
        "Собрать все артефакты SDD data workflow в одну схему.",
        "Проверить готовность репозитория к Qwen Code.",
        "Сформировать capstone-задание для своего data product."
      ],
      body: [
        { type: "h3", text: "Итоговая схема" },
        { type: "ol", items: [
          "AGENTS.md задает hard rules и verification gates.",
          ".qwen/commands запускают явные этапы: init, profile, contract, build, verify, release.",
          ".qwen/skills хранят методики review, contract writing и data quality.",
          ".qwen/agents разделяют profiler, contract writer, dbt generator, reviewer и docs writer.",
          "specs/ хранит ODPS 4.1, ODCS 3.1 и model specs.",
          ".sdd/state.json хранит approved decisions между этапами.",
          "CI проверяет contracts, dbt build, tests, drift и approval markers."
        ]},
        { type: "h3", text: "Чеклист внедрения за неделю" },
        { type: "ul", items: [
          "День 1: выбрать один output dataset и описать current grain, owner, SLA, consumers.",
          "День 2: собрать Schema Manifest на sample/staging данных.",
          "День 3: написать ODCS и проверить datacontract lint/test.",
          "День 4: описать ODPS 4.1 с productStrategy и output port.",
          "День 5: включить dbt contract и model spec для одной модели.",
          "День 6: добавить .qwen/commands и reviewer skill.",
          "День 7: прогнать изменение через Qwen Code от spec diff до verified PR."
        ]},
        { type: "h3", text: "Capstone-задание" },
        { type: "p", text: "Возьмите один data product и проведите его через полный SDD-loop: manifest -> ODCS -> ODPS -> dbt contract -> Qwen build -> verification -> reviewer report. Финальный результат должен включать diff, список проверок, unresolved approvals и migration notes для consumers." },
        { type: "h3", text: "Критерии готовности" },
        { type: "ul", items: [
          "Новый инженер может понять продукт из specs без чтения всего кода.",
          "Qwen Code не задает повторные вопросы, потому что state и specs заполнены.",
          "Breaking changes видны до merge.",
          "Каждая новая бизнес-логика имеет test или data quality rule.",
          "Self-healing patch не может примениться без approval на semantic drift."
        ]},
        { type: "callout", text: "<strong>Главная мысль:</strong> сильный Qwen Coder ускоряет работу только тогда, когда у него есть проверяемый контракт. Без контракта он ускоряет и ошибки." }
      ],
      reviewBlocks: [
        { title: "Qwen Code", items: ["AGENTS.md", ".qwen/commands", ".qwen/skills", ".qwen/agents", "hooks"] },
        { title: "Data specs", items: ["Schema Manifest", "ODCS v3.1", "ODPS 4.1", "dbt model contract", "model spec"] },
        { title: "Workflow", items: ["Adviser", "Human gate", "Generator", "Reviewer", "CI verification"] },
        { title: "Governance", items: ["PII policy", "SLA changes", "breaking changes", "PatchSpec", "consumer migration"] }
      ],
      flashcards: [
        { front: "Минимальный SDD data repo", back: "AGENTS.md, specs/, .qwen/commands, .qwen/skills, .qwen/agents, .sdd/state.json, CI gates." },
        { front: "Definition of done", back: "Spec updated, code changed minimally, checks passed, reviewer found no contract drift, approvals resolved." },
        { front: "Главный риск", back: "Qwen Code быстро чинит симптом, если процесс не заставляет его проверить контрактный смысл изменения." }
      ],
      quiz: [
        {
          prompt: "Что должно входить в финальный verified PR по SDD data workflow?",
          options: [
            "Только SQL diff.",
            "Spec diff, code diff, tests, verification output, reviewer report и approval notes.",
            "Только скриншот терминала.",
            "Только новый README без проверок."
          ],
          correct: 1,
          explain: "SDD PR должен показывать связь между изменением спецификации, реализацией и проверкой."
        },
        {
          prompt: "Какой результат показывает, что курс внедрен правильно?",
          options: [
            "Qwen Code пишет больше кода за один запуск.",
            "Breaking changes видны до merge, а агент работает по specs/state без повторных вопросов.",
            "Все проверки выключены для скорости.",
            "Контракты лежат отдельно и не используются."
          ],
          correct: 1,
          explain: "Цель не объем генерации, а предсказуемый, проверяемый workflow."
        }
      ],
      sources: [
        { title: "Qwen Code README", url: "https://github.com/QwenLM/qwen-code", meta: "GitHub", desc: "Обзор возможностей Qwen Code: terminal UI, headless mode, SDK, Skills, SubAgents, Hooks, MCP." },
        { title: "Qwen3-Coder: Agentic Coding in the World", url: "https://qwenlm.github.io/blog/qwen3-coder/", meta: "Qwen blog", desc: "Qwen3-Coder, Qwen Code и OpenAI-compatible setup." },
        { title: "Open Data Products Standards Family", url: "https://opendataproducts.org/", meta: "Linux Foundation", desc: "ODPS 4.1 и стандарты family для AI-agent-first data products." }
      ]
    }
  ]
};

const FINAL_QUIZ = [
  {
    prompt: "В чем главная роль SDD в data engineering?",
    options: [
      "Ускорить написание SQL без дополнительных проверок.",
      "Сделать grain, SLA, schema, ownership и compatibility явным контрактом до генерации кода.",
      "Заменить dbt и CI одним промптом.",
      "Хранить только текстовое описание пайплайна."
    ],
    correct: 1,
    explain: "SDD нужен не ради документации самой по себе, а чтобы агент и команда работали от проверяемого контракта."
  },
  {
    prompt: "Зачем data-репозиторию нужен AGENTS.md?",
    options: [
      "Чтобы описать стиль README.",
      "Чтобы закрепить правила для агента: что можно менять, какие проверки обязательны и где лежит state.",
      "Чтобы заменить спецификации.",
      "Чтобы отключить вопросы перед breaking changes."
    ],
    correct: 1,
    explain: "AGENTS.md задает рабочие границы: команды, запреты, gates, источники правды и правила escalations."
  },
  {
    prompt: "Что правильно описывает Schema Manifest?",
    options: [
      "Финальный контракт, уже утвержденный владельцем данных.",
      "Наблюдения по источнику: поля, типы, null rates, примеры и открытые вопросы до утверждения семантики.",
      "Только список dbt-моделей.",
      "BI-дашборд для конечных пользователей."
    ],
    correct: 1,
    explain: "Manifest отделяет факты наблюдения от решений о бизнес-смысле, grain, PII и quality policy."
  },
  {
    prompt: "Как лучше разделить ODCS, ODPS и dbt contract?",
    options: [
      "ODCS — схема и качество данных, ODPS — продукт и потребители, dbt contract — исполняемый контракт модели.",
      "Все три стандарта описывают одно и то же, можно оставить любой.",
      "ODPS нужен только для ML, dbt contract только для CSV.",
      "dbt contract заменяет owner, SLA и consumer impact."
    ],
    correct: 0,
    explain: "Эти артефакты закрывают разные уровни: dataset contract, data product contract и runtime enforcement."
  },
  {
    prompt: "Какое изменение чаще всего считается backward compatible?",
    options: [
      "Удалить колонку из output dataset.",
      "Поменять grain таблицы.",
      "Добавить nullable колонку без изменения смысла существующих полей.",
      "Переименовать business key."
    ],
    correct: 2,
    explain: "Добавление nullable поля обычно не ломает consumers. Удаление, rename, grain change и stricter nullability требуют migration plan."
  },
  {
    prompt: "Как должен выглядеть здоровый Qwen Code workflow для данных?",
    options: [
      "Один большой prompt: сразу переписать весь pipeline.",
      "Короткая цепочка profile -> approve semantics -> contract -> build -> verify -> release.",
      "Сначала code generation, потом при необходимости specs.",
      "Только ручное редактирование без agent state."
    ],
    correct: 1,
    explain: "Короткие явные этапы делают решения проверяемыми и показывают, где нужен human gate."
  },
  {
    prompt: "Что должен делать human gate?",
    options: [
      "Утверждать бизнес-смысл, PII policy, breaking changes и unresolved approvals.",
      "Форматировать SQL.",
      "Автоматически принимать все рекомендации агента.",
      "Запускать только prettier."
    ],
    correct: 0,
    explain: "Агент может предложить варианты, но ответственность за semantic decisions остается у людей."
  },
  {
    prompt: "Почему полезно разделять subagents в data-проекте?",
    options: [
      "Чтобы каждый subagent мог менять production без review.",
      "Чтобы profiler, contract writer, dbt generator и reviewer имели разные полномочия и артефакты.",
      "Чтобы скрыть решения от CI.",
      "Чтобы заменить владельца данных."
    ],
    correct: 1,
    explain: "Разделение ролей снижает смешение анализа, генерации и проверки, а reviewer может ловить drift."
  },
  {
    prompt: "Что означает схема Adviser -> Gate -> Generator?",
    options: [
      "Генератор пишет код, а потом adviser придумывает контракт.",
      "Adviser предлагает правила, gate утверждает смысл, generator меняет код только по approved state.",
      "Gate нужен только для UI-фич.",
      "Adviser всегда применяет patch автоматически."
    ],
    correct: 1,
    explain: "Такой порядок не дает агенту превратить предположение в production behavior без утверждения."
  },
  {
    prompt: "Что должно блокировать merge в SDD data workflow?",
    options: [
      "Любое изменение SQL.",
      "Invalid contract YAML, failing dbt contract, DQ severity error, unapproved breaking change или PII exposure.",
      "Отсутствие красивого changelog.",
      "Наличие слишком подробной спецификации."
    ],
    correct: 1,
    explain: "CI gate должен ловить контрактные и quality-регрессии, особенно там, где ломаются consumers или governance."
  },
  {
    prompt: "Что такое PatchSpec в self-healing loop?",
    options: [
      "Свободный текст без связи с ошибкой.",
      "Диагностированный patch plan: symptom, suspected contract drift, proposed change, checks и approval points.",
      "Команда для удаления failing tests.",
      "Автоматический merge после первой зеленой проверки."
    ],
    correct: 1,
    explain: "PatchSpec делает repair проверяемым: видно, что чинится, почему, какими проверками и где нужен approval."
  },
  {
    prompt: "Что должно входить в финальный verified PR?",
    options: [
      "Только SQL diff.",
      "Spec diff, code diff, tests, verification output, reviewer report и approval notes.",
      "Только новый dashboard.",
      "Только ссылка на чат с агентом."
    ],
    correct: 1,
    explain: "Итоговый PR должен связывать изменение контракта, реализацию, проверки и решения людей."
  },
  {
    prompt: "Какую роль играет dbt contract в этом курсе?",
    options: [
      "Он заменяет ODCS и ODPS полностью.",
      "Он делает часть model spec исполняемой: типы, constraints и on_schema_change становятся gate.",
      "Он нужен только для документации.",
      "Он отключает data quality checks."
    ],
    correct: 1,
    explain: "dbt contract полезен как runtime enforcement модели, но не заменяет product-level и consumer-level контракт."
  },
  {
    prompt: "Как понять, что курс внедрен не формально, а по-настоящему?",
    options: [
      "Агент генерирует больше строк кода за запуск.",
      "Breaking changes видны до merge, agent работает по specs/state, а reviewer ловит contract drift.",
      "Все approvals перенесены в устные договоренности.",
      "Specs лежат отдельно и не участвуют в CI."
    ],
    correct: 1,
    explain: "Успех измеряется предсказуемостью, проверяемостью и защитой consumers, а не объемом генерации."
  }
];

/* ===================== App state ===================== */
const STORAGE_KEY = "sdd_data_course_progress_v1";

const state = {
  currentLesson: 0,
  completed: new Set(),
  quizAnswers: {}
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.completed)) {
      state.completed = new Set(data.completed);
    }
    if (typeof data.currentLesson === "number") {
      state.currentLesson = Math.max(0, Math.min(data.currentLesson, COURSE.lessons.length - 1));
    }
  } catch (e) {
    /* ignore corrupted state */
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: Array.from(state.completed),
      currentLesson: state.currentLesson
    }));
  } catch (e) {
    /* storage unavailable */
  }
}

/* ===================== Rendering ===================== */
function renderNav() {
  const nav = document.getElementById("lessonNav");
  nav.innerHTML = "";
  COURSE.lessons.forEach((lesson, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lesson-nav-item" + (idx === state.currentLesson ? " active" : "") + (state.completed.has(idx) ? " done" : "");
    btn.innerHTML = [
      "<span class=\"lesson-num\">" + (idx + 1) + "</span>",
      "<span class=\"lesson-nav-text\">",
      "  <span class=\"lesson-nav-label\">" + escapeHtml(lesson.title) + "</span>",
      "  <span class=\"lesson-nav-sub\">Урок " + (idx + 1) + (lesson.reviewBlocks ? " · Итог" : "") + "</span>",
      "</span>"
    ].join("");
    btn.addEventListener("click", function () { goToLesson(idx); });
    nav.appendChild(btn);
  });
}

function updateProgressBar() {
  const total = COURSE.lessons.length;
  const done = state.completed.size;
  const fill = document.getElementById("progressFill");
  const count = document.getElementById("progressCount");
  const reviewBtn = document.getElementById("reviewBtn");
  fill.style.width = (done / total * 100).toFixed(1) + "%";
  count.textContent = done + " / " + total;
  if (reviewBtn) reviewBtn.disabled = done < total;
}

function renderLesson() {
  const lesson = COURSE.lessons[state.currentLesson];
  document.getElementById("crumbCourse").textContent = COURSE.title;
  document.getElementById("crumbLesson").textContent = "Урок " + (state.currentLesson + 1);
  document.getElementById("lessonTitle").textContent = lesson.title;
  document.getElementById("lessonIntro").textContent = lesson.summary;

  /* Objectives */
  const objList = document.getElementById("objectivesList");
  objList.innerHTML = "";
  lesson.objectives.forEach(function (obj) {
    const li = document.createElement("li");
    li.textContent = obj;
    objList.appendChild(li);
  });

  /* Body */
  const bodyEl = document.getElementById("lessonBody");
  bodyEl.innerHTML = "";
  lesson.body.forEach(function (block) {
    if (block.type === "h3") {
      const h = document.createElement("h3");
      h.textContent = block.text;
      bodyEl.appendChild(h);
    } else if (block.type === "p") {
      const p = document.createElement("p");
      p.textContent = block.text;
      bodyEl.appendChild(p);
    } else if (block.type === "ul") {
      const ul = document.createElement("ul");
      block.items.forEach(function (it) {
        const li = document.createElement("li");
        li.textContent = it;
        ul.appendChild(li);
      });
      bodyEl.appendChild(ul);
    } else if (block.type === "ol") {
      const ol = document.createElement("ol");
      block.items.forEach(function (it) {
        const li = document.createElement("li");
        li.textContent = it;
        ol.appendChild(li);
      });
      bodyEl.appendChild(ol);
    } else if (block.type === "pre") {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = block.text;
      pre.appendChild(code);
      bodyEl.appendChild(pre);
    } else if (block.type === "callout") {
      const div = document.createElement("div");
      div.className = "callout";
      div.innerHTML = block.text;
      bodyEl.appendChild(div);
    }
  });

  /* Review blocks (final lesson) */
  if (lesson.reviewBlocks) {
    const grid = document.createElement("div");
    grid.className = "review-grid";
    lesson.reviewBlocks.forEach(function (block) {
      const card = document.createElement("div");
      card.className = "review-card";
      const h = document.createElement("h4");
      h.textContent = block.title;
      const ul = document.createElement("ul");
      block.items.forEach(function (it) {
        const li = document.createElement("li");
        li.textContent = it;
        ul.appendChild(li);
      });
      card.appendChild(h);
      card.appendChild(ul);
      grid.appendChild(card);
    });
    bodyEl.appendChild(grid);
  }

  /* Flashcards */
  const fc = document.getElementById("flashcards");
  fc.innerHTML = "";
  lesson.flashcards.forEach(function (card, i) {
    const wrap = document.createElement("div");
    wrap.className = "flashcard";
    wrap.setAttribute("role", "button");
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("aria-label", "Флеш-карточка: кликните чтобы перевернуть");
    wrap.innerHTML = [
      "<div class=\"flashcard-inner\">",
      "  <div class=\"flashcard-face front\"><span class=\"flashcard-tag\">Вопрос</span>" + escapeHtml(card.front) + "</div>",
      "  <div class=\"flashcard-face back\"><span class=\"flashcard-tag\">Ответ</span>" + escapeHtml(card.back) + "</div>",
      "</div>"
    ].join("");
    const flip = function () { wrap.classList.toggle("flipped"); };
    wrap.addEventListener("click", flip);
    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    fc.appendChild(wrap);
  });

  /* Quiz */
  const quizEl = document.getElementById("quiz");
  quizEl.innerHTML = "";
  lesson.quiz.forEach(function (q, qi) {
    const block = document.createElement("div");
    block.className = "quiz-question";
    const prompt = document.createElement("div");
    prompt.className = "quiz-prompt";
    prompt.textContent = (qi + 1) + ". " + q.prompt;
    block.appendChild(prompt);

    const opts = document.createElement("div");
    opts.className = "quiz-options";
    const key = state.currentLesson + ":" + qi;
    const previous = state.quizAnswers[key];

    q.options.forEach(function (opt, oi) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt;
      if (previous !== undefined) {
        btn.disabled = true;
        if (oi === q.correct) btn.classList.add("correct");
        else if (oi === previous) btn.classList.add("wrong");
      }
      btn.addEventListener("click", function () {
        if (state.quizAnswers[key] !== undefined) return;
        state.quizAnswers[key] = oi;
        saveProgress();
        if (oi === q.correct) btn.classList.add("correct");
        else btn.classList.add("wrong");
        q.options.forEach(function (b, idx) {
          if (idx !== oi) {
            if (idx === q.correct) {
              const other = opts.children[idx];
              if (other) other.classList.add("correct");
            }
          }
          const other = opts.children[idx];
          if (other) other.disabled = true;
        });
        const fb = document.createElement("div");
        fb.className = "quiz-feedback " + (oi === q.correct ? "ok" : "bad");
        fb.textContent = (oi === q.correct ? "Верно. " : "Неверно. ") + q.explain;
        block.appendChild(fb);
      });
      opts.appendChild(btn);
    });
    block.appendChild(opts);

    if (previous !== undefined) {
      const fb = document.createElement("div");
      fb.className = "quiz-feedback " + (previous === q.correct ? "ok" : "bad");
      fb.textContent = (previous === q.correct ? "Верно. " : "Неверно. ") + q.explain;
      block.appendChild(fb);
    }

    quizEl.appendChild(block);
  });

  /* Sources */
  const srcEl = document.getElementById("sources");
  srcEl.innerHTML = "";
  lesson.sources.forEach(function (s) {
    const a = document.createElement("a");
    a.className = "source-card";
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = [
      "<span class=\"source-title\">" + escapeHtml(s.title) + "</span>",
      "<span class=\"source-meta\">" + escapeHtml(s.meta) + "</span>",
      "<span class=\"source-desc\">" + escapeHtml(s.desc) + "</span>"
    ].join("");
    srcEl.appendChild(a);
  });

  /* Mark button */
  const markBtn = document.getElementById("markBtn");
  if (state.completed.has(state.currentLesson)) {
    markBtn.textContent = "✓ Пройдено";
    markBtn.classList.add("done");
  } else {
    markBtn.textContent = "Отметить как пройденный";
    markBtn.classList.remove("done");
  }

  /* Nav buttons */
  const nextBtn = document.getElementById("nextBtn");
  document.getElementById("prevBtn").disabled = state.currentLesson === 0;
  nextBtn.textContent = state.currentLesson === COURSE.lessons.length - 1 ? "Финальный тест" : "Далее →";

  /* Scroll to top */
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildFinalQuiz() {
  const quizEl = document.getElementById("finalQuiz");
  const resultEl = document.getElementById("reviewResult");
  if (!quizEl || !resultEl) return;

  quizEl.innerHTML = "";
  resultEl.hidden = true;
  const finalAnswers = {};

  FINAL_QUIZ.forEach(function (q, qi) {
    const question = document.createElement("div");
    question.className = "quiz-question";

    const prompt = document.createElement("div");
    prompt.className = "quiz-prompt";
    prompt.textContent = (qi + 1) + ". " + q.prompt;
    question.appendChild(prompt);

    const opts = document.createElement("div");
    opts.className = "quiz-options";
    q.options.forEach(function (opt, oi) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt;
      btn.addEventListener("click", function () {
        if (finalAnswers[qi] !== undefined) return;
        finalAnswers[qi] = oi;
        opts.querySelectorAll(".quiz-option").forEach(function (other, idx) {
          other.disabled = true;
          if (idx === q.correct) other.classList.add("correct");
          else if (idx === oi) other.classList.add("wrong");
        });

        const feedback = document.createElement("div");
        feedback.className = "quiz-feedback " + (oi === q.correct ? "ok" : "bad");
        feedback.textContent = (oi === q.correct ? "Верно. " : "Неверно. ") + q.explain;
        question.appendChild(feedback);

        if (Object.keys(finalAnswers).length === FINAL_QUIZ.length) {
          const score = FINAL_QUIZ.filter(function (item, idx) {
            return finalAnswers[idx] === item.correct;
          }).length;
          showFinalResult(score, FINAL_QUIZ.length);
        }
      });
      opts.appendChild(btn);
    });
    question.appendChild(opts);
    quizEl.appendChild(question);
  });
}

function showFinalResult(score, total) {
  const resultEl = document.getElementById("reviewResult");
  const scoreEl = document.getElementById("reviewScore");
  const messageEl = document.getElementById("reviewMessage");
  if (!resultEl || !scoreEl || !messageEl) return;

  const pct = Math.round(score / total * 100);
  scoreEl.textContent = score + " / " + total + " (" + pct + "%)";
  messageEl.textContent = pct >= 85
    ? "Отлично: можно переносить SDD-подход в свой data product."
    : pct >= 65
      ? "База есть, но перед внедрением стоит пересмотреть вопросы с ошибками."
      : "Лучше пройти ключевые уроки еще раз: пока есть риск формального внедрения без настоящих gates.";
  resultEl.hidden = false;
}

function showReview() {
  document.getElementById("lessonView").hidden = true;
  document.getElementById("reviewView").hidden = false;
  buildFinalQuiz();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function goToLesson(idx) {
  state.currentLesson = idx;
  saveProgress();
  document.getElementById("reviewView").hidden = true;
  document.getElementById("lessonView").hidden = false;
  renderNav();
  renderLesson();
  updateProgressBar();
}

function toggleCompleted() {
  if (state.completed.has(state.currentLesson)) {
    state.completed.delete(state.currentLesson);
  } else {
    state.completed.add(state.currentLesson);
  }
  saveProgress();
  renderNav();
  renderLesson();
  updateProgressBar();
}

function resetProgress() {
  if (!confirm("Сбросить весь прогресс и ответы?")) return;
  state.completed.clear();
  state.quizAnswers = {};
  state.currentLesson = 0;
  saveProgress();
  document.getElementById("reviewView").hidden = true;
  document.getElementById("lessonView").hidden = false;
  renderNav();
  renderLesson();
  updateProgressBar();
}

/* ===================== Init ===================== */
function initApp() {
  loadProgress();
  document.getElementById("prevBtn").addEventListener("click", function () {
    if (state.currentLesson > 0) goToLesson(state.currentLesson - 1);
  });
  document.getElementById("nextBtn").addEventListener("click", function () {
    if (state.currentLesson < COURSE.lessons.length - 1) goToLesson(state.currentLesson + 1);
    else showReview();
  });
  document.getElementById("markBtn").addEventListener("click", toggleCompleted);
  document.getElementById("reviewBtn").addEventListener("click", showReview);
  document.getElementById("resetProgress").addEventListener("click", function (e) {
    e.preventDefault();
    resetProgress();
  });
  renderNav();
  renderLesson();
  updateProgressBar();
}

if (typeof document !== "undefined" && document.addEventListener) {
  document.addEventListener("DOMContentLoaded", initApp);
}

/* Expose for debugging and smoke tests */
if (typeof globalThis !== "undefined") {
  globalThis.COURSE = COURSE;
  globalThis.FINAL_QUIZ = FINAL_QUIZ;
  globalThis.state = state;
  globalThis.goToLesson = goToLesson;
  globalThis.toggleCompleted = toggleCompleted;
}
