const COURSE = [
  {
    title: "Что такое RAG и зачем он нужен",
    goal: "Понять, почему LLM галлюцинируют и как RAG решает эту проблему без дообучения модели.",
    objectives: [
      "Объяснить проблему галлюцинаций LLM и её последствия",
      "Описать архитектуру RAG: index → retrieve → generate",
      "Определить, когда RAG лучше fine-tuning, а когда хуже",
      "Назвать ключевые компоненты production RAG-системы"
    ],
    body: `<h2>Проблема: LLM не знают того, чего не видели</h2>
<p>Большие языковые модели обучены на гигантских корпусах текста, но они не знают вашу внутреннюю документацию, актуальные цены, свежие новости или специфические регламенты. Когда модель не знает ответ — она его <strong>выдумывает</strong>. Это называется галлюцинация, и в продакшене это стоит денег.</p>

<p>Есть два подхода к решению:</p>
<ul>
<li><strong>Fine-tuning</strong> — дообучить модель на ваших данных. Дорого, медленно, модель быстро устаревает.</li>
<li><strong>RAG (Retrieval-Augmented Generation)</strong> — дать модели доступ к внешним источникам знаний во время генерации. Дёшево, быстро, знания всегда актуальны.</li>
</ul>

<h2>Архитектура RAG: три шага</h2>
<p>RAG работает как библиотекарь: модель задаёт вопрос, библиотекарь находит релевантные документы, и модель отвечает на основе найденного.</p>

<pre><code>Запрос пользователя
        ↓
   [Retriever]
   Поиск по векторной БД
        ↓
   Топ-K релевантных чанков
        ↓
   [LLM + контекст]
   Генерация ответа
        ↓
   Ответ с источниками</code></pre>

<h3>Шаг 1: Indexing (офлайн)</h3>
<p>Документы разбиваются на чанки (фрагменты), каждый чанк конвертируется в вектор-эмбеддинг и сохраняется в векторную базу данных. Это делается один раз при загрузке данных.</p>

<h3>Шаг 2: Retrieval (онлайн)</h3>
<p>Запрос пользователя тоже конвертируется в эмбеддинг. Векторная БД находит K ближайших по косинусному расстоянию чанков. Это «похожие документы».</p>

<h3>Шаг 3: Generation (онлайн)</h3>
<p>Найденные чанки вставляются в промпт как контекст. LLM генерирует ответ, опираясь на реальные данные, а не на параметрическую память.</p>

<h2>RAG vs Fine-tuning</h2>
<p>Fine-tuning меняет <strong>поведение</strong> модели (стиль, формат, тон). RAG меняет <strong>знания</strong> модели (факты, данные, документы). В 90% бизнес-кейсов нужен именно RAG.</p>

<div class="callout callout-tip"><strong>Когда нужен fine-tuning:</strong> кастомный стиль ответа, специфический формат вывода, domain-specific токенизация. Когда нужен RAG: актуальные данные, цитирование источников, приватные знания.</div>

<div class="callout callout-warn"><strong>Ловушка:</strong> RAG не заменяет промпт-инжиниринг. Плохой промпт + хороший retriever = плохой результат. Начните с промпта.</div>

<h2>Эволюция: от Naive RAG к Advanced RAG</h2>
<p><strong>Naive RAG</strong> — простая схема: chunk → embed → retrieve → generate. Работает, но качество retrieval часто оставляет желать лучшего.</p>
<p><strong>Advanced RAG</strong> — добавляет pre-retrieval оптимизации (query rewriting, HyDE), post-retrieval (re-ranking, compression) и evaluation pipelines.</p>
<p><strong>Modular RAG</strong> — рассматривает RAG как набор модулей (router, retriever, reader, critic), которые можно комбинировать и заменять независимо.</p>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Стартап строит чат-бот для поддержки клиентов. База знаний — 500 PDF-документов с инструкциями, которые обновляются раз в неделю. Команда спорит: RAG или fine-tuning GPT-4?</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>RAG с инкрементальным индексом:</strong> новые PDF → re-index → чат-бот знает актуальную информацию без переобучения. Цитирует источник каждого факта.</li>
<li><strong>Naive RAG как MVP:</strong> за 1-2 дня собрать прототип, измерить baseline на 20 тестовых вопросах, принять решение на данных, а не на интуиции.</li>
</ul>
<p><strong>Антипаттерн:</strong> сразу начать fine-tuning «для лучшего качества» — дорого, медленно, через неделю документы обновились и модель снова устарела.</p>
</div>`,
    flashcards: [
      { front: "Что такое галлюцинация LLM?", back: "Ситуация, когда модель генерирует правдоподобный, но фактически неверный ответ, потому что не имеет доступа к нужным данным." },
      { front: "Три этапа RAG pipeline", back: "1) Indexing — разбить документы на чанки и создать эмбеддинги. 2) Retrieval — найти релевантные чанки по запросу. 3) Generation — сгенерировать ответ на основе найденного контекста." },
      { front: "RAG vs Fine-tuning — главное отличие", back: "Fine-tuning меняет поведение/стиль модели (обучение на примерах). RAG добавляет знания без переобучения (контекст в промпте). RAG дёшево и быстро обновляется." },
      { front: "Naive RAG vs Advanced RAG", back: "Naive: chunk→embed→retrieve→generate, простой пайплайн. Advanced: добавляет query rewriting, HyDE, re-ranking, compression, evaluation. Modular RAG: компоненты независимо заменяемы (router, retriever, reader, critic)." },
      { front: "Когда RAG хуже fine-tuning?", back: "Когда задача — изменить стиль/формат вывода, domain-specific токенизацию или поведение модели. RAG не обучает модель — он даёт ей данные. Стиль ≠ знания." },
      { front: "Parametric vs Non-parametric memory", back: "Parametric — знания, зашитые в веса модели при обучении. Non-parametric — внешнее хранилище (векторная БД), обновляемое без переобучения. RAG использует non-parametric." },
      { front: "Что такое Modular RAG?", back: "Архитектурный подход: RAG как набор независимых модулей — router, retriever, reader, critic, generator. Каждый можно заменить или улучшить без переписывания остального." },
      { front: "Главное правило системного промпта в RAG", back: "Всегда явно указывать: «Отвечай ТОЛЬКО на основе предоставленного контекста. Если информации недостаточно — скажи об этом». Без этого модель смешивает контекст с параметрической памятью." }
    ],
    quiz: [
      {
        question: "В каком случае RAG предпочтительнее fine-tuning?",
        options: [
          "Нужно изменить стиль ответов модели на более формальный",
          "Нужно дать модели доступ к внутренней документации компании",
          "Нужно научить модель генерировать JSON определённого формата",
          "Нужно адаптировать модель к специфической предметной области с уникальной лексикой"
        ],
        correct: 1,
        explanation: "RAG идеален для предоставления доступа к приватным/актуальным данным без переобучения. Изменение стиля и формата — задача fine-tuning."
      },
      {
        question: "Что происходит на этапе Indexing?",
        options: [
          "Запрос пользователя конвертируется в эмбеддинг",
          "LLM генерирует ответ на основе контекста",
          "Документы разбиваются на чанки и сохраняются как векторы в БД",
          "Retriever ранжирует найденные документы"
        ],
        correct: 2,
        explanation: "Indexing — это офлайн-процесс: документы → чанки → эмбеддинги → векторная БД. Остальные этапы происходят онлайн при обработке запроса."
      },
      {
        question: "RAG-система даёт точные ответы, но знания в документации обновляются ежечасно. Что делать?",
        options: [
          "Дообучить модель каждый час",
          "Настроить инкрементальный re-indexing при обновлении документов",
          "Перейти на более новую версию LLM",
          "Увеличить chunk_size — так модель лучше запомнит"
        ],
        correct: 1,
        explanation: "Ключевое преимущество RAG — данные обновляются без переобучения. Инкрементальный re-indexing (только изменённые документы) поддерживает актуальность без остановки системы."
      },
      {
        question: "Команда выбирает между RAG и fine-tuning для медицинского чат-бота с актуальными протоколами лечения. Что правильнее?",
        options: [
          "Fine-tuning — медицинская лексика требует специализации",
          "RAG — протоколы обновляются, нужны всегда актуальные данные с цитированием",
          "Оба одинаково подходят",
          "Ни один — нужна специальная медицинская модель"
        ],
        correct: 1,
        explanation: "Медицинские протоколы регулярно обновляются, а цитирование источников критично для безопасности. RAG обеспечивает актуальность данных и источники каждого факта — именно то, что нужно."
      },
      {
        question: "Что является антипаттерном при первом запуске RAG?",
        options: [
          "Начать с простого прототипа и измерить baseline",
          "Сразу добавить Agentic RAG, Self-RAG и Graph RAG для максимального качества",
          "Использовать temperature=0 для фактологических ответов",
          "Создать тестовый набор из 20 вопросов"
        ],
        correct: 1,
        explanation: "Premature optimization — главный враг RAG-разработки. Сначала Naive RAG с baseline-метриками. Advanced-паттерны добавляют сложность и latency — их вводят только когда baseline недостаточен."
      },
      {
        question: "Пользователь спрашивает: «Ваш RAG галлюцинирует?» Какой ответ технически точный?",
        options: [
          "Нет, RAG полностью исключает галлюцинации",
          "Да, но меньше чем чистый LLM — faithfulness зависит от промпта и guardrails",
          "Только при использовании GPT-3.5",
          "Галлюцинации возможны только на этапе retrieval"
        ],
        correct: 1,
        explanation: "RAG снижает галлюцинации, предоставляя контекст, но не исключает их. Модель может игнорировать контекст или дополнять из параметрической памяти. Faithfulness < 1.0 даже у лучших систем."
      }
    ],
    sources: [
      { title: "Lewis et al. — Retrieval-Augmented Generation (2020)", desc: "Оригинальная paper от Facebook AI", url: "https://arxiv.org/abs/2005.11401", icon: "📄" },
      { title: "LlamaIndex — RAG from Scratch", desc: "Пошаговое руководство от LlamaIndex", url: "https://docs.llamaindex.ai/en/stable/getting_started/starter_example/", icon: "🦙" },
      { title: "LangChain — RAG Tutorial", desc: "Официальный туториал с примерами кода", url: "https://python.langchain.com/docs/tutorials/rag/", icon: "🦜" }
    ]
  },
  {
    title: "Подготовка данных: чанкинг и метаданные",
    goal: "Научиться правильно разбивать документы на чанки и обогащать их метаданными для точного retrieval.",
    objectives: [
      "Сравнивать стратегии чанкинга: fixed-size, semantic, recursive",
      "Выбирать размер чанка под задачу",
      "Добавлять метаданные для фильтрации при retrieval",
      "Обрабатывать разные форматы: PDF, HTML, Markdown"
    ],
    body: `<h2>Чанкинг — это фундамент RAG</h2>
<p>Качество чанкинга определяет 70% качества retrieval. Плохо разбитые чанки = релевантная информация разорвана на куски или утонула в шуме.</p>

<h2>Стратегии чанкинга</h2>

<h3>1. Fixed-size chunking</h3>
<p>Самый простой: режем текст на куски по N токенов с overlap. Быстро, но ломает предложения посередине.</p>
<pre><code>from langchain.text_splitter import CharacterTextSplitter

splitter = CharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=50,
    separator="\\n\\n"
)</code></pre>

<h3>2. Recursive character splitting</h3>
<p>Пробует разделители по приоритету: параграфы → предложения → слова. Сохраняет семантическую целостность.</p>
<pre><code>from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\\n\\n", "\\n", ". ", " ", ""]
)</code></pre>

<h3>3. Semantic chunking</h3>
<p>Использует эмбеддинги для определения границ: когда косинусное расстояние между предложениями превышает порог — новый чанк. Дороже, но точнее.</p>
<pre><code>from langchain_experimental.text_splitter import SemanticChunker

splitter = SemanticChunker(
    embeddings,
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95
)</code></pre>

<h2>Размер чанка: эмпирические правила</h2>
<ul>
<li><strong>256–512 токенов</strong> — FAQ, короткие ответы, чат-боты</li>
<li><strong>512–1024 токенов</strong> — техническая документация, мануалы</li>
<li><strong>1024–2048 токенов</strong> — юридические тексты, длинные отчёты</li>
</ul>

<div class="callout callout-tip"><strong>Overlap 10-20%</strong> от chunk_size — стандартная практика. Обеспечивает, что информация на границе чанков не потеряна.</div>

<h2>Метаданные: скрытое оружие retrieval</h2>
<p>Каждый чанк должен иметь метаданные — это позволяет фильтровать результаты поиска. Без метаданных retriever ищет по всему корпусу, что снижает точность.</p>

<pre><code>chunk.metadata = {
    "source": "api_docs_v3.pdf",
    "section": "Authentication",
    "page": 42,
    "doc_type": "api_reference",
    "last_updated": "2026-01-15"
}</code></pre>

<p>Полезные метаданные:</p>
<ul>
<li><strong>source</strong> — файл/URL источника</li>
<li><strong>section/chapter</strong> — раздел документа</li>
<li><strong>doc_type</strong> — тип документа (FAQ, API, policy)</li>
<li><strong>date</strong> — дата публикации (для фильтрации устаревших)</li>
<li><strong>access_level</strong> — уровень доступа (для мульти-tenant систем)</li>
</ul>

<h2>Обработка разных форматов</h2>
<p>PDF — самый сложный формат. Таблицы ломаются, headers теряются, multi-column layout создаёт хаос.</p>

<div class="callout callout-warn"><strong>Не используйте</strong> простой PyPDF2 для продакшена. Для сложных PDF используйте Unstructured.io, LlamaParse или Marker (open-source). Для таблиц — Camelot или Tabula.</div>

<h3>Парсинг-пайплайн</h3>
<pre><code># LlamaParse для сложных документов
from llama_parse import LlamaParse

parser = LlamaParse(
    result_type="markdown",
    parsing_instruction="Extract tables as markdown"
)
documents = parser.load_data("complex_report.pdf")</code></pre>

<h2>Очистка данных</h2>
<p>Перед чанкингом — всегда очищайте:</p>
<ol>
<li>Удалить headers/footers, номера страниц</li>
<li>Нормализовать пробелы и переносы строк</li>
<li>Удалить битый текст (OCR-артефакты)</li>
<li>Сохранить структуру (заголовки, списки)</li>
<li>Дедуплицировать повторяющийся контент</li>
</ol>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Юридическая фирма индексирует 10 000 договоров в форматах PDF (таблицы условий, сканированные страницы). Retrieval возвращает бессмысленные куски — числа и реквизиты перемешаны с текстом.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>LlamaParse с parsing_instruction:</strong> явно указать «Extract tables as Markdown, preserve section headers» — таблицы условий становятся структурированными чанками.</li>
<li><strong>Метаданные doc_type + jurisdiction:</strong> добавить тип договора (аренда, NDA, поставка) и юрисдикцию в metadata — retrieval автоматически сузит область поиска.</li>
</ul>
<p><strong>Антипаттерн:</strong> использовать PyPDF2 и fixed-size chunking на 512 токенов — таблица условий разрежется посередине строки, retriever будет находить половинки таблиц без контекста.</p>
</div>`,
    flashcards: [
      { front: "Recursive vs Fixed-size chunking", back: "Recursive пробует разделители по приоритету (¶→.→word), сохраняя семантику. Fixed-size режет строго по N токенов, ломая предложения. Recursive — дефолтный выбор." },
      { front: "Semantic chunking", back: "Использует эмбеддинги для определения границ: когда расстояние между предложениями превышает порог — новый чанк. Дороже (N+1 вызовов embedding), но точнее для неоднородных текстов." },
      { front: "Зачем нужны метаданные в чанках?", back: "Для фильтрации при retrieval. Metadata filters позволяют искать только в нужных документах/секциях/датах, значительно повышая точность. Без метаданных — поиск по всему корпусу." },
      { front: "Overlap в чанкинге", back: "Перекрытие соседних чанков — обычно 10-20% от chunk_size. Гарантирует, что информация на границе чанка не потеряна. Слишком большой overlap → дублирование и раздутый индекс." },
      { front: "Почему PyPDF2 не для продакшена?", back: "PyPDF2 ломается на сложных PDF: таблицы превращаются в мусор, multi-column layout смешивается, headers/footers остаются. Для продакшена: Unstructured.io, LlamaParse или Marker." },
      { front: "access_level в метаданных", back: "Поле в chunk.metadata для мультитенантных систем. Позволяет фильтровать при retrieval: пользователь видит только чанки с подходящим уровнем доступа. Критично для корпоративных RAG." },
      { front: "Размер чанка для FAQ vs юридических текстов", back: "FAQ/чат: 256-512 токенов (короткие точные ответы). Юридические тексты/отчёты: 1024-2048 токенов (контекст важен, нельзя разрывать параграфы). Техдокументация: 512-1024." },
      { front: "Дедупликация при индексации", back: "Дублирующийся контент в корпусе снижает precision retrieval: один и тот же чанк возвращается несколько раз. Нужна дедупликация до чанкинга (по хешу документа) и после (по хешу чанка)." }
    ],
    quiz: [
      {
        question: "Какая стратегия чанкинга лучше всего подходит для технической документации с чёткой иерархией заголовков?",
        options: [
          "Fixed-size с chunk_size=100",
          "Semantic chunking с percentile threshold",
          "Recursive character splitting с overlap 15%",
          "Ручная нарезка по каждому заголовку"
        ],
        correct: 2,
        explanation: "Recursive character splitting — оптимальный баланс: автоматически сохраняет структуру через приоритет разделителей, overlap не теряет контекст на границах. Semantic — избыточен для хорошо структурированных текстов."
      },
      {
        question: "Какой размер overlap рекомендуется при chunk_size=512?",
        options: [
          "0 (без overlap)",
          "50-100 токенов (10-20%)",
          "256 токенов (50%)",
          "512 токенов (100%)"
        ],
        correct: 1,
        explanation: "10-20% overlap (50-100 токенов) — стандартная практика. Достаточно для сохранения контекста на границах без значительного увеличения количества чанков."
      },
      {
        question: "Retrieval возвращает один и тот же документ в трёх разных чанках с высоким score. Что это сигнализирует?",
        options: [
          "Всё в норме, высокий score — хороший знак",
          "Проблема дедупликации: контент дублируется в корпусе",
          "Слишком маленький chunk_size",
          "Нужно увеличить K"
        ],
        correct: 1,
        explanation: "Повторяющиеся чанки из одного источника — признак дублирования данных в индексе. Снижает diversity результатов и качество ответа. Решение: дедупликация при индексации."
      },
      {
        question: "Команда парсит PDF с финансовой отчётностью. Таблицы с числами критичны. Какой инструмент выбрать?",
        options: [
          "PyPDF2 — стандартный и быстрый",
          "LlamaParse или Camelot — специализированы для таблиц",
          "Просто конвертировать PDF в txt",
          "Разбить PDF на скриншоты и использовать OCR"
        ],
        correct: 1,
        explanation: "Таблицы в PDF — ахиллесова пята простых парсеров. LlamaParse извлекает таблицы как Markdown, Camelot — специализированный инструмент для структурированных таблиц. PyPDF2 даст бессмысленный текст."
      },
      {
        question: "Какое поле метаданных наиболее важно для корпоративного RAG с несколькими отделами?",
        options: [
          "source (имя файла)",
          "page (номер страницы)",
          "access_level (уровень доступа)",
          "chunk_id (идентификатор чанка)"
        ],
        correct: 2,
        explanation: "В мультитенантных системах access_level позволяет фильтровать результаты по правам: менеджер не увидит HR-документы, контрактор — внутренние стратегии. Без этого — утечка данных через RAG."
      },
      {
        question: "Semantic chunking значительно медленнее recursive. Когда он оправдан?",
        options: [
          "Всегда — он точнее",
          "Только для FAQ с короткими документами",
          "Для длинных неоднородных текстов (обзоры, статьи с разными темами)",
          "Только если документов меньше 100"
        ],
        correct: 2,
        explanation: "Semantic chunking оправдан когда тема резко меняется внутри документа — например, научные статьи или длинные обзоры. Для однородной документации recursive быстрее и не хуже по качеству."
      }
    ],
    sources: [
      { title: "Chunking Strategies for LLM Applications", desc: "Greg Kamradt — подробный разбор стратегий", url: "https://www.pinecone.io/learn/chunking-strategies/", icon: "📖" },
      { title: "LangChain Text Splitters", desc: "Документация по всем типам сплиттеров", url: "https://python.langchain.com/docs/how_to/#text-splitters", icon: "🦜" },
      { title: "Unstructured.io", desc: "Парсинг сложных документов (PDF, DOCX, HTML)", url: "https://unstructured.io/", icon: "📄" }
    ]
  },
  {
    title: "Эмбеддинги и векторные базы данных",
    goal: "Выбрать модель эмбеддингов и векторную БД под конкретную задачу, понять компромиссы.",
    objectives: [
      "Объяснить, как работают text embeddings",
      "Сравнивать модели: OpenAI, Cohere, open-source (BGE, E5)",
      "Выбрать векторную БД: Qdrant, pgvector, ChromaDB, Pinecone",
      "Понимать индексацию: HNSW, IVF, brute-force"
    ],
    body: `<h2>Что такое эмбеддинги</h2>
<p>Эмбеддинг — это числовой вектор (обычно 768–3072 чисел), который представляет смысл текста. Тексты с похожим смыслом имеют близкие векторы (малое косинусное расстояние).</p>

<pre><code>"Как сбросить пароль?" → [0.23, -0.45, 0.81, ..., 0.12]
"Не могу войти в аккаунт" → [0.21, -0.43, 0.79, ..., 0.11]
"Погода в Москве" → [-0.67, 0.33, -0.15, ..., 0.88]

cosine_similarity(первый, второй) = 0.94 ← близко
cosine_similarity(первый, третий) = 0.12 ← далеко</code></pre>

<h2>Выбор модели эмбеддингов</h2>

<h3>Проприетарные (API-based)</h3>
<ul>
<li><strong>OpenAI text-embedding-3-large</strong> — 3072 dim, ~$0.13/1M токенов. Качество top-tier, но дорогое при больших объёмах.</li>
<li><strong>Cohere embed-v4</strong> — мультиязычная, хорошо работает с русским. Поддерживает binary quantization для экономии.</li>
<li><strong>Voyage AI</strong> — специализированные модели для кода, финансов, медицины.</li>
</ul>

<h3>Open-source (self-hosted)</h3>
<ul>
<li><strong>BGE-M3</strong> (BAAI) — мультиязычная, 1024 dim, отлично для русского. Работает локально.</li>
<li><strong>E5-Mistral-7B</strong> — LLM-based embedding, высокое качество, но медленнее.</li>
<li><strong>GTE-Qwen2</strong> — Alibaba, конкурент BGE на MTEB бенчмарке.</li>
</ul>

<div class="callout callout-tip"><strong>MTEB Leaderboard</strong> — главный бенчмарк для сравнения embedding-моделей. Проверяйте huggingface.co/spaces/mteb/leaderboard перед выбором.</div>

<h2>Векторные базы данных</h2>

<h3>Qdrant</h3>
<p>Написан на Rust, быстрый, поддерживает payload filters. Self-hosted или cloud. Хороший выбор для продакшена.</p>
<pre><code>from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(url="http://localhost:6333")
client.create_collection("docs", vectors_config=VectorParams(
    size=1024, distance=Distance.COSINE
))</code></pre>

<h3>pgvector (PostgreSQL)</h3>
<p>Расширение PostgreSQL. Если уже используете Postgres — нулевые накладные расходы на инфраструктуру. HNSW-индексы с v0.5. Для <1M векторов — отличный выбор.</p>
<pre><code>CREATE EXTENSION vector;
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1024),
    metadata JSONB
);
CREATE INDEX ON items
    USING hnsw (embedding vector_cosine_ops);</code></pre>

<h3>ChromaDB</h3>
<p>Лёгкий, embedded, Python-native. Идеален для прототипов и dev-сред. Не рекомендуется для продакшена с большими объёмами.</p>

<h3>Pinecone</h3>
<p>Managed SaaS. Не нужно управлять инфраструктурой, но дороже и vendor lock-in. Хорош для команд без DevOps-ресурсов.</p>

<h2>Алгоритмы индексации</h2>
<ul>
<li><strong>Brute-force (flat)</strong> — точный, но O(N). Для <10K векторов — нормально.</li>
<li><strong>HNSW</strong> — граф-based, O(log N). Стандарт для большинства векторных БД. Быстрый, но потребляет много RAM.</li>
<li><strong>IVF</strong> — кластеризация + brute-force внутри кластера. Экономит RAM, но менее точный.</li>
</ul>

<div class="callout callout-warn"><strong>Quantization:</strong> для экономии RAM используйте scalar quantization (float32 → int8) или product quantization. Потеря качества 1-3%, экономия RAM 4-8x.</div>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> SaaS-платформа с 2M чанков хочет переехать с FAISS+pickle на production-ready решение. Команда: 2 бэкенд-разработчика, нет DevOps. Бюджет ограничен.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Qdrant Cloud + scalar quantization:</strong> managed, не нужен DevOps, scalar quantization снижает RAM в 4x — уместится в меньший инстанс. Предсказуемые расходы при постоянной нагрузке.</li>
<li><strong>pgvector если PostgreSQL уже есть:</strong> нулевые операционные затраты, HNSW-индексы справятся с 2M векторов, знакомый SQL для фильтрации по метаданным.</li>
</ul>
<p><strong>Антипаттерн:</strong> Pinecone serverless при постоянной высокой нагрузке — стоимость per-query быстро превысит self-hosted при предсказуемом объёме запросов.</p>
</div>`,
    flashcards: [
      { front: "Косинусное расстояние", back: "Мера схожести двух векторов. cos(A,B) = A·B / (|A|·|B|). Значения от -1 до 1. 1 = идентичный смысл, 0 = ортогональны, -1 = противоположны." },
      { front: "HNSW индекс", back: "Hierarchical Navigable Small World — граф-based алгоритм приближённого поиска. Строит многоуровневый граф навигации. O(log N) время поиска. Дефолтный выбор для большинства векторных БД." },
      { front: "pgvector — когда выбирать?", back: "Когда уже используете PostgreSQL и объём <1M векторов. Нулевые инфраструктурные затраты, HNSW-индексы, привычные SQL-запросы с фильтрами." },
      { front: "BGE-M3 — чем примечателен?", back: "Мультиязычная open-source модель (BAAI), 1024 dim, отлично работает с русским. Поддерживает dense, sparse и colbert-style retrieval одновременно. Запускается локально." },
      { front: "Scalar vs Product quantization", back: "Scalar: float32→int8, экономия RAM 4x, потеря качества 1-3%. Product (PQ): делит вектор на субвекторы, каждый квантует отдельно, экономия 8-32x, потеря качества выше. PQ для >10M векторов." },
      { front: "ChromaDB — когда и когда нет?", back: "Да: прототипы, dev-среда, локальные эксперименты. Нет: продакшен с >100K документов, многопользовательский режим, требования к надёжности. В продакшене — Qdrant или pgvector." },
      { front: "MTEB Leaderboard", back: "Massive Text Embedding Benchmark — стандарт для сравнения embedding-моделей. Тестирует retrieval, classification, clustering, STS. Проверяйте перед выбором модели. Предупреждение: бенчмарк устаревает за 6-12 месяцев." },
      { front: "Pinecone serverless vs self-hosted Qdrant", back: "Pinecone serverless: платите за запросы, zero-ops, vendor lock-in, дороже при постоянной нагрузке. Qdrant self-hosted: предсказуемая стоимость, полный контроль, нужен DevOps. Pinecone окупается при переменной нагрузке." }
    ],
    quiz: [
      {
        question: "Какая векторная БД наиболее подходит для команды, которая уже использует PostgreSQL и имеет <500K документов?",
        options: [
          "Pinecone — managed solution без ops",
          "pgvector — расширение PostgreSQL",
          "ChromaDB — embedded и простой",
          "Milvus — для больших объёмов"
        ],
        correct: 1,
        explanation: "pgvector — нулевые инфраструктурные затраты поверх существующего PostgreSQL. HNSW-индексы обеспечивают быструю скорость поиска. 500K документов — в пределах комфортного диапазона."
      },
      {
        question: "Что такое scalar quantization в контексте векторных БД?",
        options: [
          "Уменьшение размерности вектора с 1024 до 256",
          "Преобразование float32 весов в int8 для экономии RAM",
          "Сжатие текста перед созданием эмбеддинга",
          "Удаление дублирующихся векторов"
        ],
        correct: 1,
        explanation: "Scalar quantization конвертирует float32 в int8, уменьшая потребление RAM в 4x при потере качества 1-3%. Критично для продакшена с миллионами векторов."
      },
      {
        question: "Стартап строит мультиязычный поиск по документам на русском, английском и китайском. Какую модель выбрать?",
        options: [
          "text-embedding-ada-002 — самая известная",
          "BGE-M3 или Cohere embed-v4 — мультиязычные",
          "E5-base — дешевле и быстрее",
          "Любую — все модели одинаково хорошо работают с разными языками"
        ],
        correct: 1,
        explanation: "Для мультиязычного retrieval нужна модель, обученная на соответствующих языках. BGE-M3 и Cohere embed-v4 — лидеры мультиязычного MTEB. ada-002 слабее для нелатинских языков."
      },
      {
        question: "Индекс HNSW потребляет слишком много RAM при 5M векторов. Как снизить потребление с минимальной потерей качества?",
        options: [
          "Перейти на brute-force flat-индекс",
          "Применить scalar quantization (float32→int8)",
          "Уменьшить количество документов",
          "Использовать ChromaDB вместо Qdrant"
        ],
        correct: 1,
        explanation: "Scalar quantization уменьшает RAM в 4x с потерей качества 1-3%. Это стандартный production-приём для больших корпусов. Brute-force даст точность, но убьёт latency."
      },
      {
        question: "Команда начинает новый RAG-проект. Какой стек выбрать для быстрого старта без DevOps-ресурсов?",
        options: [
          "Milvus + self-hosted инфраструктура",
          "ChromaDB для прототипа, затем Qdrant Cloud или Pinecone для продакшена",
          "FAISS + pickle-файлы на диске",
          "Сразу строить на pgvector для единообразия"
        ],
        correct: 1,
        explanation: "ChromaDB — нулевая конфигурация для прототипа. После валидации гипотезы — миграция на Qdrant Cloud (managed, Rust, production-ready) или Pinecone. FAISS+pickle — только для warmup, не продакшен."
      },
      {
        question: "Что такое «recall» при оценке ANN-алгоритма (HNSW)?",
        options: [
          "Скорость построения индекса",
          "Доля настоящих ближайших соседей, найденных алгоритмом",
          "Количество векторов в индексе",
          "Размер вектора в байтах"
        ],
        correct: 1,
        explanation: "ANN-recall = (найдено истинных ближайших) / K. HNSW с ef_search=128 даёт recall ~0.99 при хорошей скорости. Чем выше ef_search — тем выше recall, тем медленнее поиск."
      }
    ],
    sources: [
      { title: "MTEB Leaderboard", desc: "Бенчмарк embedding-моделей на HuggingFace", url: "https://huggingface.co/spaces/mteb/leaderboard", icon: "🏆" },
      { title: "Qdrant Documentation", desc: "Документация по API и best practices", url: "https://qdrant.tech/documentation/", icon: "📗" },
      { title: "pgvector GitHub", desc: "Расширение PostgreSQL для векторного поиска", url: "https://github.com/pgvector/pgvector", icon: "🐘" },
      { title: "Ann Benchmarks", desc: "Сравнение алгоритмов ANN-поиска", url: "https://ann-benchmarks.com/", icon: "📊" }
    ]
  },
  {
    title: "Retrieval: поиск, фильтрация и ре-ranking",
    goal: "Настроить retrieval pipeline для максимальной точности: hybrid search, re-ranking, metadata filters.",
    objectives: [
      "Реализовать semantic search с фильтрами по метаданным",
      "Понять и применить hybrid search (dense + sparse)",
      "Настроить re-ranking для повышения точности топ-K",
      "Использовать query transformation техники"
    ],
    body: `<h2>Retrieval — самое слабое звено</h2>
<p>Исследования показывают: в 80% случаев плохой RAG проблема не в LLM, а в retrieval. Модель не может ответить правильно, если ей не дали правильный контекст.</p>

<h2>Semantic Search: основа</h2>
<pre><code># Базовый semantic search
results = vectorstore.similarity_search(
    query="Как настроить SSO?",
    k=5,
    filter={"doc_type": "guide", "lang": "ru"}
)</code></pre>

<p>K (количество возвращаемых чанков) — критический параметр. Слишком мало — упускаете релевантный контекст. Слишком много — шум и дорогие LLM-вызовы.</p>

<div class="callout callout-tip"><strong>Начните с K=5</strong> и итерируйте. Для большинства задач оптимально 3-7 чанков.</div>

<h2>Hybrid Search: dense + sparse</h2>
<p>Semantic search плохо работает для точных совпадений: номера ошибок, имена, коды. Sparse search (BM25) — наоборот. Гибрид = лучшее из обоих.</p>

<pre><code>from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

bm25 = BM25Retriever.from_documents(docs)
vector = vectorstore.as_retriever(search_kwargs={"k": 5})

hybrid = EnsembleRetriever(
    retrievers=[bm25, vector],
    weights=[0.4, 0.6]  # sparse, dense
)</code></pre>

<h3>Reciprocal Rank Fusion (RRF)</h3>
<p>Альтернативный способ объединения результатов: каждый retriever ранжирует документы, RRF объединяет ранги. Не требует калибровки весов.</p>

<h2>Re-ranking: от хорошего к отличному</h2>
<p>Retriever возвращает топ-20 кандидатов. Re-ranker (cross-encoder) переранжирует их с гораздо более высокой точностью и возвращает топ-5.</p>

<pre><code>from langchain.retrievers import ContextualCompressionRetriever
from langchain_cohere import CohereRerank

reranker = CohereRerank(model="rerank-v3.5", top_n=5)

compressor_retriever = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=vectorstore.as_retriever(
        search_kwargs={"k": 20}
    )
)
# Сначала 20 кандидатов, потом re-rank до 5</code></pre>

<h3>Open-source re-rankers</h3>
<ul>
<li><strong>BGE-Reranker-v2</strong> — BAAI, мультиязычный, self-hosted</li>
<li><strong>Jina Reranker v2</strong> — компактный, быстрый</li>
<li><strong>ms-marco-MiniLM</strong> — cross-encoder от Microsoft</li>
</ul>

<h2>Query Transformation</h2>
<p>Пользовательские запросы часто плохие для retrieval. Трансформации помогают:</p>

<h3>Query Rewriting</h3>
<p>LLM переписывает запрос в более точную форму для retrieval:</p>
<pre><code>"не работает логин" →
"ошибка аутентификации пользователя SSO авторизация"</code></pre>

<h3>HyDE (Hypothetical Document Embeddings)</h3>
<p>LLM генерирует гипотетический ответ, и <em>его</em> эмбеддинг используется для поиска. Парадоксально, но работает: гипотетический документ ближе к реальным документам, чем короткий запрос.</p>

<h3>Multi-Query</h3>
<p>LLM генерирует 3-5 вариантов запроса, каждый используется для retrieval, результаты объединяются:</p>
<pre><code>from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)</code></pre>

<div class="callout callout-warn"><strong>Latency:</strong> каждая query transformation добавляет 1-3 секунды. Для real-time чат-ботов может быть критично. Для async-обработки — нормально.</div>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Техническая поддержка. Пользователи спрашивают «ошибка ERR-4521 при логине через корпоративный SSO». Semantic search находит общие статьи про аутентификацию, но не конкретный номер ошибки.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Hybrid search BM25 + dense (веса 0.6/0.4):</strong> BM25 точно находит «ERR-4521», dense подтягивает семантически релевантный контекст про SSO-ошибки. Объединение через RRF.</li>
<li><strong>Metadata filter doc_type=«troubleshooting»:</strong> сужает поиск до troubleshooting-гайдов, исключая маркетинговые страницы и changelog.</li>
</ul>
<p><strong>Антипаттерн:</strong> применять HyDE для поиска по точным кодам ошибок — LLM сгенерирует гипотетический документ без конкретного «ERR-4521», embeddings промажут мимо нужного чанка.</p>
</div>`,
    flashcards: [
      { front: "Hybrid Search", back: "Комбинация dense (semantic/эмбеддинги) и sparse (BM25/TF-IDF) поиска. Dense находит семантически похожее, sparse — точные совпадения (номера, имена). Объединяются через weighted average или RRF." },
      { front: "Re-ranking", back: "Двухступенчатый retrieval: 1) Retriever возвращает топ-20 кандидатов (быстро, приблизительный). 2) Cross-encoder re-ranker переранжирует все 20 с высокой точностью и возвращает топ-5. Качество растёт на 10-25%." },
      { front: "HyDE (Hypothetical Document Embeddings)", back: "LLM генерирует гипотетический ответ на запрос, затем эмбеддинг этого ответа используется для поиска. Парадокс: сгенерированный документ ближе к реальным документам в векторном пространстве, чем короткий пользовательский запрос." },
      { front: "RRF (Reciprocal Rank Fusion)", back: "Способ объединить результаты нескольких retriever-ов без калибровки весов. Формула: score = Σ 1/(k+rank_i), k=60. Документы, стабильно хорошо ранжируемые обоими retriever-ами, выигрывают." },
      { front: "Multi-Query retrieval", back: "LLM генерирует 3-5 перефразировок запроса, каждая отправляется в retriever, результаты объединяются и дедуплицируются. Расширяет покрытие, особенно для размытых запросов. Цена: N LLM-вызовов + latency." },
      { front: "Cross-encoder vs Bi-encoder", back: "Bi-encoder (retriever): независимо кодирует query и документ → быстро, масштабируется. Cross-encoder (re-ranker): видит query и документ вместе → точнее, но O(N) вызовов. Типичная схема: bi-encoder→top-20, cross-encoder→top-5." },
      { front: "Query rewriting — зачем?", back: "Пользовательские запросы коротки и неточны для retrieval. LLM разворачивает «не работает логин» в «ошибка аутентификации SSO SAML OIDC авторизация». Sparse и dense search работают лучше с более полным запросом." },
      { front: "Metadata filters при retrieval", back: "Фильтры по metadata сужают область поиска до нужного подмножества (doc_type=«guide», lang=«ru», date>«2025-01-01»). Применяются ДО ANN-поиска (pre-filter) или ПОСЛЕ (post-filter). Pre-filter точнее, post-filter быстрее." }
    ],
    quiz: [
      {
        question: "Пользователь ищет документ по номеру ошибки 'ERR-4521'. Какой тип поиска наиболее эффективен?",
        options: [
          "Только semantic search (dense retrieval)",
          "Только BM25 (sparse retrieval)",
          "Hybrid search с приоритетом sparse",
          "HyDE с генерацией гипотетического документа"
        ],
        correct: 2,
        explanation: "Точные идентификаторы (номера ошибок, коды) лучше находят sparse-методы (BM25). Но hybrid с приоритетом sparse — надёжнее, так как подхватит и семантически релевантный контекст."
      },
      {
        question: "Какой pipeline retrieval даёт максимальное качество (при допустимой latency)?",
        options: [
          "K=5 без фильтров",
          "K=20 + re-ranker top-5",
          "K=5 + metadata filters",
          "K=20 без re-ranking"
        ],
        correct: 1,
        explanation: "K=20 с re-ranker top-5 — стандартный production-паттерн. Retriever возвращает широкий набор кандидатов, re-ranker отбирает лучшие 5 с высокой точностью. Прибавка к качеству 10-25%."
      },
      {
        question: "Команда заметила: при hybrid search BM25 постоянно перебивает семантический поиск для большинства запросов. Что настраивать?",
        options: [
          "Отключить BM25, перейти на pure dense",
          "Изменить веса EnsembleRetriever: снизить вес BM25, повысить dense",
          "Увеличить K у BM25-retriever-а",
          "Использовать другую embedding-модель"
        ],
        correct: 1,
        explanation: "Веса EnsembleRetriever (weights=[bm25_w, dense_w]) — главный рычаг настройки hybrid. Для conversational запросов увеличьте вес dense (0.3/0.7), для поиска по точным терминам — наоборот (0.6/0.4)."
      },
      {
        question: "HyDE добавляет задержку из-за дополнительного LLM-вызова. В каком случае это оправдано?",
        options: [
          "Для простых FAQ-запросов",
          "Для real-time чат-ботов с требованием <1s latency",
          "Для длинных аналитических запросов, где короткий запрос плохо покрывается векторами",
          "Для поиска по точным кодам ошибок"
        ],
        correct: 2,
        explanation: "HyDE работает лучше всего для запросов типа «объясни мне...» или «что такое...», где пользовательский запрос — несколько слов, а релевантный документ — несколько абзацев. Для точного keyword-поиска — бесполезен."
      },
      {
        question: "Что такое «lost in the middle» применительно к retrieval?",
        options: [
          "Документы в середине базы данных хуже индексируются",
          "LLM хуже использует информацию из чанков в середине контекста по сравнению с началом и концом",
          "BM25 теряет документы с редкими терминами",
          "Overlap между чанками создаёт дублирование"
        ],
        correct: 1,
        explanation: "«Lost in the middle» (Liu et al., 2023) — LLM лучше использует информацию из начала и конца промпта. Практическое следствие: ставьте самые важные чанки первыми или последними, не в середину."
      },
      {
        question: "Компания внедрила Multi-Query retrieval и видит улучшение recall, но latency выросла с 0.8s до 2.5s. Как оптимизировать?",
        options: [
          "Убрать Multi-Query и вернуться к одному запросу",
          "Запускать несколько запросов параллельно (asyncio.gather)",
          "Уменьшить число перефразировок с 5 до 2",
          "И B, и C — параллелизм + меньше вариантов"
        ],
        correct: 3,
        explanation: "Оба подхода вместе: 3 параллельных запроса вместо 5 последовательных дадут ~60% экономии latency. asyncio.gather запускает все retrieval-вызовы одновременно — ключевой паттерн для production."
      }
    ],
    sources: [
      { title: "Cohere Rerank v3.5", desc: "State-of-the-art re-ranker с API", url: "https://cohere.com/blog/rerank-v3-5", icon: "🔀" },
      { title: "HyDE Paper (Gao et al.)", desc: "Precise Zero-Shot Dense Retrieval without Relevance Labels", url: "https://arxiv.org/abs/2212.10496", icon: "📄" },
      { title: "BM25 Retriever", desc: "Классический sparse retrieval в LangChain", url: "https://python.langchain.com/docs/how_to/ensemble_retriever/", icon: "🔍" }
    ]
  },
  {
    title: "Прототип за вечер: первый рабочий RAG",
    goal: "Собрать минимальный работающий RAG-пайплайн на LlamaIndex или LangChain за 1-2 часа.",
    objectives: [
      "Создать работающий RAG-пайплайн за 50 строк кода",
      "Загрузить свои документы и задать вопросы по ним",
      "Итерировать: менять chunking, retrieval, промпт",
      "Определить baseline-качество для дальнейшей оптимизации"
    ],
    body: `<h2>Цель: от нуля до работающих ответов за 1 час</h2>
<p>Прототип — не про идеальное качество. Это про то, чтобы быстро проверить гипотезу: «Может ли RAG вообще работать на наших данных?»</p>

<h2>Вариант A: LlamaIndex (50 строк)</h2>
<pre><code>from llama_index.core import (
    VectorStoreIndex, SimpleDirectoryReader, Settings
)
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

# Настройки
Settings.llm = OpenAI(model="gpt-4o-mini", temperature=0)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
Settings.chunk_size = 512
Settings.chunk_overlap = 64

# Загрузка документов
documents = SimpleDirectoryReader("./docs").load_data()

# Создание индекса
index = VectorStoreIndex.from_documents(documents)

# Query engine
query_engine = index.as_query_engine(
    similarity_top_k=5,
    response_mode="compact"
)

# Тестирование
response = query_engine.query("Какой API rate limit?")
print(response)
print("\\nИсточники:")
for node in response.source_nodes:
    print(f"  - {node.metadata.get('file_name')}: "
          f"score={node.score:.3f}")</code></pre>

<h2>Вариант B: LangChain (60 строк)</h2>
<pre><code>from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader
from langchain.chains import RetrievalQA

# Загрузка
loader = DirectoryLoader("./docs", glob="**/*.md")
docs = loader.load()

# Чанкинг
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512, chunk_overlap=64
)
chunks = splitter.split_documents(docs)

# Векторная БД
vectorstore = Chroma.from_documents(
    chunks, OpenAIEmbeddings()
)

# QA Chain
qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0),
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": 5}
    ),
    return_source_documents=True
)

# Тест
result = qa.invoke("Как настроить вебхуки?")
print(result["result"])</code></pre>

<h2>Тестирование прототипа</h2>
<p>Подготовьте 10-20 тестовых вопросов с известными ответами:</p>
<pre><code>test_questions = [
    {"q": "Какой rate limit API?", "expected": "100 req/min"},
    {"q": "Как сбросить пароль?", "expected": "Settings > Security > Reset"},
    {"q": "Поддерживается ли SSO?", "expected": "Да, SAML 2.0 и OIDC"},
    # ... ещё 10-15 вопросов
]

for item in test_questions:
    response = query_engine.query(item["q"])
    print(f"Q: {item['q']}")
    print(f"A: {response}")
    print(f"Expected: {item['expected']}")
    print(f"Sources: {[n.metadata.get('file_name') for n in response.source_nodes]}")
    print("---")</code></pre>

<h2>Что оценивать на прототипе</h2>
<ol>
<li><strong>Retrieval accuracy</strong> — правильные ли чанки найдены? (проверяйте source_nodes)</li>
<li><strong>Faithfulness</strong> — ответ основан на контексте или модель галлюцинирует?</li>
<li><strong>Relevance</strong> — ответ действительно отвечает на вопрос?</li>
<li><strong>Latency</strong> — сколько времени занимает полный цикл?</li>
</ol>

<div class="callout callout-tip"><strong>Baseline:</strong> если на 20 вопросах хотя бы 12 дают корректный ответ — RAG на ваших данных имеет смысл. Если меньше 8 — проблема скорее всего в данных или чанкинге, а не в retrieval.</div>

<h2>Быстрые улучшения прототипа</h2>
<ul>
<li><strong>Системный промпт:</strong> «Отвечай ТОЛЬКО на основе предоставленного контекста. Если информации недостаточно — скажи об этом.»</li>
<li><strong>Temperature=0:</strong> для фактологических ответов — всегда ноль.</li>
<li><strong>Source citations:</strong> всегда возвращайте источники, даже в прототипе.</li>
<li><strong>Увеличить K:</strong> если модель не находит ответ, попробуйте K=10.</li>
</ul>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Product Manager хочет за выходные проверить: поможет ли RAG автоматизировать ответы на вопросы о продукте (200 MD-файлов документации). Бюджет на эксперимент — несколько долларов на API.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>LlamaIndex + ChromaDB за 50 строк:</strong> SimpleDirectoryReader читает все MD за одну строку, ChromaDB хранит локально без сервера, gpt-4o-mini дёшево. Итого: 1 час и $0.10 на тесты.</li>
<li><strong>20 тестовых вопросов с известными ответами:</strong> сразу проверить source_nodes — retriever находит правильные файлы? Это важнее финального ответа на старте.</li>
</ul>
<p><strong>Антипаттерн:</strong> сразу проектировать production-архитектуру с Qdrant, re-ranker, LangFuse и очередями — прежде чем доказано, что RAG вообще работает на этих данных.</p>
</div>`,
    flashcards: [
      { front: "Response mode: compact vs refine", back: "compact — все чанки в одном промпте (быстро, но лимит токенов). refine — итеративно уточняет ответ по каждому чанку (медленнее, но лучше для длинных контекстов). tree_summarize — рекурсивное суммирование." },
      { front: "Зачем temperature=0 в RAG?", back: "RAG — фактологическая задача. Высокая temperature добавляет креативность, но увеличивает галлюцинации. Temperature=0 делает ответы детерминированными и основанными на контексте." },
      { front: "Baseline-тест прототипа", back: "10-20 вопросов с известными ответами. Оценка: retrieval accuracy (правильные чанки?), faithfulness (нет галлюцинаций?), relevance (отвечает на вопрос?). 60%+ = RAG жизнеспособен." },
      { front: "Source citations в прототипе", back: "Всегда возвращать source_nodes с именем файла и score, даже в самом раннем прототипе. Это позволяет вручную проверять правильность retrieval, а не только финального ответа." },
      { front: "Зачем source_nodes.score проверять?", back: "Score показывает косинусную близость между запросом и чанком. Если топ-1 чанк имеет score < 0.6 — retrieval не нашёл ничего релевантного. Это диагностика без запуска full evaluation." },
      { front: "Первый системный промпт для RAG", back: "Минимальный рабочий вариант: «Ты помощник. Отвечай ТОЛЬКО на основе предоставленного контекста. Если в контексте нет ответа — скажи: не знаю. Не придумывай факты.» Простота важнее сложности на старте." },
      { front: "Когда увеличить K с 5 до 10?", back: "Если модель говорит «не знаю», но вы знаете что ответ в документах — попробуйте K=10. Retriever мог пропустить нужный чанк. Но K>15 без re-ranker снижает precision из-за шума." },
      { front: "Что значит baseline 60%+ в прототипе?", back: "На 20 тестовых вопросах 12+ корректных ответов означает: RAG на этих данных работает. 40-60% — маргинально, смотри на retrieval accuracy. <40% — проблема в данных/чанкинге, не в LLM." }
    ],
    quiz: [
      {
        question: "Что делать, если RAG-прототип на 20 тестовых вопросах даёт менее 8 корректных ответов?",
        options: [
          "Переключиться на более мощную LLM (GPT-4 вместо GPT-4o-mini)",
          "Увеличить chunk_size до 2048",
          "Проверить качество данных и стратегию чанкинга",
          "Добавить re-ranking"
        ],
        correct: 2,
        explanation: "Менее 40% accuracy на прототипе — сигнал проблемы в фундаменте: данные или чанкинг. Более мощная LLM не поможет, если retrieval возвращает мусор. Сначала — качество данных."
      },
      {
        question: "Разработчик проверяет source_nodes и видит: топ-1 чанк имеет score=0.42. Что это значит?",
        options: [
          "Отличный результат, можно двигаться дальше",
          "Retriever не нашёл ничего семантически близкого — нужно проверить данные и запрос",
          "Нужно увеличить размерность эмбеддингов",
          "Score <0.5 означает, что векторная БД сломана"
        ],
        correct: 1,
        explanation: "Score 0.42 означает низкую семантическую близость. Либо документа с ответом нет в индексе, либо чанкинг разбил нужную информацию, либо модель эмбеддингов не подходит для этой предметной области."
      },
      {
        question: "Прототип работает корректно на 15 из 20 вопросов. Какой следующий шаг?",
        options: [
          "Немедленно деплоить в продакшен",
          "Проанализировать 5 неправильных ответов: retrieval или generation проблема?",
          "Добавить все advanced-техники сразу",
          "Сменить LLM провайдера"
        ],
        correct: 1,
        explanation: "75% accuracy — хороший baseline для итерации. Анализ ошибок покажет: если retriever не нашёл правильный чанк — это retrieval-проблема. Если нашёл, но LLM дал неправильный ответ — это generation-проблема. Разные решения."
      },
      {
        question: "Нужно быстро проверить гипотезу: «Поможет ли RAG для нашей документации?» За 2 часа. Что выбрать?",
        options: [
          "LlamaIndex + ChromaDB + OpenAI — минимальный рабочий пример за 50 строк",
          "LangChain + Qdrant + BGE-M3 self-hosted + Cohere reranker",
          "Разработать собственный retriever с нуля",
          "Ждать, пока DevOps настроит production-инфраструктуру"
        ],
        correct: 0,
        explanation: "За 2 часа — нужен минимальный стек. LlamaIndex + ChromaDB + OpenAI API: нет инфраструктуры, копипаст примера из документации, ChromaDB не требует сервера. Цель — проверить гипотезу, а не построить продукт."
      },
      {
        question: "Что является обязательным в любом RAG-прототипе, даже самом минимальном?",
        options: [
          "Re-ranking и guardrails",
          "Source citations и temperature=0",
          "Streaming и semantic cache",
          "A/B тестирование и golden dataset"
        ],
        correct: 1,
        explanation: "Source citations позволяют проверить retrieval вручную. Temperature=0 устраняет случайность для воспроизводимой отладки. Остальное — улучшения для более поздних итераций."
      },
      {
        question: "Прототип на 100 вопросах: retrieval accuracy 90%, но faithfulness только 55%. Что нужно?",
        options: [
          "Улучшить retrieval — добавить re-ranking",
          "Усилить системный промпт: явный запрет добавлять факты вне контекста",
          "Увеличить размер чанков",
          "Перейти на другую модель эмбеддингов"
        ],
        correct: 1,
        explanation: "Высокий retrieval accuracy + низкий faithfulness = retrieval работает, LLM «добавляет от себя». Решение — generation: более строгий system prompt, Self-RAG паттерн, проверка выводов. Не retrieval."
      }
    ],
    sources: [
      { title: "LlamaIndex Starter Example", desc: "Минимальный рабочий пример за 5 минут", url: "https://docs.llamaindex.ai/en/stable/getting_started/starter_example/", icon: "🦙" },
      { title: "LangChain RAG Tutorial", desc: "Пошаговый туториал с ChromaDB", url: "https://python.langchain.com/docs/tutorials/rag/", icon: "🦜" },
      { title: "ChromaDB Getting Started", desc: "Embedded векторная БД для прототипов", url: "https://docs.trychroma.com/getting-started", icon: "🌈" }
    ]
  },
  {
    title: "Evaluation: как измерить качество RAG",
    goal: "Построить evaluation pipeline: автоматические метрики + human review для итеративного улучшения.",
    objectives: [
      "Объяснить 4 ключевых метрики RAG: faithfulness, relevance, recall, precision",
      "Настроить RAGAS для автоматической evaluation",
      "Создать golden dataset для тестирования",
      "Проводить A/B тесты компонентов RAG-пайплайна"
    ],
    body: `<h2>Без evaluation — вы слепы</h2>
<p>«Мне кажется, стало лучше» — не метрика. RAG evaluation измеряет конкретные аспекты качества и позволяет итерировать с данными, а не с интуицией.</p>

<h2>Четыре ключевых метрики</h2>

<h3>1. Faithfulness (верность)</h3>
<p>Ответ основан ТОЛЬКО на предоставленном контексте? Или модель добавила что-то от себя?</p>
<pre><code>Контекст: "Rate limit: 100 запросов/мин"
Ответ: "Rate limit: 100 запросов/мин, а в premium-плане — 1000"
→ Faithfulness: LOW (1000 не в контексте)</code></pre>

<h3>2. Answer Relevance (релевантность ответа)</h3>
<p>Ответ действительно отвечает на заданный вопрос?</p>
<pre><code>Вопрос: "Как настроить SSO?"
Ответ: "Наша компания использует SAML 2.0 с 2019 года."
→ Relevance: LOW (не отвечает «как настроить»)</code></pre>

<h3>3. Context Precision</h3>
<p>Из найденных чанков — сколько реально релевантных? (сигнал к шуму)</p>

<h3>4. Context Recall</h3>
<p>Из всех релевантных чанков в базе — сколько retriever нашёл? (полнота поиска)</p>

<h2>RAGAS: фреймворк evaluation</h2>
<pre><code>from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper

eval_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))
eval_embeddings = LangchainEmbeddingsWrapper(
    OpenAIEmbeddings(model="text-embedding-3-small")
)

results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall],
    llm=eval_llm,
    embeddings=eval_embeddings
)

print(results)
# {'faithfulness': 0.87, 'answer_relevancy': 0.91,
#  'context_precision': 0.73, 'context_recall': 0.82}</code></pre>

<h2>Golden Dataset</h2>
<p>Набор из 50-200 пар (вопрос, эталонный ответ, релевантные документы). Собирается вручную из реальных пользовательских запросов.</p>

<pre><code>golden_dataset = [
    {
        "question": "Какой rate limit API?",
        "ground_truth": "100 запросов в минуту для standard, 1000 для premium",
        "contexts": ["doc_api_limits.md#section-3"],
        "metadata": {"category": "api", "difficulty": "easy"}
    },
    # ... 50-200 записей
]</code></pre>

<div class="callout callout-tip"><strong>Совет:</strong> начните с 30 вопросов. Этого достаточно для первых итераций. Расширяйте до 100+ по мере накопления реальных запросов от пользователей.</div>

<h2>Human-in-the-Loop</h2>
<p>Автоматические метрики (RAGAS) — хорошая отправная точка, но не замена человеческой оценки. Настройте feedback loop:</p>
<ul>
<li><strong>👍/👎 кнопки</strong> в интерфейсе — минимальный сбор данных</li>
<li><strong>Sampling:</strong> случайно выбирайте 5% ответов для ручной проверки</li>
<li><strong>Failure analysis:</strong> все 👎 ответы — обязательный разбор</li>
</ul>

<h2>A/B тестирование компонентов</h2>
<p>Меняйте ОДИН компонент за раз и измеряйте влияние:</p>
<ol>
<li>Chunk size: 256 vs 512 vs 1024</li>
<li>Embedding model: text-embedding-3-small vs BGE-M3</li>
<li>Retrieval K: 3 vs 5 vs 10</li>
<li>Re-ranking: без vs Cohere Rerank vs BGE-Reranker</li>
<li>LLM: gpt-4o-mini vs gpt-4o vs Claude Sonnet</li>
</ol>

<div class="callout callout-danger"><strong>Никогда не меняйте два компонента одновременно.</strong> Если поменяли chunking и retrieval — не узнаете, что именно повлияло на результат.</div>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Команда запустила RAG для HR-бота. Через неделю пришли жалобы: бот даёт устаревшие правила отпусков. RAGAS faithfulness=0.91, relevance=0.88 — по метрикам всё хорошо. В чём проблема?</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Проверить golden dataset на актуальность:</strong> если тестовые вопросы составлялись до обновления политики — метрики отражают качество на старых данных. Нужно обновить эталонные ответы вместе с документами.</li>
<li><strong>Добавить фильтр по дате в metadata:</strong> поле last_updated в каждом чанке + pre-filter на retrieval отсеивает чанки старше N месяцев для questions про текущие политики.</li>
</ul>
<p><strong>Антипаттерн:</strong> доверять только автоматическим метрикам без регулярного human sampling — RAGAS не знает, что данные устарели, если эталонные ответы тоже устарели.</p>
</div>`,
    flashcards: [
      { front: "Faithfulness vs Relevance", back: "Faithfulness: ответ основан на контексте (нет галлюцинаций). Relevance: ответ отвечает на вопрос. Можно быть faithful но irrelevant (правда, но не о том), или relevant но unfaithful (о том, но выдумано)." },
      { front: "Golden Dataset", back: "Набор 50-200 пар (вопрос, эталонный ответ, релевантные документы) для evaluation. Собирается вручную из реальных запросов. Фундамент для A/B-тестов и regression-тестирования." },
      { front: "RAGAS", back: "Open-source фреймворк для автоматической evaluation RAG. Измеряет 4 метрики через LLM-as-judge (обычно GPT-4). Быстро, дёшево, коррелирует с human eval на 0.7-0.8." },
      { front: "Context Precision vs Context Recall", back: "Precision: из найденных чанков какая доля реально релевантна? (сигнал к шуму). Recall: из всех релевантных чанков в базе какую долю retriever нашёл? (полнота). Оба нужны — высокая precision при низком recall бесполезна." },
      { front: "LLM-as-judge — что это?", back: "Использование LLM (обычно GPT-4) для автоматической оценки качества ответов RAG. RAGAS, TruLens, DeepEval так работают. Корреляция с human eval ~0.7-0.8. Быстро, масштабируемо, но дорого при большом датасете." },
      { front: "Regression testing в RAG", back: "Запуск golden dataset перед каждым деплоем — аналог unit-тестов. Если faithfulness упал с 0.87 до 0.72 после изменения промпта — деплой блокируется. Интегрируется в CI/CD через RAGAS." },
      { front: "Human feedback loop", back: "👍/👎 кнопки в интерфейсе + sampling 5% для ручной проверки + обязательный разбор всех 👎. Данные обратной связи используются для расширения golden dataset и выявления систематических ошибок." },
      { front: "Context window и evaluation", back: "При K=20 и chunk_size=1024 контекст может превысить 20K токенов. Большой контекст = «lost in the middle» + дорогой LLM-вызов. Evaluation должна включать измерение среднего размера контекста в токенах." }
    ],
    quiz: [
      {
        question: "RAG-система отвечает правильно, но часто добавляет факты, которых нет в контексте. Какая метрика страдает?",
        options: [
          "Answer Relevance",
          "Context Precision",
          "Faithfulness",
          "Context Recall"
        ],
        correct: 2,
        explanation: "Faithfulness измеряет, насколько ответ основан ТОЛЬКО на контексте. Добавление внешних фактов = низкий faithfulness, даже если факты правильные."
      },
      {
        question: "Почему нельзя менять chunk_size и embedding model одновременно в A/B тесте?",
        options: [
          "Это технически невозможно",
          "Невозможно определить, какой компонент повлиял на результат",
          "RAGAS не поддерживает мульти-переменные тесты",
          "Это слишком дорого"
        ],
        correct: 1,
        explanation: "Принцип A/B тестирования: менять один компонент за раз. Иначе невозможно атрибутировать улучшение/ухудшение конкретному изменению."
      },
      {
        question: "RAGAS показывает: context_recall=0.95, context_precision=0.30. Что это означает?",
        options: [
          "Retriever находит почти все нужные чанки, но вместе с большим количеством шума",
          "Retriever пропускает 70% нужных документов",
          "Отличный результат по обеим метрикам",
          "LLM генерирует нерелевантные ответы"
        ],
        correct: 0,
        explanation: "Высокий recall + низкий precision: retriever находит всё релевантное, но тащит огромное количество нерелевантных чанков. LLM получает зашумлённый контекст. Решение: повысить K для recall уже не нужно — нужен re-ranker для фильтрации."
      },
      {
        question: "Сколько вопросов в golden dataset нужно для первых итераций?",
        options: [
          "5-10 — достаточно для старта",
          "30-50 — минимум для значимых выводов",
          "1000+ — только большой датасет надёжен",
          "Количество не важно, важно качество"
        ],
        correct: 1,
        explanation: "30-50 вопросов — достаточно для первых A/B тестов при условии разнообразия категорий. 5-10 — слишком мало для статистики. 1000+ — избыточно на старте, собирайте инкрементально из реальных запросов."
      },
      {
        question: "Команда добавила в golden dataset только лёгкие вопросы с очевидными ответами. Какой риск?",
        options: [
          "Evaluation будет занимать слишком много времени",
          "Метрики будут искусственно завышены, система провалится на реальных пользовательских запросах",
          "RAGAS не поддерживает простые вопросы",
          "Regression tests будут падать"
        ],
        correct: 1,
        explanation: "Golden dataset должен отражать реальное распределение запросов: лёгкие, средние, сложные, пограничные случаи. Датасет из только лёгких вопросов даст метрики 0.95+, которые ничего не говорят о реальном качестве."
      },
      {
        question: "Faithfulness вырос с 0.72 до 0.89 после изменения system prompt. Следующий шаг?",
        options: [
          "Немедленно деплоить",
          "Проверить, не упали ли другие метрики (relevance, precision), затем деплоить",
          "Улучшать дальше — 0.89 недостаточно",
          "Запустить только human review"
        ],
        correct: 1,
        explanation: "Улучшение одной метрики может ухудшить другую: более строгий промпт повышает faithfulness, но может снизить answer relevance (модель начинает отвечать «не знаю» на сложные вопросы). Всегда проверяйте всё."
      }
    ],
    sources: [
      { title: "RAGAS Documentation", desc: "Open-source RAG evaluation framework", url: "https://docs.ragas.io/", icon: "📊" },
      { title: "TruLens", desc: "Observability и evaluation для LLM-приложений", url: "https://www.trulens.org/", icon: "🔍" },
      { title: "RAG Evaluation Paper (Es et al.)", desc: "RAGAS: A Framework for Retrieval Augmented Generation Evaluation", url: "https://arxiv.org/abs/2309.15217", icon: "📄" }
    ]
  },
  {
    title: "Продакшен-архитектура RAG",
    goal: "Превратить прототип в production-ready систему: observability, кэширование, streaming, guardrails, cost optimization.",
    objectives: [
      "Спроектировать production RAG-архитектуру с очередями и кэшем",
      "Настроить observability: tracing, logging, метрики",
      "Реализовать streaming ответов и async-обработку",
      "Добавить guardrails и content filtering"
    ],
    body: `<h2>От прототипа к продакшену: что меняется</h2>
<p>Прототип — это ноутбук с <code>query_engine.query()</code>. Продакшен — это система, которая обрабатывает 1000+ запросов/день, не падает, стоит предсказуемо и её можно отладить.</p>

<h2>Production Architecture</h2>
<pre><code>┌─────────────────────────────────────────────┐
│              API Gateway                     │
│  (rate limiting, auth, request routing)      │
├─────────────────────────────────────────────┤
│           Query Processing                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Cache   │→ │ Rewriter │→ │ Retriever│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                  ↓           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  LLM    │← │ Guardrail│← │ Re-ranker│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│       ↓                                      │
│  ┌──────────┐  ┌──────────┐                 │
│  │ Response │→ │  Trace   │                 │
│  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────┘
         ↕                    ↕
   ┌──────────┐        ┌──────────┐
   │ VectorDB │        │ Eval DB  │
   └──────────┘        └──────────┘</code></pre>

<h2>Кэширование</h2>
<p>30-50% запросов в RAG — повторяющиеся. Кэш экономит деньги и снижает latency.</p>

<h3>Semantic Cache</h3>
<p>Вместо точного совпадения строк — кэш по семантической близости. «Как сбросить пароль?» и «Не могу войти, как поменять пароль?» — один кэш-хит.</p>

<pre><code>from langchain.cache import SemanticCache
from langchain.globals import set_llm_cache

set_llm_cache(SemanticCache(
    embedding=OpenAIEmbeddings(),
    score_threshold=0.95,  # косинусная близость
    redis_url="redis://localhost:6379"
))</code></pre>

<div class="callout callout-tip"><strong>Threshold 0.95+</strong> для semantic cache. Ниже — рискуете вернуть кэшированный ответ на другой вопрос.</div>

<h2>Observability: tracing каждого запроса</h2>
<p>Без tracing невозможно понять, ПОЧЕМУ конкретный ответ был плохим. На каком этапе сломалось?</p>

<h3>LangSmith (LangChain)</h3>
<pre><code>import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "lsv2_..."
os.environ["LANGCHAIN_PROJECT"] = "rag-production"

# Каждый вызов автоматически логируется
# В UI видно: query → rewriting → retrieval → re-ranking → LLM
# С временем, токенами, стоимостью каждого шага</code></pre>

<h3>Альтернативы</h3>
<ul>
<li><strong>LangFuse</strong> — open-source, self-hosted, бесплатный</li>
<li><strong>Arize Phoenix</strong> — open-source, мощный UI</li>
<li><strong>HoneyHive</strong> — enterprise-grade evaluation platform</li>
</ul>

<h3>Ключевые метрики для мониторинга</h3>
<ul>
<li><strong>Latency:</strong> p50, p95, p99 для retrieval и generation отдельно</li>
<li><strong>Token usage:</strong> input/output токены, стоимость за запрос</li>
<li><strong>Retrieval quality:</strong> average relevance score, source diversity</li>
<li><strong>User feedback:</strong> ratio 👍/👎, тренд по времени</li>
<li><strong>Error rate:</strong> timeouts, rate limits, empty retrieval</li>
</ul>

<h2>Streaming</h2>
<p>Пользователи не любят ждать 5-10 секунд. Streaming показывает ответ по токенам:</p>
<pre><code># LlamaIndex streaming
response = query_engine.query("Как настроить SSO?")
for token in response.response_gen:
    print(token, end="", flush=True)

# LangChain streaming
from langchain.callbacks.streaming_stdout import (
    StreamingStdOutCallbackHandler
)
llm = ChatOpenAI(
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)</code></pre>

<h2>Guardrails</h2>
<p>Защита от нежелательных ответов:</p>
<ul>
<li><strong>Input guard:</strong> фильтровать prompt injection, токсичные запросы</li>
<li><strong>Output guard:</strong> проверять PII, токсичность, off-topic</li>
<li><strong>Citation check:</strong> ответ ссылается на реальные источники?</li>
<li><strong>Confidence gate:</strong> если faithfulness score < 0.7 → «Я не уверен, уточните у ...»</li>
</ul>

<pre><code>from guardrails import Guard
from guardrails.hub import RestrictToTopic, ToxicLanguage

guard = Guard().use_many(
    RestrictToTopic(valid_topics=["product_docs", "api"]),
    ToxicLanguage(threshold=0.8)
)

result = guard(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": query}]
)</code></pre>

<h2>Cost Optimization</h2>
<ul>
<li><strong>Semantic cache</strong> — -30-50% LLM-вызовов</li>
<li><strong>Модель-маршрутизатор:</strong> простые вопросы → gpt-4o-mini ($0.15/M), сложные → gpt-4o ($2.5/M)</li>
<li><strong>Context compression:</strong> удалять нерелевантные части чанков перед отправкой в LLM</li>
<li><strong>Batch processing:</strong> для не-real-time задач — batch API (50% скидка)</li>
</ul>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> E-commerce RAG-бот обрабатывает 5000 запросов/день. Стоимость растёт: $800/месяц на LLM. Анализ показал: 40% запросов — вариации «какой у вас возврат товара?».</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Semantic cache threshold=0.95:</strong> 40% запросов обслуживаются из Redis без вызова LLM. Экономия ~$320/месяц. Реализация: 2 часа работы.</li>
<li><strong>Модель-маршрутизатор:</strong> простые FAQ → gpt-4o-mini ($0.15/M), сложные запросы про заказы → gpt-4o ($2.5/M). При 80/20 split — экономия ещё ~60% от оставшейся стоимости.</li>
</ul>
<p><strong>Антипаттерн:</strong> начинать оптимизацию с инфраструктуры (более дешёвая GPU) вместо алгоритмической (cache + routing) — инфраструктурная оптимизация даёт 10-30%, алгоритмическая — 50-80%.</p>
</div>`,
    flashcards: [
      { front: "Semantic Cache", back: "Кэш по семантической близости запросов (cosine similarity ≥ 0.95). В отличие от string-based кэша, ловит переформулировки одного вопроса. Снижает LLM-вызовы на 30-50%." },
      { front: "Tracing в RAG", back: "Запись полного пути каждого запроса: query → rewriting → retrieval (candidates, scores) → re-ranking → LLM (tokens, cost) → response. Позволяет отладить конкретный плохой ответ." },
      { front: "Guardrails в RAG", back: "Многослойная защита: input guard (prompt injection, токсичность), output guard (PII, off-topic), citation check (ссылки на реальные источники), confidence gate (faithfulness < порога → отказ)." },
      { front: "LangFuse vs LangSmith", back: "LangSmith: проприетарный, глубокая интеграция с LangChain, платный. LangFuse: open-source, self-hosted, бесплатный, поддерживает любой LLM-фреймворк. Для privacy-sensitive данных — LangFuse." },
      { front: "Streaming в RAG", back: "Отправляет токены LLM пользователю по мере генерации. Воспринимаемая latency снижается: пользователь видит первый токен через 0.5-1s вместо ожидания 5-10s. Реализуется через response.response_gen (LlamaIndex) или StreamingStdOutCallbackHandler (LangChain)." },
      { front: "Context compression", back: "Удаление нерелевантных частей чанков перед отправкой в LLM. Снижает стоимость (меньше токенов) и уменьшает «lost in the middle». Реализуется через ContextualCompressionRetriever в LangChain." },
      { front: "Incremental indexing", back: "Индексирование только изменившихся документов, а не всего корпуса заново. Критично для систем с частыми обновлениями. Требует tracking'а версий документов и удаления устаревших чанков." },
      { front: "Confidence gate", back: "Если faithfulness score ответа < порога (например 0.7) — система возвращает «Я не уверен, уточните у специалиста» вместо потенциально ложного ответа. Критично для медицины, юриспруденции, финансов." }
    ],
    quiz: [
      {
        question: "Какой threshold для semantic cache оптимален для RAG-системы?",
        options: [
          "0.80 — максимальный кэш-хит рейт",
          "0.95+ — минимальный риск неправильного кэш-хита",
          "0.50 — половина запросов кэшируется",
          "1.00 — только точные совпадения"
        ],
        correct: 1,
        explanation: "0.95+ — минимальный риск вернуть кэшированный ответ на ДРУГОЙ вопрос. При 0.80 — слишком высокий false positive rate: семантически похожие, но разные вопросы получат один ответ."
      },
      {
        question: "Модель-маршрутизатор направляет простые вопросы на gpt-4o-mini, а сложные на gpt-4o. Какая экономия при соотношении 70/30 простых/сложных?",
        options: [
          "~10%",
          "~55%",
          "~70%",
          "~30%"
        ],
        correct: 1,
        explanation: "gpt-4o-mini ~$0.15/M токенов vs gpt-4o ~$2.5/M. 70% запросов на mini (×$0.15) + 30% на 4o (×$2.5) = ~$0.86/M vs $2.5/M если все на 4o. Экономия ~65%."
      },
      {
        question: "Команда замечает: 35% запросов к RAG-системе — переформулировки одних и тех же 10 вопросов. Что внедрить в первую очередь?",
        options: [
          "Re-ranking для лучшего качества ответов",
          "Semantic cache с threshold 0.95 — устранит до 35% LLM-вызовов",
          "Увеличить размер векторной БД",
          "Добавить Multi-Query retrieval"
        ],
        correct: 1,
        explanation: "35% повторяющихся запросов — ideal case для semantic cache. При threshold 0.95 большинство из них будет обслужено из кэша без LLM-вызова. Экономия ~35% стоимости без потери качества."
      },
      {
        question: "Production RAG внезапно начал давать плохие ответы на запросы определённой категории. Tracing отключён. Как диагностировать?",
        options: [
          "Перезапустить сервис",
          "Сравнить новые запросы с golden dataset и проверить retrieval вручную",
          "Обновить LLM модель",
          "Очистить semantic cache"
        ],
        correct: 1,
        explanation: "Без tracing — ручная диагностика. Запустите проблемные запросы через отладочный режим (print source_nodes), сравните с golden dataset. Это покажет: retrieval или generation сломалась. Урок: включайте tracing с первого дня."
      },
      {
        question: "Медицинский RAG-бот иногда генерирует правдоподобные, но неверные дозировки препаратов. Что обязательно?",
        options: [
          "Только улучшить качество документов",
          "Confidence gate: отказывать в ответе если faithfulness < 0.85, направлять к врачу",
          "Использовать более мощную LLM",
          "Добавить больше медицинских документов"
        ],
        correct: 1,
        explanation: "В safety-critical системах (медицина, юриспруденция) confidence gate обязателен. Лучше «не знаю, спросите врача» чем уверенный неправильный ответ про дозировку. Это архитектурное решение, не техническое."
      },
      {
        question: "Какой инструмент observability выбрать для privacy-sensitive корпоративного RAG, который не должен отправлять данные в облако?",
        options: [
          "LangSmith — лучший UX",
          "LangFuse self-hosted — open-source, данные остаются на серверах компании",
          "Arize Phoenix cloud",
          "Простое логирование в файл"
        ],
        correct: 1,
        explanation: "LangFuse self-hosted — open-source, разворачивается в корпоративном периметре, данные трассировок не покидают инфраструктуру. Критично для систем с персональными данными или коммерческой тайной."
      }
    ],
    sources: [
      { title: "LangSmith Platform", desc: "Tracing и evaluation для LangChain приложений", url: "https://smith.langchain.com/", icon: "🔗" },
      { title: "LangFuse (open-source)", desc: "Self-hosted LLM observability", url: "https://langfuse.com/", icon: "📈" },
      { title: "Guardrails AI", desc: "Validation framework для LLM-выводов", url: "https://www.guardrailsai.com/", icon: "🛡️" },
      { title: "GPTCache", desc: "Semantic cache для LLM-запросов", url: "https://github.com/zilliztech/GPTCache", icon: "💾" }
    ]
  },
  {
    title: "Advanced RAG: агенты, графы и production checklist",
    goal: "Освоить продвинутые паттерны: Agentic RAG, Graph RAG, Self-RAG. Получить checklist для production-деплоя.",
    objectives: [
      "Объяснить разницу между Naive, Advanced и Agentic RAG",
      "Применить Graph RAG для связанных документов",
      "Реализовать Self-RAG с самооценкой качества",
      "Провести production readiness review по чеклисту"
    ],
    body: `<h2>Agentic RAG: RAG как инструмент агента</h2>
<p>Вместо статического pipeline (query → retrieve → generate) — агент, который <strong>решает</strong>, нужен ли retrieval, и может итерировать:</p>

<pre><code>Пользователь: "Сравни наши API rate limits с конкурентами Stripe и Twilio"

Агент думает:
1. Нужен retrieval из нашей документации → [находит rate limits]
2. Нужен retrieval из внешнего источника → [web search: Stripe, Twilio]
3. Есть ли достаточно данных? → Да
4. Генерация сравнительной таблицы</code></pre>

<h3>LlamaIndex Workflows</h3>
<pre><code>from llama_index.core.workflow import Workflow, step, Event

class RAGAgent(Workflow):
    @step
    async def decide(self, ev: QueryEvent) -> RetrieveEvent | AnswerEvent:
        # LLM решает: нужен ли retrieval?
        needs_retrieval = await self.llm.astructured_predict(
            NeedsRetrieval, prompt=ev.query
        )
        if needs_retrieval.answer:
            return RetrieveEvent(query=ev.query)
        return AnswerEvent(query=ev.query, context="")

    @step
    async def retrieve(self, ev: RetrieveEvent) -> AnswerEvent:
        nodes = await self.retriever.aretrieve(ev.query)
        # Проверка: достаточно ли контекста?
        if not nodes:
            return QueryEvent(query=rewrite(ev.query))
        return AnswerEvent(query=ev.query, context=nodes)

    @step
    async def generate(self, ev: AnswerEvent) -> ResponseEvent:
        response = await self.llm.agenerate(ev)
        return ResponseEvent(response=response)</code></pre>

<h2>Self-RAG: модель оценивает себя</h2>
<p>После генерации ответа модель оценивает: был ли ответ основан на контексте? Если нет — перегенерирует.</p>

<pre><code># Псевдокод Self-RAG
def self_rag(query, max_retries=2):
    for attempt in range(max_retries):
        # 1. Retrieve
        context = retriever.retrieve(query)

        # 2. Is retrieval needed?
        if not assess("Is retrieval needed?", query):
            return llm.generate(query)  # без контекста

        # 3. Are chunks relevant?
        relevant = [c for c in context if assess("Relevant?", query, c)]
        if not relevant:
            query = rewrite(query)  # попробуем другой запрос
            continue

        # 4. Generate
        answer = llm.generate(query, relevant)

        # 5. Is answer supported by context?
        if assess("Supported?", answer, relevant):
            return answer

    return "I'm not confident. Please clarify your question."</code></pre>

<h2>Graph RAG: связанные знания</h2>
<p>Обычный RAG плохо отвечает на вопросы, требующие связи между документами. «Кто руководил проектом, который упоминается в отчёте за Q3?» — нужно прыгать между документами.</p>

<p><strong>Microsoft GraphRAG</strong> строит knowledge graph из документов:</p>
<ol>
<li>LLM извлекает сущности и связи из текста</li>
<li>Строит граф (сущности → узлы, связи → рёбра)</li>
<li>При запросе — обходит граф для multi-hop reasoning</li>
</ol>

<div class="callout callout-tip"><strong>Graph RAG стоит внедрять, если:</strong> документы связаны перекрёстными ссылками, нужны multi-hop ответы, или обычный RAG стабильно не находит связанные фрагменты. Для FAQ и простых документов — overkill.</div>

<h2>Corrective RAG (CRAG)</h2>
<p>Если retrieval не дал хороших результатов — CRAG подключает web search:</p>
<pre><code>context = retriever.retrieve(query)
relevance_score = evaluator.score(query, context)

if relevance_score > 0.7:
    answer = llm.generate(query, context)
elif relevance_score > 0.3:
    # Дополнить контекст из веба
    web_results = web_search(query)
    answer = llm.generate(query, context + web_results)
else:
    # Retriever не справился — только web
    web_results = web_search(query)
    answer = llm.generate(query, web_results)</code></pre>

<h2>Production Readiness Checklist</h2>

<h3>Данные</h3>
<ul>
<li>☐ Документы очищены и нормализованы</li>
<li>☐ Чанкинг протестирован на golden dataset</li>
<li>☐ Метаданные добавлены ко всем чанкам</li>
<li>☐ Pipeline обновления данных (incremental indexing)</li>
<li>☐ Дедупликация и version control для документов</li>
</ul>

<h3>Retrieval</h3>
<ul>
<li>☐ Hybrid search (dense + sparse)</li>
<li>☐ Re-ranking на топ-20 кандидатах</li>
<li>☐ Metadata filters для scoping</li>
<li>☐ Context precision > 0.7 на golden dataset</li>
<li>☐ Fallback при empty retrieval</li>
</ul>

<h3>Generation</h3>
<ul>
<li>☐ System prompt с инструкцией «only use provided context»</li>
<li>☐ Temperature = 0 для фактологических ответов</li>
<li>☐ Streaming для real-time интерфейсов</li>
<li>☐ Source citations в каждом ответе</li>
<li>☐ Guardrails: PII, off-topic, toxicity</li>
</ul>

<h3>Инфраструктура</h3>
<ul>
<li>☐ Semantic cache (threshold ≥ 0.95)</li>
<li>☐ Rate limiting и auth на API</li>
<li>☐ Tracing: LangSmith / LangFuse / Phoenix</li>
<li>☐ Мониторинг: latency, cost, error rate, user feedback</li>
<li>☐ Алерты на деградацию качества</li>
</ul>

<h3>Evaluation</h3>
<ul>
<li>☐ Golden dataset: 100+ вопросов</li>
<li>☐ RAGAS evaluation в CI/CD</li>
<li>☐ A/B тестирование компонентов</li>
<li>☐ Human feedback loop (👍/👎 + sampling)</li>
<li>☐ Regression tests перед каждым деплоем</li>
</ul>

<div class="callout callout-danger"><strong>Главное правило:</strong> RAG — это не проект, это продукт. Он требует постоянного мониторинга, обновления данных и итерации. Запустили — не значит закончили.</div>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Инвестиционный аналитик использует RAG для вопросов по портфелю компаний. Запрос: «Кто основал компанию, которую мы приобрели в Q3?» — система возвращает «не знаю», хотя данные есть в нескольких документах.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Graph RAG:</strong> построить knowledge graph с сущностями (компании, люди, даты сделок) и связями. Multi-hop reasoning: «приобретение Q3» → «компания X» → «основатель» — три узла графа.</li>
<li><strong>Agentic RAG с двумя retrieval-шагами:</strong> первый запрос находит факт сделки Q3, второй запрос с извлечённым именем компании находит её историю. Дешевле Graph RAG для небольшого корпуса.</li>
</ul>
<p><strong>Антипаттерн:</strong> увеличивать K до 50+ в надежде что все нужные документы попадут в контекст — «lost in the middle» ухудшит ответ, стоимость вырастет, latency станет неприемлемой.</p>
</div>`,
    flashcards: [
      { front: "Agentic RAG vs Naive RAG", back: "Naive: статический pipeline (retrieve → generate). Agentic: агент решает, нужен ли retrieval, может переписывать запрос, итерировать, использовать несколько источников (vector DB + web + API). Гибче, но дороже и медленнее." },
      { front: "Self-RAG", back: "Модель оценивает свой собственный ответ: (1) нужен ли retrieval? (2) релевантны ли чанки? (3) ответ основан на контексте? Если нет — перегенерирует или переписывает запрос. Повышает faithfulness на 15-30%." },
      { front: "Graph RAG", back: "Строит knowledge graph из документов (сущности → узлы, связи → рёбра). Позволяет multi-hop reasoning: «кто руководил проектом из Q3-отчёта?». Microsoft GraphRAG — референсная реализация. Overkill для простых FAQ." },
      { front: "Corrective RAG (CRAG)", back: "Если retrieval даёт низкий score — CRAG дополняет или заменяет контекст web search. Трёхступенчатая логика: score>0.7 → только vector DB, 0.3-0.7 → vector + web, <0.3 → только web." },
      { front: "Production Readiness — минимум", back: "Данные: очищены, метаданные, инкрементальный update. Retrieval: hybrid + re-ranker + фильтры. Generation: system prompt, temperature=0, source citations. Infra: tracing, semantic cache, rate limiting, alerts." },
      { front: "LlamaIndex Workflows", back: "Event-driven система для Agentic RAG. Каждый шаг — @step-функция, возвращает Event. Позволяет строить сложные нелинейные пайплайны: условные ветки, циклы, параллельное выполнение." },
      { front: "Multi-hop reasoning в RAG", back: "Вопросы, требующие связи между несколькими документами: «Кто директор компании, упомянутой в договоре X?». Обычный RAG не справляется — нужен Graph RAG или Agentic RAG с несколькими retrieval-шагами." },
      { front: "Когда НЕ нужен Agentic RAG?", back: "Если запросы однотипны, latency критична (<2s), бюджет ограничен. Agentic RAG дороже (несколько LLM-вызовов) и медленнее. Начинайте с Naive/Advanced RAG и добавляйте агентность только при доказанной необходимости." }
    ],
    quiz: [
      {
        question: "Пользователь спрашивает: «Как наш SLA соотносится с конкурентами?» Какой RAG-паттерн наиболее подходит?",
        options: [
          "Naive RAG — один retrieval + generation",
          "Agentic RAG — агент ищет и в своей БД, и в вебе",
          "Self-RAG — модель оценивает свой ответ",
          "HyDE — гипотетический документ для retrieval"
        ],
        correct: 1,
        explanation: "Вопрос требует два источника: внутренний SLA (vector DB) и данные конкурентов (web search). Только Agentic RAG может использовать несколько инструментов и комбинировать результаты."
      },
      {
        question: "Что делать, если RAG-система стабильно даёт faithfulness < 0.6 при хорошем context recall > 0.8?",
        options: [
          "Улучшить retrieval — добавить re-ranking",
          "Увеличить количество чанков K",
          "Улучшить system prompt и добавить guardrails (Self-RAG)",
          "Переключиться на более мощную LLM"
        ],
        correct: 2,
        explanation: "Хороший recall + плохой faithfulness = retrieval работает, но модель добавляет информацию не из контекста. Это проблема generation, не retrieval. Решение: stronger system prompt, Self-RAG для самооценки, guardrails."
      },
      {
        question: "Корпоративная wiki с 50 000 документов. Часто нужны ответы типа «Кто руководил проектом X, который упоминается в стратегии отдела Y?». Что выбрать?",
        options: [
          "Naive RAG с K=20",
          "Graph RAG — multi-hop reasoning через knowledge graph",
          "HyDE для лучшего retrieval",
          "Self-RAG с итерацией"
        ],
        correct: 1,
        explanation: "Multi-hop вопросы, требующие связи между документами («проект X → руководитель → стратегия Y»), — классический use case для Graph RAG. Обычный RAG не может связать сущности из разных документов."
      },
      {
        question: "RAG-система для новостного агрегатора: документы обновляются каждый час, часть вопросов о событиях, которых нет в индексе. Что архитектурно правильно?",
        options: [
          "Увеличить частоту переиндексации до каждой минуты",
          "CRAG: при низком retrieval score — автоматически дополнять web search",
          "Убрать RAG, использовать только LLM",
          "Graph RAG для связи между новостями"
        ],
        correct: 1,
        explanation: "CRAG — идеальное решение: если векторный retrieval не нашёл ничего (событие слишком свежее для индекса) — fallback на web search. Переиндексация каждую минуту — дорого и сложно в обслуживании."
      },
      {
        question: "Checklist перед production-деплоем: что из перечисленного критически обязательно?",
        options: [
          "Graph RAG и Self-RAG",
          "Tracing + semantic cache + golden dataset с regression tests",
          "Multi-Query и HyDE",
          "Agentic RAG и LlamaIndex Workflows"
        ],
        correct: 1,
        explanation: "Tracing — без него нельзя отлаживать продакшен. Semantic cache — cost optimization. Golden dataset + regression — защита от деградации при обновлениях. Graph/Self/Agentic RAG — advanced-паттерны, не обязательные для MVP."
      },
      {
        question: "Команда реализовала Self-RAG и видит: система часто повторно запрашивает retrieval, значительно растёт latency. Что это означает?",
        options: [
          "Self-RAG работает некорректно, надо отключить",
          "Retrieval стабильно возвращает низкорелевантные чанки — нужно улучшить retrieval",
          "LLM слишком мощная",
          "Слишком большой chunk_size"
        ],
        correct: 1,
        explanation: "Self-RAG повторяет retrieval только когда чанки нерелевантны. Частые повторы — симптом плохого retrieval: либо embedding-модель не подходит для предметной области, либо нужен hybrid search + re-ranker."
      }
    ],
    sources: [
      { title: "Microsoft GraphRAG", desc: "Graph-based RAG для multi-hop reasoning", url: "https://github.com/microsoft/graphrag", icon: "🕸️" },
      { title: "Self-RAG Paper (Asai et al.)", desc: "Learning to Retrieve, Generate, and Critique through Self-Reflection", url: "https://arxiv.org/abs/2310.11511", icon: "📄" },
      { title: "Corrective RAG (Yan et al.)", desc: "CRAG: Corrective Retrieval Augmented Generation", url: "https://arxiv.org/abs/2401.15884", icon: "📄" },
      { title: "LlamaIndex Workflows", desc: "Event-driven agentic workflows", url: "https://docs.llamaindex.ai/en/stable/understanding/workflows/", icon: "🦙" }
    ]
  }
,
  {
    id: 9,
    title: "Contextual Retrieval (Anthropic)",
    goal: "Освоить production-default 2025: префиксная контекстуализация чанков для устранения главной слабости naive chunking.",
    objectives: [
      "Объяснить, почему изолированные чанки теряют контекст документа",
      "Реализовать contextual prefix generation с prompt caching",
      "Интерпретировать результаты Anthropic: −35%, −49%, −67% ошибок retrieval",
      "Посчитать стоимость контекстуализации с prompt caching (~$1/1M токенов)"
    ],
    body: `<h2>Проблема: чанк без контекста</h2>
<p>Стандартный чанкинг вырывает фрагмент из документа. Чанк «Компания показала рост 23%» без контекста — бесполезен: рост чего? За какой период? Из какого документа?</p>
<p>При retrieval этот чанк конкурирует с похожими фрагментами из других документов. Эмбеддинг «голого» чанка не несёт контекста документа, из которого он пришёл.</p>

<h2>Решение: префикс из 50-100 токенов</h2>
<p><strong>Contextual Retrieval</strong> (Anthropic, 2024) — перед каждым чанком добавляется сгенерированный LLM-ом краткий контекст из 50-100 токенов, описывающий место этого чанка в документе. Это происходит до создания эмбеддинга и до индексации в BM25.</p>

<pre><code># Промпт для генерации контекста (с prompt caching)
CONTEXT_PROMPT = """
&lt;document&gt;
{full_document}
&lt;/document&gt;

Вот фрагмент из этого документа:
&lt;chunk&gt;
{chunk_text}
&lt;/chunk&gt;

Напиши краткий (2-3 предложения) контекст для этого фрагмента,
который поможет понять его место в документе при поиске.
Отвечай только контекстом, без лишних слов.
"""

# Результат: контекст + чанк
def contextualize_chunk(doc_text, chunk_text, client):
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        system=[{
            "type": "text",
            "text": doc_text,
            "cache_control": {"type": "ephemeral"}  # prompt caching!
        }],
        messages=[{
            "role": "user",
            "content": f"Chunk: {chunk_text}\\n\\nProvide context."
        }]
    )
    context_prefix = response.content[0].text
    return f"{context_prefix}\\n\\n{chunk_text}"</code></pre>

<h2>Результаты Anthropic</h2>
<ul>
<li><strong>Contextual Retrieval alone:</strong> −35% ошибок retrieval по сравнению с baseline</li>
<li><strong>+ BM25 (hybrid):</strong> −49% ошибок</li>
<li><strong>+ reranker:</strong> −67% ошибок retrieval</li>
</ul>
<p>Это не академический результат — это измерения на реальных production-корпусах. Именно поэтому contextual retrieval стал де-факто стандартом в 2025.</p>

<h2>Стоимость с prompt caching</h2>
<p>Главная проблема — нужно обработать каждый чанк LLM-вызовом. Без оптимизации это дорого. С prompt caching (весь документ кэшируется) стоимость падает до ~<strong>$1 на 1 миллион токенов документов</strong>.</p>

<div class="callout callout-tip"><strong>Ключевой приём:</strong> полный текст документа помещается в system-блок с <code>cache_control: ephemeral</code>. Все чанки одного документа используют один кэш — документ читается LLM только один раз.</div>

<pre><code># Батчевая обработка чанков одного документа
def process_document(doc_text, chunks, client):
    contextualized = []
    for chunk in chunks:
        # document кэшируется после первого вызова
        ctx_chunk = contextualize_chunk(doc_text, chunk, client)
        contextualized.append(ctx_chunk)
    return contextualized
# Стоимость: 1 полный read документа + N×(только чанк)</code></pre>

<h2>Почему это стандарт, а не академия</h2>
<p>Contextual retrieval решает фундаментальную проблему chunking: loss of context. Это не сложно реализовать, не требует специальных моделей и даёт измеримое улучшение на любом корпусе. Если вы строите RAG в 2025 без контекстуализации — вы оставляете 35-67% качества на столе.</p>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Финтех индексирует 500 финансовых отчётов. Retrieval находит чанки с цифрами, но непонятно к какой компании и кварталу они относятся. Faithfulness 0.91, но пользователи жалуются на перепутанные факты между компаниями.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Contextual prefix с именем компании и периодом:</strong> LLM генерирует «Этот фрагмент из годового отчёта Газпром за 2024Q3, раздел "Выручка"». Эмбеддинг теперь несёт контекст источника.</li>
<li><strong>Prompt caching на уровне документа:</strong> 500 отчётов × ~50 чанков = 25 000 LLM-вызовов. С кэшингом — стоимость около $25, без — $250+.</li>
</ul>
<p><strong>Антипаттерн:</strong> добавлять только source метаданных в metadata фильтр без изменения текста чанка — metadata помогает фильтрации, но не улучшает качество самого эмбеддинга.</p>
</div>`,
    flashcards: [
      { front: "Зачем нужен контекстный префикс?", back: "Изолированный чанк теряет контекст документа: «рост 23%» без указания компании и периода — бесполезен при retrieval. Префикс 50-100 токенов восстанавливает этот контекст до создания эмбеддинга." },
      { front: "Результаты Contextual Retrieval (Anthropic)", back: "Prefix alone: −35% ошибок retrieval. +BM25: −49%. +reranker: −67%. Измерено на реальных production-корпусах, что делает это промышленным стандартом, а не академическим экспериментом." },
      { front: "Prompt caching в contextual retrieval", back: "Полный документ помещается в system-блок с cache_control: ephemeral. Все N чанков документа используют один кэш — стоимость: 1 полное чтение + N×(только чанк). Итого ~$1/1M токенов документов." },
      { front: "Когда применять contextual retrieval?", back: "Всегда при работе с длинными документами (>5 страниц), где чанки теряют контекст. Особенно важно: финансовые отчёты, юридические документы, технические спецификации с перекрёстными ссылками." },
      { front: "Claude Haiku для контекстуализации", back: "Оптимальная модель для генерации контекстных префиксов: быстрая (низкая latency при batch-обработке), дешёвая, достаточно умная для 2-3 предложений контекста. Claude 3.5 Sonnet — избыточен для этой задачи." },
      { front: "Contextual retrieval vs metadata", back: "Metadata filters работают на уровне retrieval (pre/post-filter). Contextual prefix улучшает качество самого эмбеддинга — документ-чанк семантически обогащается. Оба подхода дополняют друг друга, не конкурируют." },
      { front: "Порядок операций при contextual retrieval", back: "1) Загрузить документ. 2) Разбить на чанки. 3) Для каждого чанка сгенерировать контекст (LLM + caching). 4) Создать эмбеддинг (контекст + чанк). 5) Добавить в BM25-индекс (контекст + чанк). 6) Сохранить в векторную БД." },
      { front: "50-100 токенов — почему именно столько?", back: "Меньше 50: слишком мало для meaningful контекста. Больше 100: чанк «тонет» в префиксе, эмбеддинг начинает отражать контекст больше чем содержание. 50-100 — эмпирически найденный баланс Anthropic." }
    ],
    quiz: [
      {
        question: "Зачем генерировать контекстный префикс ДО создания эмбеддинга, а не хранить контекст только в metadata?",
        options: [
          "Metadata хранится отдельно от эмбеддинга и не влияет на векторный поиск",
          "Это просто удобнее для реализации",
          "Metadata фильтры работают медленнее",
          "LLM не умеет читать metadata"
        ],
        correct: 0,
        explanation: "Векторный поиск использует только эмбеддинг текста. Если контекст не включён в текст — эмбеддинг его не отражает. Metadata помогает фильтровать, но не улучшает семантическое соответствие запросу."
      },
      {
        question: "Команда обрабатывает 1000 документов по 100 страниц, 50 чанков каждый. Без caching это 50 000 LLM-вызовов с полным документом. Как оптимизировать?",
        options: [
          "Уменьшить количество чанков до 10",
          "Prompt caching: document в system-блоке кэшируется для всех 50 чанков одного документа",
          "Использовать более дешёвую embedding-модель",
          "Пропустить контекстуализацию для больших документов"
        ],
        correct: 1,
        explanation: "С prompt caching: 1000 документов × 1 full read + 50 000 × (только чанк). Стоимость кэшированных токенов = 10% от обычной. Экономия 85-90% стоимости при 50 чанках на документ."
      },
      {
        question: "Contextual prefix для финансового чанка «Выручка выросла на 23%» должен содержать:",
        options: [
          "Полный пересказ документа",
          "Название компании, период, раздел документа — 2-3 предложения",
          "Только название документа",
          "Технические метаданные (page, chunk_id)"
        ],
        correct: 1,
        explanation: "Эффективный префикс отвечает на вопросы: откуда этот факт? В контексте чего? Например: «Этот фрагмент из годового отчёта Газпром 2024, раздел Финансовые результаты Q3. Описывает динамику выручки газового сегмента.»"
      },
      {
        question: "После внедрения contextual retrieval retrieval errors снизились на 35%. Что добавить для достижения −67%?",
        options: [
          "Увеличить размер контекстного префикса до 500 токенов",
          "Добавить hybrid BM25 + reranker поверх контекстуализированных чанков",
          "Переобучить embedding-модель",
          "Увеличить K с 5 до 20"
        ],
        correct: 1,
        explanation: "По результатам Anthropic: contextual prefix −35%, +BM25 hybrid −49%, +reranker −67%. Все три компонента работают вместе — контекстуализация улучшает качество эмбеддингов и BM25-индекса, reranker финально отбирает лучшие."
      },
      {
        question: "Какая модель оптимальна для генерации контекстных префиксов?",
        options: [
          "GPT-4o — максимальное качество",
          "Claude 3 Haiku — быстрая и дешёвая для batch-обработки",
          "Embedding-модель напрямую",
          "Нужна специально обученная модель"
        ],
        correct: 1,
        explanation: "Haiku — оптимальный баланс для контекстуализации: задача простая (2-3 предложения контекста), требует скорости и низкой стоимости для обработки тысяч чанков. Claude Sonnet/Opus — избыточны и дороже в 5-20 раз."
      },
      {
        question: "Почему contextual retrieval называют «production-default 2025», а не «advanced technique»?",
        options: [
          "Потому что Anthropic его запатентовала",
          "Потому что он прост в реализации, не требует специальных моделей и даёт измеримое улучшение на любом корпусе",
          "Потому что он заменяет все другие техники",
          "Потому что его использует OpenAI"
        ],
        correct: 1,
        explanation: "«Advanced technique» — что-то сложное с непредсказуемым эффектом. Contextual retrieval: реализуется за день, работает с любой LLM, улучшение измеримо (35-67%). Это делает его стандартной практикой, а не экзотикой."
      }
    ],
    sources: [
      { title: "Anthropic — Contextual Retrieval (канонический референс курса)", desc: "Оригинальная публикация Anthropic с методологией и результатами", url: "https://www.anthropic.com/news/contextual-retrieval", icon: "📄" },
      { title: "Anthropic Prompt Caching", desc: "Документация по кэшированию промптов для снижения стоимости", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", icon: "💾" },
      { title: "Claude API — System Prompts", desc: "Документация по cache_control в system-блоках", url: "https://docs.anthropic.com/en/api/messages", icon: "🔧" }
    ]
  },
  {
    id: 10,
    title: "Late chunking — альтернатива контекстуализации",
    goal: "Понять late chunking (Jina, 2024) как дешёвую альтернативу contextual retrieval без LLM-вызовов.",
    objectives: [
      "Объяснить механизм late chunking через long-context эмбеддинги",
      "Сравнить late chunking с contextual retrieval по качеству и стоимости",
      "Определить, когда выбрать late chunking вместо contextual retrieval",
      "Понять ограничения: требования к моделям и длине документа"
    ],
    body: `<h2>Идея: эмбеддинг всего документа, чанкинг потом</h2>
<p>В классическом подходе: сначала режем документ на чанки, потом каждый чанк эмбеддируем независимо — контекст теряется. Contextual retrieval решает это через LLM-вызовы. Late chunking решает иначе: через long-context embeddings.</p>

<h2>Как работает late chunking</h2>
<ol>
<li><strong>Пропускаем весь документ через encoder целиком</strong> (в пределах 8192-токенного окна модели)</li>
<li>Encoder производит token-level representations — для каждого токена документа</li>
<li><strong>Усредняем representations по границам чанков</strong> (mean pooling по span токенов каждого чанка)</li>
<li>Каждый чанк получает эмбеддинг, «знающий» о своём контексте в документе</li>
</ol>

<pre><code>from transformers import AutoTokenizer, AutoModel
import torch

model_name = "jinaai/jina-embeddings-v3"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name, trust_remote_code=True)

def late_chunking(doc_text, chunk_boundaries):
    # 1. Токенизируем весь документ
    inputs = tokenizer(doc_text, return_tensors="pt",
                       truncation=True, max_length=8192)

    # 2. Encoder — token-level representations
    with torch.no_grad():
        outputs = model(**inputs)
    token_embeddings = outputs.last_hidden_state[0]

    # 3. Mean pooling по span каждого чанка
    chunk_embeddings = []
    for start, end in chunk_boundaries:
        span_emb = token_embeddings[start:end].mean(dim=0)
        chunk_embeddings.append(span_emb)

    return chunk_embeddings</code></pre>

<h2>Главное преимущество: нет LLM-вызовов</h2>
<p>Contextual retrieval стоит ~$1/1M токенов документов с кэшингом. Late chunking стоит ровно столько, сколько один embedding-вызов на документ — никаких дополнительных LLM API calls. Для большого корпуса это разница в 10-100x.</p>

<h2>Ограничения</h2>
<ul>
<li><strong>Нужна модель с длинным контекстным окном</strong>: минимум 4096 токенов. Из коробки поддерживает jina-embeddings-v3 (8192 токенов).</li>
<li><strong>Документ должен влезать в контекст модели</strong>: для документов >8192 токенов нужно разделение на секции.</li>
<li><strong>Совместимость</strong>: text-embedding-3-large, BGE-M3, Cohere embed-v4 не поддерживают late chunking нативно — нужен специфический mean-pooling API.</li>
</ul>

<h2>Сравнение с contextual retrieval</h2>
<table>
<tr><th>Параметр</th><th>Late chunking</th><th>Contextual retrieval</th></tr>
<tr><td>Стоимость</td><td>Только embedding</td><td>~$1/1M токенов (с caching)</td></tr>
<tr><td>Дополнительные API</td><td>Нет</td><td>LLM API (Claude/GPT)</td></tr>
<tr><td>Качество</td><td>Хорошее</td><td>Лучше (+ семантический контекст)</td></tr>
<tr><td>Модели</td><td>Только long-context биэнкодеры</td><td>Любая LLM + любая embedding</td></tr>
<tr><td>Документы >8K токенов</td><td>Требует разбивки</td><td>Работает (документ в caching)</td></tr>
</table>

<div class="callout callout-tip"><strong>Когда выбирать late chunking:</strong> большой корпус, бюджет ограничен, используете jina-embeddings-v3, документы < 8192 токенов. <strong>Когда contextual retrieval:</strong> качество критично, документы длинные, уже используете Claude API.</div>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> EdTech стартап индексирует 50 000 учебных статей (в среднем 2000 токенов). Бюджет на индексацию минимален, нет Claude API, но есть возможность self-host jina-embeddings-v3.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Late chunking с jina-embeddings-v3:</strong> весь документ (2000 токенов) влезает в 8192-токенное окно, mean pooling даёт контекстуализированные чанки без API-вызовов. Стоимость = только embedding inference.</li>
<li><strong>Self-hosted inference:</strong> при 50 000 статей и batch-обработке — GPU за несколько часов. Нет зависимости от внешних API и платы за токены.</li>
</ul>
<p><strong>Антипаттерн:</strong> применять late chunking к PDF-договорам на 200 страниц (>100 000 токенов) — документ не влезает в контекст, придётся разбивать на секции и контекст всё равно частично теряется. Здесь лучше contextual retrieval.</p>
</div>`,
    flashcards: [
      { front: "Late chunking — ключевая идея", back: "Пропустить весь документ через long-context encoder → получить token-level representations → усреднить по span каждого чанка. Каждый чанк получает эмбеддинг с контекстом всего документа." },
      { front: "Mean pooling в late chunking", back: "Для чанка со span токенов [start:end]: mean_pooling = token_embeddings[start:end].mean(dim=0). Усреднённый вектор несёт информацию о контексте соседних токенов, видимых encoder-ом." },
      { front: "jina-embeddings-v3", back: "Главная open-source модель с native поддержкой late chunking. Контекстное окно 8192 токенов, мультиязычная. Поддерживает dense, sparse и late-chunking режимы." },
      { front: "Late chunking vs contextual retrieval — стоимость", back: "Late chunking: только embedding (нет дополнительных API). Contextual retrieval: ~$1/1M токенов с caching. При 10M токенов корпуса: $0 vs $10. При 1B токенов: $0 vs $1000." },
      { front: "Ограничение late chunking по длине", back: "Документ должен влезать в контекстное окно модели (8192 для jina-embeddings-v3). Документы длиннее требуют разбивки на секции, что частично лишает преимущества метода." },
      { front: "Когда late chunking хуже contextual retrieval?", back: "Длинные документы (>8K токенов): нужна разбивка, контекст теряется. Когда нужен семантически богатый префикс (LLM понимает суть чанка лучше mean pooling). При использовании OpenAI embeddings." }
    ],
    quiz: [
      {
        question: "В чём принципиальное отличие late chunking от стандартного chunking?",
        options: [
          "Чанки меньшего размера",
          "Эмбеддинг создаётся из token-level представлений всего документа, а не изолированного чанка",
          "Используется другая метрика расстояния",
          "Чанки создаются после retrieval, а не до"
        ],
        correct: 1,
        explanation: "Стандартный: чанк → независимый эмбеддинг (контекст документа потерян). Late chunking: весь документ → token embeddings → mean pooling по span чанка. Эмбеддинг «видит» соседние токены документа."
      },
      {
        question: "Компания индексирует 100 000 коротких новостных статей (~500 токенов). Что выгоднее: late chunking или contextual retrieval?",
        options: [
          "Contextual retrieval — он точнее",
          "Late chunking — нет LLM-вызовов, статьи влезают в контекст jina-embeddings-v3",
          "Одинаково — разницы нет",
          "Contextual retrieval — у него нет ограничений на длину"
        ],
        correct: 1,
        explanation: "500 токенов << 8192 (лимит jina-v3). Late chunking: только embedding inference, нет API costs. 100K статей × contextual retrieval = 100K+ LLM-вызовов. При таком объёме late chunking экономит значительные средства."
      },
      {
        question: "Какая модель поддерживает late chunking из коробки?",
        options: [
          "text-embedding-ada-002 (OpenAI)",
          "jina-embeddings-v3",
          "BGE-M3",
          "Cohere embed-v4"
        ],
        correct: 1,
        explanation: "jina-embeddings-v3 — основная модель с нативной поддержкой late chunking (8192 токенов, специальный mean-pooling API). Другие модели технически можно адаптировать, но нет официальной поддержки и оптимизации."
      },
      {
        question: "Документ на 15 000 токенов обрабатывается через late chunking с jina-embeddings-v3 (лимит 8192). Что произойдёт?",
        options: [
          "Модель автоматически обработает весь документ",
          "Документ будет усечён до 8192 токенов, хвост потеряется",
          "Нужно вручную разбить на 2 секции и обработать отдельно",
          "Late chunking недоступен для таких документов"
        ],
        correct: 2,
        explanation: "При документе > лимита контекста нужна разбивка на секции и отдельная обработка каждой. Это частично лишает late chunking его главного преимущества — контекст теперь ограничен секцией, а не всем документом."
      },
      {
        question: "Mean pooling в late chunking усредняет что именно?",
        options: [
          "Эмбеддинги соседних чанков",
          "Token-level hidden states encoder-а для span токенов данного чанка",
          "Косинусные расстояния между векторами",
          "Веса attention-голов трансформера"
        ],
        correct: 1,
        explanation: "Encoder возвращает hidden state для каждого токена всего документа. Для чанка [start:end] берём последовательность hidden states этого span и усредняем (mean pool) в один вектор — это и есть late chunking эмбеддинг."
      }
    ],
    sources: [
      { title: "Late Chunking — Jina AI Blog", desc: "Оригинальный пост с описанием метода и бенчмарками", url: "https://jina.ai/news/late-chunking-in-long-context-embedding-models/", icon: "📄" },
      { title: "jina-embeddings-v3", desc: "Модель с native поддержкой late chunking на HuggingFace", url: "https://huggingface.co/jinaai/jina-embeddings-v3", icon: "🤗" },
      { title: "Anthropic Contextual Retrieval", desc: "Сравнительный метод для выбора подхода", url: "https://www.anthropic.com/news/contextual-retrieval", icon: "📗" }
    ]
  },
  {
    id: 11,
    title: "Long-context vs RAG: когда RAG уже не нужен",
    goal: "Понять границы применимости RAG в эпоху 1M+ токенных контекстов и принять обоснованное решение.",
    objectives: [
      "Применить правило Anthropic: knowledge base <200K токенов → prompt caching",
      "Объяснить феномен «lost in the middle» для long-context моделей",
      "Рассчитать $/запрос для RAG vs full-context-with-cache",
      "Использовать матрицу решений для выбора архитектуры"
    ],
    body: `<h2>Контекстные окна выросли на порядки</h2>
<p>В 2023 «длинный контекст» — это 32K токенов. В 2025: Gemini 2.0 — 2M токенов, Claude — 1M токенов, Llama 4 Scout — до 10M токенов. Это меняет вопрос не «как сделать RAG», а «нужен ли RAG вообще».</p>

<h2>Правило большого пальца Anthropic</h2>
<div class="callout callout-tip"><strong>Если knowledge base < 200K токенов — положи всё в контекст с prompt caching. RAG не нужен.</strong> Это официальная рекомендация Anthropic для Claude.</div>

<p>200K токенов ≈ 150 000 слов ≈ 500 страниц текста. Это большинство корпоративных wiki, небольших документационных баз, специализированных справочников.</p>

<h2>«Lost in the middle» — long-context не панацея</h2>
<p>Эксперименты (Liu et al., 2023) показывают: LLM значительно хуже использует информацию из середины длинного контекста по сравнению с началом и концом. При 1M токенном контексте важный факт в середине — почти потерян.</p>

<pre><code># Положение в контексте важно
# Для длинных контекстов помещайте критичную информацию:
# ✓ В начало контекста (system prompt + первые документы)
# ✓ В конец контекста (перед вопросом пользователя)
# ✗ Избегайте длинных «буферных» блоков в середине</code></pre>

<h2>Гибрид: RAG + long-context</h2>
<p>Наиболее мощная архитектура 2025 для больших корпусов:</p>
<ol>
<li>RAG retrieval: находит топ-20 релевантных чанков (из миллионов)</li>
<li>Re-ranker: отбирает топ-10</li>
<li>Full documents: загружает полные документы-источники в long-context окно</li>
<li>LLM: отвечает с полным контекстом документов</li>
</ol>
<p>Таким образом, получаем масштабируемость RAG + глубокое понимание long-context.</p>

<h2>Экономика: RAG vs full-context-with-cache</h2>
<pre><code># Сценарий: 500-страничная база знаний (~200K токенов)
# Запросов в день: 1000

# Full-context с prompt caching (Claude):
cache_write = 200_000 * 0.0000037  # $0.74 (один раз)
cache_read = 200_000 * 0.0000003   # $0.06 per request
total_per_day = cache_write + 1000 * cache_read  # ~$60.74

# RAG (retrieval 5K tokens + LLM):
rag_context = 5_000 * 0.000003   # $0.015 per request
total_per_day_rag = 1000 * rag_context  # $15/day

# При 1000 запросов/день RAG дешевле.
# При 100 запросов/день full-context с кэшем сопоставимо.</code></pre>

<h2>Матрица решений</h2>
<table>
<tr><th>Корпус</th><th>Частота обновлений</th><th>Latency</th><th>Решение</th></tr>
<tr><td>&lt;200K токенов</td><td>Редко</td><td>Любая</td><td>Full-context + caching</td></tr>
<tr><td>&lt;200K токенов</td><td>Часто</td><td>Низкая</td><td>RAG с инкрементальным индексом</td></tr>
<tr><td>200K–10M токенов</td><td>Любая</td><td>Средняя</td><td>RAG + hybrid search + reranker</td></tr>
<tr><td>&gt;10M токенов</td><td>Любая</td><td>Низкая</td><td>RAG + Agentic с routing</td></tr>
<tr><td>Любой</td><td>Часто</td><td>Критична</td><td>RAG + semantic cache</td></tr>
</table>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Команда строит внутренний ассистент для юридического отдела. База: 300 договоров (~120K токенов). 50 запросов в день. Уже потратили 2 недели на RAG-пайплайн.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Остановить RAG-разработку и проверить full-context:</strong> 120K токенов < 200K (правило Anthropic). Все 300 договоров в system prompt с prompt caching. При 50 запросах/день стоимость сопоставима с RAG.</li>
<li><strong>Сравнить качество:</strong> LLM с полным контекстом 300 договоров ответит на multi-hop вопросы («найди все договоры с неустойкой >5%»), которые RAG с K=5 пропустит.</li>
</ul>
<p><strong>Антипаттерн:</strong> автоматически выбирать RAG для любой задачи с документами — в 2025 это не всегда оптимально. Правило <200K токенов → сначала проверь full-context.</p>
</div>`,
    flashcards: [
      { front: "Правило 200K токенов (Anthropic)", back: "Если весь knowledge base < 200K токенов — положи всё в контекст с prompt caching, не строй RAG. Это официальная рекомендация Anthropic. 200K ≈ 500 страниц текста." },
      { front: "«Lost in the middle»", back: "LLM хуже использует информацию из середины длинного контекста. Критичные факты должны быть в начале или конце. При 1M токенов это серьёзная проблема — RAG с re-ranking часто точнее." },
      { front: "Prompt caching — как снижает стоимость", back: "Повторно используемый контекст (system prompt, документы) кэшируется. Стоимость cache read = 10% от обычной. При 1000 запросах/день к одному корпусу — экономия 90% на input tokens." },
      { front: "Гибрид RAG + long-context", back: "RAG находит топ-N чанков → загружаем полные документы-источники в long-context окно → LLM отвечает с полным контекстом. Масштабируемость RAG + глубокое понимание full-context." },
      { front: "Когда RAG выгоднее full-context?", back: "При высоком трафике (>500 запросов/день) с большим корпусом: стоимость per-request RAG (5K токенов) << full-context (200K+ токенов). Также при частых обновлениях документов." },
      { front: "Llama 4 Scout — 10M токенов", back: "Open-source модель с 10M токенным контекстом. Теоретически можно положить всю корпоративную документацию. Практически: «lost in the middle» + latency + стоимость делают RAG разумнее для >1M токенов." }
    ],
    quiz: [
      {
        question: "Knowledge base компании — 180K токенов (внутренние политики). 200 запросов в день. Что выбрать?",
        options: [
          "RAG с hybrid search и re-ranking",
          "Full-context с prompt caching — правило <200K токенов",
          "Fine-tuning модели на политиках",
          "Graph RAG для связанных документов"
        ],
        correct: 1,
        explanation: "180K < 200K — правило Anthropic. Все документы в system prompt с prompt caching: только один cache write при изменении, все запросы используют кэш. Проще, быстрее в реализации, сравнимая стоимость при 200 запросах/день."
      },
      {
        question: "При каком условии «lost in the middle» становится критической проблемой?",
        options: [
          "При chunk_size < 256 токенов",
          "При длинном контексте (>50K токенов) с важной информацией в середине",
          "При использовании BM25 retrieval",
          "При K > 10 в RAG"
        ],
        correct: 1,
        explanation: "«Lost in the middle» (Liu et al.): LLM плохо обрабатывает середину длинного промпта. При 100K+ токенов информация из середины практически игнорируется. Поэтому full-context при очень большой базе хуже целевого RAG retrieval."
      },
      {
        question: "Корпус 5M токенов, 10 000 запросов в день. Что правильно?",
        options: [
          "Full-context — Gemini 2.0 поддерживает 2M токенов",
          "RAG — full-context при таком объёме и трафике слишком дорог",
          "Fine-tuning",
          "Разбить на 25 отдельных баз по 200K"
        ],
        correct: 1,
        explanation: "5M токенов full-context per request × 10 000 запросов = 50B input токенов в день. Даже с caching prohibitively expensive. RAG retrieves 5-10K токенов per request — в 500-1000x дешевле."
      },
      {
        question: "Гибридная архитектура «RAG → full documents in context» — в чём преимущество перед чистым RAG?",
        options: [
          "Быстрее работает",
          "LLM получает полный документ-источник, а не изолированный чанк — лучше multi-hop reasoning",
          "Дешевле",
          "Не нужен re-ranker"
        ],
        correct: 1,
        explanation: "RAG retrieves релевантные чанки, но LLM видит только фрагмент. Гибрид: по найденным чанкам определяем source documents и загружаем их целиком. LLM имеет полный контекст документа — отвечает точнее на сложные вопросы."
      },
      {
        question: "Anthropic рекомендует full-context для баз <200K токенов. Какое исключение из этого правила?",
        options: [
          "Если документы на русском языке",
          "Если документы обновляются часто и latency критична — инкрементальный RAG быстрее",
          "Если используется GPT-4 вместо Claude",
          "Если в базе более 100 документов"
        ],
        correct: 1,
        explanation: "Частые обновления — главное исключение. Full-context требует перезаписи кэша при каждом изменении. Если база обновляется каждый час, RAG с инкрементальным индексом актуальнее и дешевле в обслуживании."
      }
    ],
    sources: [
      { title: "Anthropic — When to use RAG vs long context", desc: "Официальные рекомендации Anthropic", url: "https://www.anthropic.com/news/contextual-retrieval", icon: "📗" },
      { title: "Lost in the Middle (Liu et al., 2023)", desc: "Исследование деградации качества в середине контекста", url: "https://arxiv.org/abs/2307.03172", icon: "📄" },
      { title: "Gemini 2.0 — 2M Context", desc: "Google DeepMind — long context capabilities", url: "https://deepmind.google/technologies/gemini/", icon: "🔮" }
    ]
  },
  {
    id: 12,
    title: "Метаданные и фильтрация: boring wins",
    goal: "Понять, почему metadata-first подход часто обгоняет архитектурные усложнения и как его реализовать.",
    objectives: [
      "Применить Jason Liu-подход: metadata перед архитектурными изменениями",
      "Реализовать структурное извлечение метаданных через LLM",
      "Настроить pre/post-фильтрацию в Qdrant и pgvector",
      "Построить routing по метаданным для логической сегментации индекса"
    ],
    body: `<h2>Правило: сначала скучное, потом умное</h2>
<blockquote>
<p>«Basic improvements like date filters, metadata inclusion, and hybrid search often outperform complex architectural changes.»</p>
<p>— Jason Liu, автор instructor и contributor LlamaIndex</p>
</blockquote>
<p>Команды тратят недели на Agentic RAG и Graph RAG, пока простые date filters и metadata routing дают +30% precision за день работы. Boring wins — не скромность, а эмпирика.</p>

<h2>Структурное извлечение метаданных</h2>
<p>LLM + structured output извлекает метаданные из документа автоматически:</p>

<pre><code>from anthropic import Anthropic
import json

EXTRACTION_PROMPT = """
Извлеки метаданные из документа и верни JSON:
{
  "doc_type": "contract|policy|faq|guide|report",
  "date": "YYYY-MM-DD или null",
  "author": "имя или null",
  "jurisdiction": "RU|EU|US|null",
  "access_level": "public|internal|confidential",
  "topics": ["тема1", "тема2"],
  "language": "ru|en"
}
"""

def extract_metadata(doc_text, client):
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"{EXTRACTION_PROMPT}\\n\\nДокумент:\\n{doc_text[:3000]}"
        }]
    )
    return json.loads(response.content[0].text)</code></pre>

<h2>Pre-filter vs Post-filter</h2>
<p><strong>Pre-filter (рекомендован):</strong> сначала фильтрация по metadata, потом ANN-поиск в отфильтрованном подмножестве. Быстрее, точнее, но требует metadata-индексов в векторной БД.</p>
<p><strong>Post-filter:</strong> сначала ANN-поиск топ-K×N, потом фильтрация. Медленнее, может вернуть пустой результат при жёстком фильтре.</p>

<pre><code># Qdrant pre-filter
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range
from datetime import datetime

results = client.search(
    collection_name="docs",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="metadata.doc_type",
                match=MatchValue(value="contract")
            ),
            FieldCondition(
                key="metadata.jurisdiction",
                match=MatchValue(value="RU")
            ),
            FieldCondition(
                key="metadata.date",
                range=Range(gte="2024-01-01")
            )
        ]
    ),
    limit=10
)</code></pre>

<pre><code>-- pgvector с metadata filters
SELECT content, embedding &lt;=&gt; $1 AS distance
FROM chunks
WHERE
    metadata->>'doc_type' = 'contract'
    AND metadata->>'jurisdiction' = 'RU'
    AND (metadata->>'date')::date >= '2024-01-01'
    AND metadata->>'access_level' IN ('public', 'internal')
ORDER BY distance
LIMIT 10;</code></pre>

<h2>Routing по метаданным</h2>
<p>Один физический индекс → много логических подмножеств через routing. Запрос про HR-политики → фильтр doc_type=«policy» + department=«HR». Запрос про технический API → filter doc_type=«api_reference».</p>

<pre><code>def route_query(query: str, llm) -> dict:
    """LLM определяет нужные фильтры по запросу"""
    response = llm.predict(f"""
    Для запроса: {query}
    Определи фильтры поиска (JSON):
    - doc_type: contract/policy/faq/guide/report
    - date_from: YYYY-MM-DD или null
    - jurisdiction: RU/EU/US или null
    Верни только JSON.
    """)
    return json.loads(response)</code></pre>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Юридическая компания: RAG отвечает на вопросы по законодательству. Context precision низкий — retrieval находит релевантные чанки, но из разных юрисдикций (российское право смешивается с европейским).</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Metadata routing по юрисдикции:</strong> LLM определяет из запроса нужную юрисдикцию (RU/EU/US) → фильтр при retrieval. Один индекс, но логически разделённые пространства поиска.</li>
<li><strong>Pre-filter по access_level:</strong> пользователь с уровнем «internal» не получает «confidential» документы. Фильтр применяется до ANN-поиска — безопасно и быстро.</li>
</ul>
<p><strong>Антипаттерн:</strong> внедрять Graph RAG для «связи документов из разных юрисдикций», когда простой metadata filter по jurisdiction=«RU» решает проблему за 1 день разработки.</p>
</div>`,
    flashcards: [
      { front: "Jason Liu — правило boring wins", back: "«Basic improvements like date filters, metadata inclusion, and hybrid search often outperform complex architectural changes». Метаданные и hybrid search дают +20-40% precision быстрее, чем Agentic/Graph RAG." },
      { front: "Pre-filter vs Post-filter", back: "Pre-filter: сначала фильтр по metadata, потом ANN-поиск. Быстрее и точнее. Post-filter: ANN-поиск с запасом (K×N), потом фильтрация — может вернуть пустой результат при жёстких условиях." },
      { front: "Структурное извлечение метаданных", back: "LLM (Haiku/GPT-4o-mini) + structured output автоматически извлекает doc_type, date, author, jurisdiction, access_level из текста документа. Один вызов при индексации → богатые фильтры при retrieval." },
      { front: "Routing по метаданным", back: "LLM анализирует запрос и определяет нужные фильтры: «вопрос про HR политику» → doc_type=policy, department=HR. Один индекс разбивается на логические подмножества без физического дублирования." },
      { front: "access_level как security layer", back: "Поле access_level (public/internal/confidential) + pre-filter при retrieval = безопасность на уровне поиска. Пользователь физически не может получить чанки с более высоким уровнем доступа." },
      { front: "Какие metadata реально важны?", back: "Дата (фильтр устаревшего контента), doc_type (routing), jurisdiction/department (логическое разделение), access_level (безопасность), language (мультиязычные корпусы). Остальное — вторично." }
    ],
    quiz: [
      {
        question: "RAG-система для кодекса законов смешивает нормы разных юрисдикций. Самый быстрый способ исправить?",
        options: [
          "Построить Graph RAG для связи норм",
          "Добавить metadata поле jurisdiction и pre-filter при retrieval",
          "Разделить на отдельные векторные базы",
          "Использовать Multi-Query с разными запросами"
        ],
        correct: 1,
        explanation: "Metadata filter — самое быстрое решение: добавить поле при индексации (день работы), фильтровать при retrieval. Отдельные БД — избыточная инфраструктура. Graph RAG — чрезмерно сложен для этой задачи."
      },
      {
        question: "Что такое «routing по метаданным»?",
        options: [
          "Физическая маршрутизация запросов между серверами",
          "LLM определяет нужные metadata-фильтры из запроса, сужая поиск до нужного подмножества",
          "Перенаправление на разные embedding-модели",
          "Балансировка нагрузки между vectorDB нодами"
        ],
        correct: 1,
        explanation: "Routing: LLM смотрит на запрос и выбирает фильтры (doc_type, jurisdiction, department). Один индекс логически разделяется на подмножества без дублирования данных. Дешевле и проще чем несколько индексов."
      },
      {
        question: "В каком порядке правильно применять оптимизации RAG по принципу boring wins?",
        options: [
          "Agentic RAG → Graph RAG → metadata filters",
          "Metadata filters → hybrid search → re-ranking → (потом, если нужно) advanced patterns",
          "Self-RAG → HyDE → metadata filters",
          "Порядок не имеет значения"
        ],
        correct: 1,
        explanation: "Boring wins: начинай с самого дешёвого и быстрого — metadata filters и hybrid search. Они дают 60-80% возможного улучшения. Agentic/Graph RAG — только когда базовые техники исчерпаны."
      },
      {
        question: "Structured metadata extraction с Claude Haiku обрабатывает первые 3000 токенов документа. Достаточно ли этого?",
        options: [
          "Нет, нужно обрабатывать весь документ",
          "Да, для большинства случаев — заголовок, дата, тип, автор обычно в начале документа",
          "Нет, нужно брать случайный sample из середины",
          "Зависит от типа документа"
        ],
        correct: 1,
        explanation: "Большинство metadata (заголовок, дата, автор, тип документа, юрисдикция) содержится в начале документа. 3000 токенов достаточно для 95%+ случаев. Обработка полного документа — в 10x дороже за маргинальное улучшение."
      },
      {
        question: "Pre-filter вернул 0 результатов при поиске. Как правильно обработать?",
        options: [
          "Вернуть пустой ответ пользователю",
          "Fallback: последовательно ослаблять фильтры (убрать date, расширить jurisdiction) до получения результатов",
          "Переключиться на post-filter",
          "Увеличить K"
        ],
        correct: 1,
        explanation: "Пустой pre-filter — нужен graceful fallback. Иерархия: строгие фильтры → убрать дату → убрать юрисдикцию → убрать doc_type → полный corpus. Пользователь получает «нашёл в смежной области» вместо «ничего не найдено»."
      },
      {
        question: "Команда хочет хранить разные access_level документов в одном Qdrant-коллекции. Какой риск?",
        options: [
          "Нет рисков при правильном pre-filter",
          "Если pre-filter не применён (ошибка в коде) — confidential документы попадут к пользователям без доступа",
          "Снизится скорость поиска",
          "Metadata не поддерживается в Qdrant"
        ],
        correct: 1,
        explanation: "Один индекс для разных уровней доступа — риск при ошибке в фильтре. Defense in depth: pre-filter + проверка access_level на уровне API + audit logging. Для критичных данных рассмотрите физически отдельные коллекции."
      }
    ],
    sources: [
      { title: "Jason Liu — Improving RAG (Tweet/Blog)", desc: "Оригинальная цитата и контекст boring wins", url: "https://jxnl.github.io/blog/writing/2024/01/07/why-rag-is-hard/", icon: "✍️" },
      { title: "Qdrant Filtering", desc: "Документация по payload filters в Qdrant", url: "https://qdrant.tech/documentation/concepts/filtering/", icon: "📗" },
      { title: "pgvector JSONB фильтрация", desc: "PostgreSQL JSONB operators для metadata", url: "https://www.postgresql.org/docs/current/functions-json.html", icon: "🐘" }
    ]
  },
  {
    id: 13,
    title: "Multimodal RAG: ColPali и ColQwen2",
    goal: "Понять paradigm shift для PDF/таблиц/изображений: обход OCR через vision-language embeddings.",
    objectives: [
      "Объяснить ColPali/ColQwen2 и late interaction mechanism",
      "Сравнить с OCR-based подходами и unified vision embeddings",
      "Определить use cases: договоры, отчётность, сканы",
      "Оценить ограничения: стоимость, latency, storage"
    ],
    body: `<h2>Проблема: PDF — это не текст</h2>
<p>Стандартный RAG-пайплайн: PDF → OCR → текст → чанки → эмбеддинги. Проблема: OCR разрушает таблицы, теряет визуальную иерархию, не понимает графики. 30-40% информации в корпоративных документах — визуальная.</p>

<h2>ColPali: страница PDF как изображение</h2>
<p><strong>ColPali</strong> (Faysse et al., 2024) — принципиально иной подход: вместо OCR → страница PDF эмбеддируется целиком как изображение через Vision Language Model (PaliGemma). Late interaction mechanism (MaxSim) позволяет эффективно индексировать и искать по patch-токенам изображения.</p>

<pre><code># ColPali — концептуальная схема
from colpali_engine.models import ColPali, ColPaliProcessor

model = ColPali.from_pretrained("vidore/colpali-v1.2")
processor = ColPaliProcessor.from_pretrained("vidore/colpali-v1.2")

# Индексирование: страница PDF → patch embeddings
def index_pdf_page(page_image):
    inputs = processor.process_images([page_image])
    with torch.no_grad():
        page_embeddings = model(**inputs)
    # page_embeddings: [num_patches, dim]
    # Каждый patch = 16×16 пикселей документа
    return page_embeddings

# Retrieval: текстовый запрос → MaxSim по всем patches
def search(query, all_page_embeddings, top_k=5):
    query_inputs = processor.process_queries([query])
    query_embedding = model(**query_inputs)
    # MaxSim: максимальное сходство между query-токеном и patch-токенами
    scores = model.score_multi_vector(
        query_embedding, all_page_embeddings
    )
    return scores.topk(top_k)</code></pre>

<h2>ColQwen2 — улучшенная версия</h2>
<p>ColQwen2 использует Qwen2-VL вместо PaliGemma — более мощный VLM, лучше работает с таблицами и схемами. Занял первое место на ViDoRe (Visual Document Retrieval) бенчмарке.</p>

<h2>Альтернативы для production</h2>
<ul>
<li><strong>Voyage-multimodal-3</strong> — unified embeddings для текста и изображений в одном пространстве. API-based, проще интеграция.</li>
<li><strong>Cohere Embed v4</strong> — мультимодальные unified embeddings. Текст и изображения в общем векторном пространстве.</li>
<li><strong>GPT-4o Vision + OCR</strong> — использовать VLM для извлечения текста с сохранением структуры, затем standard RAG.</li>
</ul>

<h2>Use cases — когда multimodal RAG оправдан</h2>
<ul>
<li><strong>Юридические документы:</strong> договоры со схемами, таблицами штрафов, печатями</li>
<li><strong>Финансовая отчётность:</strong> балансы, графики, сноски в таблицах</li>
<li><strong>Технические мануалы:</strong> схемы устройств, диаграммы подключения</li>
<li><strong>Сканированные документы:</strong> OCR плохо работает с рукописными или нестандартными шрифтами</li>
</ul>

<h2>Ограничения и стоимость</h2>
<div class="callout callout-warn"><strong>Хранение:</strong> ColPali хранит patch-эмбеддинги для каждой страницы (≈1000 патчей × 128 dim). Для 100 000 страниц — в 50-100 раз больше памяти, чем text-based RAG.</div>
<ul>
<li><strong>Latency:</strong> индексирование страницы ~500ms vs ~50ms для текстового чанка</li>
<li><strong>Storage:</strong> patch embeddings в 50-100x больше по объёму</li>
<li><strong>Стоимость Voyage-multimodal-3:</strong> $0.006 per 1000 image tokens (vs $0.00013 text)</li>
</ul>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Страховая компания индексирует 50 000 страниц страховых полисов в PDF. Ключевые данные — в таблицах (лимиты покрытия, исключения, суммы). OCR пайплайн даёт 25% ошибок на таблицах.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>ColQwen2 для страниц с таблицами:</strong> страница как изображение — таблицы видны VLM как структура, не разрушаются при OCR. Критичные цифры извлекаются точнее.</li>
<li><strong>Гибрид: ColPali для изображений + text RAG для описательных секций:</strong> хранить оба индекса, routing по типу страницы (content_type=«table» / «text»).</li>
</ul>
<p><strong>Антипаттерн:</strong> применять ColPali ко всем документам без разбора — огромный storage overhead для текстовых страниц, которые отлично обрабатываются standard text RAG.</p>
</div>`,
    flashcards: [
      { front: "ColPali — ключевая идея", back: "Страница PDF эмбеддируется как изображение через VLM (PaliGemma). Нет OCR. Late interaction (MaxSim) позволяет искать по patch-токенам страницы. Лидер ViDoRe бенчмарка." },
      { front: "Late interaction (MaxSim)", back: "Метрика для multimodal retrieval: для каждого query-токена находим максимальное сходство с любым patch-токеном страницы, суммируем. MaxSim(q, d) = Σ max_j(q_i · d_j). Точнее простого cosine similarity." },
      { front: "ColQwen2 vs ColPali", back: "ColQwen2 использует Qwen2-VL (более мощный VLM). Лучше на таблицах и схемах. Занял 1 место на ViDoRe. ColPali — оригинальная версия на PaliGemma, проще запустить." },
      { front: "Voyage-multimodal-3", back: "API-based unified embedding model для текста и изображений в одном векторном пространстве. Проще интеграции чем ColPali (нет self-hosted inference), но дороже ($0.006/1000 image tokens)." },
      { front: "Когда НЕ нужен Multimodal RAG?", back: "Когда документы хорошо структурированы и OCR работает корректно (plain text PDF, Markdown, HTML). Multimodal RAG — overhead по storage (50-100x) и latency (10x) оправдан только при реальной визуальной информации." },
      { front: "ViDoRe бенчмарк", back: "Visual Document Retrieval benchmark — стандарт для оценки multimodal document retrieval. ColQwen2 и ColPali лидируют. Показывает реальные результаты на сканах, таблицах, схемах." }
    ],
    quiz: [
      {
        question: "Почему ColPali обходит OCR в пайплайне?",
        options: [
          "OCR просто медленный",
          "VLM видит страницу как изображение — таблицы, схемы, визуальная иерархия не разрушаются преобразованием в текст",
          "ColPali использует лучший OCR",
          "ColPali быстрее индексирует"
        ],
        correct: 1,
        explanation: "OCR разрушает визуальную структуру: таблицы становятся последовательностью чисел, схемы — непонятным текстом. ColPali обрабатывает изображение напрямую — VLM «видит» структуру так, как её видит человек."
      },
      {
        question: "Команда индексирует финансовые отчёты: текстовые описания + таблицы с цифрами. Что оптимально?",
        options: [
          "Только ColPali для всех страниц",
          "Только text RAG с Camelot для извлечения таблиц",
          "Гибрид: ColPali/ColQwen2 для страниц с таблицами, text RAG для текстовых страниц",
          "GPT-4o Vision для всех страниц"
        ],
        correct: 2,
        explanation: "Гибридный подход по типу контента: text pages → standard RAG (дешевле, быстрее), table pages → ColPali/ColQwen2 (точнее для визуальных структур). Routing по content_type в metadata."
      },
      {
        question: "Главное ограничение ColPali при production-деплое?",
        options: [
          "Поддерживает только английский язык",
          "Требует GPU и patch embeddings требуют в 50-100x больше storage чем text embeddings",
          "Не поддерживает PDF формат",
          "Работает только с цветными изображениями"
        ],
        correct: 1,
        explanation: "Storage overhead — главная боль ColPali. ~1000 patches per page × 128 dim float32 = 0.5MB per page. 100K страниц = 50GB только embeddings. Plus GPU inference. Для text RAG это в 50-100 раз меньше."
      },
      {
        question: "Что такое MaxSim в контексте ColPali retrieval?",
        options: [
          "Максимальное количество результатов",
          "Для каждого query-токена находим максимальное сходство с patch-токенами документа — сумма этих максимумов = relevance score",
          "Максимальный размер индекса",
          "Максимальная скорость индексирования"
        ],
        correct: 1,
        explanation: "MaxSim: score(q,d) = Σ_i max_j(q_i · d_j). Каждый запросный токен «ищет» наиболее похожий патч на странице. Это позволяет точечно находить нужную область документа (таблицу, схему) без привязки к позиции."
      },
      {
        question: "Voyage-multimodal-3 и ColPali — в чём разница для production?",
        options: [
          "Они идентичны по функциональности",
          "Voyage-multimodal-3 — API-based, проще интеграция, нет self-hosted overhead. ColPali — self-hosted, дешевле при масштабе, контроль над данными",
          "ColPali поддерживает только изображения, Voyage — только текст",
          "Voyage дороже в 100 раз"
        ],
        correct: 1,
        explanation: "Voyager: API endpoint, нет GPU, $0.006/1K img tokens. ColPali: самостоятельный деплой GPU-модели, нет per-token cost, полный контроль над данными. Voyage — быстрый старт, ColPali — при больших объёмах и privacy requirements."
      }
    ],
    sources: [
      { title: "ColPali Paper (Faysse et al.)", desc: "Efficient Document Retrieval with Vision Language Models", url: "https://arxiv.org/abs/2407.01449", icon: "📄" },
      { title: "ColQwen2 — ViDoRe SOTA", desc: "Лидер Visual Document Retrieval бенчмарка", url: "https://huggingface.co/vidore/colqwen2-v1.0", icon: "🤗" },
      { title: "Voyage-multimodal-3", desc: "Unified multimodal embeddings API", url: "https://docs.voyageai.com/docs/multimodal-embeddings", icon: "🚀" },
      { title: "Cohere Embed v4", desc: "Мультимодальные unified embeddings", url: "https://cohere.com/blog/embed-4", icon: "🔵" }
    ]
  },
  {
    id: 14,
    title: "Экономика и latency RAG-пайплайна",
    goal: "Уметь считать $/query и p50/p95/p99 на каждом этапе и принимать обоснованные архитектурные решения.",
    objectives: [
      "Разложить RAG-пайплайн по latency компонентам и найти узкое место",
      "Сравнить экономику Pinecone serverless vs self-hosted pgvector",
      "Рассчитать экономию от semantic cache и prompt caching",
      "Применить batch API для оффлайн-индексации"
    ],
    body: `<h2>Разложение latency: где время?</h2>
<p>Среднестатистический production RAG-запрос:</p>

<pre><code>┌──────────────────────────────────────────────┐
│ Компонент              │ p50    │ p95    │     │
├──────────────────────────────────────────────┤
│ Query embedding        │ 50ms   │ 120ms  │     │
│ Vector search (HNSW)   │ 30ms   │ 80ms   │     │
│ BM25 search            │ 20ms   │ 50ms   │     │
│ Re-ranker (Cohere API) │ 200ms  │ 600ms  │ ←── │
│ LLM generation (4o)    │ 1000ms │ 3000ms │ ←── │
│ Network overhead       │ 50ms   │ 150ms  │     │
├──────────────────────────────────────────────┤
│ TOTAL                  │ ~1.4s  │ ~4s    │     │
└──────────────────────────────────────────────┘</code></pre>

<p>Реranker и LLM — 85-90% latency. Оптимизировать embedding или vector search — маргинальный эффект.</p>

<h2>Reranker как узкое место</h2>
<p>Cohere Rerank API добавляет 200-600ms на каждый запрос. Альтернативы:</p>
<ul>
<li><strong>Self-hosted BGE-Reranker-v2-m3:</strong> 50-100ms на GPU (T4), нет API latency. Стоимость: амортизация GPU.</li>
<li><strong>Flash Rerank (lightweight):</strong> 30-80ms, небольшая потеря качества.</li>
<li><strong>Убрать reranker, оставить K=5:</strong> если latency критична и recall достаточен.</li>
</ul>

<h2>Экономика: Pinecone serverless vs pgvector</h2>
<pre><code># Pinecone serverless (2025 цены)
# Модель: $0.33 per 1M read units + $2/GB storage

# 1M запросов/месяц × 5 reads per query:
pinecone_reads = 1_000_000 * 5 * 0.00000033  # $1.65
pinecone_storage = 10 * 2                      # $20 (10GB)
pinecone_total = pinecone_reads + pinecone_storage  # ~$21.65/мес

# pgvector self-hosted (AWS RDS r6g.large)
# $0.26/hour ≈ $187/месяц + $115/TB storage
pgvector_compute = 0.26 * 24 * 30  # $187.2
pgvector_storage = 0.115 * 0.01    # $1.15 (10GB)
pgvector_total = pgvector_compute + pgvector_storage  # ~$188/мес

# Вывод: Pinecone выгоден при ПЕРЕМЕННОЙ нагрузке (&lt;1M req/мес)
# pgvector выгоден при ПОСТОЯННОЙ нагрузке (&gt;5M req/мес)
</code></pre>

<h2>Semantic cache: экономия 30-50%</h2>
<pre><code># Анализ реальных запросов:
# 35% — точные дубли (один вопрос)
# 15% — семантически идентичные переформулировки
# Итого: semantic cache с threshold=0.95 покрывает ~40-50%

# Экономия при $0.015/request и 10K req/day:
daily_cost = 10_000 * 0.015   # $150/day
cache_hit_rate = 0.45
savings = daily_cost * cache_hit_rate  # $67.5/day = $2025/month</code></pre>

<h2>Prompt caching на retrieved context</h2>
<p>Если один и тот же набор документов используется для многих запросов (например, small knowledge base) — retrieved контекст можно кэшировать в prompt cache.</p>

<h2>Batch API для оффлайн-индексации</h2>
<pre><code># OpenAI Batch API: 50% скидка на embeddings
# Для индексации 10M чанков:

# Standard embeddings (text-embedding-3-small):
standard_cost = 10_000_000 * 0.00000002  # $0.20 (уже дёшево)
# Batch API: $0.10 — небольшая экономия для embeddings

# Для LLM-задач (contextual retrieval generation):
# standard gpt-4o-mini: $0.15/M → batch: $0.075/M
# При 1M чанков contextual retrieval: $75 → $37.5 (экономия $37.5)</code></pre>

<h2>Матрица оптимизаций по ROI</h2>
<table>
<tr><th>Оптимизация</th><th>Latency</th><th>Стоимость</th><th>Сложность</th></tr>
<tr><td>Semantic cache</td><td>-40%</td><td>-40%</td><td>Низкая</td></tr>
<tr><td>Prompt caching</td><td>-10%</td><td>-30-50%</td><td>Низкая</td></tr>
<tr><td>Model router</td><td>0%</td><td>-50-65%</td><td>Средняя</td></tr>
<tr><td>Self-hosted reranker</td><td>-30%</td><td>-20%</td><td>Высокая</td></tr>
<tr><td>Batch API</td><td>N/A</td><td>-50%</td><td>Низкая</td></tr>
</table>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> RAG-сервис: 50 000 запросов/день, средняя latency p95=5.2 секунды, стоимость $900/месяц. Требования: p95 <3s, стоимость <$500/месяц.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Анализ latency breakdown:</strong> оказалось, reranker (Cohere API) = 2.1s p95. Мигрировать на self-hosted BGE-Reranker-v2 (GPU T4): latency 100ms, стоимость $100/месяц инстанса.</li>
<li><strong>Semantic cache:</strong> анализ запросов показал 42% повторяемость. Cache hit rate 0.42 × $900 = $378 экономии. Итого: $522/месяц → с reranker migration: $244/месяц.</li>
</ul>
<p><strong>Антипаттерн:</strong> начинать оптимизацию с embedding-модели (50ms → 30ms = 4% от total latency) вместо reranker (2100ms = 40% от total). Измеряй сначала, оптимизируй потом.</p>
</div>`,
    flashcards: [
      { front: "Главные источники latency в RAG", back: "Re-ranker: 200-600ms (p95). LLM generation: 1-3s. Итого 85-90% времени. Embedding (50ms) и vector search (30ms) — маргинальны. Оптимизируй reranker и LLM, а не поиск." },
      { front: "Pinecone serverless vs pgvector — когда что?", back: "Pinecone serverless: переменная нагрузка (<1M req/мес), нет DevOps, pay-per-use. pgvector: постоянная нагрузка (>5M req/мес), уже есть PostgreSQL, предсказуемые расходы." },
      { front: "Semantic cache ROI", back: "30-50% запросов — повторяющиеся. Semantic cache (threshold 0.95) экономит: latency (cache hit <10ms vs 1.5s) + стоимость (0 LLM calls). Внедрение: 1-2 дня. Один из лучших ROI в RAG-оптимизации." },
      { front: "Batch API для оффлайн-задач", back: "OpenAI/Anthropic batch API: 50% скидка на LLM-вызовы. Для contextual retrieval generation при индексации: вместо real-time вызовов — batch-задача за ночь. Применимо только для не-real-time обработки." },
      { front: "p50/p95/p99 в RAG", back: "p50 — медиана (типичный запрос). p95 — 95% запросов быстрее этого (хвост распределения). p99 — самые медленные 1%. Для SLA важны p95/p99. Reranker сильно влияет на p95/p99 из-за сетевых задержек API." },
      { front: "Self-hosted reranker vs API", back: "Cohere Rerank API: 200-600ms p95, нет ops overhead, $0.002 per 1000 tokens. BGE-Reranker self-hosted (GPU T4): 50-100ms, $100-200/мес инстанс, нет per-request cost. Self-hosted выгоден при >500 req/день." }
    ],
    quiz: [
      {
        question: "RAG-пайплайн: embedding 50ms, vector search 30ms, reranker 400ms, LLM 1500ms. Что оптимизировать в первую очередь?",
        options: [
          "Embedding — самый быстрый способ",
          "LLM — самый большой компонент",
          "Reranker — лучший ROI: 400ms можно снизить до 50ms self-hosted",
          "Vector search — напрямую влияет на качество"
        ],
        correct: 2,
        explanation: "LLM latency сложно снизить без потери качества (меньшая модель). Reranker: переход с API (400ms) на self-hosted BGE (50ms) даёт -350ms при минимальной потере качества. Это лучший ROI в данном профиле."
      },
      {
        question: "При какой нагрузке Pinecone serverless дешевле self-hosted pgvector?",
        options: [
          "Всегда дешевле — нет infrastructure overhead",
          "При переменной/низкой нагрузке — pay-per-use выгоден при пиках без постоянного трафика",
          "При постоянной высокой нагрузке >5M req/мес",
          "При объёме данных >1TB"
        ],
        correct: 1,
        explanation: "Pinecone serverless: $0.33/1M reads. pgvector RDS: ~$200/мес фиксированно. Break-even: ~600K запросов/мес. При переменной нагрузке (пики и провалы) Pinecone pay-per-use экономичнее, чем оплачивать простаивающий сервер."
      },
      {
        question: "Semantic cache показывает hit rate 20%, хотя анализ запросов показал 45% повторяемости. Почему?",
        options: [
          "Threshold слишком высокий (0.95) — снизить до 0.80",
          "Кэш слишком маленький, вытесняет старые записи до повторного запроса",
          "Semantic cache несовместим с этим LLM",
          "Нужно больше данных для обучения"
        ],
        correct: 1,
        explanation: "При высокой нагрузке и маленьком кэше — старые записи вытесняются до того, как придёт похожий запрос. Решение: увеличить size кэша (Redis memory). Снижать threshold до 0.80 опасно: false positives (разные вопросы → один ответ)."
      },
      {
        question: "Для чего batch API НЕ подходит?",
        options: [
          "Генерация contextual retrieval префиксов при ночной индексации",
          "Real-time ответы пользователям в чат-боте",
          "Оффлайн evaluation на golden dataset",
          "Batch re-embedding при смене модели"
        ],
        correct: 1,
        explanation: "Batch API возвращает результаты через несколько часов (не real-time). Подходит только для async-задач: индексация, evaluation, re-embedding. Для real-time chatbot — только standard API."
      },
      {
        question: "Какая метрика latency важна для SLA «99% запросов завершаются за 3 секунды»?",
        options: [
          "p50 (медиана)",
          "p99",
          "Среднее значение",
          "Максимальное значение"
        ],
        correct: 1,
        explanation: "«99% запросов за 3s» = p99 ≤ 3000ms. p50 не поможет — 50% запросов укладывается в медиану, но SLA про 99%. Максимум — слишком консервативен (единичные выбросы). p99 — правильная метрика для таких SLA."
      },
      {
        question: "Prompt caching на retrieved context — когда это работает?",
        options: [
          "Всегда — это бесплатная оптимизация",
          "Когда один и тот же набор документов возвращается для многих запросов (малый корпус или частые тематические кластеры)",
          "Только при использовании Claude API",
          "Только для документов длиннее 1000 токенов"
        ],
        correct: 1,
        explanation: "Prompt caching на context эффективен когда один и тот же retrieved контент используется повторно. Если малый корпус (все запросы возвращают схожие чанки) — кэш работает. При большом корпусе каждый запрос уникален — кэш бесполезен."
      }
    ],
    sources: [
      { title: "Pinecone Pricing 2025", desc: "Актуальные цены serverless и dedicated", url: "https://www.pinecone.io/pricing/", icon: "💰" },
      { title: "Anthropic Prompt Caching Docs", desc: "Документация по ephemeral cache и ценообразованию", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", icon: "💾" },
      { title: "OpenAI Batch API", desc: "Batch API для асинхронных LLM-задач со скидкой 50%", url: "https://platform.openai.com/docs/guides/batch", icon: "📦" },
      { title: "BGE-Reranker-v2-m3", desc: "Open-source cross-encoder для self-hosted reranking", url: "https://huggingface.co/BAAI/bge-reranker-v2-m3", icon: "🤗" }
    ]
  },
  {
    id: 15,
    title: "Что устарело в RAG 2026",
    goal: "Маркировать legacy-подходы и не тратить время на то, что уже не актуально.",
    objectives: [
      "Назвать 7 паттернов RAG, ставших legacy к 2026",
      "Объяснить, почему каждый из них устарел",
      "Понять, чем заменить каждый подход",
      "Применить принцип «учи методике, а не бенчмарку»"
    ],
    body: `<h2>Технологии устаревают быстро — паттерны медленнее</h2>
<p>Конкретные модели меняются каждые 3-6 месяцев. Паттерны (contextual retrieval, hybrid search, metadata filtering) живут дольше. Этот урок — про то, что уже можно смело списывать.</p>

<h2>1. FAISS + pickle на диске как production-решение</h2>
<p>FAISS — отличная библиотека для экспериментов и прогрева моделей. Но FAISS + pickle-файл в продакшене:</p>
<ul>
<li>Нет metadata-фильтрации без ручного кода</li>
<li>Нет CRUD (удалить документ — пересобрать весь индекс)</li>
<li>Нет persistence без внешних механизмов</li>
<li>Нет горизонтального масштабирования</li>
</ul>
<p><strong>Замена:</strong> Qdrant, pgvector, Weaviate — всё это в 2026 production-ready из коробки.</p>

<h2>2. Голый text-embedding-ada-002</h2>
<p>text-embedding-ada-002 — это 2022 год. Сам OpenAI рекомендует text-embedding-3-small/large. На MTEB он уступает современным open-source моделям (BGE-M3, GTE-Qwen2, jina-embeddings-v3).</p>
<p><strong>Замена:</strong> text-embedding-3-small (дешевле, точнее), или BGE-M3 для self-hosted.</p>

<h2>3. Dense-only retrieval без BM25</h2>
<p>Pure semantic search в 2026 — это оставить на столе 15-25% quality. Hybrid search (dense + BM25) стал стандартом. Qdrant, Elasticsearch, pgvector с pg_bm25 — всё поддерживает из коробки.</p>
<p><strong>Замена:</strong> EnsembleRetriever с BM25 или встроенный hybrid в Qdrant.</p>

<h2>4. Абстракции LangChain ради самих абстракций</h2>
<p>LangChain — мощный инструмент, но паттерн «обернуть всё в Chain» без понимания что происходит внутри создаёт:</p>
<ul>
<li>Непрозрачный debugging</li>
<li>Версионные конфликты (langchain-community vs langchain-core)</li>
<li>Over-engineering для простых задач</li>
</ul>
<p><strong>Замена:</strong> понимать каждый компонент. LangChain — там, где действительно нужно. Прямые API-вызовы — там, где достаточно.</p>

<h2>5. «Volatile» бенчмарки в лоб</h2>
<div class="callout callout-warn"><strong>MTEB протухает за 6-12 месяцев.</strong> Модели, оптимизированные под конкретный бенчмарк, перестают быть лидерами на реальных задачах через полгода. Учи методику измерения, а не цифры.</div>
<p>Правильный подход: создать собственный mini-MTEB на своих данных и регулярно перемерять свою embedding-модель. 200 пар (query, relevant_doc) достаточно.</p>

<h2>6. Fine-tuning embedding-моделей в обзорном курсе</h2>
<p>Fine-tuning embedding — отдельная большая тема (negative mining, contrastive loss, domain adaptation). В большинстве production-сценариев достаточно contextual retrieval + хорошей базовой модели. Fine-tuning — для специализированных доменов с уникальной лексикой после исчерпания других опций.</p>

<h2>7. RAG с k=20 без reranker</h2>
<p>Передавать 20 чанков напрямую в LLM без re-ranking:</p>
<ul>
<li>«Lost in the middle» — LLM игнорирует середину контекста</li>
<li>Дорогие LLM-вызовы (20× больше input-токенов)</li>
<li>Шум снижает faithfulness</li>
</ul>
<p><strong>Правило:</strong> если K>10 — нужен reranker. Если latency не позволяет reranker — снизи K до 5 с качественными metadata-фильтрами.</p>

<h4>🎯 Мини-кейс</h4>
<div>
<p><strong>Ситуация:</strong> Команда наследует RAG-систему 2023 года: FAISS+pickle, ada-002, pure dense retrieval, k=15 без reranker, всё в LangChain с 4 уровнями абстракции. Жалобы на качество.</p>
<p><strong>Правильные подходы:</strong></p>
<ul>
<li><strong>Приоритизированная миграция:</strong> 1) FAISS→pgvector (один раз, снимает все ops-боли), 2) ada-002→text-embedding-3-small (re-index, +10-15% quality), 3) добавить BM25 hybrid, 4) добавить reranker top-5 из K=15.</li>
<li><strong>Рефакторинг абстракций:</strong> каждый LangChain компонент заменить на понятный код с явными вызовами — трассируемость и debugging становятся очевидными.</li>
</ul>
<p><strong>Антипаттерн:</strong> мигрировать всё одновременно — невозможно измерить, что дало улучшение. Один компонент за раз с evaluation на golden dataset после каждого шага.</p>
</div>`,
    flashcards: [
      { front: "FAISS+pickle — почему не продакшен?", back: "Нет metadata-фильтрации, нет CRUD (удаление = пересборка индекса), нет горизонтального масштабирования, нет persistence. Для warmup и экспериментов — ок. Для продакшена — Qdrant, pgvector." },
      { front: "ada-002 — почему устарел?", back: "text-embedding-ada-002 — 2022 год. OpenAI рекомендует text-embedding-3-small/large. На MTEB он уступает BGE-M3, GTE-Qwen2, jina-embeddings-v3. Стоит дороже text-embedding-3-small при худшем качестве." },
      { front: "Почему MTEB «протухает»?", back: "Модели оптимизируются под бенчмарк (teaching to the test). Через 6-12 месяцев MTEB-лидеры не лучшие на реальных задачах. Решение: свой mini-MTEB на 200 парах из вашего домена." },
      { front: "K=20 без reranker — проблема", back: "20 чанков в LLM: «lost in the middle» (середина игнорируется), дорого (20× input tokens), шум снижает faithfulness. Правило: K>10 → нужен reranker. K≤5 с хорошими фильтрами — лучше K=20 без reranker." },
      { front: "LangChain-over-engineering", back: "4 уровня абстракции вокруг простого API-вызова: сложный debugging, version conflicts, непрозрачность. Правило: использовать фреймворки там где нужно, прямые вызовы там где достаточно." },
      { front: "Dense-only retrieval в 2026", back: "Pure semantic search оставляет 15-25% качества на столе. BM25 + dense hybrid стал стандартом. Все major vectorDB поддерживают гибридный поиск. Нет причины использовать только dense в 2026." }
    ],
    quiz: [
      {
        question: "Команда использует FAISS+pickle в продакшене с 500K документов. Главный операционный риск?",
        options: [
          "FAISS медленно ищет",
          "Удаление/обновление документа требует полной пересборки индекса — простой при обновлениях",
          "FAISS не поддерживает cosine similarity",
          "pickle-файлы несовместимы с Python 3.11"
        ],
        correct: 1,
        explanation: "FAISS не поддерживает CRUD. Обновить 1 документ из 500K = пересобрать весь индекс. При ежедневных обновлениях — постоянный downtime индекса или сложные workarounds. Qdrant/pgvector решают это нативно."
      },
      {
        question: "Почему нельзя принимать решение о выборе embedding-модели только на основе текущего MTEB-рейтинга?",
        options: [
          "MTEB тестирует только английский язык",
          "Модели оптимизируются под бенчмарк, реальное качество на вашем домене может отличаться — нужен собственный тест",
          "MTEB обновляется слишком часто",
          "MTEB не тестирует retrieval"
        ],
        correct: 1,
        explanation: "«Teaching to the test»: топ-модели на MTEB специально обучены на его задачах. На вашем специфическом домене (юридический, медицинский, технический) другая модель может быть лучше. 200 domain-specific пар — ваш личный бенчмарк."
      },
      {
        question: "Зачем нужен reranker при K>10?",
        options: [
          "Reranker ускоряет поиск",
          "LLM плохо использует информацию из середины контекста — reranker отбирает топ-5 лучших и ставит их первыми",
          "Reranker заменяет embedding-модель",
          "Reranker снижает стоимость LLM-вызовов"
        ],
        correct: 1,
        explanation: "«Lost in the middle»: при K=15 чанки в позициях 5-10 фактически игнорируются LLM. Reranker находит действительно лучшие 5, размещает их в начале контекста. Качество растёт, стоимость падает (меньше токенов)."
      },
      {
        question: "Какой принцип применять при выборе: использовать LangChain abstraction или прямой API-вызов?",
        options: [
          "Всегда использовать LangChain — стандарт индустрии",
          "Никогда не использовать LangChain",
          "LangChain там где даёт реальную ценность (сложные chains, callbacks). Прямые вызовы там где достаточно — прозрачнее, проще debug",
          "Выбор зависит только от размера команды"
        ],
        correct: 2,
        explanation: "LangChain — инструмент, не догма. Для простых RAG-пайплайнов прямые API-вызовы прозрачнее и проще в отладке. LangChain добавляет ценность при сложных агентных пайплайнах, callback-системах, интеграциях. Используй осознанно."
      },
      {
        question: "Fine-tuning embedding-модели — когда это оправдано?",
        options: [
          "Всегда — это даёт лучшее качество",
          "Никогда — contextual retrieval лучше",
          "Только после исчерпания: contextual retrieval + hybrid + reranker + metadata. Для доменов с уникальной лексикой (медицина, право, патенты)",
          "При корпусе более 1M документов"
        ],
        correct: 2,
        explanation: "Fine-tuning — дорогое последнее средство. Сначала: contextual retrieval, hybrid search, reranker, metadata фильтры. Если всё это дало максимум, а качество ещё недостаточно на специализированной лексике — тогда fine-tuning."
      },
      {
        question: "Что из перечисленного НЕ является legacy-паттерном в 2026?",
        options: [
          "FAISS+pickle в продакшене",
          "text-embedding-ada-002",
          "Dense-only retrieval без BM25",
          "Hybrid search с contextual retrieval и reranker"
        ],
        correct: 3,
        explanation: "Hybrid search (dense + BM25) + contextual retrieval + reranker — это production-default 2025-2026. Остальные три — legacy: FAISS+pickle (нет CRUD), ada-002 (устаревшая), dense-only (хуже гибрида)."
      }
    ],
    sources: [
      { title: "MTEB Leaderboard", desc: "Бенчмарк embedding-моделей — изучай методику, а не только цифры", url: "https://huggingface.co/spaces/mteb/leaderboard", icon: "🏆" },
      { title: "text-embedding-3 Migration Guide", desc: "Официальный гайд OpenAI по миграции с ada-002", url: "https://platform.openai.com/docs/guides/embeddings", icon: "🔧" },
      { title: "Jason Liu — RAG is hard", desc: "Почему простые улучшения важнее архитектурных", url: "https://jxnl.github.io/blog/writing/2024/01/07/why-rag-is-hard/", icon: "✍️" }
    ]
  }
];

// === State ===
let currentLesson = -1;
let completedLessons = new Set(JSON.parse(localStorage.getItem('rag-completed') || '[]'));

// === DOM ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function init() {
    renderSidebar();
    updateProgress();

    $('#btnStart').addEventListener('click', () => openLesson(0));
    $('#btnPrev').addEventListener('click', () => openLesson(currentLesson - 1));
    $('#btnNext').addEventListener('click', () => {
        if (currentLesson === COURSE.length - 1) showFinalReview();
        else openLesson(currentLesson + 1);
    });
    $('#btnComplete').addEventListener('click', toggleComplete);
    $('#btnRestart').addEventListener('click', restart);
    $('#mobileMenu').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });
}

function renderSidebar() {
    const nav = $('#lessonNav');
    nav.innerHTML = COURSE.map((lesson, i) => {
        const completed = completedLessons.has(i);
        return `<button class="lesson-btn ${completed ? 'completed' : ''}" data-idx="${i}">
            <span class="lesson-num">${completed ? '&#x2713;' : (i + 1)}</span>
            <span class="lesson-btn-text">${lesson.title}</span>
        </button>`;
    }).join('');

    nav.querySelectorAll('.lesson-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openLesson(parseInt(btn.dataset.idx));
            $('#sidebar').classList.remove('open');
        });
    });
}

function openLesson(idx) {
    if (idx < 0 || idx >= COURSE.length) return;

    currentLesson = idx;
    const lesson = COURSE[idx];

    // Show lesson view
    $('#welcomeScreen').classList.add('hidden');
    $('#finalReview').classList.add('hidden');
    $('#lessonView').classList.remove('hidden');

    // Header
    $('#lessonBadge').textContent = 'Урок ' + (idx + 1) + ' из ' + COURSE.length;
    $('#lessonTitle').textContent = lesson.title;
    $('#lessonGoal').textContent = lesson.goal;

    // Objectives
    $('#objectivesList').innerHTML = lesson.objectives
        .map(o => '<li>' + o + '</li>').join('');

    // Body
    $('#lessonBody').innerHTML = lesson.body;

    // Flashcards
    renderFlashcards(lesson.flashcards);

    // Quiz
    renderQuiz(lesson.quiz);

    // Sources
    renderSources(lesson.sources);

    // Nav buttons
    $('#btnPrev').style.visibility = idx === 0 ? 'hidden' : 'visible';
    $('#btnNext').textContent = idx === COURSE.length - 1 ? 'Завершить курс' : 'Далее \u2192';

    const isCompleted = completedLessons.has(idx);
    $('#btnComplete').textContent = isCompleted ? 'Завершено \u2713' : 'Завершить урок \u2713';
    $('#btnComplete').classList.toggle('done', isCompleted);

    // Highlight sidebar
    $$('.lesson-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

function renderFlashcards(cards) {
    const grid = $('#flashcardsGrid');
    grid.innerHTML = cards.map((card, i) => `
        <div class="flashcard" data-idx="${i}">
            <div class="flashcard-inner">
                <div class="flashcard-front">${card.front}</div>
                <div class="flashcard-back">${card.back}</div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.flashcard').forEach(fc => {
        fc.addEventListener('click', () => fc.classList.toggle('flipped'));
    });
}

function renderQuiz(questions) {
    const container = $('#quizContainer');
    container.innerHTML = questions.map((q, qi) => `
        <div class="quiz-question" data-qi="${qi}">
            <p>${q.question}</p>
            <div class="quiz-options">
                ${q.options.map((opt, oi) => `
                    <div class="quiz-option" data-oi="${oi}">${opt}</div>
                `).join('')}
            </div>
            <div class="quiz-feedback" data-qi="${qi}"></div>
        </div>
    `).join('');

    container.querySelectorAll('.quiz-question').forEach(qEl => {
        const qi = parseInt(qEl.dataset.qi);
        const q = questions[qi];

        qEl.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => {
                if (opt.classList.contains('disabled')) return;

                const oi = parseInt(opt.dataset.oi);
                const isCorrect = oi === q.correct;

                // Mark all options
                qEl.querySelectorAll('.quiz-option').forEach(o => {
                    o.classList.add('disabled');
                    if (parseInt(o.dataset.oi) === q.correct) {
                        o.classList.add('correct');
                    }
                });

                if (!isCorrect) {
                    opt.classList.add('wrong');
                }

                // Show feedback
                const fb = qEl.querySelector('.quiz-feedback');
                fb.textContent = q.explanation;
                fb.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'wrong');
            });
        });
    });
}

function renderSources(sources) {
    const grid = $('#sourcesGrid');
    grid.innerHTML = sources.map(s => `
        <a class="source-card" href="${s.url}" target="_blank" rel="noopener">
            <span class="source-icon">${s.icon}</span>
            <div class="source-info">
                <div class="source-title">${s.title}</div>
                <div class="source-desc">${s.desc}</div>
            </div>
        </a>
    `).join('');
}

function toggleComplete() {
    if (completedLessons.has(currentLesson)) {
        completedLessons.delete(currentLesson);
    } else {
        completedLessons.add(currentLesson);
    }
    localStorage.setItem('rag-completed', JSON.stringify([...completedLessons]));
    updateProgress();
    renderSidebar();

    const isCompleted = completedLessons.has(currentLesson);
    $('#btnComplete').textContent = isCompleted ? 'Завершено \u2713' : 'Завершить урок \u2713';
    $('#btnComplete').classList.toggle('done', isCompleted);

    // Re-highlight active
    $$('.lesson-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === currentLesson);
    });
}

function updateProgress() {
    const pct = (completedLessons.size / COURSE.length) * 100;
    $('#progressFill').style.width = pct + '%';
    $('#progressText').textContent = completedLessons.size + ' / ' + COURSE.length + ' уроков';
}

function showFinalReview() {
    $('#lessonView').classList.add('hidden');
    $('#finalReview').classList.remove('hidden');

    const content = $('#reviewContent');
    content.innerHTML = '<div class="review-grid">' +
        COURSE.map((lesson, i) => `
            <div class="review-item">
                <span class="review-check">${completedLessons.has(i) ? '\u2705' : '\u2B1C'}</span>
                <span class="review-text">${i + 1}. ${lesson.title}</span>
            </div>
        `).join('') +
    '</div>';

    window.scrollTo(0, 0);
}

function restart() {
    completedLessons.clear();
    localStorage.removeItem('rag-completed');
    currentLesson = -1;
    updateProgress();
    renderSidebar();
    $('#finalReview').classList.add('hidden');
    $('#lessonView').classList.add('hidden');
    $('#welcomeScreen').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Init
document.addEventListener('DOMContentLoaded', init);
