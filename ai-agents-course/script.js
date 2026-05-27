// ============================================================
// AI Agents: Архитектура и Оркестрация — Course Data & Logic
// ============================================================

const courseData = [
  {
    id: 1,
    title: "Что такое AI Agent",
    goal: "Понять фундаментальное отличие агента от чатбота и освоить базовую архитектуру.",
    objectives: [
      "Определять AI-агента через цикл perception-reasoning-action",
      "Отличать агентные системы от простых LLM-вызовов",
      "Знать ключевые компоненты любого агента"
    ],
    content: `
      <h4>От чатбота к агенту</h4>
      <p>LLM-чатбот получает сообщение и генерирует ответ. AI-агент получает <strong>цель</strong> и самостоятельно планирует, какие действия выполнить, чтобы её достичь. Разница фундаментальна: чатбот реагирует, агент действует.</p>

      <div class="key-concept">
        <strong>AI Agent</strong> — автономная система на базе LLM, способная воспринимать окружение, рассуждать о следующих шагах, использовать инструменты и действовать для достижения цели без пошаговых инструкций от человека.
      </div>

      <h4>Цикл Perception → Reasoning → Action</h4>
      <p>Каждый агент работает в бесконечном цикле:</p>
      <ul>
        <li><strong>Perception (восприятие)</strong> — агент получает данные: сообщение пользователя, результат API-вызова, ошибку, данные из базы</li>
        <li><strong>Reasoning (рассуждение)</strong> — LLM анализирует контекст и решает, что делать дальше. Это сердце агента</li>
        <li><strong>Action (действие)</strong> — агент выполняет шаг: вызывает инструмент, пишет код, отправляет запрос, или возвращает ответ пользователю</li>
      </ul>
      <p>Цикл повторяется до тех пор, пока задача не решена или не достигнут лимит итераций.</p>

      <h4>Ключевые компоненты агента</h4>
      <ul>
        <li><strong>LLM (мозг)</strong> — модель, которая рассуждает и принимает решения</li>
        <li><strong>System Prompt</strong> — инструкции, определяющие поведение и ограничения</li>
        <li><strong>Tools (инструменты)</strong> — функции, которые агент может вызвать: поиск, API, код, базы данных</li>
        <li><strong>Memory (память)</strong> — хранение контекста между шагами и сессиями</li>
        <li><strong>Planning</strong> — декомпозиция сложной задачи на подзадачи</li>
      </ul>

      <h4>Когда нужен агент, а когда хватает чатбота?</h4>
      <p>Если задача решается за один LLM-вызов (ответить на вопрос, перевести текст, написать письмо) — это чатбот. Если задача требует <em>нескольких шагов с промежуточными результатами</em> (исследовать тему → собрать данные → проанализировать → написать отчёт) — это агент.</p>
    `,
    flashcards: [
      { front: "Чем агент отличается от чатбота?", back: "Чатбот реагирует на вход одним LLM-вызовом. Агент получает цель и автономно планирует и выполняет серию действий через цикл perception-reasoning-action." },
      { front: "Три фазы цикла агента", back: "Perception (восприятие входных данных) → Reasoning (рассуждение, что делать) → Action (выполнение действия через инструменты)" },
      { front: "5 ключевых компонентов агента", back: "LLM (мозг), System Prompt (инструкции), Tools (инструменты), Memory (память), Planning (декомпозиция задач)" }
    ],
    quiz: [
      {
        question: "Какая из систем является AI-агентом?",
        options: [
          "Бот, который переводит текст с английского на русский",
          "Система, которая получает задачу \"проанализируй конкурентов\", сама ищет информацию, сравнивает данные и пишет отчёт",
          "Чатбот, который отвечает на FAQ по документации",
          "Автодополнение кода в IDE"
        ],
        correct: 1,
        explanation: "Агент автономно планирует и выполняет многошаговую задачу. Остальные — одношаговые LLM-вызовы."
      },
      {
        question: "Что происходит в фазе Reasoning?",
        options: [
          "Агент получает данные от пользователя",
          "LLM анализирует контекст и решает, какое действие выполнить следующим",
          "Агент сохраняет результат в базу данных",
          "Агент вызывает внешний API"
        ],
        correct: 1,
        explanation: "Reasoning — это фаза рассуждения, где LLM анализирует текущий контекст и определяет следующий шаг."
      }
    ],
    sources: [
      { title: "ReAct: Synergizing Reasoning and Acting (Yao et al., 2022)", url: "https://arxiv.org/abs/2210.03629", icon: "📄" },
      { title: "A Survey on Large Language Model based Autonomous Agents", url: "https://arxiv.org/abs/2308.11432", icon: "📄" }
    ]
  },
  {
    id: 2,
    title: "Архитектура Single Agent",
    goal: "Освоить паттерны проектирования одиночного агента: ReAct, chain-of-thought и tool loops.",
    objectives: [
      "Реализовывать паттерн ReAct (Reason + Act)",
      "Понимать разницу между zero-shot и few-shot агентными подходами",
      "Проектировать цикл выполнения с остановкой по условию"
    ],
    content: `
      <h4>Паттерн ReAct</h4>
      <p>ReAct (Reasoning + Acting) — базовый паттерн, в котором агент чередует рассуждения и действия. На каждом шаге модель сначала <em>думает</em> (Thought), затем <em>действует</em> (Action), затем получает <em>наблюдение</em> (Observation).</p>

      <pre><code>Thought: Мне нужно найти текущую цену биткоина.
Action: search("текущая цена биткоина")
Observation: BTC = $67,432 (CoinGecko, 2024-01-15)
Thought: Отлично, теперь нужно перевести в рубли по текущему курсу.
Action: get_exchange_rate("USD", "RUB")
Observation: 1 USD = 89.5 RUB
Thought: 67432 * 89.5 = 6,035,164 рубля. Могу ответить.
Answer: Текущая цена BTC ≈ 6 035 000 ₽</code></pre>

      <h4>Tool Loop</h4>
      <p>Современные фреймворки (LangChain, LlamaIndex, OpenAI Assistants) реализуют агент через <strong>tool loop</strong> — цикл вызова инструментов:</p>
      <ul>
        <li>Отправить сообщение + доступные инструменты в LLM</li>
        <li>Если LLM вернула tool_call → выполнить функцию → добавить результат в контекст → повторить</li>
        <li>Если LLM вернула текстовый ответ → завершить цикл, вернуть ответ пользователю</li>
      </ul>

      <div class="key-concept">
        <strong>Условие остановки</strong> — критически важный элемент. Без него агент может зациклиться. Стандартные лимиты: max_iterations (обычно 10-15), таймаут, обнаружение повторений.
      </div>

      <h4>Zero-shot vs Few-shot агенты</h4>
      <p><strong>Zero-shot:</strong> агент получает только описание инструментов и должен сам разобраться, как их использовать. Подходит для мощных моделей (GPT-4, Claude).</p>
      <p><strong>Few-shot:</strong> в промпт добавляются примеры (demonstrations) правильного использования инструментов. Улучшает точность для более слабых моделей.</p>

      <h4>Обработка ошибок</h4>
      <p>Надёжный агент обязан обрабатывать ошибки gracefully:</p>
      <ul>
        <li>Ошибка инструмента → передать сообщение об ошибке в LLM, пусть решит, что делать</li>
        <li>Парсинг-ошибка → retry с уточнённым промптом</li>
        <li>Зацикливание → принудительная остановка + summary сделанного</li>
      </ul>
    `,
    flashcards: [
      { front: "Паттерн ReAct", back: "Reasoning + Acting: агент чередует Thought (рассуждение) → Action (вызов инструмента) → Observation (результат) до получения финального ответа." },
      { front: "Tool Loop", back: "Цикл: отправить запрос в LLM → если tool_call, выполнить функцию и вернуть результат → повторять. Завершается, когда LLM даёт текстовый ответ без tool_call." },
      { front: "Когда агент должен остановиться?", back: "Когда: (1) LLM вернула финальный ответ без tool_call, (2) достигнут max_iterations, (3) истёк таймаут, (4) обнаружено зацикливание." }
    ],
    quiz: [
      {
        question: "В паттерне ReAct, что идёт сразу после Action?",
        options: ["Thought", "Answer", "Observation", "Planning"],
        correct: 2,
        explanation: "После Action (вызова инструмента) агент получает Observation — результат выполнения, на основе которого строит следующий Thought."
      }
    ],
    sources: [
      { title: "LangChain Agent Executor", url: "https://python.langchain.com/docs/modules/agents/", icon: "🔗" },
      { title: "OpenAI Function Calling Guide", url: "https://platform.openai.com/docs/guides/function-calling", icon: "🔗" }
    ]
  },
  {
    id: 3,
    title: "Tool Use и Function Calling",
    goal: "Научиться проектировать набор инструментов агента и правильно описывать их для LLM.",
    objectives: [
      "Описывать инструменты через JSON Schema для function calling",
      "Проектировать сбалансированный набор инструментов (не слишком много, не слишком мало)",
      "Обрабатывать параллельные вызовы инструментов"
    ],
    content: `
      <h4>Как LLM \"вызывает\" инструменты</h4>
      <p>LLM не выполняет код напрямую. Вместо этого она генерирует <strong>структурированный запрос</strong> — JSON с именем функции и аргументами.Runtime (ваш код) парсит этот JSON, выполняет реальную функцию и возвращает результат в контекст.</p>

      <pre><code>// Описание инструмента для LLM
{
  "name": "search_web",
  "description": "Search the web for current information",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query string"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum results to return",
        "default": 5
      }
    },
    "required": ["query"]
  }
}</code></pre>

      <h4>Принципы хорошего набора инструментов</h4>
      <ul>
        <li><strong>Ясные описания</strong> — LLM выбирает инструмент по описанию. Расплывчатое описание = неправильный выбор</li>
        <li><strong>Минимальная поверхность</strong> — 5-10 инструментов оптимально. 30+ инструментов запутывают модель</li>
        <li><strong>Чёткие границы</strong> — каждый инструмент должен делать одну вещь. Если два инструмента пересекаются, LLM будет путаться</li>
        <li><strong>Предсказуемые ошибки</strong> — возвращайте структурированные ошибки, которые LLM может понять и обработать</li>
      </ul>

      <div class="key-concept">
        <strong>Parallel tool calls</strong> — современные модели (GPT-4, Claude 3) могут вызвать несколько инструментов за один шаг. Это ускоряет выполнение, но требует, чтобы инструменты были независимыми (без side effects, конфликтующих друг с другом).
      </div>

      <h4>Паттерн: Tool Composition</h4>
      <p>Сложные задачи требуют <em>композиции</em> инструментов. Агент сначала получает список файлов (list_files), затем читает нужный (read_file), затем анализирует данные (analyze). Порядок определяется LLM на каждом шаге — это и есть \"интеллект\" агента.</p>

      <h4>Безопасность инструментов</h4>
      <p>Каждый инструмент — потенциальная точка уязвимости. Обязательные практики:</p>
      <ul>
        <li>Валидация всех входных параметров (LLM может сгенерировать инъекцию)</li>
        <li>Rate limiting на внешние API</li>
        <li>Sandbox для выполнения кода (никогда не eval/exec без изоляции)</li>
        <li>Audit log всех вызовов инструментов</li>
      </ul>
    `,
    flashcards: [
      { front: "Как LLM вызывает инструменты?", back: "LLM генерирует структурированный JSON (имя функции + аргументы). Runtime парсит JSON, выполняет реальную функцию, возвращает результат в контекст для следующего шага." },
      { front: "Оптимальное количество инструментов", back: "5-10 инструментов. Меньше 3 — агент ограничен. Больше 15-20 — LLM путается в выборе и начинает галлюцинировать параметры." },
      { front: "Parallel tool calls", back: "Современные LLM могут вызвать несколько инструментов за один шаг. Требует, чтобы инструменты были независимыми (без конфликтующих side effects)." }
    ],
    quiz: [
      {
        question: "Почему не рекомендуется давать агенту 30+ инструментов?",
        options: [
          "Это замедляет работу API",
          "LLM путается в выборе, делает неправильные вызовы и галлюцинирует параметры",
          "Это нарушает rate limits",
          "Runtime не может обработать столько функций"
        ],
        correct: 1,
        explanation: "Большой набор инструментов создаёт когнитивную нагрузку для LLM — она начинает путать похожие инструменты и выдумывать несуществующие параметры."
      },
      {
        question: "Что происходит, если инструмент вернул ошибку?",
        options: [
          "Агент немедленно останавливается",
          "Ошибка передаётся обратно в LLM как Observation, и агент решает, как действовать дальше",
          "Runtime повторяет вызов автоматически",
          "Пользователь получает уведомление"
        ],
        correct: 1,
        explanation: "В паттерне tool loop ошибка инструмента передаётся в контекст LLM, которая может решить повторить, использовать альтернативный инструмент или сообщить пользователю."
      }
    ],
    sources: [
      { title: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling", icon: "🔗" },
      { title: "Anthropic Tool Use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", icon: "🔗" },
      { title: "Gorilla: Large Language Model Connected with Massive APIs", url: "https://arxiv.org/abs/2305.15334", icon: "📄" }
    ]
  },
  {
    id: 4,
    title: "Memory Systems",
    goal: "Освоить типы памяти агентов и выбрать правильную стратегию для конкретной задачи.",
    objectives: [
      "Различать short-term, long-term и episodic memory",
      "Реализовывать RAG как память агента",
      "Управлять контекстным окном через суммаризацию"
    ],
    content: `
      <h4>Три типа памяти</h4>
      <ul>
        <li><strong>Short-term (рабочая)</strong> — текущий контекст разговора в prompt. Ограничена контекстным окном (8K-200K токенов). Самая быстрая, но самая дорогая</li>
        <li><strong>Long-term (долговременная)</strong> — векторная база данных, внешнее хранилище. Неограниченная по объёму, но требует retrieval</li>
        <li><strong>Episodic (эпизодическая)</strong> — память о конкретных взаимодействиях: \"что мы обсуждали вчера\". Ключ к персонализации</li>
      </ul>

      <h4>Стратегии управления контекстом</h4>
      <p>Контекстное окно — дорогой и ограниченный ресурс. Основные стратегии:</p>

      <div class="key-concept">
        <strong>Sliding Window:</strong> хранить только последние N сообщений. Просто, но теряет ранний контекст. Подходит для short-task агентов.
      </div>

      <p><strong>Summarization:</strong> при переполнении контекста — сжать старые сообщения в summary через LLM и хранить краткую версию. Баланс между простотой и сохранением контекста.</p>

      <p><strong>RAG (Retrieval-Augmented):</strong> перед каждым шагом делать retrieval из векторной БД по релевантности к текущему вопросу. Позволяет иметь \"бесконечную\" память.</p>

      <h4>RAG как агентная память</h4>
      <pre><code>// Упрощённый паттерн
1. Пользователь задаёт вопрос
2. Agent извлекает embedding из вопроса
3. Retrieval: найти top-K релевантных chunks из vector store
4. Добавить chunks в контекст LLM
5. LLM генерирует ответ с учётом retrieved context</code></pre>

      <h4>Практические советы</h4>
      <ul>
        <li>Используйте <code>metadata</code> в векторной БД для фильтрации (по дате, пользователю, проекту)</li>
        <li>Сохраняйте не только факты, но и <em>решения</em> — \"почему мы выбрали подход X\"</li>
        <li>Периодически \"забывайте\" — удаляйте устаревшие записи, иначе retrieval деградирует</li>
        <li>Для multi-user агентов: namespace isolation, чтобы память одного пользователя не просачивалась к другому</li>
      </ul>
    `,
    flashcards: [
      { front: "Short-term vs Long-term memory", back: "Short-term = текущий контекст в prompt (быстрая, дорогая, ограниченная). Long-term = векторная БД (неограниченная, медленнее, требует retrieval)." },
      { front: "Episodic memory", back: "Память о конкретных прошлых взаимодействиях и их результатах. Позволяет агенту \"помнить\" опыт и адаптировать поведение." },
      { front: "Summarization strategy", back: "При переполнении контекста старые сообщения сжимаются LLM в короткое summary. Summary хранится в контексте вместо полных сообщений." }
    ],
    quiz: [
      {
        question: "Какой тип памяти лучше всего подходит для задачи \"помни, что пользователь предпочитает Python\"?",
        options: ["Short-term (рабочая память)", "Long-term (векторная БД с фактами о пользователе)", "Буфер последних 5 сообщений", "Не нужна память"],
        correct: 1,
        explanation: "Предпочтения пользователя — это long-term данные, которые должны сохраняться между сессиями. Short-term память очищается при завершении разговора."
      },
      {
        question: "Что такое RAG в контексте агентной памяти?",
        options: [
          "Метод сжатия контекстного окна",
          "Retrieval-Augmented Generation — извлечение релевантных фрагментов из БД перед генерацией",
          "Алгоритм оптимизации LLM",
          "Протокол связи между агентами"
        ],
        correct: 1,
        explanation: "RAG = Retrieval-Augmented Generation. Перед генерацией агент ищет релевантные данные во внешней БД и добавляет их в контекст."
      }
    ],
    sources: [
      { title: "MemGPT: Towards LLMs as Operating Systems", url: "https://arxiv.org/abs/2310.08560", icon: "📄" },
      { title: "LangChain Memory Module", url: "https://python.langchain.com/docs/modules/memory/", icon: "🔗" }
    ]
  },
  {
    id: 5,
    title: "Multi-Agent Оркестрация",
    goal: "Освоить паттерны координации нескольких агентов для решения сложных задач.",
    objectives: [
      "Выбирать между supervisor, peer-to-peer и hierarchical паттернами",
      "Проектировать протоколы коммуникации между агентами",
      "Избегать типичных проблем: deadlock, бесконечные дебаты, потеря контекста"
    ],
    content: `
      <h4>Зачем несколько агентов?</h4>
      <p>Один агент ограничен: одним контекстом, одним набором инструментов, одной \"ролью\". Сложные задачи требуют <strong>разделения ответственности</strong> — как в команде людей.</p>

      <h4>Паттерн 1: Supervisor (Супервайзер)</h4>
      <p>Один \"главный\" агент (orchestrator) получает задачу, декомпозирует её и делегирует подзадачи \"рабочим\" агентам (workers).</p>
      <pre><code>User → Supervisor Agent
  → \"Исследуй рынок\" → Research Agent
  → \"Напиши код\" → Coding Agent
  → \"Проверь качество\" → Review Agent
← Supervisor собирает результаты → User</code></pre>
      <p><strong>Плюсы:</strong> централизованный контроль, легко дебажить. <strong>Минусы:</strong> bottleneck на supervisor.</p>

      <h4>Паттерн 2: Peer-to-Peer (Равноправные)</h4>
      <p>Агенты общаются напрямую друг с другом, передавая сообщения по цепочке или графу.</p>
      <p><strong>Плюсы:</strong> гибкость, нет единой точки отказа. <strong>Минусы:</strong> сложно контролировать, риск бесконечных циклов.</p>

      <h4>Паттерн 3: Hierarchical (Иерархический)</h4>
      <p>Дерево: supervisor → team leads → workers. Для очень сложных задач с несколькими уровнями декомпозиции.</p>

      <div class="key-concept">
        <strong>Сообщения между агентами</strong> — ключевой дизайн-выбор. Формат: structured (JSON с типом, payload, metadata) vs unstructured (свободный текст). Для продакшна — всегда structured: можно логировать, валидировать, парсить.
      </div>

      <h4>Типичные проблемы</h4>
      <ul>
        <li><strong>Deadlock:</strong> агент A ждёт ответа от B, B ждёт от A. Решение: таймауты + fallback</li>
        <li><strong>Бесконечные дебаты:</strong> два агента критикуют друг друга без прогресса. Решение: max_rounds + арбитр</li>
        <li><strong>Потеря контекста:</strong> при передаче между агентами теряются детали. Решение: structured handoff с полным контекстом</li>
        <li><strong>Дублирование работы:</strong> два агента делают одно и то же. Решение: task registry с lock</li>
      </ul>
    `,
    flashcards: [
      { front: "Supervisor паттерн", back: "Один orchestrator-агент декомпозирует задачу и делегирует подзадачи worker-агентам. Централизованный контроль, но supervisor = bottleneck." },
      { front: "Когда использовать multi-agent?", back: "Когда задача: (1) требует разных навыков (код + дизайн + анализ), (2) слишком сложна для одного контекста, (3) выигрывает от разделения ответственности." },
      { front: "Deadlock в multi-agent", back: "Ситуация, когда агент A ждёт агента B, а B ждёт A. Решения: таймауты на ожидание, fallback-стратегии, обнаружение циклов в графе коммуникации." }
    ],
    quiz: [
      {
        question: "Какой паттерн лучше для задачи \"написать и протестировать Python-модуль\"?",
        options: [
          "Peer-to-peer без контроля",
          "Supervisor: один агент планирует, coding agent пишет, review agent тестирует",
          "Один агент делает всё сам",
          "Hierarchical с 3 уровнями"
        ],
        correct: 1,
        explanation: "Supervisor паттерн идеально подходит: чёткое разделение ролей (планирование/код/тесты), централизованный контроль качества, легко добавить новые worker-роли."
      },
      {
        question: "Два агента критикуют работу друг друга бесконечно. Какое решение?",
        options: [
          "Удалить одного агента",
          "Установить max_rounds (максимум раундов критики) и назначить арбитра для финального решения",
          "Увеличить контекстное окно",
          "Перевести на peer-to-peer"
        ],
        correct: 1,
        explanation: "Бесконечные дебаты — классическая проблема. max_rounds ограничивает количество итераций, а арбитр (supervisor или отдельный агент) принимает финальное решение."
      }
    ],
    sources: [
      { title: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", url: "https://arxiv.org/abs/2308.08155", icon: "📄" },
      { title: "CrewAI Documentation", url: "https://docs.crewai.com/", icon: "🔗" },
      { title: "MetaGPT: Meta Programming for Multi-Agent Collaborative Framework", url: "https://arxiv.org/abs/2308.00352", icon: "📄" }
    ]
  },
  {
    id: 6,
    title: "Planning и Reasoning",
    goal: "Научить агента планировать, декомпозировать задачи и восстанавливаться после ошибок.",
    objectives: [
      "Реализовывать task decomposition через plan-and-execute",
      "Применять self-reflection для улучшения результатов",
      "Проектировать guardrails и fallback-стратегии"
    ],
    content: `
      <h4>Plan-and-Execute</h4>
      <p>Вместо того чтобы действовать реактивно (шаг за шагом), агент сначала <strong>составляет план</strong>, а затем выполняет его по пунктам.</p>
      <pre><code>// Plan-and-Execute паттерн
Step 1: PLAN
  "Задача: создать REST API для блога"
  План:
  1. Спроектировать схему БД
  2. Создать модели
  3. Написать CRUD endpoints
  4. Добавить аутентификацию
  5. Написать тесты

Step 2: EXECUTE (по одному пункту)
  [Пункт 1] → coding agent → результат
  [Пункт 2] → coding agent → результат
  ...

Step 3: REFLECT (после каждого пункта)
  "Результат пункта 1 OK, переходим к пункту 2"
  или "Ошибка в пункте 3, нужен revised plan"</code></pre>

      <h4>Self-Reflection (Рефлексия)</h4>
      <p>После выполнения действия агент <strong>оценивает свой результат</strong> и решает, нужно ли что-то исправить.</p>

      <div class="key-concept">
        <strong>Reflexion (Shinn et al.)</strong> — паттерн, при котором агент после неудачи анализирует, что пошло не так, формулирует урок и применяет его в следующей попытке. Аналогично тому, как человек учится на ошибках.
      </div>

      <h4>Task Decomposition</h4>
      <p>Сложные задачи невозможно решить одним действием. Агент должен уметь разбивать их:</p>
      <ul>
        <li><strong>Рекурсивная декомпозиция</strong> — задача → подзадачи → под-подзадачи (до атомарных действий)</li>
        <li><strong>DAG (направленный граф)</strong> — некоторые подзадачи можно выполнять параллельно, другие зависят от результатов</li>
        <li><strong>Dynamic replanning</strong> — если результат подзадачи неожиданный, перестроить оставшийся план</li>
      </ul>

      <h4>Guardrails</h4>
      <p>Ограничители, которые не дают агенту выйти за пределы:</p>
      <ul>
        <li><strong>Output guardrails</strong> — проверка ответа перед отправкой (PII, токсичность, галлюцинации)</li>
        <li><strong>Action guardrails</strong> — белый список разрешённых действий, подтверждение для деструктивных операций</li>
        <li><strong>Budget guardrails</strong> — лимит на количество LLM-вызовов, токенов, времени выполнения</li>
        <li><strong>Human-in-the-loop</strong> — для критичных действий агент запрашивает подтверждение человека</li>
      </ul>
    `,
    flashcards: [
      { front: "Plan-and-Execute", back: "Агент сначала составляет полный план (список шагов), затем выполняет каждый шаг по очереди, с рефлексией после каждого." },
      { front: "Reflexion паттерн", back: "После неудачи агент анализирует ошибку, формулирует урок (\"в следующий раз я буду...\") и применяет его. Аналог обучения на ошибках." },
      { front: "Human-in-the-loop", back: "Для критичных действий (удаление данных, отправка email, финансовые операции) агент ставит выполнение на паузу и ждёт подтверждения от человека." }
    ],
    quiz: [
      {
        question: "В чём преимущество Plan-and-Execute перед обычным ReAct?",
        options: [
          "Он быстрее выполняет каждый шаг",
          "Агент видит всю задачу целиком, может оптимально распределить ресурсы и параллелить независимые шаги",
          "Он не требует LLM",
          "Он проще в реализации"
        ],
        correct: 1,
        explanation: "Plan-and-Execute даёт агенту глобальное видение задачи. ReAct действует реактивно, шаг за шагом, без общего плана — может идти неоптимальным путём."
      },
      {
        question: "Какой тип guardrail подходит для предотвращения отправки email с конфиденциальными данными?",
        options: ["Budget guardrail", "Output guardrail с PII-детекцией", "Action guardrail с whitelist", "Таймаут"],
        correct: 1,
        explanation: "Output guardrail проверяет содержимое ответа/действия перед отправкой. PII-детектор найдёт персональные данные и заблокирует отправку."
      }
    ],
    sources: [
      { title: "Reflexion: Language Agents with Verbal Reinforcement Learning", url: "https://arxiv.org/abs/2303.11366", icon: "📄" },
      { title: "Plan-and-Solve: Improving Zero-Shot CoT by Planning", url: "https://arxiv.org/abs/2305.04091", icon: "📄" },
      { title: "NeMo Guardrails (NVIDIA)", url: "https://github.com/NVIDIA/NeMo-Guardrails", icon: "🔗" }
    ]
  },
  {
    id: 7,
    title: "Продакшн и Масштабирование",
    goal: "Вывести агентную систему в продакшн: мониторинг, оценка, безопасность и оптимизация стоимости.",
    objectives: [
      "Настраивать observability для агентных систем",
      "Проводить evaluation агентов (автоматическую и ручную)",
      "Оптимизировать стоимость LLM-вызовов без потери качества"
    ],
    content: `
      <h4>Observability: видеть, что происходит</h4>
      <p>Агентная система — чёрный ящик без правильного мониторинга. Обязательный минимум:</p>
      <ul>
        <li><strong>Trace каждого запуска</strong> — полная цепочка: input → мысли → вызовы инструментов → output</li>
        <li><strong>Latency per step</strong> — какой шаг тормозит? LLM? Инструмент? Retrieval?</li>
        <li><strong>Token usage</strong> — сколько токенов потребляет каждый запуск</li>
        <li><strong>Error rate</strong> — процент неудачных запусков и причины</li>
        <li><strong>User satisfaction</strong> — thumbs up/down, explicit feedback</li>
      </ul>
      <p>Инструменты: LangSmith, Langfuse, Phoenix (Arize), Weights & Biases.</p>

      <h4>Evaluation: измерять качество</h4>

      <div class="key-concept">
        <strong>LLM-as-Judge</strong> — использовать мощную модель (GPT-4, Claude) для оценки ответов агента по критериям: correctness, helpfulness, safety, relevance. Дёшево и масштабируемо, но требует калибровки.
      </div>

      <p><strong>Типы evaluation:</strong></p>
      <ul>
        <li><strong>Unit tests</strong> — детерминированные проверки: вызван ли нужный инструмент? Правильные ли параметры?</li>
        <li><strong>Golden dataset</strong> — набор эталонных (input, expected output) пар. Сравнивать output агента с expected</li>
        <li><strong>A/B testing</strong> — сравнивать две версии агента на реальном трафике</li>
        <li><strong>Regression testing</strong> — при каждом изменении прогонять golden dataset, чтобы не сломать</li>
      </ul>

      <h4>Оптимизация стоимости</h4>
      <ul>
        <li><strong>Модельный роутинг:</strong> простые задачи → дешёвая модель (GPT-4o-mini), сложные → мощная (GPT-4, Claude Opus)</li>
        <li><strong>Caching:</strong> кэшировать ответы на повторяющиеся запросы (semantic cache по embedding similarity)</li>
        <li><strong>Prompt compression:</strong> убирать лишнее из system prompt, сжимать примеры</li>
        <li><strong>Streaming:</strong> отдавать результаты по мере генерации — не ускоряет, но улучшает UX</li>
      </ul>

      <h4>Безопасность в продакшне</h4>
      <ul>
        <li><strong>Prompt injection defense</strong> — санитизация пользовательского ввода, разделение system/user промптов</li>
        <li><strong>Rate limiting per user</strong> — защита от злоупотреблений</li>
        <li><strong>Audit trail</strong> — логировать все действия агента для compliance</li>
        <li><strong>Rollback</strong> — возможность откатить действия агента (idempotent tools)</li>
      </ul>
    `,
    flashcards: [
      { front: "LLM-as-Judge", back: "Мощная LLM (GPT-4/Claude) оценивает ответы агента по критериям: correctness, helpfulness, safety. Дешевле ручной оценки, но требует калибровки на golden dataset." },
      { front: "Модельный роутинг", back: "Направление запросов к разным моделям по сложности: простые задачи → дешёвая модель (mini), сложные → мощная. Экономия 60-80% без потери качества." },
      { front: "Что логировать для observability?", back: "Trace (полная цепочка шагов), latency per step, token usage, error rate, user satisfaction. Инструменты: LangSmith, Langfuse, Phoenix." }
    ],
    quiz: [
      {
        question: "Как сэкономить 60-80% на LLM-вызовах без потери качества?",
        options: [
          "Использовать только самую дешёвую модель",
          "Модельный роутинг: простые задачи → дешёвая модель, сложные → мощная",
          "Уменьшить контекстное окно",
          "Убрать memory"
        ],
        correct: 1,
        explanation: "80% запросов обычно простые. Направляя их к дешёвой модели, а сложные — к мощной, экономите без потери качества на сложных задачах."
      },
      {
        question: "Что такое prompt injection?",
        options: [
          "Метод ускорения LLM",
          "Атака, при которой пользователь вставляет инструкции, переопределяющие поведение агента",
          "Способ добавления инструментов",
          "Техника сжатия контекста"
        ],
        correct: 1,
        explanation: "Prompt injection — атака, при которой злоумышленник через пользовательский ввод заставляет агента игнорировать system prompt и выполнять вредоносные действия."
      }
    ],
    sources: [
      { title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/", icon: "🔗" },
      { title: "Langfuse — Open Source LLM Observability", url: "https://langfuse.com/", icon: "🔗" },
      { title: "OWASP Top 10 for LLM Applications", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", icon: "🔗" }
    ]
  }
];

// Final Review Questions (pooled from all lessons)
const finalQuiz = [
  {
    question: "Какой компонент НЕ является обязательным для AI-агента?",
    options: ["LLM для рассуждений", "Tools для взаимодействия с миром", "GPU-кластер для инференса", "Memory для хранения контекста"],
    correct: 2,
    explanation: "GPU-кластер — инфраструктурная деталь. Агенту нужна LLM (через API), tools и memory. Где именно работает модель — не важно для архитектуры."
  },
  {
    question: "В ReAct-паттерне, какова правильная последовательность?",
    options: ["Action → Thought → Observation", "Thought → Action → Observation", "Observation → Action → Thought", "Action → Observation → Thought"],
    correct: 1,
    explanation: "ReAct: агент сначала думает (Thought), затем действует (Action), затем получает наблюдение (Observation)."
  },
  {
    question: "Что произойдёт, если агенту дать 30+ инструментов?",
    options: [
      "Он станет умнее",
      "LLM начнёт путаться в выборе и галлюцинировать параметры",
      "Runtime автоматически выберет нужный",
      "Ничего не изменится"
    ],
    correct: 1,
    explanation: "Слишком много инструментов = когнитивная перегрузка LLM. Оптимально 5-10."
  },
  {
    question: "Какой тип памяти нужен, чтобы агент помнил факты между сессиями?",
    options: ["Short-term", "Context window", "Long-term (vector store / DB)", "Sliding window"],
    correct: 2,
    explanation: "Long-term memory (векторная БД) хранит данные между сессиями. Short-term очищается при завершении разговора."
  },
  {
    question: "В supervisor-паттерне, кто принимает решения о распределении задач?",
    options: ["Каждый worker-агент сам", "Orchestrator (supervisor) агент", "Пользователь напрямую", "Случайный выбор"],
    correct: 1,
    explanation: "Supervisor-агент — централизованный координатор. Он декомпозирует задачу и назначает подзадачи worker-агентам."
  },
  {
    question: "Что такое Reflexion?",
    options: [
      "Метод ускорения инференса",
      "Паттерн, при котором агент анализирует свои ошибки и применяет уроки в следующей попытке",
      "Протокол коммуникации агентов",
      "Тип vector store"
    ],
    correct: 1,
    explanation: "Reflexion — агент учится на своих ошибках, формулируя verbal lessons и применяя их в последующих попытках."
  },
  {
    question: "Модельный роутинг экономит деньги за счёт:",
    options: [
      "Использования одной модели для всего",
      "Направления простых задач к дешёвой модели, а сложных — к мощной",
      "Уменьшения числа инструментов",
      "Отключения memory"
    ],
    correct: 1,
    explanation: "Большинство запросов простые. Модельный роутинг направляет их к дешёвой модели, а только сложные — к дорогой. Экономия 60-80%."
  },
  {
    question: "Какая проблема НЕ типична для multi-agent систем?",
    options: ["Deadlock", "Бесконечные дебаты", "Потеря контекста при передаче", "Переполнение GPU"],
    correct: 3,
    explanation: "GPU overflow — инфраструктурная проблема, не специфичная для multi-agent. Deadlock, дебаты и потеря контекста — классические проблемы оркестрации."
  }
];

// ============================================================
// App State & Logic
// ============================================================

let state = {
  currentLesson: -1, // -1 = welcome, 0-6 = lessons, 7 = review
  completed: new Set(),
  quizAnswered: {} // { "lessonId-questionIdx": selectedOption }
};

// DOM refs
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function init() {
  buildSidebar();
  bindEvents();
  updateProgress();
}

function buildSidebar() {
  const nav = $("#lesson-nav");
  nav.innerHTML = courseData.map((lesson, i) => `
    <button class="lesson-nav-item${i === state.currentLesson ? " active" : ""}" data-lesson="${i}">
      <span class="nav-icon">${state.completed.has(i) ? "✓" : i + 1}</span>
      <span>${lesson.title}</span>
    </button>
  `).join("");
}

function bindEvents() {
  $("#btn-start").addEventListener("click", () => goToLesson(0));
  $("#btn-prev").addEventListener("click", prevLesson);
  $("#btn-next").addEventListener("click", nextLesson);
  $("#btn-review").addEventListener("click", showReview);
  $("#sidebar-toggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
  });

  $("#lesson-nav").addEventListener("click", (e) => {
    const item = e.target.closest(".lesson-nav-item");
    if (item) {
      goToLesson(parseInt(item.dataset.lesson));
      $("#sidebar").classList.remove("open");
    }
  });
}

function goToLesson(index) {
  state.currentLesson = index;
  $("#welcome").classList.add("hidden");
  $("#review-view").classList.add("hidden");
  $("#lesson-view").classList.remove("hidden");

  const lesson = courseData[index];
  $("#lesson-badge").textContent = `Урок ${index + 1}`;
  $("#lesson-title").textContent = lesson.title;

  // Objectives
  $("#objectives-list").innerHTML = lesson.objectives.map(o => `<li>${o}</li>`).join("");

  // Content
  $("#content-section").innerHTML = `<h3>📖 Материал</h3>${lesson.content}`;

  // Flashcards
  buildFlashcards(lesson.flashcards);

  // Quiz
  buildQuiz(lesson.quiz, lesson.id);

  // Sources
  buildSources(lesson.sources);

  // Nav buttons
  $("#btn-prev").style.visibility = index === 0 ? "hidden" : "visible";
  $("#btn-next").textContent = index === courseData.length - 1 ? "Завершить →" : "Далее →";

  // Mark complete
  state.completed.add(index);
  updateProgress();
  buildSidebar();

  // Scroll to top
  window.scrollTo(0, 0);
}

function buildFlashcards(cards) {
  const container = $("#flashcards");
  container.innerHTML = cards.map((card, i) => `
    <div class="flashcard" data-card="${i}">
      <div class="flashcard-inner">
        <div class="flashcard-front">${card.front}</div>
        <div class="flashcard-back">${card.back}</div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".flashcard").forEach(card => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

function buildQuiz(questions, lessonId) {
  const container = $("#quiz");
  container.innerHTML = questions.map((q, qi) => {
    const key = `${lessonId}-${qi}`;
    const answered = state.quizAnswered[key];
    return `
      <div class="quiz-question" data-key="${key}" data-correct="${q.correct}">
        <h4>${qi + 1}. ${q.question}</h4>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => {
            let cls = "quiz-option";
            if (answered !== undefined) {
              cls += " disabled";
              if (oi === q.correct) cls += " correct";
              else if (oi === answered && oi !== q.correct) cls += " wrong";
            }
            return `<button class="${cls}" data-option="${oi}" data-key="${key}">${opt}</button>`;
          }).join("")}
        </div>
        <div class="quiz-feedback ${answered !== undefined ? "show" : ""} ${answered !== undefined ? (answered === q.correct ? "correct-fb" : "wrong-fb") : ""}" data-key="${key}">
          ${answered !== undefined ? (answered === q.correct ? "✅ Правильно! " : "❌ Неверно. ") + q.explanation : ""}
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => handleQuizAnswer(btn));
  });
}

function handleQuizAnswer(btn) {
  const key = btn.dataset.key;
  if (state.quizAnswered[key] !== undefined) return;

  const questionEl = btn.closest(".quiz-question");
  const correctIdx = parseInt(questionEl.dataset.correct);
  const selectedIdx = parseInt(btn.dataset.option);

  state.quizAnswered[key] = selectedIdx;

  const options = questionEl.querySelectorAll(".quiz-option");
  options.forEach((opt, i) => {
    opt.classList.add("disabled");
    if (i === correctIdx) opt.classList.add("correct");
    else if (i === selectedIdx && i !== correctIdx) opt.classList.add("wrong");
  });

  const feedback = questionEl.querySelector(".quiz-feedback");
  const [lessonId, qIdx] = key.split("-").map(Number);
  const explanation = courseData[lessonId - 1]?.quiz[qIdx]?.explanation || "";
  feedback.textContent = (selectedIdx === correctIdx ? "✅ Правильно! " : "❌ Неверно. ") + explanation;
  feedback.className = `quiz-feedback show ${selectedIdx === correctIdx ? "correct-fb" : "wrong-fb"}`;
}

function buildSources(sources) {
  const container = $("#sources");
  if (!sources || sources.length === 0) {
    $("#sources-section").classList.add("hidden");
    return;
  }
  $("#sources-section").classList.remove("hidden");
  container.innerHTML = sources.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener" class="source-card">
      <span class="source-icon">${s.icon}</span>
      <div>
        <div class="source-title">${s.title}</div>
        <div class="source-url">${s.url}</div>
      </div>
    </a>
  `).join("");
}

function prevLesson() {
  if (state.currentLesson > 0) goToLesson(state.currentLesson - 1);
}

function nextLesson() {
  if (state.currentLesson < courseData.length - 1) {
    goToLesson(state.currentLesson + 1);
  } else {
    showReview();
  }
}

function showReview() {
  state.currentLesson = 7;
  $("#welcome").classList.add("hidden");
  $("#lesson-view").classList.add("hidden");
  $("#review-view").classList.remove("hidden");

  buildFinalQuiz();
  buildSidebar();
  window.scrollTo(0, 0);
}

function buildFinalQuiz() {
  const container = $("#final-quiz");
  container.innerHTML = finalQuiz.map((q, qi) => `
    <div class="quiz-question" data-fkey="${qi}" data-correct="${q.correct}">
      <h4>${qi + 1}. ${q.question}</h4>
      <div class="quiz-options">
        ${q.options.map((opt, oi) => `
          <button class="quiz-option" data-foption="${oi}" data-fkey="${qi}">${opt}</button>
        `).join("")}
      </div>
      <div class="quiz-feedback" data-fkey="${qi}"></div>
    </div>
  `).join("");

  const answeredFinal = {};

  container.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const fkey = btn.dataset.fkey;
      if (answeredFinal[fkey] !== undefined) return;

      const questionEl = btn.closest(".quiz-question");
      const correctIdx = parseInt(questionEl.dataset.correct);
      const selectedIdx = parseInt(btn.dataset.foption);

      answeredFinal[fkey] = selectedIdx;

      const options = questionEl.querySelectorAll(".quiz-option");
      options.forEach((opt, i) => {
        opt.classList.add("disabled");
        if (i === correctIdx) opt.classList.add("correct");
        else if (i === selectedIdx && i !== correctIdx) opt.classList.add("wrong");
      });

      const feedback = questionEl.querySelector(".quiz-feedback");
      feedback.textContent = (selectedIdx === correctIdx ? "✅ " : "❌ ") + finalQuiz[fkey].explanation;
      feedback.className = `quiz-feedback show ${selectedIdx === correctIdx ? "correct-fb" : "wrong-fb"}`;

      // Check if all answered
      if (Object.keys(answeredFinal).length === finalQuiz.length) {
        const score = Object.entries(answeredFinal).filter(([k, v]) => v === finalQuiz[k].correct).length;
        showResult(score, finalQuiz.length);
      }
    });
  });
}

function showResult(score, total) {
  const el = $("#review-result");
  el.classList.remove("hidden");
  const pct = Math.round(score / total * 100);
  $("#review-score").textContent = `${score} / ${total} (${pct}%)`;
  if (pct >= 80) {
    $("#review-message").textContent = "🎉 Отлично! Вы хорошо освоили архитектуру AI-агентов. Пора строить!";
  } else if (pct >= 50) {
    $("#review-message").textContent = "👍 Хорошая база. Пересмотрите уроки, где были ошибки — и попробуйте снова.";
  } else {
    $("#review-message").textContent = "📚 Стоит пройти курс ещё раз, уделив внимание каждому уроку. Не спешите!";
  }
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-text").textContent = `${state.completed.size} / ${courseData.length} уроков`;
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

// Boot
document.addEventListener("DOMContentLoaded", init);
