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
<p><strong>Modular RAG</strong> — рассматривает RAG как набор модулей (router, retriever, reader, critic), которые можно комбинировать и заменять независимо.</p>`,
    flashcards: [
      { front: "Что такое галлюцинация LLM?", back: "Ситуация, когда модель генерирует правдоподобный, но фактически неверный ответ, потому что не имеет доступа к нужным данным." },
      { front: "Три этапа RAG pipeline", back: "1) Indexing — разбить документы на чанки и создать эмбеддинги. 2) Retrieval — найти релевантные чанки по запросу. 3) Generation — сгенерировать ответ на основе найденного контекста." },
      { front: "RAG vs Fine-tuning — главное отличие", back: "Fine-tuning меняет поведение/стиль модели (обучение на примерах). RAG добавляет знания без переобучения (контекст в промпте). RAG дёшево и быстро обновляется." }
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
</ol>`,
    flashcards: [
      { front: "Recursive vs Fixed-size chunking", back: "Recursive пробует разделители по приоритету (¶→.→word), сохраняя семантику. Fixed-size режет строго по N токенов, ломая предложения. Recursive — дефолтный выбор." },
      { front: "Semantic chunking", back: "Использует эмбеддинги для определения границ: когда расстояние между предложениями превышает порог — новый чанк. Дороже (N+1 вызовов embedding), но точнее для неоднородных текстов." },
      { front: "Зачем нужны метаданные в чанках?", back: "Для фильтрации при retrieval. Metadata filters позволяют искать только в нужных документах/секциях/датах, значительно повышая точность. Без метаданных — поиск по всему корпусу." }
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

<div class="callout callout-warn"><strong>Quantization:</strong> для экономии RAM используйте scalar quantization (float32 → int8) или product quantization. Потеря качества 1-3%, экономия RAM 4-8x.</div>`,
    flashcards: [
      { front: "Косинусное расстояние", back: "Мера схожести двух векторов. cos(A,B) = A·B / (|A|·|B|). Значения от -1 до 1. 1 = идентичный смысл, 0 = ортогональны, -1 = противоположны." },
      { front: "HNSW индекс", back: "Hierarchical Navigable Small World — граф-based алгоритм приближённого поиска. Строит многоуровневый граф навигации. O(log N) время поиска. Дефолтный выбор для большинства векторных БД." },
      { front: "pgvector — когда выбирать?", back: "Когда уже используете PostgreSQL и объём <1M векторов. Нулевые инфраструктурные затраты, HNSW-индексы, привычные SQL-запросы с фильтрами." }
    ],
    quiz: [
      {
        question: "Какая векторная БД наиболее подходит для команды, которая уже использует PostgreSQL и имеет <500K документов?",
        options: [
          "Pinecone — managed solution без运维",
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

<div class="callout callout-warn"><strong>Latency:</strong> каждая query transformation добавляет 1-3 секунды. Для real-time чат-ботов может быть критично. Для async-обработки — нормально.</div>`,
    flashcards: [
      { front: "Hybrid Search", back: "Комбинация dense (semantic/эмбеддинги) и sparse (BM25/TF-IDF) поиска. Dense находит семантически похожее, sparse — точные совпадения (номера, имена). Объединяются через weighted average или RRF." },
      { front: "Re-ranking", back: "Двухступенчатый retrieval: 1) Retriever возвращает топ-20 кандидатов (быстро, приблизительный). 2) Cross-encoder re-ranker переранжирует все 20 с высокой точностью и возвращает топ-5. Качество растёт на 10-25%." },
      { front: "HyDE (Hypothetical Document Embeddings)", back: "LLM генерирует гипотетический ответ на запрос, затем эмбеддинг этого ответа используется для поиска. Парадокс: сгенерированный документ ближе к реальным документам в векторном пространстве, чем короткий пользовательский запрос." }
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
</ul>`,
    flashcards: [
      { front: "Response mode: compact vs refine", back: "compact — все чанки в одном промпте (быстро, но лимит токенов). refine — итеративно уточняет ответ по каждому чанку (медленнее, но лучше для длинных контекстов). tree_summarize — рекурсивное суммирование." },
      { front: "Зачем temperature=0 в RAG?", back: "RAG — фактологическая задача. Высокая temperature добавляет креативность, но увеличивает галлюцинации. Temperature=0 делает ответы детерминированными и основанными на контексте." },
      { front: "Baseline-тест прототипа", back: "10-20 вопросов с известными ответами. Оценка: retrieval accuracy (правильные чанки?), faithfulness (нет галлюцинаций?), relevance (отвечает на вопрос?). 60%+ = RAG жизнеспособен." }
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

<div class="callout callout-danger"><strong>Никогда не меняйте два компонента одновременно.</strong> Если поменяли chunking и retrieval — не узнаете, что именно повлияло на результат.</div>`,
    flashcards: [
      { front: "Faithfulness vs Relevance", back: "Faithfulness: ответ основан на контексте (нет галлюцинаций). Relevance: ответ отвечает на вопрос. Можно быть faithful но irrelevant (правда, но не о том), или relevant но unfaithful (о том, но выдумано)." },
      { front: "Golden Dataset", back: "Набор 50-200 пар (вопрос, эталонный ответ, релевантные документы) для evaluation. Собирается вручную из реальных запросов. Фундамент для A/B-тестов и regression-тестирования." },
      { front: "RAGAS", desc: "Фреймворк для автоматической evaluation RAG. Измеряет faithfulness, answer_relevancy, context_precision, context_recall через LLM-as-judge.", back: "Open-source фреймворк для автоматической evaluation RAG. Измеряет 4 метрики через LLM-as-judge (обычно GPT-4). Быстро, дёшево, коррелирует с human eval на 0.7-0.8." }
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
</ul>`,
    flashcards: [
      { front: "Semantic Cache", back: "Кэш по семантической близости запросов (cosine similarity ≥ 0.95). В отличие от string-based кэша, ловит переформулировки одного вопроса. Снижает LLM-вызовы на 30-50%." },
      { front: "Tracing в RAG", back: "Запись полного пути каждого запроса: query → rewriting → retrieval (candidates, scores) → re-ranking → LLM (tokens, cost) → response. Позволяет отладить конкретный плохой ответ." },
      { front: "Guardrails в RAG", back: "Многослойная защита: input guard (prompt injection, токсичность), output guard (PII, off-topic), citation check (ссылки на реальные источники), confidence gate (faithfulness < порога → отказ)." }
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

<div class="callout callout-danger"><strong>Главное правило:</strong> RAG — это не проект, это продукт. Он требует постоянного мониторинга, обновления данных и итерации. Запустили — не значит закончили.</div>`,
    flashcards: [
      { front: "Agentic RAG vs Naive RAG", back: "Naive: статический pipeline (retrieve → generate). Agentic: агент решает, нужен ли retrieval, может переписывать запрос, итерировать, использовать несколько источников (vector DB + web + API). Гибче, но дороже и медленнее." },
      { front: "Self-RAG", back: "Модель оценивает свой собственный ответ: (1) нужен ли retrieval? (2) релевантны ли чанки? (3) ответ основан на контексте? Если нет — перегенерирует или переписывает запрос. Повышает faithfulness на 15-30%." },
      { front: "Graph RAG", back: "Строит knowledge graph из документов (сущности → узлы, связи → рёбра). Позволяет multi-hop reasoning: «кто руководил проектом из Q3-отчёта?». Microsoft GraphRAG — референсная реализация. Overkill для простых FAQ." }
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
      }
    ],
    sources: [
      { title: "Microsoft GraphRAG", desc: "Graph-based RAG для multi-hop reasoning", url: "https://github.com/microsoft/graphrag", icon: "🕸️" },
      { title: "Self-RAG Paper (Asai et al.)", desc: "Learning to Retrieve, Generate, and Critique through Self-Reflection", url: "https://arxiv.org/abs/2310.11511", icon: "📄" },
      { title: "Corrective RAG (Yan et al.)", desc: "CRAG: Corrective Retrieval Augmented Generation", url: "https://arxiv.org/abs/2401.15884", icon: "📄" },
      { title: "LlamaIndex Workflows", desc: "Event-driven agentic workflows", url: "https://docs.llamaindex.ai/en/stable/understanding/workflows/", icon: "🦙" }
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
