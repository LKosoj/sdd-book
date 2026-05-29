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
      "Знать, как LLM могут «молча» выходить из строя"
    ],
    content: `
      <h4>Почему APM не работает для LLM</h4>
      <p>Традиционный мониторинг отвечает на вопрос: <em>«Работает ли система?»</em> LLM Observability отвечает на вопрос: <em>«Почему модель повела себя именно так?»</em> HTTP-коды и время отклика БД не способны зафиксировать семантический дрейф, галлюцинации и непредсказуемое потребление токенов.</p>

      <div class="key-concept">
        <strong>Silent success — главный антипаттерн LLM:</strong> система возвращает HTTP 200 OK с грамматически безупречным ответом, который при этом фактически неверен. Datadog в обзоре post-mortem 2025 года показал: 67% инцидентов с LLM-приложениями в продакшне имели HTTP 2xx, а проблема была обнаружена через пользовательскую жалобу. Traditional APM здесь бесполезен.
      </div>

      <h4>Трилемма оценки</h4>
      <p>В продакшне команды сталкиваются с «трилеммой оценки» — необходимо выбрать два из трёх параметров:</p>
      <ul>
        <li><strong>Автоматические метрики</strong> (BLEU, ROUGE, BERTScore) — быстрые и дешёвые, но плохо коррелируют с человеческим суждением</li>
        <li><strong>Человеческая оценка</strong> — золотой стандарт качества, но медленный и дорогой</li>
        <li><strong>LLM-as-a-Judge</strong> — использование мощных моделей для оценки выводов других моделей. Наиболее сбалансированный подход</li>
      </ul>

      <h4>Последствия отсутствия observability</h4>
      <p>Без специализированной наблюдаемости команды отлаживают системы «вслепую», что ведёт к потере доверия пользователей и юридическим рискам. В прецедентном деле <em>Mata v. Avianca</em> галлюцинации модели привели к реальным судебным санкциям; чат-бот Air Canada в 2024 году выдумал политику возврата средств, и суд обязал авиакомпанию её исполнить.</p>

      <h4>Что должна обеспечивать LLM Observability</h4>
      <ul>
        <li>Полный трейсинг каждого запроса: от входа до финального ответа</li>
        <li>Мониторинг качества в реальном времени</li>
        <li>Контроль стоимости и потребления токенов</li>
        <li>Обнаружение аномалий и деградации</li>
        <li>Связь с CI/CD для regression testing</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «Air Canada 2024»:</strong> чат-бот авиакомпании на базе LLM сообщил пассажиру о несуществующей политике bereavement-возврата. Пассажир купил билет, рассчитывая на возврат, и подал в суд. Tribunal of British Columbia постановил: компания отвечает за всё, что сказал её чат-бот. Если бы у Air Canada была online LLM-as-judge faithfulness-проверка ответов, инцидент был бы пойман до выпуска.
      </div>
    `,
    flashcards: [
      { front: "LLM Observability vs APM", back: "APM: «Работает ли система?» (HTTP-коды, latency). LLM Obs: «Почему модель повела себя так?» (галлюцинации, дрейф, токены, качество ответов)." },
      { front: "Трилемма оценки", back: "Выбор 2 из 3: (1) автоматические метрики — быстрые/дешёвые, (2) человеческая оценка — качественная/дорогая, (3) LLM-as-Judge — сбалансированный подход." },
      { front: "Как LLM «молча» выходят из строя?", back: "Генерируют фактически неверный, но грамматически правильный текст. Попадают в бесконечные циклы tool calls. Уязвимы к prompt injection. Без observability это невидимо." },
      { front: "Silent success", back: "Главный антипаттерн LLM: HTTP 200 OK + галлюцинация. Datadog 2025: 67% LLM-инцидентов имели HTTP 2xx, проблема всплыла через жалобу пользователя." },
      { front: "Юридический риск галлюцинаций", back: "Mata v. Avianca: адвокат отправил в суд вымышленные прецеденты. Air Canada 2024: чат-бот выдумал refund policy — суд обязал компанию исполнить. Observability = compliance." },
      { front: "Non-determinism в проде", back: "Одинаковый промпт → разный ответ. Стандартные unit-тесты неприменимы. Нужны distribution-based метрики (p95, drift) и semantic validators." },
      { front: "Без observability — debugging вслепую", back: "Нет трейса = нет воспроизведения. Нет токенов = нет cost-контроля. Нет drift-детекции = деградация на месяцы незаметна. LLM Observability — не nice-to-have." }
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
      },
      {
        question: "Какой урок даёт кейс Air Canada 2024 для команд, выпускающих LLM-чатботов?",
        options: [
          "Не использовать LLM для customer support",
          "Внедрять online faithfulness-проверку ответов до отдачи пользователю — иначе компания юридически отвечает за галлюцинации",
          "Использовать только GPT-4o",
          "Не давать чат-боту доступ к политике возврата"
        ],
        correct: 1,
        explanation: "Tribunal of British Columbia постановил: компания отвечает за всё, что сказал её чат-бот. Online observability с faithfulness-проверкой обязательна для customer-facing LLM."
      },
      {
        question: "Что делает LLM-приложения принципиально недетерминированными с точки зрения мониторинга?",
        options: [
          "Использование GPU",
          "Стохастический сэмплинг при генерации — один и тот же промпт даёт разные ответы; нельзя использовать стандартные unit-тесты",
          "Облачное развёртывание",
          "Большой размер модели"
        ],
        correct: 1,
        explanation: "Sampling (temperature > 0) делает вывод недетерминированным. Распределение ответов нестабильно — нужны distribution-based метрики (p95, drift, faithfulness), не строгие assert-ы."
      },
      {
        question: "Какой компонент трилеммы выбирают команды, которым нужен компромисс между качеством и стоимостью?",
        options: [
          "Только автоматические метрики (BLEU)",
          "Только human eval",
          "LLM-as-a-Judge — недорого, лучше коррелирует с human eval, чем BLEU/ROUGE",
          "Никакой — нужно все три"
        ],
        correct: 2,
        explanation: "LLM-as-Judge — компромисс: дешевле human eval, качественнее BLEU. Требует калибровки рубрики против человеческой разметки, но даёт лучший trade-off."
      }
    ],
    sources: [
      { title: "The Complete Guide to LLM Observability (Portkey, 2026)", url: "https://portkey.ai/blog/the-complete-guide-to-llm-observability/", icon: "📄" },
      { title: "LLM Application Lifecycle (Applied AI, 2025)", url: "https://www.applied-ai.com/briefings/llm-application-lifecycle/", icon: "📄" },
      { title: "Air Canada chatbot postmortem (Dev.to)", url: "https://dev.to/johalputt/postmortem-our-ai-powered-chatbot-hallucinated-sensitive-data", icon: "📄" },
      { title: "Datadog LLM Observability 2025 report", url: "https://www.datadoghq.com/blog/llm-otel-semantic-convention/", icon: "📄" }
    ]
  },
  {
    id: 2,
    title: "Ключевые метрики LLM",
    goal: "Освоить метрики, специфичные для LLM-приложений: latency, tokens, cost и quality indicators.",
    objectives: [
      "Различать компоненты latency: TTFT, TPOT, ITL, P95/P99",
      "Настраивать token accounting с детализацией",
      "Внедрять атрибуцию затрат по тегам"
    ],
    content: `
      <h4>Метрики задержки (Latency)</h4>
      <p>Задержка в LLM-приложениях — не единое значение. Она разделяется на компоненты, критичные для UX:</p>

      <div class="metric-card">
        <h5>TTFT (Time to First Token)</h5>
        <p>Время до генерации первого токена. Критично для streaming и интерактивных чатов. Определяет воспринимаемую «отзывчивость». Хороший таргет: &lt;500 мс для чата, &lt;200 мс для voice.</p>
      </div>

      <div class="metric-card">
        <h5>TPOT / ITL (Time Per Output Token / Inter-Token Latency)</h5>
        <p>Время генерации каждого последующего токена. Определяет скорость «печати» модели в streaming-режиме. Хороший таргет: &lt;100 мс/токен для читаемости.</p>
      </div>

      <div class="metric-card">
        <h5>P95 и P99 (Tail Percentiles)</h5>
        <p>Контроль «хвостов» распределения. Аномальный рост P99 указывает на KV-cache evictions, batching interference, троттлинг провайдера, неоптимальные промпты с долгими reasoning-цепочками. Среднее значение их скрывает.</p>
      </div>

      <h4>Token Accounting</h4>
      <p>Стоимость LLM-запросов нелинейна и непредсказуема. Один edge case может увеличить ежемесячный счёт в 10 раз, если агент попадёт в цикл рекурсивных вызовов.</p>
      <ul>
        <li><code>input_tokens</code> — токены входного промпта</li>
        <li><code>output_tokens</code> — сгенерированные токены</li>
        <li><code>cached_tokens</code> — контекстное кэширование (экономия)</li>
        <li><code>reasoning_tokens</code> — для reasoning-моделей (o1, o3, Claude extended thinking)</li>
        <li><code>audio/image_tokens</code> — для мультимодальных систем</li>
      </ul>

      <h4>Prompt caching observability</h4>
      <div class="key-concept">
        <strong>Cache hit rate = cache_read / (cache_read + input_tokens).</strong> Целевой диапазон 80–95%. Anthropic: <code>cache_control</code> явный, чтение = 10% цены входа, запись = 125%. OpenAI: автоматически от 1024 токенов, кэш = 50% цены. Без мониторинга hit rate деньги уходят, но не ясно — кэш промахивается из-за неверного breakpoint или потому что трафик действительно уникальный.
      </div>

      <h4>Атрибуция затрат (FinOps)</h4>
      <div class="key-concept">
        <strong>FinOps для LLM:</strong> Группировка расходов по тегам: <code>user_id</code>, <code>feature_name</code>, <code>department</code>, <code>environment</code>. Позволяет устанавливать бюджеты на уровне команд и клиентов, обнаруживать «дорогих» пользователей. Без атрибуции счёт от провайдера на $50K не разложишь по фичам.
      </div>

      <h4>Метрики качества</h4>
      <ul>
        <li><strong>Error Rate</strong> — ошибки API, rate limits, таймауты</li>
        <li><strong>Длина ответа</strong> — гистограммы помогают выявить деградацию (слишком краткие или избыточные ответы)</li>
        <li><strong>Дрейф (Drift)</strong> — изменение распределения входных или выходных данных с течением времени</li>
        <li><strong>Tool-call success rate</strong> — для агентов: процент tool-calls с валидным parsing (38% production agent failures = malformed JSON)</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «Агент за $4 200 за 63 часа»:</strong> в публичном postmortem (Medium, 2026) команда выкатила агента с tool-use, у которого один из инструментов возвращал длинный JSON. Агент не валидировал размер ответа, повторял вызов с уточняющим контекстом, попадал в цикл «уточнить → расширить контекст → снова уточнить». За 63 часа израсходовано $4 200. Token volume alert на p99 окне 5 минут поймал бы это за первые 10 минут. Cost alert на средние — нет.
      </div>
    `,
    flashcards: [
      { front: "TTFT vs TPOT/ITL", back: "TTFT = время до первого токена (отзывчивость). TPOT/ITL = время на каждый последующий токен (скорость печати). Оба критичны для streaming UX. Таргеты: TTFT <500мс, TPOT <100мс." },
      { front: "Почему P99 latency важнее среднего?", back: "Среднее скрывает outliers. P99 показывает худшие случаи — KV-cache evictions, batching interference, троттлинг провайдера, неоптимальные промпты." },
      { front: "Token accounting детализация", back: "input_tokens + output_tokens + cached_tokens + reasoning_tokens + audio/image_tokens. Без детализации невозможно понять, куда уходят деньги." },
      { front: "Cache hit rate", back: "cache_read / (cache_read + input_tokens). Таргет 80–95%. Anthropic cache_read = 10% цены, OpenAI = 50%. Без мониторинга hit rate расходы на cache писать = 125% — деньги в трубу." },
      { front: "Token volume vs request rate для cost-алертов", back: "Request rate бесполезен: один request может стоить как 10. Цикл tool-use → 1 request, но 100K токенов. Алерт всегда на token volume или $ cost, не на rate." },
      { front: "Reasoning tokens", back: "o1, o3, Claude extended thinking генерируют скрытые reasoning токены, которые тарифицируются. Без отдельного учёта reasoning_tokens cost-модель неверна на 2-5x." },
      { front: "Tool-call success rate", back: "Для агентов: процент tool-calls с валидным parsing. 38% production agent failures = malformed JSON (parsing errors). Метрика — первая линия диагностики агентов." }
    ],
    quiz: [
      {
        question: "Агент попал в цикл рекурсивных вызовов инструментов. Какая метрика первой покажет проблему?",
        options: [
          "TTFT",
          "Token volume и стоимость (token usage + cost) резко возрастут",
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
      },
      {
        question: "Cache hit rate у Anthropic упал с 90% до 30% после изменения промпта. Что произошло?",
        options: [
          "Anthropic снизил скидку",
          "Cache breakpoint оказался ПОСЛЕ изменённой части — кэш промахивается каждый раз, расходы на cache write вместо read",
          "Это нормальное поведение",
          "Модель стала медленнее"
        ],
        correct: 1,
        explanation: "Префикс должен быть стабильным. Если изменения попадают в кэшируемую часть — каждый запрос пишет новый кэш (125% цены) вместо чтения (10%). Hit rate observability ловит это сразу."
      },
      {
        question: "Почему TTFT критичен для voice-агентов?",
        options: [
          "Voice-агенты дороже",
          "Пауза >300 мс воспринимается как «модель не понимает» — UX-разрыв. Стандартный таргет <200 мс",
          "Voice-агенты используют другие модели",
          "Voice-API не поддерживает streaming"
        ],
        correct: 1,
        explanation: "Voice UX чувствителен к паузам сильнее, чем чат. Таргет TTFT для voice <200 мс — иначе разговор «ломается». Чат терпимее (<500 мс)."
      },
      {
        question: "Что такое ITL (Inter-Token Latency) и чем отличается от TPOT?",
        options: [
          "Это разные названия одной метрики",
          "Это разные метрики: ITL — для серверного бэкенда (vLLM, SGLang), TPOT — для клиента; численно близки",
          "ITL для embeddings, TPOT для chat",
          "ITL устарело"
        ],
        correct: 1,
        explanation: "ITL и TPOT численно близки и часто взаимозаменяемы. ITL — терминология serving-фреймворков (vLLM, SGLang, TGI). TPOT — терминология клиентских observability-инструментов."
      }
    ],
    sources: [
      { title: "Monitoring Latency and Cost in LLM Operations (Maxim AI, 2026)", url: "https://www.getmaxim.ai/articles/monitoring-latency-and-cost-in-llm-operations-essential-metrics-for-success/", icon: "📄" },
      { title: "LLM Inference SLO: TTFT, ITL & Latency Budget Guide (Spheron, 2026)", url: "https://spheron.network/blog/llm-inference-slo-ttft-itl-latency-budget-guide-2026", icon: "📄" },
      { title: "Anyscale LLM Serving Benchmark Metrics", url: "https://docs.anyscale.com/llm/serving/benchmarking/metrics", icon: "📄" },
      { title: "OpenAI Prompt Caching Guide", url: "https://developers.openai.com/api/docs/guides/prompt-caching", icon: "🔗" }
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
        <li><strong>Trace</strong> — полный жизненный цикл одного запроса</li>
        <li><strong>Span</strong> — логический блок работы (retrieval, tool call, data transformation)</li>
        <li><strong>Generation</strong> — конкретный вызов LLM с метаданными (модель, токены, промпт, ответ)</li>
        <li><strong>Event</strong> — точечное событие (ошибка, лог, checkpoint)</li>
      </ul>

      <h4>OpenTelemetry для GenAI</h4>
      <div class="key-concept">
        <strong>OTel SemConv для GenAI:</strong> Стандартные атрибуты <code>gen_ai.*</code>: <code>gen_ai.system</code> (провайдер), <code>gen_ai.request.model</code>, <code>gen_ai.usage.input_tokens</code>, <code>gen_ai.usage.output_tokens</code>, <code>gen_ai.response.finish_reasons</code>. Совместимы с Langfuse, Phoenix, Helicone, Datadog. С версии OTel 1.37+ покрывают agent и framework spans.
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

      <h4>OpenLLMetry — auto-instrumentation</h4>
      <p>Проект <strong>OpenLLMetry от Traceloop</strong> (Apache 2.0, 6.6k+ stars) — референс-имплементация GenAI SemConv. Один <code>Traceloop.init()</code> авто-инструментирует 30+ библиотек: OpenAI, Anthropic, LangChain, LlamaIndex, Pinecone, Weaviate, Qdrant. Экспорт в любой OTel-бэкенд.</p>

      <h4>Что логировать в трейсе</h4>
      <ul>
        <li>Полный промпт (system + user) — для воспроизведения и дебага</li>
        <li>Ответ модели — для оценки качества</li>
        <li>Все tool calls с аргументами и результатами</li>
        <li>Latency per span — для обнаружения bottleneck</li>
        <li>Token usage — для cost tracking</li>
        <li>Session/user metadata — для группировки и анализа</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «миграция Langfuse → Phoenix без переписывания»:</strong> команда стартовала на Langfuse SaaS, через год upgrade-плана стало дорого, перешли на self-hosted Phoenix. Поскольку всё было инструментировано через стандартные OTel <code>gen_ai.*</code> атрибуты, миграция = смена OTLP-эндпоинта в одной переменной окружения. Vendor-agnostic OTel-инструментация спасла недели работы.
      </div>
    `,
    flashcards: [
      { front: "Trace vs Span vs Generation", back: "Trace = весь запрос. Span = логический блок (retrieval, tool call). Generation = конкретный LLM-вызов с токенами и моделью. Generation ⊂ Span ⊂ Trace." },
      { front: "OpenTelemetry gen_ai.* атрибуты", back: "Стандартные атрибуты: gen_ai.system (провайдер), gen_ai.request.model, gen_ai.usage.input_tokens, gen_ai.usage.output_tokens, gen_ai.response.finish_reasons. Vendor-agnostic." },
      { front: "Что логировать в LLM-трейсе?", back: "Полный промпт, ответ модели, tool calls, latency per span, token usage, session metadata. Без этого невозможно воспроизвести и отдебажить." },
      { front: "OTel SemConv 1.37+ — что нового", back: "Agent spans (gen_ai.agent.name, gen_ai.agent.id), framework spans для LangChain/LlamaIndex, message content opt-in (gen_ai.input.messages). Принят Datadog, Phoenix, Langfuse." },
      { front: "OpenLLMetry — что это", back: "Apache 2.0 проект Traceloop, 6.6k stars. Один Traceloop.init() — авто-инструментация 30+ библиотек (OpenAI, Anthropic, LangChain, Pinecone). Экспорт в любой OTel-бэкенд." },
      { front: "OTLP endpoint у Langfuse", back: "Langfuse имеет нативный OTLP-эндпоинт /api/public/otel — принимает стандартный OTel-трафик с маппингом gen_ai.* атрибутов в свою модель данных. Vendor-agnostic." },
      { front: "Зачем opt-in message content в OTel", back: "По умолчанию gen_ai.input.messages / gen_ai.output.messages не пишутся из соображений privacy (PII в логах). Включаются явно через переменную окружения OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true." }
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
          "Совместимость с любыми observability-платформами (Langfuse, Phoenix, Helicone, Datadog) без кастомной интеграции",
          "Ускорение инференса",
          "Снижение стоимости API"
        ],
        correct: 1,
        explanation: "Стандартные атрибуты gen_ai.* обеспечивают vendor-agnostic инструментацию. Можно переключить observability-бэкенд без изменения кода."
      },
      {
        question: "Что даёт OTel SemConv 1.37+ по сравнению с предыдущими версиями?",
        options: [
          "Поддержку embeddings",
          "Agent spans (gen_ai.agent.*) и framework spans для LangChain/LlamaIndex — стандарт для observability агентов",
          "GPU-метрики",
          "Поддержку только OpenAI"
        ],
        correct: 1,
        explanation: "В версии 1.37+ OTel GenAI SemConv покрыли агентные системы. Раньше agent observability был vendor-specific (AgentOps, LangSmith). Теперь — стандарт."
      },
      {
        question: "OpenLLMetry — это:",
        options: [
          "Платный сервис",
          "Apache 2.0 проект Traceloop с авто-инструментацией 30+ LLM-библиотек через один Traceloop.init()",
          "Внутренний продукт OpenAI",
          "Замена OpenTelemetry"
        ],
        correct: 1,
        explanation: "OpenLLMetry — открытая референс-имплементация GenAI SemConv. Не замена OTel — расширение для GenAI-стеков. Авто-инструментация OpenAI, Anthropic, LangChain и др."
      },
      {
        question: "Почему gen_ai.input.messages по умолчанию НЕ логируются?",
        options: [
          "Это медленно",
          "Privacy: prompt и completion могут содержать PII, токены доступа, медицинские данные — opt-in через OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true",
          "Это требование GDPR",
          "Эти поля удалены из стандарта"
        ],
        correct: 1,
        explanation: "По умолчанию OTel не пишет содержимое сообщений — слишком велик риск утечки PII в общие APM-логи. Включается явно, обычно с redaction-pipeline."
      }
    ],
    sources: [
      { title: "OpenTelemetry GenAI Semantic Conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/", icon: "🔗" },
      { title: "OpenTelemetry GenAI Observability blog (2026)", url: "https://opentelemetry.io/blog/2026/genai-observability/", icon: "📄" },
      { title: "Langfuse OpenTelemetry Integration", url: "https://langfuse.com/integrations/native/opentelemetry", icon: "🔗" },
      { title: "OpenLLMetry GitHub (Traceloop)", url: "https://github.com/traceloop/openllmetry", icon: "🔗" }
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
      <p>Langfuse использует иерархическую модель данных: трейс → наблюдения (observations), которые делятся на spans, generations и events.</p>
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

response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "system", "content": prompt.prompt}],
    temperature=prompt.config.get("temperature", 0.7)
)</code></pre>

      <h4>Masking API для PII</h4>
      <p>У Langfuse встроенный <code>mask</code>-функция в SDK: до отправки трейса вызывается redaction-функция, которая может убрать PII. Бэкенд никогда не получает чувствительные данные.</p>
      <pre><code>from langfuse import Langfuse
import re

def mask_pii(data: dict) -> dict:
    text = str(data)
    text = re.sub(r'[\\w\\.-]+@[\\w\\.-]+', '[EMAIL]', text)
    text = re.sub(r'\\b\\d{16}\\b', '[CARD]', text)
    return text

lf = Langfuse(mask=mask_pii)
# Все трейсы проходят через mask_pii перед отправкой</code></pre>

      <h4>OpenTelemetry интеграция</h4>
      <p>Langfuse полностью совместим с OTel: нативный OTLP-эндпоинт (<code>/api/public/otel</code>) и маппинг атрибутов <code>gen_ai.*</code> в свою модель данных.</p>

      <h4>Дашборды и аналитика</h4>
      <ul>
        <li>Cost dashboard — расходы по моделям, пользователям, фичам</li>
        <li>Latency breakdown — TTFT, TPOT, per-model breakdown</li>
        <li>Quality scores — оценки от LLM-as-Judge и human reviewers</li>
        <li>Session view — группировка трейсов по сессиям и пользователям</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «утечка через одного пользователя»:</strong> e-commerce компания обнаружила, что 22% месячных расходов на LLM приходится на одного user_id. Cost dashboard Langfuse с группировкой по тегам показал это за 5 минут. Расследование выявило bot-сценарий: автоматизированный клиент задавал по 500 запросов в час. Без атрибуции по user_id — потеряли бы $8K/мес.
      </div>

      <h4>Ограничения</h4>
      <ul>
        <li>Требует инфраструктуры для self-hosting (PostgreSQL + ClickHouse + Redis + S3)</li>
        <li>Нет встроенных LLM-судей «из коробки» — нужно подключать внешние эвалюаторы</li>
      </ul>
    `,
    flashcards: [
      { front: "Langfuse — что это?", back: "Open-source (MIT) LLM observability платформа. Де-факто стандарт: трейсинг, промпт-менеджмент, cost analytics. Self-hosted на PostgreSQL + ClickHouse + Redis + S3." },
      { front: "Runtime prompt fetch в Langfuse", back: "Промпты хранятся в реестре Langfuse с версионированием. Приложение получает их через SDK во время выполнения — можно откатить промпт без redeploy." },
      { front: "Стек Langfuse self-hosted", back: "PostgreSQL (основная БД), ClickHouse (аналитика), Redis (кэш/очереди), S3 (хранение трейсов), Next.js (UI). Требует инфраструктуры, но даёт полный контроль." },
      { front: "Masking API в Langfuse", back: "SDK-функция mask: redaction вызывается до отправки трейса. PII (email, карты) удаляются на клиенте — бэкенд их не видит. Соответствие GDPR/HIPAA." },
      { front: "MIT-лицензия Langfuse — почему важно", back: "Можно развернуть self-hosted без ограничений: коммерческое использование, модификации, отсутствие vendor lock-in. Альтернатива закрытым SaaS (LangSmith)." },
      { front: "Cost dashboard с тегами", back: "Группировка расходов по user_id, feature_name, environment. Позволяет за 5 минут найти «дорогих» пользователей и фичи. Без тегов счёт от провайдера = чёрная дыра." },
      { front: "ClickHouse в Langfuse", back: "Зачем кроме PostgreSQL: оптимизирован для аналитики — агрегации по миллионам трейсов, cost breakdown, latency percentiles работают в секунды на больших объёмах." }
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
      },
      {
        question: "Что делает Langfuse Masking API?",
        options: [
          "Шифрует данные в S3",
          "Применяет redaction-функцию на клиенте до отправки трейса — бэкенд никогда не видит PII",
          "Скрывает дашборды от пользователей",
          "Маскирует API-ключи"
        ],
        correct: 1,
        explanation: "Masking — на стороне SDK. Email, card numbers, медицинские данные удаляются до сериализации в HTTP-payload. Бэкенд хранит уже очищенные трейсы — соответствие GDPR/HIPAA."
      },
      {
        question: "Команда обнаружила, что 22% расходов идёт на одного user_id. Как Langfuse помог это выявить?",
        options: [
          "Прислал алерт",
          "Cost dashboard с группировкой по user_id — атрибуция затрат показала аномалию за 5 минут",
          "Заблокировал пользователя",
          "Это сделал не Langfuse"
        ],
        correct: 1,
        explanation: "Атрибуция затрат по тегам (user_id, feature_name) — ключевая фича Langfuse cost dashboard. Аномалии в распределении видны мгновенно. Без атрибуции — счёт провайдера на $50K не разложишь."
      },
      {
        question: "Почему MIT-лицензия Langfuse важна для enterprise?",
        options: [
          "Бесплатно навсегда",
          "Коммерческое использование без royalties, self-hosting без ограничений, модификации разрешены — нет vendor lock-in",
          "Только из-за поддержки сообщества",
          "Лицензия не важна"
        ],
        correct: 1,
        explanation: "MIT позволяет: self-hosting в private cloud, форки, коммерческое использование. Сравните с LangSmith (closed source, SaaS-only) — нет данных on-prem, vendor lock-in."
      }
    ],
    sources: [
      { title: "Langfuse Documentation", url: "https://langfuse.com/docs", icon: "🔗" },
      { title: "Langfuse Masking API", url: "https://langfuse.com/docs/observability/features/masking", icon: "🔗" },
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

      <h4>LangGraph trajectory как USP</h4>
      <p>LangSmith — единственная платформа с native-визуализацией графов LangGraph: вершины (узлы), переходы между состояниями, retry-петли, condition branches. Это даёт debugging-преимущество, которое не воспроизводится через generic OTel.</p>

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

experiment = client.create_experiment(
    name="summarize-v3-vs-v4",
    dataset_id=dataset_id
)
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

      <div class="key-concept">
        <strong>Мини-кейс «уход с LangChain на DSPy»:</strong> продуктовая команда перешла с LangChain на DSPy для лучшей оптимизации промптов. Через неделю обнаружили: 60% ценности LangSmith потеряно — visual graph LangGraph больше не строится, evaluation pipelines требуют переписки. Переехали на Phoenix + Langfuse. Урок: оценивайте vendor lock-in заранее.
      </div>
    `,
    flashcards: [
      { front: "LangSmith — для кого?", back: "Для команд на LangChain/LangGraph. Глубочайшая интеграция: авто-трейсинг, визуализация агентов, A/B промптов. Vendor lock-in — основной минус." },
      { front: "Production → Dataset в LangSmith", back: "Конвертация production трейсов в evaluation датасеты. Нашли плохой ответ → добавили в golden dataset → regression test. Замкнутый цикл улучшения." },
      { front: "Vendor lock-in LangSmith", back: "Полный потенциал только с LangChain/LangGraph. Для LlamaIndex, DSPy или кастомных стеков — Langfuse или Phoenix будут лучше." },
      { front: "LangGraph trajectory как USP", back: "LangSmith — единственная платформа с native-визуализацией графов LangGraph: узлы, переходы, retry-петли, condition branches. Generic OTel это не даёт." },
      { front: "SaaS-only ограничение", back: "LangSmith нет в self-hosted варианте (только Enterprise plan, дорого). Данные уходят в облако LangChain — для on-prem требований не подходит." },
      { front: "Cost LangSmith vs Langfuse", back: "LangSmith: per-seat + per-trace pricing, дорого при росте. Langfuse self-hosted: только инфраструктура. На 1M traces/мес LangSmith $1500+, Langfuse — $200." },
      { front: "A/B тестирование промптов", back: "LangSmith experiments: запуск двух версий промпта на одном датасете, side-by-side сравнение accuracy/latency/tokens. Встроено в платформу." }
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
      },
      {
        question: "Команда перешла с LangChain на DSPy. Что произойдёт с их LangSmith-инвестицией?",
        options: [
          "Ничего, всё продолжит работать",
          "Большая часть ценности теряется — native-визуализация графов перестаёт работать, evaluation pipelines требуют переписки",
          "DSPy не работает с observability",
          "LangSmith автоматически портирует трейсы"
        ],
        correct: 1,
        explanation: "Vendor lock-in: LangSmith built на LangChain primitives. DSPy/LlamaIndex/кастомные стеки получают только базовый трейсинг без визуализации графов и framework-aware фич."
      },
      {
        question: "Что делает LangGraph trajectory визуализацию уникальной для LangSmith?",
        options: [
          "Использует D3.js",
          "Native-понимание узлов, переходов, retry-петель и condition branches графа — нельзя воспроизвести через generic OTel-span tree",
          "Поддерживает 3D",
          "Работает на GPU"
        ],
        correct: 1,
        explanation: "Trajectory = граф состояний агента. LangSmith понимает семантику LangGraph (узлы, переходы) и рисует это как граф. OTel видит только spans без знания о структуре графа."
      },
      {
        question: "Почему LangSmith дороже Langfuse в long run?",
        options: [
          "LangSmith лучше",
          "Per-seat + per-trace SaaS pricing — на 1M traces/мес стоит $1500+, тогда как Langfuse self-hosted = только инфраструктура",
          "Langfuse менее надёжен",
          "Это рыночная случайность"
        ],
        correct: 1,
        explanation: "LangSmith SaaS-only с per-trace pricing. На больших объёмах счёт растёт линейно. Langfuse self-hosted: фиксированные инфра-расходы независимо от объёма трейсов."
      }
    ],
    sources: [
      { title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/", icon: "🔗" },
      { title: "LLM Observability Tools Comparison (Comet, 2025)", url: "https://www.comet.com/site/blog/llm-observability-tools/", icon: "📄" },
      { title: "Agent Observability — LangChain", url: "https://www.langchain.com/articles/agent-observability", icon: "📄" }
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
qa_eval = QAEvaluator(model)</code></pre>

      <h4>OpenTelemetry native</h4>
      <p>Phoenix полностью построен вокруг OTel. Любой OTel-совместимый трейс (из LangChain, LlamaIndex, кастомного кода) автоматически визуализируется. Нет vendor lock-in.</p>

      <h4>Embeddings Analysis — уникальная фича</h4>
      <p>Phoenix визуализирует embeddings в 2D/3D пространстве (UMAP/t-SNE). Помогает обнаруживать кластеры, outliers и coverage gaps в retrieval. Эту фичу не дают Langfuse, LangSmith или Helicone.</p>

      <h4>Когда использовать Phoenix vs другие</h4>
      <ul>
        <li><strong>Phoenix:</strong> локальная отладка RAG, embeddings analysis, dev-цикл</li>
        <li><strong>Helicone:</strong> proxy-based logging, минимальная инструментация — wrap base_url</li>
        <li><strong>W&amp;B Weave:</strong> для команд, уже использующих Weights &amp; Biases для ML</li>
        <li><strong>Braintrust:</strong> eval-first платформа с regression harness</li>
        <li><strong>Galileo / Laminar:</strong> payload-pricing, дороже но enterprise-grade</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «debug RAG retrieval за 10 минут»:</strong> команда RAG-чатбота получала жалобы «модель путает наши продукты». Phoenix embeddings UMAP показал: продуктовые описания кластеризовались в одну точку (синонимичные тексты), retrieval возвращал случайные chunks. Решение — добавить product_id в metadata фильтр. Без визуализации embeddings обнаружить такую проблему — недели работы.
      </div>
    `,
    flashcards: [
      { front: "Phoenix — ключевая фича", back: "Developer-first: 2 команды для запуска, UI на localhost:6006. OpenTelemetry native. Идеален для локальной отладки RAG без Docker/ClickHouse." },
      { front: "RAG-метрики в Phoenix", back: "QA Correctness (правильность ответа), Context Relevance (релевантность chunks), Hallucination Detection (выдуманные факты). Все на LLM-as-Judge." },
      { front: "Embeddings Analysis в Phoenix", back: "Визуализация embeddings в 2D/3D (UMAP/t-SNE). Обнаружение кластеров, outliers, coverage gaps. Уникальная фича, которой нет в Langfuse/LangSmith." },
      { front: "Helicone vs Phoenix", back: "Helicone — proxy-based: меняешь base_url, не нужна инструментация. Минимально-инвазивно. Phoenix — code-based: больше инсайтов, но требует SDK." },
      { front: "Braintrust vs Phoenix", back: "Braintrust — eval-first с regression harness и CI-интеграцией. Phoenix — больше про observability + embeddings. Дополняют друг друга." },
      { front: "W&B Weave — когда выбирать", back: "Если команда уже использует Weights & Biases для ML-экспериментов. Weave добавляет LLM observability к привычным W&B-дашбордам." },
      { front: "Phoenix OTel-совместимость", back: "Любой OTel-совместимый трейс (LangChain, LlamaIndex, OpenLLMetry, custom) автоматически визуализируется без адаптеров. Vendor-agnostic." }
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
        explanation: "Phoenix визуализирует embeddings через UMAP/t-SNE — можно увидеть, как документы кластеризуются, найти outliers и gaps в coverage retrieval."
      },
      {
        question: "Чем Helicone принципиально отличается от Phoenix?",
        options: [
          "Helicone бесплатный",
          "Helicone — proxy-based: меняешь base_url, без SDK. Phoenix — code-based instrumentation",
          "Helicone только для OpenAI",
          "Helicone не поддерживает streaming"
        ],
        correct: 1,
        explanation: "Helicone работает как прокси перед LLM API. Меняешь base_url — все запросы логируются. Минимально-инвазивно, но меньше контроля над span-структурой."
      },
      {
        question: "Команда уже использует Weights & Biases для ML. Какой LLM-observability выбрать?",
        options: [
          "Langfuse — он лучше",
          "W&B Weave — интегрируется с существующими W&B-дашбордами и отчётами",
          "LangSmith",
          "Только Phoenix"
        ],
        correct: 1,
        explanation: "W&B Weave добавляет LLM observability к привычной для команды среде W&B. Не нужно учить новый UI и переносить eval-workflow."
      },
      {
        question: "RAG-чатбот «путает продукты» по жалобам пользователей. Как Phoenix помогает диагностировать?",
        options: [
          "Phoenix автоматически чинит retrieval",
          "Embeddings UMAP-визуализация показывает кластеры — если продукты в одной точке, retrieval возвращает случайные chunks; решение через metadata-фильтр",
          "Phoenix отправляет алерт",
          "Phoenix меняет модель"
        ],
        correct: 1,
        explanation: "Embeddings visualization — топовый инструмент для retrieval debugging. Кластеризация в одну точку = синонимичные тексты = retrieval не различает. Видно за 10 минут."
      }
    ],
    sources: [
      { title: "Arize Phoenix Documentation", url: "https://docs.arize.com/phoenix", icon: "🔗" },
      { title: "Best Hallucination Detection Tools (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/best-hallucination-detection-tools-2026", icon: "📄" },
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

      <div class="key-concept">
        <strong>Мини-кейс «model upgrade сломал JSON parsing»:</strong> команда обновила GPT-4o-2024-08-06 → GPT-4o-2026-01. Внезапно 38% production agent failures = malformed JSON в tool-calls. Анализ показал: новая версия чаще обрамляет JSON в markdown-блоки. Регресс не пойман CI потому что golden dataset не покрывал tool-use сценарии. Урок: golden dataset должен быть репрезентативным к production-распределению.
      </div>
    `,
    flashcards: [
      { front: "Faithfulness Check для RAG", back: "Проверяет: следует ли ответ извлечённому контексту? Если модель ссылается на факты, которых нет в chunks — галлюцинация. Инструменты: RAGAS, Phoenix, Braintrust." },
      { front: "Семантический дрейф", back: "Постепенное изменение: input drift (новые типы вопросов), output drift (изменение стиля/длины), quality drift (снижение faithfulness/relevance). Обнаруживается через мониторинг распределений." },
      { front: "Композитный observability стек", back: "OTel (instrumentation) + Langfuse (production) + Phoenix (dev) + RAGAS (evaluation) + CI/CD regression gate. Каждый инструмент для своей задачи." },
      { front: "Online LLM-as-judge", back: "Sampling части продакшн-трафика → judge-модель оценивает по рубрике. Дрейф/деградация ловится в реальном времени. Рубрику нужно периодически валидировать против human-разметки." },
      { front: "Golden dataset должен быть репрезентативным", back: "Не пишите golden dataset «из головы». Сэмплируйте production-трейсы по стратам (пользовательские роли, типы запросов). Иначе CI пройдёт, а production упадёт на untested сценариях." },
      { front: "Alerting только на latency — антипаттерн", back: "Galочка проходит на latency-нормe, но качество деградировало (модель отвечает короче, faithfulness ниже). Нужны quality-алерты: drift в распределении длины ответа, faithfulness score." },
      { front: "Regression gate в CI", back: "На каждый PR: golden dataset → eval → сравнение с baseline. > 5% ухудшений = блок PR. SDD-эквивалент code coverage для LLM-приложений." }
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
      },
      {
        question: "Команда обновила модель — внезапно 38% agent failures на parsing JSON. Почему CI это не поймал?",
        options: [
          "CI отключили",
          "Golden dataset не покрывал tool-use сценарии — был нерепрезентативен production-распределению",
          "Модель сломалась случайно",
          "JSON parsing не относится к LLM"
        ],
        correct: 1,
        explanation: "Главный урок: golden dataset должен сэмплироваться из production-трафика по стратам. Если в golden нет tool-use — регресс ловится только в проде."
      },
      {
        question: "Что такое online LLM-as-judge?",
        options: [
          "Платный сервис",
          "Sampling production-трафика → judge-модель оценивает по рубрике — позволяет ловить дрейф качества в реальном времени",
          "Это устаревшая техника",
          "Используется только в dev"
        ],
        correct: 1,
        explanation: "Offline eval не ловит дрейф (новые типы запросов, изменение upstream-модели). Online judge на 1-5% sampling трафика — постоянный мониторинг качества."
      },
      {
        question: "Почему alerting только на latency — антипаттерн?",
        options: [
          "Latency не важна",
          "Качество может деградировать без изменения latency (короче ответы, ниже faithfulness) — нужны quality-алерты в дополнение",
          "Latency-алерты дают false positives",
          "Это правильный паттерн"
        ],
        correct: 1,
        explanation: "Silent quality degradation: latency норма, но faithfulness упал на 20% после смены модели. Нужны drift-алерты на распределение длины ответа и quality scores."
      }
    ],
    sources: [
      { title: "LLM Monitoring & Drift Detection Guide (Leanware, 2026)", url: "https://www.leanware.co/insights/llm-monitoring-drift-detection-guide", icon: "📄" },
      { title: "Best Hallucination Detection Tools (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/best-hallucination-detection-tools-2026", icon: "📄" },
      { title: "LLM Hallucinations in Production (Maxim AI)", url: "https://www.getmaxim.ai/articles/llm-hallucinations-in-production-monitoring-strategies-that-actually-work", icon: "📄" },
      { title: "The Agent That Burned $4,200 in 63 Hours (Medium)", url: "https://medium.com/@sattyamjain96/the-agent-that-burned-4200-in-63-hours", icon: "📄" }
    ]
  },
  {
    id: 8,
    title: "OpenTelemetry GenAI Semantic Conventions",
    goal: "Глубоко изучить стандарт OTel GenAI SemConv — базис всей современной LLM observability.",
    objectives: [
      "Знать обязательные и опциональные атрибуты gen_ai.*",
      "Понимать agent и framework spans в OTel 1.37+",
      "Сравнивать референс-имплементации (OpenLLMetry, нативные SDK)"
    ],
    content: `
      <h4>Зачем стандарт</h4>
      <p>До 2024 года каждая observability-платформа изобретала свои атрибуты: <code>langfuse.input</code>, <code>helicone-prompt</code>, <code>arize.tokens.input</code>. Это создавало vendor lock-in: смена платформы = переписывание инструментации. OpenTelemetry GenAI SemConv решает это — единый словарь атрибутов, понятный всем платформам.</p>

      <div class="key-concept">
        <strong>OTel GenAI SemConv статус 2026:</strong> Status: Development (не Stable), но уже принят Datadog, Phoenix, Langfuse, Helicone, Traceloop. К версии OTel 1.37 покрывает: LLM calls, embeddings, framework spans (LangChain, LlamaIndex), agent spans, multi-modal (image/audio inputs).
      </div>

      <h4>Обязательные атрибуты для LLM Span</h4>
      <ul>
        <li><code>gen_ai.request.model</code> — модель в запросе (gpt-4o, claude-sonnet-4)</li>
        <li><code>gen_ai.system</code> — провайдер (openai, anthropic, aws.bedrock, az.ai.openai)</li>
        <li><code>gen_ai.operation.name</code> — chat / text_completion / embeddings / generate_content</li>
      </ul>

      <h4>Рекомендуемые атрибуты</h4>
      <ul>
        <li><code>gen_ai.usage.input_tokens</code> / <code>gen_ai.usage.output_tokens</code></li>
        <li><code>gen_ai.response.id</code> — ID ответа провайдера</li>
        <li><code>gen_ai.response.model</code> — фактически использованная модель</li>
        <li><code>gen_ai.response.finish_reasons</code> — массив (stop, length, content_filter, tool_calls)</li>
        <li><code>gen_ai.request.temperature</code>, <code>gen_ai.request.top_p</code>, <code>gen_ai.request.max_tokens</code></li>
      </ul>

      <h4>Opt-in атрибуты — content capture</h4>
      <p>По умолчанию НЕ записываются (privacy):</p>
      <ul>
        <li><code>gen_ai.input.messages</code> — массив сообщений на вход</li>
        <li><code>gen_ai.output.messages</code> — массив сообщений на выход</li>
        <li><code>gen_ai.system_instructions</code> — system prompt</li>
      </ul>
      <p>Включаются переменной <code>OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true</code> или через masking-pipeline в Collector.</p>

      <h4>Agent spans (OTel 1.37+)</h4>
      <pre><code>gen_ai.agent.id          # UUID агента в системе
gen_ai.agent.name        # human-readable имя
gen_ai.agent.description # описание роли
gen_ai.tool.name         # имя вызванного инструмента
gen_ai.tool.call.id      # ID вызова tool-use
gen_ai.tool.description  # описание инструмента
gen_ai.conversation.id   # ID многошаговой сессии</code></pre>

      <h4>Framework spans</h4>
      <p>Для LangChain, LlamaIndex, Pydantic AI, OpenAI Agents SDK добавлены framework-specific атрибуты: <code>gen_ai.framework.name</code>, <code>gen_ai.framework.version</code>, <code>gen_ai.framework.run.id</code>. Это позволяет фильтровать трейсы по framework и видеть его-специфичную семантику (LangGraph nodes, LlamaIndex query engine steps).</p>

      <h4>Референс-имплементации</h4>
      <ul>
        <li><strong>OpenLLMetry</strong> (Traceloop, Apache 2.0) — 30+ библиотек, эталонная имплементация</li>
        <li><strong>OpenInference</strong> (Arize Phoenix, Apache 2.0) — близко к SemConv с дополнениями для retrieval-spans</li>
        <li><strong>Nativно в SDK провайдеров:</strong> OpenAI Python SDK с 1.50+ имеет встроенную OTel-инструментацию</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «выбор имплементации»:</strong> команда RAG-стартапа сравнила OpenLLMetry vs OpenInference. Выбрали OpenInference — лучшие abstractions для retrieval (отдельный span-kind для vector search, явный contextChunks attribute). Через 8 месяцев решили мигрировать на Langfuse — миграция заняла полдня, потому что обе имплементации экспортируют через стандартный OTLP.
      </div>
    `,
    flashcards: [
      { front: "Зачем OTel GenAI SemConv", back: "Единый словарь атрибутов вместо vendor-specific (langfuse.input, helicone-prompt). Смена платформы = смена endpoint, не переписывание инструментации." },
      { front: "Статус OTel GenAI SemConv 2026", back: "Development (не Stable), но уже принят Datadog, Phoenix, Langfuse, Helicone, Traceloop. Покрывает LLM calls, embeddings, agents, frameworks, multi-modal." },
      { front: "Обязательные атрибуты LLM span", back: "gen_ai.request.model, gen_ai.system (провайдер), gen_ai.operation.name (chat/embeddings/etc). Без них не валидный GenAI span." },
      { front: "finish_reasons — почему массив", back: "Модель может завершить по нескольким причинам одновременно (stop + content_filter). Массив отражает это. Атрибут критичен для алертинга на content_filter (compliance issues)." },
      { front: "Agent spans в OTel 1.37+", back: "gen_ai.agent.id/name/description, gen_ai.tool.name/call.id, gen_ai.conversation.id. Стандартизуют то, что раньше делали AgentOps/LangSmith vendor-specific." },
      { front: "Framework spans", back: "gen_ai.framework.name/version для LangChain/LlamaIndex/Pydantic AI. Позволяет фильтровать трейсы по framework и видеть его-специфичную семантику." },
      { front: "OpenLLMetry vs OpenInference", back: "OpenLLMetry (Traceloop, 30+ либ) — широкое покрытие. OpenInference (Phoenix) — лучше abstractions для RAG retrieval. Обе экспортируют через стандартный OTLP." },
      { front: "Native OTel в OpenAI SDK", back: "OpenAI Python SDK с 1.50+ имеет встроенную OTel-инструментацию — не нужны сторонние авто-инструменты для базовых сценариев. Anthropic SDK добавил аналог в начале 2026." }
    ],
    quiz: [
      {
        question: "Что НЕ входит в обязательные атрибуты LLM span по OTel GenAI SemConv?",
        options: [
          "gen_ai.request.model",
          "gen_ai.system",
          "gen_ai.operation.name",
          "gen_ai.user.email"
        ],
        correct: 3,
        explanation: "user.email — кастомный атрибут, не входит в стандарт. Обязательные: model, system, operation.name. Остальное (tokens, finish_reasons) — рекомендуемое."
      },
      {
        question: "Почему gen_ai.input.messages по умолчанию НЕ записываются?",
        options: [
          "Это медленно",
          "Privacy-риск: prompt и completion могут содержать PII — opt-in через OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true",
          "Этих атрибутов нет в стандарте",
          "Это нарушение GDPR в любом случае"
        ],
        correct: 1,
        explanation: "По умолчанию выключено: общие APM-логи не должны содержать PII случайно. Включается явно, обычно вместе с masking-pipeline для очистки."
      },
      {
        question: "Что нового даёт OTel 1.37+ по сравнению с 1.30?",
        options: [
          "Только bug fixes",
          "Agent spans (gen_ai.agent.*) и framework spans — стандартизированный observability для агентов и фреймворков",
          "Поддержку GPU-метрик",
          "Удалили message content"
        ],
        correct: 1,
        explanation: "В 1.37+ покрыты агентные системы и framework-spans. До этого agent-observability был vendor-specific (AgentOps, LangSmith). Теперь — общий стандарт."
      },
      {
        question: "В чём разница между OpenLLMetry и OpenInference?",
        options: [
          "Это одно и то же",
          "OpenLLMetry (Traceloop, 30+ библиотек, широкое покрытие) vs OpenInference (Phoenix, лучшие RAG-abstractions)",
          "OpenInference дороже",
          "OpenLLMetry устарел"
        ],
        correct: 1,
        explanation: "Обе — Apache 2.0 имплементации OTel GenAI SemConv. OpenLLMetry — на больший набор библиотек. OpenInference — глубже для retrieval-сценариев (vector search spans)."
      },
      {
        question: "Зачем нужен gen_ai.conversation.id в agent spans?",
        options: [
          "Для безопасности",
          "Группировка multi-turn сессий: одна conversation_id связывает несколько связанных LLM-вызовов в логической сессии",
          "Для биллинга",
          "Это deprecated"
        ],
        correct: 1,
        explanation: "Для агентов и чатов важна агрегация по сессии (resolution rate, session length, conversation cost). conversation.id связывает все trace-ы одной логической сессии."
      }
    ],
    sources: [
      { title: "OpenTelemetry GenAI Semantic Conventions spec", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/", icon: "🔗" },
      { title: "OpenTelemetry GenAI Observability blog 2026", url: "https://opentelemetry.io/blog/2026/genai-observability/", icon: "📄" },
      { title: "Datadog LLM OTel Semantic Convention support", url: "https://www.datadoghq.com/blog/llm-otel-semantic-convention/", icon: "📄" },
      { title: "OpenLLMetry GitHub (Traceloop)", url: "https://github.com/traceloop/openllmetry", icon: "🔗" }
    ]
  },
  {
    id: 9,
    title: "Agent Observability и trajectory traces",
    goal: "Освоить специфику observability для агентных систем: session-level метрики, trajectory-визуализация, multi-framework debugging.",
    objectives: [
      "Различать request-level и session-level метрики",
      "Сохранять prompt/context snapshots для воспроизводимого debugging",
      "Использовать AgentOps для multi-framework debugging",
      "Понимать ключевые agent eval-метрики (resolution rate, goal completion)"
    ],
    content: `
      <h4>Чем агенты отличаются от обычных LLM-приложений</h4>
      <p>Single LLM call: один запрос — один ответ — одна метрика качества. Agent: один пользовательский запрос → 5-20 LLM вызовов → 3-10 tool-calls → 2-5 memory read/write. Метрики качества смещаются с request-level на session-level.</p>

      <div class="key-concept">
        <strong>Ключевые agent-метрики:</strong>
        <br>• <strong>Resolution rate</strong> — % сессий, в которых агент достиг цели пользователя
        <br>• <strong>Escalation rate</strong> — % сессий, переданных человеку
        <br>• <strong>Goal completion</strong> — для task-агентов: реализовано ли намерение
        <br>• <strong>Loop detection</strong> — % сессий с обнаруженным циклом tool-use
        <br>• <strong>Trajectory length</strong> — медиана шагов до решения
      </div>

      <h4>Trajectory traces</h4>
      <p>Trajectory — путь агента от пользовательского запроса до ответа: последовательность узлов (LLM call, tool call, memory access) и переходов. Визуализируется как граф состояний с временной осью.</p>

      <pre><code>User: "Сделай PR с фиксом auth-бага"
↓
Agent reasoning: «надо найти баг»
↓
Tool: search_code(query="auth")  → 12 файлов
↓
Agent reasoning: «надо прочитать ключевые»
↓
Tool: read_file(path="auth.py")  → 200 строк
↓
Agent reasoning: «нашёл — race condition в session refresh»
↓
Tool: write_file(path="auth.py", content="...")
↓
Tool: run_tests()  → PASS
↓
Tool: create_pr(title="Fix auth race")
↓
Response: «PR #42 создан»</code></pre>

      <h4>Prompt/context snapshots</h4>
      <p>Trajectory отвечает на вопрос «какие шаги были выполнены». Для воспроизведения нужен ещё один слой: какой именно prompt, system-инструкции, tool-схемы и накопленный контекст увидела модель на конкретном шаге. Без такого snapshot команда часто спорит о поведении агента по памяти, а не по факту.</p>

      <pre><code>{
  "trace_id": "trc-2026-05-29-0042",
  "span": "llm.plan_next_action",
  "model": "qwen-coder",
  "system_prompt_hash": "sha256:8b1c...",
  "tool_schema_names": ["search_code", "read_file", "run_tests"],
  "context_token_count": 18342,
  "prompt_excerpt": "Найди auth-баг и предложи минимальный фикс",
  "redaction": "pii-and-secrets-applied"
}</code></pre>

      <p>Сохраняйте snapshot как диагностический артефакт, а не как полный дамп всего подряд: секреты и PII должны редактироваться, большие tool-ответы — ссылаться на отдельный артефакт, а стабильные системные промпты — храниться по hash/version. Тогда один trace можно воспроизвести локально и сравнить после смены модели или tool-схемы.</p>

      <h4>Native-адаптеры в фреймворках</h4>
      <ul>
        <li><strong>LangGraph</strong> — нативный trace в LangSmith с визуализацией узлов и переходов</li>
        <li><strong>OpenAI Agents SDK</strong> — встроенный tracing с экспортом в OTel</li>
        <li><strong>CrewAI</strong> — adapter для AgentOps, Langfuse, Phoenix</li>
        <li><strong>Pydantic AI</strong> — OTel-инструментация из коробки</li>
        <li><strong>Mastra (TS)</strong> — встроенный observability с OTLP-экспортом</li>
      </ul>

      <h4>AgentOps — multi-framework debugging</h4>
      <p>AgentOps — observability-платформа, специализированная на агентах. Главное преимущество: native-поддержка 20+ фреймворков (LangChain, CrewAI, AutoGen, LlamaIndex, Swarm, OpenAI Agents). Единая визуализация trajectory вне зависимости от стека.</p>

      <h4>Что мониторить кроме обычных метрик</h4>
      <ul>
        <li><strong>Tool selection accuracy</strong> — выбрал ли агент правильный инструмент</li>
        <li><strong>Tool argument validity</strong> — корректность переданных аргументов (38% prod failures = malformed JSON)</li>
        <li><strong>Memory hit rate</strong> — % сессий, использующих long-term memory</li>
        <li><strong>State transitions</strong> — для state-machine агентов: легитимные ли переходы</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «loop detection saved $12K»:</strong> support-агент после обновления модели начал зацикливаться: вызов tool «get_user_history» → response парсился как «no data» → агент повторял с уточнённым запросом. AgentOps loop detection поймал паттерн «повтор tool-call с похожими аргументами 5+ раз в сессии» за первые 200 пользователей. Hot-fix через 30 минут, сэкономлено $12K в недельных расходах.
      </div>
    `,
    flashcards: [
      { front: "Request-level vs session-level метрики", back: "Request: latency, tokens, faithfulness одного вызова. Session: resolution rate, goal completion, trajectory length всей сессии агента. Для агентов session-метрики важнее." },
      { front: "Resolution rate", back: "% сессий, в которых агент достиг цели пользователя. Главная метрика качества агента. Меряется через goal-checker (rule-based или LLM-judge)." },
      { front: "Trajectory trace", back: "Путь агента от запроса до ответа: последовательность LLM-call, tool-call, memory access. Визуализируется как граф с временной осью. Основа debugging агентов." },
      { front: "Prompt/context snapshot", back: "Снимок того, что реально увидела модель: prompt excerpt, system_prompt_hash, tool_schema_names, context_token_count, model и trace_id. Нужен для воспроизведения багов." },
      { front: "AgentOps — главное преимущество", back: "Native-поддержка 20+ фреймворков (LangChain, CrewAI, AutoGen, OpenAI Agents). Unified trajectory view независимо от стека. Сильнейший в multi-framework debugging." },
      { front: "Loop detection", back: "Паттерн «повтор tool-call с похожими аргументами 5+ раз в сессии». Один из главных agent-антипаттернов: бесконечный цикл, который жжёт деньги. Алерт обязателен." },
      { front: "Tool argument validity", back: "Корректность переданных в tool аргументов. Главная причина 38% production agent failures — malformed JSON. Метрика первой линии." },
      { front: "Native vs OTel-агентная инструментация", back: "Native (LangSmith для LangGraph) — лучшая визуализация семантики фреймворка. OTel — vendor-agnostic, но потеря части framework-знаний. Trade-off lock-in vs portability." },
      { front: "State transitions для агентов", back: "Для state-machine агентов: были ли переходы между состояниями легитимными? Например: «agent не должен переходить из confirmed → cancelled без user-confirmation»." }
    ],
    quiz: [
      {
        question: "Главная разница в observability single-LLM vs agent:",
        options: [
          "Агенты используют больше токенов",
          "Метрики качества смещаются с request-level на session-level: resolution rate, goal completion, trajectory length",
          "Агенты медленнее",
          "Агенты не нужно мониторить"
        ],
        correct: 1,
        explanation: "Один agent-запрос = 5-20 LLM-вызовов. Качество одного вызова не отражает success. Считаем session-метрики: достиг ли агент цели в итоге."
      },
      {
        question: "Что такое loop detection в agent observability?",
        options: [
          "Поиск багов в коде",
          "Обнаружение паттерна «повтор tool-call с похожими аргументами 5+ раз» — частая причина выгорания бюджета",
          "Цикл for в Python",
          "Это устаревшее"
        ],
        correct: 1,
        explanation: "Loop: агент зациклился на повторяющемся вызове инструмента. Без detection — сжигает деньги (см. кейс $12K за неделю). AgentOps и LangSmith имеют встроенные детекторы."
      },
      {
        question: "Что должен содержать prompt/context snapshot для agent debugging?",
        options: [
          "Только финальный ответ пользователю",
          "trace_id, модель, hash системного промпта, доступные tool-схемы, размер контекста и безопасный excerpt промпта",
          "Только HTTP status code",
          "Полный дамп всех секретов окружения"
        ],
        correct: 1,
        explanation: "Snapshot фиксирует фактический вход модели без опасного полного дампа. Hash/version системного промпта, tool-схемы и context_token_count позволяют воспроизвести конкретный шаг trajectory."
      },
      {
        question: "Команда использует 3 фреймворка (LangChain, CrewAI, custom). Какой observability выбрать?",
        options: [
          "LangSmith — он лучший",
          "AgentOps — native-поддержка 20+ фреймворков, unified trajectory view",
          "Только Langfuse",
          "По одному для каждого"
        ],
        correct: 1,
        explanation: "AgentOps создан для multi-framework сценариев. Unified UI для трейсов с разных стеков. LangSmith лучше для pure-LangChain, для гетерогенного стека — AgentOps."
      },
      {
        question: "Какая метрика первой покажет, что агент после деплоя стал хуже?",
        options: [
          "Latency",
          "Resolution rate — % сессий, в которых агент достиг цели",
          "Cost",
          "Token usage"
        ],
        correct: 1,
        explanation: "Latency и cost могут быть в норме, но агент перестал решать задачи (циклы, неверные tool-calls). Resolution rate — главная KPI агента."
      },
      {
        question: "Зачем нужна tool argument validity metric?",
        options: [
          "Для security",
          "38% production agent failures = malformed JSON в tool-call аргументах. Метрика первой линии диагностики",
          "Для performance",
          "Это устаревшее"
        ],
        correct: 1,
        explanation: "Самая частая причина agent-failures — модель генерирует невалидный JSON для tool-args. Метрика «% tool-calls с валидным parsing» — первая линия алертов."
      }
    ],
    sources: [
      { title: "Agent Observability Complete Guide (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/agent-observability-complete-guide-2026", icon: "📄" },
      { title: "Agent Observability — LangChain Articles", url: "https://www.langchain.com/articles/agent-observability", icon: "📄" },
      { title: "AgentOps Documentation", url: "https://docs.agentops.ai/", icon: "🔗" },
      { title: "OpenAI Agents SDK Tracing", url: "https://github.com/openai/openai-agents-python", icon: "🔗" }
    ]
  },
  {
    id: 10,
    title: "Latency budgets и prompt caching observability",
    goal: "Освоить продвинутые техники мониторинга latency и кэширования промптов.",
    objectives: [
      "Различать TTFT, ITL, throughput и хвосты распределения",
      "Настраивать SLO с latency budgets",
      "Мониторить hit rate prompt caching"
    ],
    content: `
      <h4>Latency budget — что это</h4>
      <p>Latency budget = SLO на воспринимаемое время ответа. Разбивается на компоненты для каждого участка пайплайна:</p>
      <pre><code>User request → API gateway: 20 мс
API gateway → LLM proxy:    10 мс
LLM proxy → OpenAI:         30 мс
OpenAI TTFT:                250 мс
First token → User:         15 мс
─────────────────────────────────
Total TTFT budget:          325 мс (таргет <500 мс)

OpenAI ITL × 500 tokens:    500 × 80 мс = 40 c
TTFT until done:            ~40.3 c
SLO: 95% сессий <50 c</code></pre>

      <h4>Tail latency vs средние</h4>
      <div class="key-concept">
        <strong>P99 ловит то, что среднее скрывает:</strong> KV-cache evictions при росте concurrent-users, batching interference (когда твой запрос ждёт в очереди), GC pauses в self-hosted serving, rate-limit throttling провайдером. Средняя latency может быть отлично, P99 — катастрофа.
      </div>

      <h4>Prompt caching: экономика</h4>
      <ul>
        <li><strong>Anthropic:</strong> явный <code>cache_control</code> на блок промпта. Чтение = 10% цены входа. Запись = 125%. 5-минутный TTL.</li>
        <li><strong>OpenAI:</strong> автоматическое кэширование от 1024 токенов. Чтение = 50% цены входа. Запись = 100%. ~5 минут idle TTL.</li>
        <li><strong>Google Gemini:</strong> explicit context caching через <code>CachedContent</code> API. Цена = 25% обычного входа за хранение/час + чтение.</li>
      </ul>

      <h4>Hit rate observability</h4>
      <pre><code>cache_hit_rate = cache_read_tokens / (cache_read_tokens + input_tokens)

Целевой диапазон: 80-95%
< 50% — breakpoint размещён неверно
> 95% — почти всё повторяется (может быть проблема с разнообразием)
0% — кэш вообще не работает (TTL истёк, breakpoint после изменений)</code></pre>

      <h4>Где размещать breakpoint в Anthropic</h4>
      <p>Стандартный паттерн: <code>system instructions → cached → большой context (документы, RAG-chunks) → cached → история диалога → user message</code>. Breakpoint после большого статичного контекста. Изменчивые части после breakpoint не ломают кэш.</p>

      <h4>SLO Dashboards: что показывать</h4>
      <ul>
        <li>P50/P95/P99 TTFT за период (с burn-rate alerting)</li>
        <li>P50/P95 ITL — распределение скорости стрима</li>
        <li>Cache hit rate с разбивкой по моделям и фичам</li>
        <li>Cost per request с разбивкой cached vs uncached</li>
        <li>Error budget остаток за SLO-период</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «cache hit rate упал с 90% до 12%»:</strong> команда подняла версию системного промпта (добавили дату в начало). Это сместило весь stable-префикс — breakpoint оказался после изменённой части. Hit rate обвалился, расходы выросли в 4 раза. Дашборд с trend по cache hit rate показал проблему за час, не за биллинг-период. Решение: вынесли дату в user message (после breakpoint).
      </div>
    `,
    flashcards: [
      { front: "Latency budget", back: "SLO на воспринимаемое время ответа, разбитое на компоненты пайплайна (gateway → proxy → provider → first token). Позволяет точно понимать, где «утекает» время." },
      { front: "Почему P99 важнее средней", back: "P99 ловит KV-cache evictions, batching interference, GC pauses, rate-limit throttling. Средняя их скрывает. Алерт на P99 — обязателен." },
      { front: "Anthropic cache pricing", back: "Cache read = 10% цены входа. Cache write = 125%. TTL ~5 минут. Явный cache_control на блок промпта. ROI: 75% экономии при стабильном префиксе." },
      { front: "OpenAI cache pricing", back: "Автоматическое кэширование от 1024 токенов. Cache read = 50% цены входа (хуже Anthropic). Без явного контроля — кэш «случается» при стабильном префиксе." },
      { front: "Cache hit rate целевой диапазон", back: "80-95%. <50% — breakpoint размещён неверно. 0% — кэш не работает (TTL истёк или изменения попадают в кэшируемую часть)." },
      { front: "Где размещать Anthropic breakpoint", back: "После большого статичного контекста: system → cached → docs → cached → history → user. Изменчивые части ПОСЛЕ breakpoint не ломают кэш." },
      { front: "Cost per request — разбивка", back: "Cached vs uncached токены имеют разную цену. Без разбивки cost-dashboard вводит в заблуждение. Считать $$ отдельно для cache_read, cache_write, normal input." },
      { front: "Burn-rate alerting", back: "SRE-практика: алерт не на абсолютную метрику, а на скорость «выгорания» error budget. Применимо к LLM SLO: P99 latency burn rate × error budget remaining." }
    ],
    quiz: [
      {
        question: "TTFT в проде вырос с 300 мс до 800 мс. Среднее в порядке, P50 не изменился. Что искать?",
        options: [
          "Ничего не нужно делать",
          "Tail latency: P95/P99 — возможно KV-cache evictions, batching interference или rate-limit throttling провайдером",
          "Сменить модель",
          "Это нормально"
        ],
        correct: 1,
        explanation: "Если среднее и P50 в норме — рост идёт в хвостах распределения. Это типичный сценарий cache eviction или batching interference. Алертить нужно на P95/P99."
      },
      {
        question: "Cache hit rate в Anthropic упал с 90% до 12% после изменения промпта. Что произошло?",
        options: [
          "Anthropic сломал API",
          "Breakpoint оказался после изменённой части — стабильный префикс изменился, кэш промахивается каждый раз",
          "Это нормальное поведение",
          "Cache TTL истёк"
        ],
        correct: 1,
        explanation: "Anthropic cache работает по точному совпадению префикса. Если изменение попадает в кэшируемую часть — кэш недействителен. Решение: вынести изменчивые части ПОСЛЕ breakpoint."
      },
      {
        question: "Чем OpenAI prompt caching отличается от Anthropic?",
        options: [
          "Это одно и то же",
          "OpenAI: автоматически от 1024 токенов, cache read = 50%. Anthropic: explicit cache_control, cache read = 10%",
          "Только Anthropic поддерживает кэш",
          "OpenAI дешевле"
        ],
        correct: 1,
        explanation: "Anthropic даёт больший контроль (явный cache_control) и сильнее скидку (10% vs 50%). OpenAI — автоматически, но меньше скидка."
      },
      {
        question: "Какой целевой диапазон cache hit rate?",
        options: [
          "10-20%",
          "80-95% — выше может означать недостаточное разнообразие; ниже — неверное размещение breakpoint",
          "100%",
          "Любой"
        ],
        correct: 1,
        explanation: "80-95% — sweet spot. <50% сигнализирует о проблеме с архитектурой промпта. >95% может означать, что нет вариативности (мало уникальных user inputs)."
      },
      {
        question: "Что такое burn-rate alerting в контексте SLO?",
        options: [
          "Алерт на температуру серверов",
          "Алерт не на абсолютную метрику, а на скорость «выгорания» error budget — позволяет реагировать раньше",
          "Алерт на стоимость",
          "Устаревшая практика"
        ],
        correct: 1,
        explanation: "Burn rate = (текущая ошибка) / (допустимая ошибка по SLO). Высокий burn rate за короткое время = критично. Применимо к LLM SLO: latency, faithfulness, cost."
      }
    ],
    sources: [
      { title: "LLM Inference SLO: TTFT, ITL & Latency Budget (Spheron, 2026)", url: "https://spheron.network/blog/llm-inference-slo-ttft-itl-latency-budget-guide-2026", icon: "📄" },
      { title: "Anyscale LLM Serving Metrics", url: "https://docs.anyscale.com/llm/serving/benchmarking/metrics", icon: "📄" },
      { title: "OpenAI Prompt Caching Guide", url: "https://developers.openai.com/api/docs/guides/prompt-caching", icon: "🔗" },
      { title: "Anthropic Prompt Caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", icon: "🔗" }
    ]
  },
  {
    id: 11,
    title: "Online evaluation, LLM-as-judge в проде и drift detection",
    goal: "Освоить мониторинг качества в реальном времени: online judges, drift detection, hallucination detection.",
    objectives: [
      "Настраивать online LLM-as-judge на sampled-трафике",
      "Различать input/output/quality drift",
      "Валидировать рубрики против human-разметки"
    ],
    content: `
      <h4>Offline vs online evaluation</h4>
      <p>Offline eval (golden dataset на CI) ловит регрессии при изменении кода. Он НЕ ловит:</p>
      <ul>
        <li>Дрейф из-за обновления upstream-модели (gpt-4o версия обновилась)</li>
        <li>Изменение распределения пользовательских запросов</li>
        <li>Деградацию из-за устаревания retrieval-индекса</li>
        <li>Влияние непротестированных prompt-edits через UI Langfuse/LangSmith</li>
      </ul>
      <p>Online eval — sampling части продакшн-трафика и оценка judge-моделью в реальном времени.</p>

      <h4>Online LLM-as-judge архитектура</h4>
      <pre><code>1. Production LLM call → trace в Langfuse/Phoenix
2. Sampling worker: каждый 1-5% трейс → eval queue
3. Judge LLM (gpt-4o-mini или claude-haiku) → оценка по рубрике
4. Score → метрика в observability-платформу
5. Drift detector → alert при падении метрики >2σ от baseline</code></pre>

      <h4>Калибровка рубрики</h4>
      <div class="key-concept">
        <strong>Validate the validator:</strong> Перед production надо валидировать judge против human-разметки. Возьмите 200 примеров, разметьте human-evaluators, прогоните через judge, посчитайте agreement (Cohen's kappa, accuracy). Если kappa <0.6 — рубрика плохая. Повторно валидировать раз в квартал.
      </div>

      <h4>Drift detection: типы</h4>
      <ul>
        <li><strong>Input drift</strong> — изменение распределения запросов. Метрика: KL-divergence между embeddings текущего окна и baseline.</li>
        <li><strong>Output drift</strong> — изменение распределения ответов. Признаки: средняя длина ответа, тональность, использование специфичных слов.</li>
        <li><strong>Quality drift</strong> — снижение judge-scores или RAG-faithfulness со временем. Самая прямая метрика деградации.</li>
      </ul>

      <h4>Hallucination detection стратегии</h4>
      <ul>
        <li><strong>RAG-faithfulness:</strong> для RAG — каждое утверждение в ответе должно следовать из извлечённого контекста. RAGAS faithfulness, Phoenix HallucinationEvaluator.</li>
        <li><strong>Fact extraction + KB-проверка:</strong> извлекаем atomic facts из ответа, сверяем с reference KB.</li>
        <li><strong>Self-consistency:</strong> N генераций на один вход, кластеризация ответов. Если кластер один — вероятно factual; если разбросано — uncertainty.</li>
        <li><strong>User-correction signal:</strong> если пользователь отвечает «нет, неправильно» / «ты ошибаешься» — это сигнал галлюцинации в предыдущем ответе.</li>
      </ul>

      <h4>Cost online judges</h4>
      <p>На 100K production-запросов/день, sampling 5%, judge gpt-4o-mini → ~$60/мес. Это дёшево относительно бизнес-цены незамеченной деградации.</p>

      <div class="key-concept">
        <strong>Мини-кейс «stale retrieval index»:</strong> RAG-чатбот e-commerce постепенно деградировал: faithfulness падал на 1% в неделю. Online judge поймал тренд, root cause через 2 дня — retrieval index не переиндексировался при добавлении новых продуктов. Без online eval это всплыло бы через 3-4 месяца, когда менеджеры заметили падение conversion.
      </div>
    `,
    flashcards: [
      { front: "Offline vs online eval", back: "Offline: golden dataset на CI, ловит регрессии кода. Online: sampling продакшн-трафика, ловит дрейф (upstream model, stale index, изменение трафика). Нужны оба." },
      { front: "Online judge архитектура", back: "Sampling 1-5% продакшн-трейсов → judge LLM (cheap model) → score → drift detector. Алерт при падении >2σ от baseline." },
      { front: "Validate the validator", back: "Перед prod валидируйте judge против human-разметки на 200 примерах. Agreement (Cohen's kappa) >0.6 — приемлемо. <0.6 — переработать рубрику." },
      { front: "Input drift", back: "Изменение распределения запросов. Метрика: KL-divergence между embeddings текущего окна и baseline. Сигнализирует о новых сценариях, не покрытых golden dataset." },
      { front: "Output drift", back: "Изменение распределения ответов: средняя длина, тональность, специфичные слова. Часто признак upstream-model upgrade или prompt-edit." },
      { front: "Quality drift", back: "Снижение judge-scores или RAG-faithfulness. Самая прямая метрика деградации. Алерт обязателен." },
      { front: "RAG faithfulness check", back: "Каждое утверждение в ответе должно следовать из retrieved chunks. RAGAS faithfulness, Phoenix HallucinationEvaluator, Braintrust scorers." },
      { front: "Cost online judges", back: "100K req/day, 5% sampling, gpt-4o-mini judge = ~$60/мес. Дёшево относительно цены незамеченной деградации (Air Canada суд, retention loss)." }
    ],
    quiz: [
      {
        question: "Что НЕ ловит offline eval (golden dataset на CI)?",
        options: [
          "Регрессии при изменении кода",
          "Дрейф из-за обновления upstream-модели, изменения трафика, stale retrieval index — это ловит только online eval",
          "Изменения в промптах",
          "Изменения в моделях"
        ],
        correct: 1,
        explanation: "Offline eval — снимок на момент CI. Дрейф (постепенное изменение) не виден. Нужен online sampling трафика с judge-моделью."
      },
      {
        question: "Что значит «validate the validator»?",
        options: [
          "Проверить, что judge доступен",
          "Перед prod валидировать judge против human-разметки на 200 примерах, рассчитать agreement (Cohen's kappa >0.6)",
          "Деплоить judge через CI",
          "Это устаревшая практика"
        ],
        correct: 1,
        explanation: "Judge тоже LLM — может ошибаться. Без калибровки против human-разметки нет уверенности в его оценках. Стандарт: повторная валидация раз в квартал."
      },
      {
        question: "Faithfulness падает на 1% в неделю в RAG-чатботе. Что искать?",
        options: [
          "Сменить модель",
          "Stale retrieval index или дрейф запросов — постепенная деградация типична для retrieval-проблем",
          "Это нормально",
          "Увеличить sampling rate"
        ],
        correct: 1,
        explanation: "Медленный тренд деградации в RAG — почти всегда retrieval issue: устаревший index, новые типы запросов без покрытия, изменение релевантности embeddings."
      },
      {
        question: "Чем self-consistency помогает обнаружить галлюцинации?",
        options: [
          "Это быстрее",
          "N генераций на один вход — если ответы разбросаны (разные факты), модель неуверена и вероятно галлюцинирует; согласованность = factual",
          "Это уменьшает стоимость",
          "Self-consistency не для галлюцинаций"
        ],
        correct: 1,
        explanation: "Uncertainty proxy: если модель уверена, N-генерация будет давать похожие ответы. Если разные факты — модель «придумывает» из шума. Метод хорошо работает для factual QA."
      },
      {
        question: "Sampling 5% продакшн-трафика с judge gpt-4o-mini на 100K req/день стоит:",
        options: [
          "$5000/мес — слишком дорого",
          "~$60/мес — дёшево относительно цены незамеченной деградации",
          "$0 — судья бесплатный",
          "$500/мес"
        ],
        correct: 1,
        explanation: "5K судебных eval/день × cheap model = ~$2/день = $60/мес. Бизнес-цена незамеченной деградации (отток, suit, retention) на порядки выше."
      }
    ],
    sources: [
      { title: "Best Hallucination Detection Tools (Braintrust, 2026)", url: "https://www.braintrust.dev/articles/best-hallucination-detection-tools-2026", icon: "📄" },
      { title: "LLM Hallucinations in Production (Maxim AI)", url: "https://www.getmaxim.ai/articles/llm-hallucinations-in-production-monitoring-strategies-that-actually-work", icon: "📄" },
      { title: "LLM Monitoring & Drift Detection (Leanware, 2026)", url: "https://www.leanware.co/insights/llm-monitoring-drift-detection-guide", icon: "📄" },
      { title: "RAGAS Faithfulness Metric", url: "https://docs.ragas.io/en/stable/concepts/metrics/faithfulness.html", icon: "🔗" }
    ]
  },
  {
    id: 12,
    title: "Privacy, PII redaction и self-hosted observability",
    goal: "Освоить «Safe Observability» паттерн: соответствие GDPR/HIPAA/NIST AI RMF, redaction, self-hosting.",
    objectives: [
      "Применять redaction до отправки трейса",
      "Понимать требования GDPR / HIPAA / NIST AI RMF для LLM-логов",
      "Развёртывать self-hosted observability для on-prem"
    ],
    content: `
      <h4>Safe Observability — паттерн</h4>
      <div class="key-concept">
        <strong>Safe Observability:</strong> redaction чувствительных данных происходит на стороне SDK или OTel Collector ДО сериализации в transport. Observability-бэкенд никогда не видит сырое значение PII. Это сильнее, чем «backend хранит PII зашифрованным» — данные просто не покидают приложение.
      </div>

      <h4>Что считается PII в LLM-контексте</h4>
      <ul>
        <li>Email, телефон, паспортные данные</li>
        <li>Номера карт, банковских счетов</li>
        <li>Медицинская информация (HIPAA)</li>
        <li>IP-адреса (GDPR — да; CCPA — иногда)</li>
        <li>Session tokens, API keys, JWT в промптах (могут попасть случайно)</li>
        <li>Имена клиентов, адреса, гео-координаты</li>
      </ul>

      <h4>Стратегии redaction</h4>
      <ul>
        <li><strong>Regex-based:</strong> быстро, но ловит только структурированные форматы (email, карты). Не поймает «Иван Иванов».</li>
        <li><strong>NER (Named Entity Recognition):</strong> ML-модель распознаёт PERSON, LOCATION, MONEY. Microsoft Presidio, AWS Comprehend, spaCy.</li>
        <li><strong>Гибрид:</strong> regex для известных форматов + NER для произвольного текста. Рекомендуемый паттерн.</li>
      </ul>

      <h4>OTel Collector с redaction-pipeline</h4>
      <pre><code>processors:
  redaction:
    allow_all_keys: false
    blocked_values:
      # Email
      - '[\\w\\.-]+@[\\w\\.-]+'
      # Credit card
      - '\\b\\d{16}\\b'
      # SSN
      - '\\b\\d{3}-\\d{2}-\\d{4}\\b'
    summary: debug

  transform/pii:
    log_statements:
      - context: log
        statements:
          - replace_pattern(body, "[\\w\\.-]+@[\\w\\.-]+", "[EMAIL]")</code></pre>

      <h4>Регуляторные требования</h4>
      <ul>
        <li><strong>GDPR:</strong> правo на удаление (Article 17), data minimization. LLM-логи должны быть удаляемы по user_id. Retention &lt;6 месяцев — обычная практика.</li>
        <li><strong>HIPAA:</strong> 6 лет retention для PHI; audit log всех access; encryption at rest и in transit.</li>
        <li><strong>NIST AI RMF (2026):</strong> логировать model version, policy version, redaction action, timestamp. Audit trail для AI-решений.</li>
        <li><strong>EU AI Act (вступил 2026):</strong> high-risk AI системы обязаны иметь observability и audit trail. Penalties до €35M или 7% global turnover.</li>
      </ul>

      <h4>Self-hosted варианты</h4>
      <ul>
        <li><strong>Langfuse (MIT)</strong> — самый популярный self-hosted, PostgreSQL+ClickHouse+Redis+S3</li>
        <li><strong>Phoenix (Elastic 2.0)</strong> — простой self-host, embedded mode</li>
        <li><strong>OpenLLMetry/OpenInference</strong> — инструментация; бэкенд = любой OTel-совместимый</li>
        <li><strong>SigNoz, Jaeger</strong> — generic OTel, требуют адаптации для GenAI-семантики</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс «банк on-prem»:</strong> банк выбирал между Datadog LLM Observability (SaaS) и Langfuse self-hosted. Datadog был быстрее на старте, но требовал передачи промптов в US-cloud — конфликт с локальными требованиями к банковской тайне. Перешли на Langfuse self-hosted в private cloud + Presidio NER redaction в OTel Collector. Cost-of-ownership выше, но compliance закрыт.
      </div>
    `,
    flashcards: [
      { front: "Safe Observability паттерн", back: "Redaction на стороне SDK/Collector ДО сериализации в transport. Бэкенд никогда не видит PII. Сильнее, чем «encrypted storage» — данные не покидают приложение." },
      { front: "Что считается PII в LLM-логах", back: "Email, телефон, карты, медицинские данные, IP (GDPR), session tokens/API keys (случайно в промптах), имена/адреса/координаты." },
      { front: "Стратегии redaction", back: "Regex (быстро, только структуры) + NER (Presidio, AWS Comprehend, spaCy — ловит PERSON, LOCATION). Гибрид — рекомендуемый паттерн." },
      { front: "GDPR для LLM-логов", back: "Право на удаление (Article 17) — должно быть возможно удалить логи по user_id. Data minimization — не логировать лишнего. Retention <6 мес обычно." },
      { front: "HIPAA требования", back: "6 лет retention для PHI, audit log всех access, encryption at rest и in transit. Self-hosted сильно упрощает соответствие, чем SaaS." },
      { front: "NIST AI RMF 2026", back: "Логировать model version, policy version, redaction action, timestamp. Audit trail для AI-решений. Не нормативный, но de-facto стандарт для US-федеральных контрактов." },
      { front: "EU AI Act observability requirement", back: "High-risk AI системы обязаны иметь observability и audit trail. Penalties до €35M или 7% global turnover. Вступил в силу в 2026." },
      { front: "Self-hosted vs SaaS observability", back: "SaaS быстрее на старте, но передача промптов в чужой облако — compliance issue для regulated industries. Self-hosted: Langfuse MIT, Phoenix Elastic 2.0." }
    ],
    quiz: [
      {
        question: "Главное преимущество Safe Observability паттерна:",
        options: [
          "Дешевле",
          "Redaction до сериализации — бэкенд никогда не видит PII; сильнее, чем encrypted storage",
          "Быстрее",
          "Нет необходимости в NER"
        ],
        correct: 1,
        explanation: "Encryption защищает от breach, но данные всё равно проходят через бэкенд. Redaction до transport означает, что PII даже не покидает приложение."
      },
      {
        question: "Почему regex-only redaction недостаточен?",
        options: [
          "Regex медленный",
          "Regex ловит только структурированные форматы (email, карты), не поймает «Иван Иванов проживает по адресу...» — нужен NER",
          "Regex устарел",
          "Regex не работает в Python"
        ],
        correct: 1,
        explanation: "Имена, адреса, неструктурированные данные не имеют чёткого паттерна. NER (Presidio, AWS Comprehend) распознаёт сущности по контексту."
      },
      {
        question: "Банк требует логи LLM-промптов на on-prem из-за банковской тайны. Какой стек выбрать?",
        options: [
          "Datadog LLM Observability",
          "Langfuse self-hosted в private cloud + Presidio NER redaction в OTel Collector",
          "LangSmith SaaS",
          "Никакой — observability невозможен"
        ],
        correct: 1,
        explanation: "Self-hosted MIT-лицензированный Langfuse в private cloud + collector с redaction = full control. SaaS-варианты передают данные в чужое облако — не подходят."
      },
      {
        question: "Что требует EU AI Act от high-risk AI систем?",
        options: [
          "Запрет на использование",
          "Observability и audit trail; penalties до €35M или 7% global turnover за невыполнение",
          "Только проверку моделей",
          "Open source"
        ],
        correct: 1,
        explanation: "EU AI Act 2026 для high-risk систем (kredit-scoring, медицина, рекрутинг) требует audit trail. Observability — необходимое условие для compliance."
      },
      {
        question: "GDPR Article 17 («право на забвение») для LLM-логов означает:",
        options: [
          "Логи нельзя хранить вовсе",
          "Должно быть возможно удалить все логи, связанные с user_id, по запросу — нужна индексация по user_id и retention policy",
          "Только удаление через 6 месяцев",
          "GDPR не применим к LLM"
        ],
        correct: 1,
        explanation: "Право на удаление: user может запросить удаление своих данных. LLM-логи (трейсы, промпты, ответы) должны быть индексированы по user_id для возможности bulk-delete."
      }
    ],
    sources: [
      { title: "Langfuse Masking API", url: "https://langfuse.com/docs/observability/features/masking", icon: "🔗" },
      { title: "Microsoft Presidio (PII anonymization)", url: "https://github.com/microsoft/presidio", icon: "🔗" },
      { title: "Safe Observability (IJCJournal, 2026)", url: "https://ijcjournal.org/InternationalJournalOfComputer/article/view/2458", icon: "📄" },
      { title: "OpenTelemetry Collector Redaction Processor", url: "https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/redactionprocessor", icon: "🔗" }
    ]
  }
];

// Final Review Questions — 12 вопросов из всех уроков
const finalQuiz = [
  { question: "Традиционный APM не подходит для LLM, потому что:", options: ["LLM не используют HTTP", "Не фиксирует семантический дрейф, галлюцинации и непредсказуемые расходы токенов", "LLM слишком быстрые для APM", "APM не поддерживает Python"], correct: 1, explanation: "LLM-системы вероятностны. APM видит HTTP 200, но не видит, что ответ — галлюцинация, или что стоимость запроса выросла в 10 раз." },
  { question: "TTFT (Time to First Token) критичен для:", options: ["Batch processing", "Streaming и интерактивных чатов — определяет воспринимаемую отзывчивость", "Оффлайн-оценки", "Training"], correct: 1, explanation: "TTFT = время до первого токена. В streaming-режиме пользователь ждёт первый символ — это UX-метрика отзывчивости." },
  { question: "Какой атрибут OpenTelemetry НЕ входит в обязательные для GenAI span?", options: ["gen_ai.request.model", "gen_ai.system", "gen_ai.operation.name", "gen_ai.user.email"], correct: 3, explanation: "user.email — кастомный атрибут, не часть стандарта. Обязательные: model, system, operation.name." },
  { question: "Главное преимущество Langfuse:", options: ["Самый красивый UI", "Open-source MIT, self-hosted, OTel-compatible, промпт-менеджмент, masking API", "Бесплатный SaaS", "Только для LangChain"], correct: 1, explanation: "Langfuse = open-source + self-hosted + OTel + промпт-менеджмент + Safe Observability. Полный контроль данных, vendor-agnostic." },
  { question: "LangSmith лучше всего работает с:", options: ["Любым фреймворком", "LangChain/LangGraph — максимальная интеграция, native LangGraph trajectory", "Только с GPT-4", "Kubernetes"], correct: 1, explanation: "LangSmith создан командой LangChain. Native trajectory-визуализация графов LangGraph — главная USP. Для других стеков — vendor lock-in." },
  { question: "Phoenix от Arize AI уникален тем, что:", options: ["Самый дорогой", "Локальный запуск за 2 команды, embeddings visualization (UMAP/t-SNE), OTel native", "Только для enterprise", "Не поддерживает RAG"], correct: 1, explanation: "Phoenix: pip install + serve = UI на localhost. Embeddings visualization — уникальная фича для отладки retrieval." },
  { question: "Faithfulness check в RAG проверяет:", options: ["Скорость retrieval", "Следует ли ответ ТОЛЬКО извлечённому контексту (нет ли выдуманных фактов)", "Размер контекстного окна", "Количество chunks"], correct: 1, explanation: "Faithfulness: ответ RAG должен основываться только на извлечённых chunks. Если модель добавляет факты из своей памяти — это галлюцинация." },
  { question: "Рекомендуемый production observability стек 2026:", options: ["Только LangSmith", "Только Langfuse", "OTel (instrumentation) + Langfuse (production) + Phoenix (dev) + RAGAS (eval) + CI/CD gate", "Console.log"], correct: 2, explanation: "Композитный стек: каждый инструмент для своей задачи. OTel — стандарт, Langfuse — production, Phoenix — dev, RAGAS — eval, CI/CD — regression." },
  { question: "Agent observability отличается от обычной LLM observability тем, что:", options: ["Использует другие фреймворки", "Метрики смещаются с request-level на session-level: resolution rate, goal completion, trajectory length, loop detection", "Дороже", "Не нужна"], correct: 1, explanation: "Один agent-запрос = 5-20 LLM-вызовов. Качество одного вызова не отражает успех. Считаем session-метрики: resolution rate, loop detection, trajectory length." },
  { question: "Cache hit rate в Anthropic упал с 90% до 12% после изменения промпта. Причина:", options: ["Anthropic снизил скидку", "Breakpoint после изменённой части — стабильный префикс сменился, кэш промахивается каждый раз; расходы 125% вместо 10%", "Это нормальное поведение", "Cache всегда падает"], correct: 1, explanation: "Изменчивые части ДОЛЖНЫ быть ПОСЛЕ breakpoint. Иначе каждый запрос пишет новый кэш (cache_write = 125% цены) вместо чтения (cache_read = 10%)." },
  { question: "Что НЕ ловит offline eval на golden dataset (только CI)?", options: ["Регрессии при изменении кода", "Дрейф из-за обновления upstream-модели, изменения трафика, stale retrieval index — нужен online eval", "Изменения в промптах", "Изменения в моделях"], correct: 1, explanation: "Offline eval — снимок на момент CI. Постепенный дрейф (stale index, изменение распределения трафика) виден только через online sampling с judge-моделью." },
  { question: "Safe Observability паттерн означает:", options: ["Шифрование в storage", "Redaction до сериализации в transport — бэкенд никогда не видит PII (сильнее, чем encrypted storage)", "Запрет на логирование", "Только on-prem"], correct: 1, explanation: "Encryption защищает от breach, но данные проходят через бэкенд. Redaction до transport — PII даже не покидает приложение. Это требование GDPR/HIPAA/NIST AI RMF для regulated industries." }
];

// ============================================================
// App State & Logic
// ============================================================
let state = { currentLesson: -1, completed: new Set(), quizAnswered: {} };
const $ = (sel) => document.querySelector(sel);

function init() { buildSidebar(); bindEvents(); updateProgress(); }

function buildSidebar() {
  $("#lesson-nav").innerHTML = courseData.map((l, i) =>
    '<button class="lesson-nav-item' + (i === state.currentLesson ? ' active' : '') + '" data-lesson="' + i + '">' +
    '<span class="nav-icon">' + (state.completed.has(i) ? '✓' : (i + 1)) + '</span>' +
    '<span>' + l.title + '</span></button>'
  ).join('');
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
  $("#lesson-badge").textContent = "Урок " + (index + 1);
  $("#lesson-title").textContent = l.title;
  $("#objectives-list").innerHTML = l.objectives.map(o => "<li>" + o + "</li>").join("");
  $("#content-section").innerHTML = "<h3>📖 Материал</h3>" + l.content;
  buildFlashcards(l.flashcards);
  buildQuiz(l.quiz, l.id);
  buildSources(l.sources);
  $("#btn-prev").style.visibility = index === 0 ? "hidden" : "visible";
  $("#btn-next").textContent = index === courseData.length - 1 ? "Завершить →" : "Далее →";
  state.completed.add(index);
  updateProgress(); buildSidebar(); window.scrollTo(0, 0);
}

function buildFlashcards(cards) {
  const c = $("#flashcards");
  c.innerHTML = cards.map((card, i) =>
    '<div class="flashcard"><div class="flashcard-inner">' +
    '<div class="flashcard-front">' + card.front + '</div>' +
    '<div class="flashcard-back">' + card.back + '</div>' +
    '</div></div>'
  ).join('');
  c.querySelectorAll(".flashcard").forEach(f => f.addEventListener("click", () => f.classList.toggle("flipped")));
}

function buildQuiz(questions, lessonId) {
  const c = $("#quiz");
  c.innerHTML = questions.map((q, qi) => {
    const key = lessonId + "-" + qi;
    const a = state.quizAnswered[key];
    return '<div class="quiz-question" data-key="' + key + '" data-correct="' + q.correct + '">' +
      '<h4>' + (qi + 1) + '. ' + q.question + '</h4><div class="quiz-options">' +
      q.options.map((o, oi) => {
        let cls = "quiz-option";
        if (a !== undefined) { cls += " disabled"; if (oi === q.correct) cls += " correct"; else if (oi === a) cls += " wrong"; }
        return '<button class="' + cls + '" data-option="' + oi + '" data-key="' + key + '">' + o + '</button>';
      }).join('') + '</div><div class="quiz-feedback' + (a !== undefined ? ' show ' + (a === q.correct ? 'correct-fb' : 'wrong-fb') : '') + '">' +
      (a !== undefined ? (a === q.correct ? '✅ Правильно! ' : '❌ Неверно. ') + q.explanation : '') + '</div></div>';
  }).join('');
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
  fb.textContent = (si === ci ? '✅ Правильно! ' : '❌ Неверно. ') + exp;
  fb.className = "quiz-feedback show " + (si === ci ? "correct-fb" : "wrong-fb");
}

function buildSources(sources) {
  if (!sources || !sources.length) { $("#sources-section").classList.add("hidden"); return; }
  $("#sources-section").classList.remove("hidden");
  $("#sources").innerHTML = sources.map(s =>
    '<a href="' + s.url + '" target="_blank" class="source-card"><span class="source-icon">' + s.icon + '</span>' +
    '<div><div class="source-title">' + s.title + '</div><div class="source-url">' + s.url + '</div></div></a>'
  ).join('');
}

function prevLesson() { if (state.currentLesson > 0) goToLesson(state.currentLesson - 1); }
function nextLesson() { state.currentLesson < courseData.length - 1 ? goToLesson(state.currentLesson + 1) : showReview(); }

function showReview() {
  state.currentLesson = courseData.length;
  $("#welcome").classList.add("hidden"); $("#lesson-view").classList.add("hidden"); $("#review-view").classList.remove("hidden");
  buildFinalQuiz(); buildSidebar(); window.scrollTo(0, 0);
}

function buildFinalQuiz() {
  const c = $("#final-quiz");
  c.innerHTML = finalQuiz.map((q, qi) =>
    '<div class="quiz-question" data-fkey="' + qi + '" data-correct="' + q.correct + '">' +
    '<h4>' + (qi + 1) + '. ' + q.question + '</h4><div class="quiz-options">' +
    q.options.map((o, oi) => '<button class="quiz-option" data-foption="' + oi + '" data-fkey="' + qi + '">' + o + '</button>').join('') +
    '</div><div class="quiz-feedback" data-fkey="' + qi + '"></div></div>'
  ).join('');
  const af = {};
  c.querySelectorAll(".quiz-option").forEach(b => b.addEventListener("click", () => {
    const fk = b.dataset.fkey;
    if (af[fk] !== undefined) return;
    const q = b.closest(".quiz-question"), ci = parseInt(q.dataset.correct), si = parseInt(b.dataset.foption);
    af[fk] = si;
    q.querySelectorAll(".quiz-option").forEach((o, i) => { o.classList.add("disabled"); if (i === ci) o.classList.add("correct"); else if (i === si) o.classList.add("wrong"); });
    const fb = q.querySelector(".quiz-feedback");
    fb.textContent = (si === ci ? '✅ ' : '❌ ') + finalQuiz[fk].explanation;
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
    ? '🎉 Отлично! Вы готовы настраивать LLM Observability в продакшне!'
    : pct >= 50 ? '👍 Хорошая база. Пересмотрите уроки с ошибками.'
    : '📚 Стоит пройти курс ещё раз.';
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-text").textContent = state.completed.size + " / " + courseData.length + " уроков";
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

document.addEventListener("DOMContentLoaded", init);
