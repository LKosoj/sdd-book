// ============================================================
// LLM Observability — Course Data & Logic
// ============================================================

const courseData = [
  {
    id: 1,
    title: "Введение в LLM Observability",
    goal: "Понять, почему традиционный APM не работает для LLM и какие проблемы решает специализированная наблюдаемость.",
    objectives: [
      "Объяснить, чем LLM Observability отличается от классического APM",
      "Понимать трилемму оценки (масштабируемость, качество, стоимость)",
      "Знать, как LLM могут \"молча\" выходить из строя"
    ],
    content: `
      <h4>Почему APM не работает для LLM</h4>
      <p>Традиционный мониторинг отвечает на вопрос: <em>«Работает ли система?»</em> LLM Observability отвечает на вопрос: <em>«Почему модель повела себя именно так?»</em> HTTP-коды и время отклика БД не способны зафиксировать семантический дрейф, галлюцинации и непредсказуемое потребление токенов.</p>

      <div class="key-concept">
        <strong>Ключевое отличие:</strong> LLM-системы вероятностны и недетерминированы. Они могут «молча» выходить из строя: генерировать фактически неверный, но грамматически безупречный текст, попадать в бесконечные циклы вызова инструментов или становиться уязвимыми для инъекций промптов.
      </div>

      <h4>Трилемма оценки</h4>
      <p>В продакшне команды сталкиваются с «трилеммой оценки» — необходимо выбрать два из трёх параметров:</p>
      <ul>
        <li><strong>Автоматические метрики</strong> (BLEU, ROUGE, BERTScore) — быстрые и дешёвые, но плохо коррелируют с человеческим суждением</li>
        <li><strong>Человеческая оценка</strong> — золотой стандарт качества, но медленный и дорогой</li>
        <li><strong>LLM-as-a-Judge</strong> — использование мощных моделей для оценки выводов других моделей. Наиболее сбалансированный подход</li>
      </ul>

      <h4>Последствия отсутствия observability</h4>
      <p>Без специализированной наблюдаемости команды отлаживают системы «вслепую», что ведёт к потере доверия пользователей и юридическим рискам. В прецедентном деле <em>Mata v. Avianca</em> галлюцинации модели привели к реальным судебным санкциям.</p>

      <h4>Что должна обеспечивать LLM Observability</h4>
      <ul>
        <li>Полный трейсинг каждого запроса: от входа до финального ответа</li>
        <li>Мониторинг качества в реальном времени</li>
        <li>Контроль стоимости и потребления токенов</li>
        <li>Обнаружение аномалий и деградации</li>
        <li>Связь с CI/CD для regression testing</li>
      </ul>
    `,
    flashcards: [
      { front: "LLM Observability vs APM", back: "APM: «Работает ли система?» (HTTP-коды, latency). LLM Obs: «Почему модель повела себя так?» (галлюцинации, дрейф, токены, качество ответов)." },
      { front: "Трилемма оценки", back: "Выбор 2 из 3: (1) автоматические метрики — быстрые/дешёвые, (2) человеческая оценка — качественная/дорогая, (3) LLM-as-Judge — сбалансированный подход." },
      { front: "Как LLM «молча» выходят из строя?", back: "Генерируют фактически неверный, но грамматически правильный текст. Попадают в бесконечные циклы tool calls. Уязвимы к prompt injection. Без observability это невидимо." }
    ],
    quiz: [
      {
        question: "Почему HTTP 200 OK не гарантирует, что LLM-приложение работает правильно?",
        options: [
          "HTTP-коды не поддерживаются LLM",
          "Модель может вернуть грамматически правильный, но фактически неверный ответ — HTTP-код при этом будет 200",
          "LLM-приложения не используют HTTP",
          "HTTP 200 означает ошибку"
        ],
        correct: 1,
        explanation: "LLM может сгенерировать галлюцинацию — фактически неверный ответ. HTTP-статус отражает только успешность сетевого вызова, не семантическое качество ответа."
      },
      {
        question: "Что такое трилемма оценки в LLM Observability?",
        options: [
          "Выбор между GPT-4, Claude и Gemini",
          "Необходимость выбрать 2 из 3: масштабируемость, качество, стоимость оценки",
          "Три типа метрик: latency, tokens, cost",
          "Три уровня мониторинга: dev, staging, production"
        ],
        correct: 1,
        explanation: "Трилемма оценки: автоматические метрики (быстро/дёшево), human eval (качественно/дорого), LLM-as-Judge (сбалансированно). Все три одновременно — невозможно."
      }
    ],
    sources: [
      { title: "The Complete Guide to LLM Observability (Portkey, 2026)", url: "https://portkey.ai/blog/the-complete-guide-to-llm-observability/", icon: "📄" },
      { title: "LLM Application Lifecycle (Applied AI, 2025)", url: "https://www.applied-ai.com/briefings/llm-application-lifecycle/", icon: "📄" }
    ]
  },
  {
    id: 2,
    title: "Ключевые метрики LLM",
    goal: "Освоить метрики, специфичные для LLM-приложений: latency, tokens, cost и quality indicators.",
    objectives: [
      "Различать компоненты latency: TTFT, TPOT, P95/P99",
      "Настраивать token accounting с детализацией",
      "Внедрять атрибуцию затрат по тегам"
    ],
    content: `
      <h4>Метрики задержки (Latency)</h4>
      <p>Задержка в LLM-приложениях — не единое значение. Она разделяется на компоненты, критичные для UX:</p>

      <div class="metric-card">
        <h5>TTFT (Time to First Token)</h5>
        <p>Время до генерации первого токена. Критично для streaming и интерактивных чатов. Определяет воспринимаемую «отзывчивость».</p>
      </div>

      <div class="metric-card">
        <h5>TPOT (Time Per Output Token)</h5>
        <p>Время генерации каждого последующего токена. Определяет скорость «печати» модели в streaming-режиме.</p>
      </div>

      <div class="metric-card">
        <h5>P95 и P99 (Tail Percentiles)</h5>
        <p>Контроль «хвостов» распределения. Аномальный рост P99 указывает на проблемы с пулом соединений, троттлинг или неоптимальные промпты с долгими reasoning-цепочками.</p>
      </div>

      <h4>Token Accounting</h4>
      <p>Стоимость LLM-запросов нелинейна и непредсказуема. Один edge case может увеличить ежемесячный счёт в 10 раз, если агент попадёт в цикл рекурсивных вызовов.</p>
      <ul>
        <li><code>input_tokens</code> — токены входного промпта</li>
        <li><code>output_tokens</code> — сгенерированные токены</li>
        <li><code>cached_tokens</code> — контекстное кэширование (экономия)</li>
        <li><code>reasoning_tokens</code> — для reasoning-моделей (o1, o3)</li>
        <li><code>audio/image_tokens</code> — для мультимодальных систем</li>
      </ul>

      <h4>Атрибуция затрат (FinOps)</h4>
      <div class="key-concept">
        <strong>FinOps для LLM:</strong> Группировка расходов по тегам: <code>user_id</code>, <code>feature_name</code>, <code>department</code>, <code>environment</code>. Позволяет устанавливать бюджеты на уровне команд и клиентов, обнаруживать «дорогих» пользователей.
      </div>

      <h4>Метрики качества</h4>
      <ul>
        <li><strong>Error Rate</strong> — ошибки API, rate limits, таймауты</li>
        <li><strong>Длина ответа</strong> — гистограммы помогают выявить деградацию (слишком краткие или избыточные ответы)</li>
        <li><strong>Дрейф (Drift)</strong> — изменение распределения входных или выходных данных с течением времени</li>
      </ul>
    `,
    flashcards: [
      { front: "TTFT vs TPOT", back: "TTFT = время до первого токена (отзывчивость). TPOT = время на каждый последующий токен (скорость печати). Оба критичны для streaming UX." },
      { front: "Почему P99 latency важнее среднего?", back: "Среднее скрывает outliers. P99 показывает худшие случаи — проблемы с пулом соединений, троттлинг провайдера, неоптимальные промпты." },
      { front: "Token accounting детализация", back: "input_tokens + output_tokens + cached_tokens + reasoning_tokens + audio/image_tokens. Без детализации невозможно понять, куда уходят деньги." }
    ],
    quiz: [
      {
        question: "Агент попал в цикл рекурсивных вызовов инструментов. Какая метрика первой покажет проблему?",
        options: [
          "TTFT",
          "Количество токенов и стоимость (token usage + cost) резко возрастут",
          "Error rate",
          "P95 latency"
        ],
        correct: 1,
        explanation: "Рекурсивный цикл инструментов = экспоненциальный рост токенов и стоимости. Один edge case может увеличить счёт в 10 раз. Token accounting — первая линия обороны."
      },
      {
        question: "Зачем нужна атрибуция затрат по тегам (user_id, feature_name)?",
        options: [
          "Для красивых графиков",
          "Для FinOps: установка бюджетов, обнаружение дорогих фичей и пользователей, аллокация расходов по командам",
          "Это требование GDPR",
          "Для ускорения инференса"
        ],
        correct: 1,
        explanation: "Атрибуция затрат — основа FinOps для LLM. Позволяет понять, какие фичи/пользователи генерируют расходы, и устанавливать бюджеты."
      }
    ],
    sources: [
      { title: "Monitoring Latency and Cost in LLM Operations (Maxim AI, 2026)", url: "https://www.getmaxim.ai/articles/monitoring-latency-and-cost-in-llm-operations-essential-metrics-for-success/", icon: "📄" },
      { title: "LLM Monitoring & Observability (OneUptime, 2026)", url: "https://oneuptime.com/blog/post/2026-01-25-llm-monitoring-observability/view", icon: "📄" }
    ]
  },
  {
    id: 3,
    title: "Трейсинг и OpenTelemetry",
    goal: "Научиться строить distributed traces для LLM-приложений с использованием стандарта OpenTelemetry.",
    objectives: [
      "Проектировать иерархическую модель трейсов (trace → span → generation)",
      "Настраивать OpenTelemetry для GenAI (атрибуты gen_ai.*)",
      "Инструментировать LLM-вызовы в коде"
    ],
    content: `
      <h4>Иерархическая модель данных</h4>
      <p>LLM-трейс — это дерево операций, а не плоский лог:</p>

      <pre><code>Trace (один пользовательский запрос)
├── Span: Retrieval (поиск в векторной БД)
│   ├── Event: query embedding
│   └── Event: top-5 results
├── Generation: LLM call (промпт → ответ)
│   ├── input_tokens: 1247
│   ├── output_tokens: 342
│   └── model: gpt-4o
├── Span: Tool call (search_web)
│   ├── input: {"query": "..."}
│   └── output: "result..."
└── Generation: Final response</code></pre>

      <h4>Типы наблюдений</h4>
      <ul>
        <li><strong>Trace</strong> — полный жизненный цикл одного запроса (от входа до финального ответа)</li>
        <li><strong>Span</strong> — логический блок работы (retrieval, tool call, data transformation)</li>
        <li><strong>Generation</strong> — конкретный вызов LLM с метаданными (модель, токены, промпт, ответ)</li>
        <li><strong>Event</strong> — точечное событие (ошибка, лог, checkpoint)</li>
      </ul>

      <h4>OpenTelemetry для GenAI</h4>
      <div class="key-concept">
        <strong>OTel SemConv для GenAI:</strong> Стандартные атрибуты <code>gen_ai.*</code>: <code>gen_ai.system</code> (провайдер), <code>gen_ai.request.model</code>, <code>gen_ai.usage.input_tokens</code>, <code>gen_ai.usage.output_tokens</code>, <code>gen_ai.response.finish_reasons</code>. Совместимы с Langfuse, Phoenix, Helicone.
      </div>

      <pre><code># Python: инструментация через OpenTelemetry
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

provider = TracerProvider()
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("llm-app")

with tracer.start_as_current_span("llm-call",
    attributes={
        "gen_ai.system": "openai",
        "gen_ai.request.model": "gpt-4o",
    }) as span:
    response = openai.chat.completions.create(...)
    span.set_attribute("gen_ai.usage.input_tokens",
                       response.usage.prompt_tokens)
    span.set_attribute("gen_ai.usage.output_tokens",
                       response.usage.completion_tokens)</code></pre>

      <h4>Что логировать в трейсе</h4>
      <ul>
        <li>Полный промпт (system + user) — для воспроизведения и дебага</li>
        <li>Ответ модели — для оценки качества</li>
        <li>Все tool calls с аргументами и результатами</li>
        <li>Latency per span — для обнаружения bottleneck</li>
        <li>Token usage — для cost tracking</li>
        <li>Session/user metadata — для группировки и анализа</li>
      </ul>
    `,
    flashcards: [
      { front: "Trace vs Span vs Generation", back: "Trace = весь запрос. Span = логический блок (retrieval, tool call). Generation = конкретный LLM-вызов с токенами и моделью. Generation ⊂ Span ⊂ Trace." },
      { front: "OpenTelemetry gen_ai.* атрибуты", back: "Стандартные атрибуты: gen_ai.system (провайдер), gen_ai.request.model, gen_ai.usage.input_tokens, gen_ai.usage.output_tokens. Совместимы со всеми observability-платформами." },
      { front: "Что логировать в LLM-трейсе?", back: "Полный промпт, ответ модели, tool calls, latency per span, token usage, session metadata. Без этого невозможно воспроизвести и отдебажить проблему." }
    ],
    quiz: [
      {
        question: "В трейсе LLM-приложения, что является Generation?",
        options: [
          "Полный пользовательский запрос",
          "Конкретный вызов LLM с метаданными (модель, токены, промпт, ответ)",
          "HTTP-запрос к API",
          "Запрос к векторной БД"
        ],
        correct: 1,
        explanation: "Generation — это конкретный вызов LLM с полным набором метаданных. Это подмножество Span, которое является подмножеством Trace."
      },
      {
        question: "Зачем использовать стандартные атрибуты OpenTelemetry gen_ai.*?",
        options: [
          "Это требование закона",
          "Совместимость с любыми observability-платформами (Langfuse, Phoenix, Helicone) без кастомной интеграции",
          "Ускорение инференса",
          "Снижение стоимости API"
        ],
        correct: 1,
        explanation: "Стандартные атрибуты gen_ai.* обеспечивают vendor-agnostic инструментацию. Можно переключить observability-бэкенд без изменения кода."
      }
    ],
    sources: [
      { title: "Langfuse OpenTelemetry Integration", url: "https://langfuse.com/integrations/native/opentelemetry", icon: "🔗" },
      { title: "OpenTelemetry Semantic Conventions for GenAI", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/", icon: "🔗" }
    ]
  },
  {
    id: 4,
    title: "Langfuse",
    goal: "Освоить Langfuse — open-source стандарт для production LLM observability.",
    objectives: [
      "Развёртывать Langfuse self-hosted",
      "Использовать промпт-менеджмент с версионированием",
      "Настраивать дашборды и аналитику затрат"
    ],
    content: `
      <h4>Обзор Langfuse</h4>
      <div class="metric-card">
        <h5>Langfuse — Open-source LLM Observability</h5>
        <p>Лицензия MIT. Де-факто стандарт для open-source наблюдаемости. Фокус на высокопроизводительном инджесте трейсов, промпт-менеджменте и аналитике затрат.</p>
      </div>

      <h4>Архитектура</h4>
      <p>Langfuse использует иерархическую модель данных: трейс → наблюдения (observations), которые делятся на spans, generations и events. Это точно отражает вложенность агентских workflow.</p>
      <pre><code>Self-hosted стек:
- PostgreSQL (основная БД)
- ClickHouse (аналитика, агрегации)
- Redis (кэш, очереди)
- S3 (хранение трейсов, артефактов)
- Next.js (UI)
- API (REST + OTLP endpoint)</code></pre>

      <h4>Промпт-менеджмент</h4>
      <div class="key-concept">
        <strong>Реестр промптов:</strong> Встроенный реестр с версионированием, тегами и синхронизацией с GitHub. Промпты получаются во время выполнения (runtime fetch) через SDK — можно откатывать изменения без redeploy кода.
      </div>

      <pre><code># Python SDK: получение промпта из Langfuse
from langfuse import Langfuse

lf = Langfuse()
prompt = lf.get_prompt("summarize-v2")

# prompt.config содержит параметры
# prompt.prompt содержит шаблон
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "system", "content": prompt.prompt}],
    temperature=prompt.config.get("temperature", 0.7)
)</code></pre>

      <h4>OpenTelemetry интеграция</h4>
      <p>Langfuse полностью совместим с OTel: нативный OTLP-эндпоинт (<code>/api/public/otel</code>) и маппинг атрибутов <code>gen_ai.*</code> в свою модель данных. Можно инструментировать код стандартными OTel-библиотеками.</p>

      <h4>Дашборды и аналитика</h4>
      <ul>
        <li>Cost dashboard — расходы по моделям, пользователям, фичам</li>
        <li>Latency breakdown — TTFT, TPOT, per-model breakdown</li>
        <li>Quality scores — оценки от LLM-as-Judge и human reviewers</li>
        <li>Session view — группировка трейсов по сессиям и пользователям</li>
      </ul>

      <h4>Ограничения</h4>
      <ul>
        <li>Требует инфраструктуры для self-hosting (PostgreSQL + ClickHouse + Redis + S3)</li>
        <li>Нет встроенных LLM-судей «из коробки» — нужно подключать внешние эвалюаторы</li>
      </ul>
    `,
    flashcards: [
      { front: "Langfuse — что это?", back: "Open-source (MIT) LLM observability платформа. Де-факто стандарт: трейсинг, промпт-менеджмент, cost analytics. Self-hosted на PostgreSQL + ClickHouse + Redis." },
      { front: "Runtime prompt fetch в Langfuse", back: "Промпты хранятся в реестре Langfuse с версионированием. Приложение получает их через SDK во время выполнения — можно откатить промпт без redeploy." },
      { front: "Стек Langfuse self-hosted", back: "PostgreSQL (основная БД), ClickHouse (аналитика), Redis (кэш/очереди), S3 (хранение трейсов), Next.js (UI). Требует инфраструктуры, но даёт полный контроль." }
    ],
    quiz: [
      {
        question: "Какое преимущество даёт runtime prompt fetch через Langfuse SDK?",
        options: [
          "Ускоряет инференс",
          "Позволяет откатить промпт без redeploy приложения",
          "Снижает стоимость токенов",
          "Автоматически улучшает качество промптов"
        ],
        correct: 1,
        explanation: "Runtime fetch: промпт загружается из Langfuse при каждом вызове. Изменили промпт в UI Langfuse → приложение сразу использует новую версию. Откатили → без redeploy."
      },
      {
        question: "Почему Langfuse использует ClickHouse вместе с PostgreSQL?",
        options: [
          "PostgreSQL не поддерживает JSON",
          "PostgreSQL — для транзакционных данных, ClickHouse — для аналитических запросов по миллионам трейсов",
          "ClickHouse нужен для промпт-менеджмента",
          "Это маркетинговое решение"
        ],
        correct: 1,
        explanation: "PostgreSQL хранит структурированные данные (пользователи, промпты). ClickHouse оптимизирован для аналитики: агрегации по миллионам трейсов, cost breakdown, latency percentiles."
      }
    ],
    sources: [
      { title: "Langfuse Documentation", url: "https://langfuse.com/docs", icon: "🔗" },
      { title: "Langfuse vs Phoenix (ZenML, 2026)", url: "https://www.zenml.io/blog/langfuse-vs-phoenix", icon: "📄" }
    ]
  },
  {
    id: 5,
    title: "LangSmith",
    goal: "Освоить LangSmith — observability-платформу с глубокой интеграцией в экосистему LangChain.",
    objectives: [
      "Отлаживать сложные агентские workflow",
      "Конвертировать production трейсы в evaluation датасеты",
      "Проводить A/B тестирование промптов"
    ],
    content: `
      <h4>Обзор LangSmith</h4>
      <div class="metric-card">
        <h5>LangSmith — от команды LangChain</h5>
        <p>Глубочайшая интеграция с LangChain/LangGraph. Создан специально для отладки сложных агентов и цепочек. Лучший инструмент, если ваш стек — LangChain.</p>
      </div>

      <h4>Агентская отладка</h4>
      <p>LangSmith отлично визуализирует многошаговые агентские workflow:</p>
      <ul>
        <li>Каждый вызов инструмента — отдельный span с input/output</li>
        <li>Ретриверы с relevance scores</li>
        <li>Циклы рассуждений (reasoning loops) — видны на таймлайне</li>
        <li>Вложенные спаны для сложных графов LangGraph</li>
      </ul>

      <h4>Evaluation Pipeline</h4>
      <div class="key-concept">
        <strong>Production → Dataset:</strong> LangSmith позволяет конвертировать production трейсы в датасеты для оффлайн-оценки. Нашли плохой ответ в продакшне → одним кликом добавили в golden dataset → прогнали в regression test.
      </div>

      <h4>A/B тестирование промптов</h4>
      <pre><code># LangSmith: A/B тест двух версий промпта
from langsmith import Client
client = Client()

# Создать эксперимент
experiment = client.create_experiment(
    name="summarize-v3-vs-v4",
    dataset_id=dataset_id
)

# Запустить evaluation для обоих промптов
# LangSmith сравнит accuracy, latency, tokens
# и покажет side-by-side результаты</code></pre>

      <h4>Интеграция с LangChain</h4>
      <pre><code># Автоматический трейсинг через LangSmith
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "lsv2_..."
os.environ["LANGCHAIN_PROJECT"] = "my-app"

# Весь LangChain-код автоматически логируется
chain = prompt | llm | output_parser
result = chain.invoke({"question": "..."})
# Трейс уже в LangSmith!</code></pre>

      <h4>Ограничения</h4>
      <ul>
        <li><strong>Vendor lock-in</strong> — полный потенциал только с LangChain/LangGraph</li>
        <li>Менее подходит для LlamaIndex, DSPy или кастомных OTel-инструментаций</li>
        <li>Хостинг только SaaS (нет open-source self-hosted)</li>
      </ul>
    `,
    flashcards: [
      { front: "LangSmith — для кого?", back: "Для команд на LangChain/LangGraph. Глубочайшая интеграция: авто-трейсинг, визуализация агентов, A/B промптов. Vendor lock-in — основной минус." },
      { front: "Production → Dataset в LangSmith", back: "Конвертация production трейсов в evaluation датасеты. Нашли плохой ответ → добавили в golden dataset → regression test. Замкнутый цикл улучшения." },
      { front: "Vendor lock-in LangSmith", back: "Полный потенциал только с LangChain/LangGraph. Для LlamaIndex, DSPy или кастомных стеков — Langfuse или Phoenix будут лучше." }
    ],
    quiz: [
      {
        question: "Когда LangSmith — лучший выбор?",
        options: [
          "Для любого LLM-приложения",
          "Когда стек построен на LangChain/LangGraph — максимальная интеграция и авто-трейсинг",
          "Только для open-source проектов",
          "Для edge-устройств"
        ],
        correct: 1,
        explanation: "LangSmith раскрывает потенциал только с LangChain/LangGraph: автоматический трейсинг, визуализация графов, A/B тестирование. Для других стеков — Langfuse или Phoenix."
      },
      {
        question: "Как LangSmith помогает с regression testing?",
        options: [
          "Автоматически исправляет ошибки",
          "Позволяет конвертировать production трейсы в evaluation датасеты и прогонять их при каждом изменении",
          "Блокирует деплой при ошибках",
          "Удаляет плохие промпты"
        ],
        correct: 1,
        explanation: "Production трейс → golden dataset → regression test. При каждом изменении промпта/модели прогоняете датасет — убеждаетесь, что не стало хуже."
      }
    ],
    sources: [
      { title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/", icon: "🔗" },
      { title: "LLM Observability Tools Comparison (Comet, 2025)", url: "https://www.comet.com/site/blog/llm-observability-tools/", icon: "📄" }
    ]
  },
  {
    id: 6,
    title: "Arize Phoenix",
    goal: "Освоить Phoenix — developer-first платформу для локальной отладки и RAG evaluation.",
    objectives: [
      "Запускать Phoenix локально для быстрой отладки",
      "Оценивать RAG-конвейеры (retrieval + generation)",
      "Использовать Phoenix с OpenTelemetry"
    ],
    content: `
      <h4>Обзор Phoenix</h4>
      <div class="metric-card">
        <h5>Phoenix (Arize AI) — developer-first</h5>
        <p>Начинался как ML-мониторинг, эволюционировал в LLM evaluation + RAG. Философия: локальное развертывание, OpenTelemetry native, zero-config.</p>
      </div>

      <h4>Локальная отладка</h4>
      <pre><code># Установка и запуск — 2 команды
pip install arize-phoenix
python -m phoenix.server.main serve

# UI доступен на http://localhost:6006
# Автоматически собирает OTel-трейсы</code></pre>
      <p>Phoenix стартует локально за секунды — не нужен Docker, ClickHouse или Redis. Идеален для development и staging.</p>

      <h4>RAG Evaluation</h4>
      <div class="key-concept">
        <strong>Встроенные RAG-метрики:</strong> QA Correctness (правильность ответа), Context Relevance (релевантность извлечённых chunks), Hallucination Detection (выдумал ли модель факты). Все на базе LLM-as-Judge.
      </div>

      <pre><code># RAG evaluation в Phoenix
import phoenix as px
from phoenix.evals import (
    HallucinationEvaluator,
    QAEvaluator,
    OpenAIModel
)

model = OpenAIModel(model="gpt-4o")
hallucination_eval = HallucinationEvaluator(model)
qa_eval = QAEvaluator(model)

# Оценка каждого трейса
# Результат: score + explanation для каждого</code></pre>

      <h4>OpenTelemetry native</h4>
      <p>Phoenix полностью построен вокруг OTel. Любой OTel-совместимый трейс (из LangChain, LlamaIndex, кастомного кода) автоматически визуализируется. Нет vendor lock-in.</p>

      <h4>Embeddings Analysis</h4>
      <p>Уникальная фича Phoenix — визуализация embeddings в 2D/3D пространстве (UMAP/t-SNE). Помогает обнаруживать кластеры, outliers и coverage gaps в retrieval.</p>

      <h4>Когда использовать Phoenix</h4>
      <ul>
        <li>Быстрая локальная отладка RAG-конвейеров</li>
        <li>Evaluation без развёртывания инфраструктуры</li>
        <li>Анализ embeddings и retrieval quality</li>
        <li>Vendor-agnostic стек (OpenTelemetry)</li>
      </ul>
    `,
    flashcards: [
      { front: "Phoenix — ключевая фича", back: "Developer-first: 2 команды для запуска, UI на localhost:6006. OpenTelemetry native. Идеален для локальной отладки RAG без Docker/ClickHouse." },
      { front: "RAG-метрики в Phoenix", back: "QA Correctness (правильность ответа), Context Relevance (релевантность chunks), Hallucination Detection (выдуманные факты). Все на LLM-as-Judge." },
      { front: "Embeddings Analysis в Phoenix", back: "Визуализация embeddings в 2D/3D (UMAP/t-SNE). Обнаружение кластеров, outliers, coverage gaps. Уникальная фича, которой нет в Langfuse/LangSmith." }
    ],
    quiz: [
      {
        question: "Какое главное преимущество Phoenix перед Langfuse для development?",
        options: [
          "Больше дашбордов",
          "Локальный запуск за 2 команды без инфраструктуры (Docker, ClickHouse, Redis)",
          "Поддержка большего числа моделей",
          "Встроенный промпт-менеджмент"
        ],
        correct: 1,
        explanation: "Phoenix запускается локально за секунды (pip install + serve). Langfuse требует PostgreSQL + ClickHouse + Redis + S3. Для dev-цикла Phoenix удобнее."
      },
      {
        question: "Какая уникальная фича Phoenix помогает отлаживать retrieval?",
        options: [
          "A/B тестирование промптов",
          "Визуализация embeddings в 2D/3D пространстве для обнаружения кластеров и gaps",
          "Автоматический деплой",
          "Генерация синтетических данных"
        ],
        correct: 1,
        explanation: "Phoenix визуализирует embeddings через UMAP/t-SNE — можно увидеть, как документи кластеризуются, найти outliers и gaps в coverage retrieval."
      }
    ],
    sources: [
      { title: "Arize Phoenix Documentation", url: "https://docs.arize.com/phoenix", icon: "🔗" },
      { title: "Langfuse vs Phoenix (MyEngineeringPath, 2026)", url: "https://myengineeringpath.dev/tools/langfuse-vs-phoenix-arize", icon: "📄" }
    ]
  },
  {
    id: 7,
    title: "Production Monitoring",
    goal: "Построить production-ready observability стек: alerting, drift detection, галлюцинации и CI/CD integration.",
    objectives: [
      "Настраивать alerting на аномалии качества",
      "Обнаруживать семантический дрейф",
      "Интегрировать evaluation в CI/CD pipeline"
    ],
    content: `
      <h4>Detection галлюцинаций</h4>
      <p>Галлюцинации — главная угроза LLM-приложений. Стратегии обнаружения:</p>

      <div class="key-concept">
        <strong>Faithfulness Check:</strong> Для RAG — проверяет, следует ли ответ извлечённому контексту. Если модель ссылается на факты, которых нет в chunks — это галлюцинация. Инструменты: RAGAS faithfulness, Phoenix HallucinationEvaluator, Braintrust scorers.
      </div>

      <ul>
        <li><strong>Factual consistency</strong> — проверка фактов против reference knowledge base</li>
        <li><strong>Citation verification</strong> — если модель цитирует источники, проверка что цитата корректна</li>
        <li><strong>Uncertainty detection</strong> — определение, когда модель «не уверена» и может выдумывать</li>
        <li><strong>Self-consistency</strong> — несколько генераций на один вход, проверка согласованности</li>
      </ul>

      <h4>Drift Detection</h4>
      <p>Семантический дрейф — постепенное изменение качества или поведения модели:</p>
      <ul>
        <li><strong>Input drift</strong> — пользователи начинают задавать вопросы, на которые модель не была обучена отвечать</li>
        <li><strong>Output drift</strong> — распределение ответов меняется (короче/длиннее, другой тон, другие темы)</li>
        <li><strong>Quality drift</strong> — метрики качества (faithfulness, relevance) снижаются со временем</li>
      </ul>

      <h4>CI/CD Integration</h4>
      <pre><code># GitHub Actions: evaluation gate
name: LLM Evaluation
on: [pull_request]
jobs:
  eval:
    steps:
      - name: Run golden dataset
        run: |
          python run_eval.py \\
            --dataset golden.json \\
            --output results.json

      - name: Check regression
        run: |
          python check_regression.py \\
            --current results.json \\
            --baseline baseline.json \\
            --max-regression 0.05
        # Если regression > 5% — PR блокируется</code></pre>

      <h4>Композитный стек observability</h4>
      <p>Рекомендуемая архитектура 2026:</p>
      <ul>
        <li><strong>Instrumentation:</strong> OpenTelemetry SDK + auto-instrumentation для вашего фреймворка</li>
        <li><strong>Production:</strong> Langfuse (self-hosted) для трейсинга, cost tracking, alerting</li>
        <li><strong>Development:</strong> Phoenix (локально) для быстрой отладки RAG и evaluation</li>
        <li><strong>Evaluation:</strong> RAGAS + LLM-as-Judge для automated quality checks</li>
        <li><strong>CI/CD:</strong> Golden dataset + regression gate в GitHub Actions</li>
      </ul>
    `,
    flashcards: [
      { front: "Faithfulness Check для RAG", back: "Проверяет: следует ли ответ извлечённому контексту? Если модель ссылается на факты, которых нет в chunks — галлюцинация. Инструменты: RAGAS, Phoenix, Braintrust." },
      { front: "Семантический дрейф", back: "Постепенное изменение: input drift (новые типы вопросов), output drift (изменение стиля/длины), quality drift (снижение faithfulness/relevance). Обнаруживается через мониторинг распределений." },
      { front: "Композитный observability стек", back: "OTel (instrumentation) + Langfuse (production) + Phoenix (dev) + RAGAS (evaluation) + CI/CD regression gate. Каждый инструмент для своей задачи." }
    ],
    quiz: [
      {
        question: "RAG-система начала генерировать ответы с фактами, которых нет в извлечённых chunks. Что это?",
        options: [
          "Нормальное поведение",
          "Галлюцинация — нарушение faithfulness. Ответ должен следовать только извлечённому контексту",
          "Input drift",
          "Проблема с latency"
        ],
        correct: 1,
        explanation: "Faithfulness violation: RAG-система должна отвечать ТОЛЬКО на основе извлечённого контекста. Если добавляет факты из своей памяти — это галлюцинация."
      },
      {
        question: "CI/CD pipeline блокирует PR, если regression rate > 5%. Какой тип testing это реализует?",
        options: [
          "Unit testing",
          "Regression testing на golden dataset — каждый PR прогоняется через эталонные примеры",
          "Integration testing",
          "Stress testing"
        ],
        correct: 1,
        explanation: "Regression testing: golden dataset прогоняется через новую версию. Если > 5% примеров ухудшились — PR блокируется. Защита от деградации качества."
      }
    ],
    sources: [
      { title: "LLM Monitoring & Drift Detection Guide (Leanware, 2026)", url: "https://www.leanware.co/insights/llm-monitoring-drift-detection-guide", icon: "📄" },
      { title: "Best Hallucination Detection Tools (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/best-hallucination-detection-tools-2026", icon: "📄" },
      { title: "Best LLM Cost Tracking Tools (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/best-tools-tracking-llm-costs-2026", icon: "📄" }
    ]
  }
];

// Final Review Questions
const finalQuiz = [
  { question: "Традиционный APM не подходит для LLM, потому что:", options: ["LLM не используют HTTP", "Не фиксирует семантический дрейф, галлюцинации и непредсказуемые расходы токенов", "LLM слишком быстрые для APM", "APM не поддерживает Python"], correct: 1, explanation: "LLM-системы вероятностны. APM видит HTTP 200, но не видит, что ответ — галлюцинация, или что стоимость запроса выросла в 10 раз." },
  { question: "TTFT (Time to First Token) критичен для:", options: ["Batch processing", "Streaming и интерактивных чатов — определяет воспринимаемую отзывчивость", "Оффлайн-оценки", "Training"], correct: 1, explanation: "TTFT = время до первого токена. В streaming-режиме пользователь ждёт первый символ — это UX-метрика отзывчивости." },
  { question: "Какой атрибут OpenTelemetry НЕ входит в gen_ai.*?", options: ["gen_ai.system", "gen_ai.request.model", "gen_ai.usage.input_tokens", "gen_ai.user.email"], correct: 3, explanation: "gen_ai.* стандарт включает system, model, tokens. user.email — кастомный атрибут, не часть стандарта." },
  { question: "Главное преимущество Langfuse:", options: ["Самый красивый UI", "Open-source MIT, self-hosted, OTel-compatible, промпт-менеджмент", "Бесплатный SaaS", "Только для LangChain"], correct: 1, explanation: "Langfuse = open-source + self-hosted + OTel + промпт-менеджмент. Полный контроль данных, vendor-agnostic." },
  { question: "LangSmith лучше всего работает с:", options: ["Любым фреймворком", "LangChain/LangGraph — максимальная интеграция и авто-трейсинг", "Только с GPT-4", "Kubernetes"], correct: 1, explanation: "LangSmith создан командой LangChain. Полный потенциал — только с LangChain/LangGraph. Для других стеков — vendor lock-in." },
  { question: "Phoenix от Arize AI уникален тем, что:", options: ["Самый дорогой", "Локальный запуск за 2 команды, embeddings visualization, OTel native", "Только для enterprise", "Не поддерживает RAG"], correct: 1, explanation: "Phoenix: pip install + serve = UI на localhost. Embeddings visualization (UMAP/t-SNE) — уникальная фича для отладки retrieval." },
  { question: "Faithfulness check в RAG проверяет:", options: ["Скорость retrieval", "Следует ли ответ ТОЛЬКО извлечённому контексту (нет ли выдуманных фактов)", "Размер контекстного окна", "Количество chunks"], correct: 1, explanation: "Faithfulness: ответ RAG должен основываться только на извлечённых chunks. Если модель добавляет факты из памяти — это галлюцинация." },
  { question: "Рекомендуемый production observability стек 2026:", options: ["Только LangSmith", "Только Langfuse", "OTel (instrumentation) + Langfuse (production) + Phoenix (dev) + RAGAS (eval) + CI/CD gate", "Console.log"], correct: 2, explanation: "Композитный стек: каждый инструмент для своей задачи. OTel — стандарт, Langfuse — production, Phoenix — dev, RAGAS — eval, CI/CD — regression." }
];

// ============================================================
// App State & Logic
// ============================================================
let state = { currentLesson: -1, completed: new Set(), quizAnswered: {} };
const $ = (sel) => document.querySelector(sel);

function init() { buildSidebar(); bindEvents(); updateProgress(); }

function buildSidebar() {
  $("#lesson-nav").innerHTML = courseData.map((l, i) =>
    "<button class=\"lesson-nav-item" + (i === state.currentLesson ? " active" : "") + "\" data-lesson=\"" + i + "\">" +
    "<span class=\"nav-icon\">" + (state.completed.has(i) ? "\u2713" : i + 1) + "</span>" +
    "<span>" + l.title + "</span></button>"
  ).join("");
}

function bindEvents() {
  $("#btn-start").addEventListener("click", () => goToLesson(0));
  $("#btn-prev").addEventListener("click", prevLesson);
  $("#btn-next").addEventListener("click", nextLesson);
  $("#btn-review").addEventListener("click", showReview);
  $("#sidebar-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#lesson-nav").addEventListener("click", (e) => {
    const item = e.target.closest(".lesson-nav-item");
    if (item) { goToLesson(parseInt(item.dataset.lesson)); $("#sidebar").classList.remove("open"); }
  });
}

function goToLesson(index) {
  state.currentLesson = index;
  $("#welcome").classList.add("hidden");
  $("#review-view").classList.add("hidden");
  $("#lesson-view").classList.remove("hidden");
  const l = courseData[index];
  $("#lesson-badge").textContent = "\u0423\u0440\u043e\u043a " + (index + 1);
  $("#lesson-title").textContent = l.title;
  $("#objectives-list").innerHTML = l.objectives.map(o => "<li>" + o + "</li>").join("");
  $("#content-section").innerHTML = "<h3>\ud83d\udcd6 \u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b</h3>" + l.content;
  buildFlashcards(l.flashcards);
  buildQuiz(l.quiz, l.id);
  buildSources(l.sources);
  $("#btn-prev").style.visibility = index === 0 ? "hidden" : "visible";
  $("#btn-next").textContent = index === courseData.length - 1 ? "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044c \u2192" : "\u0414\u0430\u043b\u0435\u0435 \u2192";
  state.completed.add(index);
  updateProgress(); buildSidebar(); window.scrollTo(0, 0);
}

function buildFlashcards(cards) {
  const c = $("#flashcards");
  c.innerHTML = cards.map((card, i) =>
    "<div class=\"flashcard\"><div class=\"flashcard-inner\">" +
    "<div class=\"flashcard-front\">" + card.front + "</div>" +
    "<div class=\"flashcard-back\">" + card.back + "</div>" +
    "</div></div>"
  ).join("");
  c.querySelectorAll(".flashcard").forEach(f => f.addEventListener("click", () => f.classList.toggle("flipped")));
}

function buildQuiz(questions, lessonId) {
  const c = $("#quiz");
  c.innerHTML = questions.map((q, qi) => {
    const key = lessonId + "-" + qi;
    const a = state.quizAnswered[key];
    return "<div class=\"quiz-question\" data-key=\"" + key + "\" data-correct=\"" + q.correct + "\">" +
      "<h4>" + (qi + 1) + ". " + q.question + "</h4><div class=\"quiz-options\">" +
      q.options.map((o, oi) => {
        let cls = "quiz-option";
        if (a !== undefined) { cls += " disabled"; if (oi === q.correct) cls += " correct"; else if (oi === a) cls += " wrong"; }
        return "<button class=\"" + cls + "\" data-option=\"" + oi + "\" data-key=\"" + key + "\">" + o + "</button>";
      }).join("") + "</div><div class=\"quiz-feedback" + (a !== undefined ? " show " + (a === q.correct ? "correct-fb" : "wrong-fb") : "") + "\">" +
      (a !== undefined ? (a === q.correct ? "\u2705 \u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e! " : "\u274c \u041d\u0435\u0432\u0435\u0440\u043d\u043e. ") + q.explanation : "") + "</div></div>";
  }).join("");
  c.querySelectorAll(".quiz-option").forEach(b => b.addEventListener("click", () => handleAnswer(b)));
}

function handleAnswer(btn) {
  const key = btn.dataset.key;
  if (state.quizAnswered[key] !== undefined) return;
  const q = btn.closest(".quiz-question");
  const ci = parseInt(q.dataset.correct), si = parseInt(btn.dataset.option);
  state.quizAnswered[key] = si;
  q.querySelectorAll(".quiz-option").forEach((o, i) => { o.classList.add("disabled"); if (i === ci) o.classList.add("correct"); else if (i === si) o.classList.add("wrong"); });
  const fb = q.querySelector(".quiz-feedback");
  const [lid, qi] = key.split("-").map(Number);
  const exp = courseData[lid - 1]?.quiz[qi]?.explanation || "";
  fb.textContent = (si === ci ? "\u2705 \u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e! " : "\u274c \u041d\u0435\u0432\u0435\u0440\u043d\u043e. ") + exp;
  fb.className = "quiz-feedback show " + (si === ci ? "correct-fb" : "wrong-fb");
}

function buildSources(sources) {
  if (!sources || !sources.length) { $("#sources-section").classList.add("hidden"); return; }
  $("#sources-section").classList.remove("hidden");
  $("#sources").innerHTML = sources.map(s =>
    "<a href=\"" + s.url + "\" target=\"_blank\" class=\"source-card\"><span class=\"source-icon\">" + s.icon + "</span>" +
    "<div><div class=\"source-title\">" + s.title + "</div><div class=\"source-url\">" + s.url + "</div></div></a>"
  ).join("");
}

function prevLesson() { if (state.currentLesson > 0) goToLesson(state.currentLesson - 1); }
function nextLesson() { state.currentLesson < courseData.length - 1 ? goToLesson(state.currentLesson + 1) : showReview(); }

function showReview() {
  state.currentLesson = 7;
  $("#welcome").classList.add("hidden"); $("#lesson-view").classList.add("hidden"); $("#review-view").classList.remove("hidden");
  buildFinalQuiz(); buildSidebar(); window.scrollTo(0, 0);
}

function buildFinalQuiz() {
  const c = $("#final-quiz");
  c.innerHTML = finalQuiz.map((q, qi) =>
    "<div class=\"quiz-question\" data-fkey=\"" + qi + "\" data-correct=\"" + q.correct + "\">" +
    "<h4>" + (qi + 1) + ". " + q.question + "</h4><div class=\"quiz-options\">" +
    q.options.map((o, oi) => "<button class=\"quiz-option\" data-foption=\"" + oi + "\" data-fkey=\"" + qi + "\">" + o + "</button>").join("") +
    "</div><div class=\"quiz-feedback\" data-fkey=\"" + qi + "\"></div></div>"
  ).join("");
  const af = {};
  c.querySelectorAll(".quiz-option").forEach(b => b.addEventListener("click", () => {
    const fk = b.dataset.fkey;
    if (af[fk] !== undefined) return;
    const q = b.closest(".quiz-question"), ci = parseInt(q.dataset.correct), si = parseInt(b.dataset.foption);
    af[fk] = si;
    q.querySelectorAll(".quiz-option").forEach((o, i) => { o.classList.add("disabled"); if (i === ci) o.classList.add("correct"); else if (i === si) o.classList.add("wrong"); });
    const fb = q.querySelector(".quiz-feedback");
    fb.textContent = (si === ci ? "\u2705 " : "\u274c ") + finalQuiz[fk].explanation;
    fb.className = "quiz-feedback show " + (si === ci ? "correct-fb" : "wrong-fb");
    if (Object.keys(af).length === finalQuiz.length) {
      const s = Object.entries(af).filter(([k, v]) => v === finalQuiz[k].correct).length;
      showResult(s, finalQuiz.length);
    }
  }));
}

function showResult(score, total) {
  $("#review-result").classList.remove("hidden");
  const pct = Math.round(score / total * 100);
  $("#review-score").textContent = score + " / " + total + " (" + pct + "%)";
  $("#review-message").textContent = pct >= 80
    ? "\ud83c\udf89 \u041e\u0442\u043b\u0438\u0447\u043d\u043e! \u0412\u044b \u0433\u043e\u0442\u043e\u0432\u044b \u043d\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0442\u044c LLM Observability!"
    : pct >= 50 ? "\ud83d\udc4d \u0425\u043e\u0440\u043e\u0448\u0430\u044f \u0431\u0430\u0437\u0430. \u041f\u0435\u0440\u0435\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0443\u0440\u043e\u043a\u0438 \u0441 \u043e\u0448\u0438\u0431\u043a\u0430\u043c\u0438."
    : "\ud83d\udcda \u0421\u0442\u043e\u0438\u0442 \u043f\u0440\u043e\u0439\u0442\u0438 \u043a\u0443\u0440\u0441 \u0435\u0449\u0451 \u0440\u0430\u0437.";
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-text").textContent = state.completed.size + " / " + courseData.length + " \u0443\u0440\u043e\u043a\u043e\u0432";
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

document.addEventListener("DOMContentLoaded", init);
