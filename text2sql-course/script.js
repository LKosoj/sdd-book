const COURSE = [
  {
    title: "Что такое Text-2-SQL и зачем это нужно",
    goal: "Понеть задачу Text-2-SQL, её место в экосистеме AI, и основные подходы к решению.",
    objectives: [
      "Описать задачу Text-2-SQL и её бизнес-применения",
      "Различать подходы: rule-based, seq2seq, LLM-based",
      "Понимать метрики качества: Execution Accuracy vs Exact Match",
      "Оценить, когда Text-2-SQL применим, а когда нет"
    ],
    body: `<h2>Задача: превратить вопрос в SQL-запрос</h2>
<p>Пользователь пишет на естественном языке: «Покажи топ-10 клиентов по выручке за последний квартал». Система должна сгенерировать корректный SQL:</p>

<pre><code>SELECT c.name, SUM(o.total) AS revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 10;</code></pre>

<p>Это и есть Text-2-SQL (NL2SQL) — преобразование естественного языка в структурированные запросы к базе данных.</p>

<h2>Зачем это нужно бизнесу</h2>
<ul>
<li><strong>Self-service аналитика</strong> — менеджеры получают данные без SQL-навыков и очередей к аналитикам</li>
<li><strong>Chat-боты для данных</strong> — conversational интерфейс к корпоративным БД</li>
<li><strong>Автоматизация отчётности</strong> — генерация отчётов по текстовым запросам</li>
<li><strong>Data democratization</strong> — доступ к данным для нетехнических сотрудников</li>
</ul>

<div class="callout callout-tip"><strong>Рынок:</strong> по данным Gartner, к 2026 году 50% enterprise-аналитики будет использовать NL-интерфейсы. Text-2-SQL — ключевая технология.</div>

<h2>Эволюция подходов</h2>

<h3>1. Rule-based (2010-2017)</h3>
<p>Парсинг NLP → извлечение сущностей → шаблоны SQL. Жёсткие правила, ограниченный словарь, не масштабируется.</p>
<pre><code># Псевдокод rule-based подхода
intent = parse_intent("покажи топ клиентов")
# Распознано: SELECT + ORDER BY + LIMIT

entities = extract_entities("топ-10 клиентов по выручке за квартал")
# Распознано: table=customers, metric=revenue, period=quarter, limit=10

sql = apply_template(intent, entities)
# → SELECT ... FROM customers ... LIMIT 10</code></pre>

<h3>2. Seq2Seq / Encoder-Decoder (2017-2022)</h3>
<p>Нейросети, обученные на парах (вопрос, SQL). RAT-SQL, IRNet, BRIDGE. Специализированные модели, fine-tuned на Spider. Хорошо на бенчмарках, но хрупко — не обобщает на новые схемы.</p>

<h3>3. LLM-based (2023+)</h3>
<p>GPT-4, Claude, CodeLlama генерируют SQL через prompt engineering. Few-shot примеры, schema в промпте, chain-of-thought. Гибко, обобщает, но требует тщательного промпт-дизайна.</p>

<pre><code># Современный подход: LLM + schema context
prompt = f"""
Схема базы данных:
{schema_description}

Вопрос: {user_question}

Сгенерируй SQL-запрос (PostgreSQL диалект).
Верни ТОЛЬКО SQL, без объяснений.
"""
sql = llm.generate(prompt)</code></pre>

<h2>Метрики качества</h2>

<h3>Execution Accuracy (EX)</h3>
<p>Сгенерированный SQL выполняется на БД, результат сравнивается с эталоном. <strong>Главная метрика</strong> — потому что два разных SQL могут дать одинаковый результат.</p>

<h3>Exact Match (EM)</h3>
<p>Посимвольное сравнение SQL-запросов. Строгая, но непрактичная метрика: <code>SELECT a, b</code> и <code>SELECT b, a</code> — разные строки, но одинаковый результат.</p>

<div class="callout callout-warn"><strong>На практике используйте Execution Accuracy.</strong> Exact Match слишком строгая и penalizes корректные, но иначе написанные запросы.</div>

<h2>Когда Text-2-SQL применим</h2>
<p><strong>Хорошо работает:</strong> OLAP-запросы, агрегации, JOINs, фильтры по датам, простые аналитические задачи.</p>
<p><strong>Плохо работает:</strong> write-операции (INSERT/UPDATE/DELETE), сложные window functions, рекурсивные CTE, оптимизация query plans.</p>

<blockquote>Золотое правило: Text-2-SQL — для READ-запросов. Никогда не давайте LLM генерировать write-SQL без явного подтверждения пользователем и sandbox-окружения.</blockquote>`,
    flashcards: [
      { front: "Text-2-SQL (NL2SQL)", back: "Задача преобразования вопроса на естественном языке в SQL-запрос. Три поколения: rule-based (шаблоны) → seq2seq (специализированные модели) → LLM-based (prompt engineering с GPT-4/Claude)." },
      { front: "Execution Accuracy vs Exact Match", back: "EX: результат SQL совпадает с эталоном (главная метрика). EM: SQL-строка совпадает посимвольно (слишком строгая — SELECT a,b и SELECT b,a дают одинаковый результат, но EM=0)." },
      { front: "Когда Text-2-SQL НЕ работает", back: "Write-операции (INSERT/UPDATE/DELETE) — опасно. Сложные window functions, рекурсивные CTE — LLM часто ошибается. Оптимизация query plans — не задача NL2SQL. Золотое правило: только READ." }
    ],
    quiz: [
      {
        question: "Почему Execution Accuracy предпочтительнее Exact Match для оценки Text-2-SQL?",
        options: [
          "Execution Accuracy быстрее вычисляется",
          "Exact Match не учитывает синтаксические ошибки",
          "Два разных SQL могут давать одинаковый результат — EX это учитывает",
          "Execution Accuracy не требует эталонных данных"
        ],
        correct: 2,
        explanation: "SELECT a, b и SELECT b, a — семантически идентичны, но EM=0. Execution Accuracy выполняет оба запроса и сравнивает результаты, что корректно оценивает качество."
      },
      {
        question: "Какой тип SQL-операций НЕ рекомендуется для Text-2-SQL?",
        options: [
          "SELECT с JOINs и GROUP BY",
          "INSERT, UPDATE, DELETE",
          "SELECT с WHERE и ORDER BY",
          "SELECT с агрегатными функциями"
        ],
        correct: 1,
        explanation: "Write-операции опасны: LLM может сгенерировать DELETE без WHERE или UPDATE, затрагивающий миллионы строк. Text-2-SQL должен быть ограничен READ-запросами (SELECT)."
      }
    ],
    sources: [
      { title: "Spider Benchmark (Yu et al.)", desc: "Крупнейший бенчмарк Text-2-SQL с 10K+ примеров", url: "https://yale-lily.github.io/spider", icon: "🕷️" },
      { title: "BIRD Benchmark", desc: "Бенчмарк с dirty values и domain knowledge", url: "https://bird-bench.github.io/", icon: "🐦" },
      { title: "Text-to-SQL Survey (2024)", desc: "Обзор современного состояния области", url: "https://arxiv.org/abs/2405.01465", icon: "📄" }
    ]
  },
  {
    title: "Schema Understanding: как подать схему модели",
    goal: "Научиться описывать схему БД так, чтобы LLM генерировала точные SQL-запросы.",
    objectives: [
      "Извлекать схему из БД и форматировать для LLM",
      "Добавлять семантические описания к таблицам и колонкам",
      "Обрабатывать большие схемы: что включить, что отбросить",
      "Предоставлять sample data для контекста"
    ],
    body: `<h2>Схема — это 70% успеха Text-2-SQL</h2>
<p>LLM не знает вашу базу данных. Чем точнее и полнее вы опишете схему в промпте, тем точнее будет SQL. Плохое описание схемы = плохие запросы. Всегда.</p>

<h2>Извлечение схемы из БД</h2>

<h3>PostgreSQL</h3>
<pre><code>SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;</code></pre>

<h3>Форматирование для промпта</h3>
<pre><code>CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),          -- полное имя клиента
    email VARCHAR(255),         -- email для уведомлений
    created_at TIMESTAMP,       -- дата регистрации
    plan VARCHAR(20),           -- free, pro, enterprise
    country_code CHAR(2)        -- ISO 3166-1 alpha-2
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    total DECIMAL(10,2),        -- сумма заказа в USD
    status VARCHAR(20),         -- pending, paid, refunded, cancelled
    created_at TIMESTAMP
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),       -- electronics, clothing, food, books
    price DECIMAL(10,2),
    stock INTEGER               -- остаток на складе
);</code></pre>

<h2>Семантические описания: критически важны</h2>
<p>Без описаний LLM угадывает назначение колонок. <code>status</code> может быть чем угодно. С описаниями — точность растёт на 20-40%.</p>

<h3>Где хранить описания</h3>
<pre><code># Вариант 1: COMMENT ON в PostgreSQL (рекомендуется)
COMMENT ON TABLE orders IS 'Заказы клиентов. Один заказ может содержать несколько позиций.';
COMMENT ON COLUMN orders.status IS 'Статус: pending (ожидает оплаты), paid (оплачен), refunded (возврат), cancelled (отменён)';
COMMENT ON COLUMN orders.total IS 'Итоговая сумма в USD, включая налоги и доставку';

# Вариант 2: Отдельный YAML/JSON файл
schema_metadata:
  orders:
    description: "Заказы клиентов"
    columns:
      status:
        values: ["pending", "paid", "refunded", "cancelled"]
        note: "Для аналитики выручки используйте только status=paid"
      total:
        unit: "USD"
        note: "Включает налоги. Для net revenue умножайте на 0.82"</code></pre>

<h2>Sample data: покажи примеры</h2>
<p>2-3 строки из каждой таблицы помогают LLM понять типы значений и формат:</p>

<pre><code>-- Примеры данных:
-- customers: (1, 'Иван Петров', 'ivan@mail.ru', '2024-01-15', 'pro', 'RU')
-- orders: (101, 1, 2499.99, 'paid', '2026-03-15')
-- products: (501, 'MacBook Air M3', 'electronics', 129990.00, 45)</code></pre>

<div class="callout callout-tip"><strong>Правило:</strong> sample data должны показывать РЕАЛЬНЫЕ значения, edge cases (NULL, пустые строки), и формат дат/чисел. Особенно важно для нестандартных форматов (даты как '15.03.2026' vs '2026-03-15').</div>

<h2>Большие схемы: что включить</h2>
<p>Если схема содержит 200+ таблиц — невозможно включить всё в промпт (лимит токенов). Стратегии:</p>

<h3>Ручной отбор</h3>
<p>Включить только релевантные таблицы для задачи. Работает для специализированных ботов.</p>

<h3>Динамический schema linking</h3>
<p>Автоматический поиск релевантных таблиц по запросу пользователя (подробнее в уроке 4).</p>

<h3>Иерархическое описание</h3>
<pre><code># Уровень 1: Обзор (всегда в промпте)
База данных содержит 3 основных модуля:
1. CRM: customers, contacts, deals (12 таблиц)
2. Финансы: invoices, payments, expenses (8 таблиц)
3. Продукты: products, categories, inventory (6 таблиц)

# Уровень 2: Детали модуля (по запросу)
[при запросе про финансы — добавить полную схему финансов]</code></pre>

<div class="callout callout-warn"><strong>Лимит контекста:</strong> при схеме 50+ таблиц — описание занимает 5-15K токенов. Используйте dynamic schema linking, чтобы включать только релевантные 5-10 таблиц в каждый запрос.</div>

<h2>Foreign keys и relationships</h2>
<p>LLM должна понимать связи между таблицами. Явно указывайте JOIN-пути:</p>

<pre><code>-- Связи:
-- customers ← orders (customer_id)
-- orders ← order_items (order_id)
-- order_items ← products (product_id)
-- customers ← support_tickets (customer_id)

-- Типичные JOIN-паттерны:
-- Выручка по клиентам: customers → orders (WHERE status='paid')
-- Детали заказа: orders → order_items → products</code></pre>`,
    flashcards: [
      { front: "Почему семантические описания колонок критичны?", back: "Без описаний LLM угадывает: status может быть 'active/inactive' или 'pending/paid/refunded'. С описаниями + примерами значений — точность SQL растёт на 20-40%. Храните в COMMENT ON или отдельном YAML." },
      { front: "Sample data в промпте", back: "2-3 строки из каждой таблицы показывают: реальные форматы значений, edge cases (NULL), формат дат/чисел. Критично для нестандартных форматов. Помогает LLM правильно использовать CAST и форматирование." },
      { front: "Dynamic schema linking", back: "Для больших схем (50+ таблиц): вместо включения всех таблиц в промпт — автоматический поиск релевантных таблиц по запросу. Embedding-поиск по описаниям таблиц → топ-5-10 → полная схема только этих таблиц." }
    ],
    quiz: [
      {
        question: "Схема БД содержит 150 таблиц. Какой подход к описанию схемы в промпте оптимален?",
        options: [
          "Включить все 150 таблиц — больше контекста = лучше результат",
          "Включить только 5-10 релевантных таблиц через dynamic schema linking",
          "Не включать схему вообще — LLM сама знает SQL",
          "Включить только названия таблиц без колонок"
        ],
        correct: 1,
        explanation: "150 таблиц = 15-30K токенов — превышает контекстное окно или занимает слишком много места. Dynamic schema linking находит релевантные таблицы по запросу и включает только их (5-10), сохраняя качество и экономя токены."
      },
      {
        question: "Колонка orders.status содержит значения 'pending', 'paid', 'refunded', 'cancelled'. Что произойдёт, если не указать эти значения в промпте?",
        options: [
          "Ничего — LLM знает стандартные статусы заказов",
          "LLM может использовать несуществующие значения вроде 'completed' или 'active'",
          "SQL будет синтаксически невалидным",
          "Запрос выполнится, но с ошибкой"
        ],
        correct: 1,
        explanation: "Без явного перечисления значений LLM угадывает: 'completed', 'active', 'processed' — все plausible, но не существуют в БД. WHERE status='completed' вернёт 0 строк, хотя пользователь имел в виду 'paid'."
      }
    ],
    sources: [
      { title: "DIN-SQL Schema Linking", desc: "Decomposed In-Context Learning for Text-2-SQL", url: "https://arxiv.org/abs/2304.11015", icon: "📄" },
      { title: "PostgreSQL COMMENT ON", desc: "Документация по добавлению описаний к объектам БД", url: "https://www.postgresql.org/docs/current/sql-comment.html", icon: "🐘" },
      { title: "Schema Linking Survey", desc: "Анализ подходов к schema linking в Text-2-SQL", url: "https://arxiv.org/abs/2402.00291", icon: "📄" }
    ]
  },
  {
    title: "Prompt Engineering для SQL генерации",
    goal: "Освоить промпт-техники, специфичные для генерации SQL: few-shot, CoT, диалект, guardrails.",
    objectives: [
      "Спроектировать system prompt для SQL-генерации",
      "Создать few-shot примеры для разных типов запросов",
      "Применять Chain-of-Thought для сложных SQL",
      "Защитить от SQL injection и опасных запросов"
    ],
    body: `<h2>System prompt для Text-2-SQL</h2>
<p>Хороший system prompt задаёт: роль, диалект SQL, правила, формат вывода.</p>

<pre><code>Ты — эксперт по написанию SQL-запросов.

ПРАВИЛА:
- Генерируй ТОЛЬКО SELECT-запросы (никогда INSERT/UPDATE/DELETE/DROP)
- Используй диалект PostgreSQL
- Всегда используй JOIN вместо подзапросов, когда возможно
- Даты в формате YYYY-MM-DD
- Для строковых сравнений используй ILIKE (case-insensitive)
- Если вопрос неоднозначный — выбери наиболее вероятную интерпретацию
- Если вопрос невозможно преобразовать в SQL — скажи "Не могу сформулировать запрос"
- Возвращай ТОЛЬКО SQL-код, без объяснений

ФОРМАТ ВЫВОДА:
\`\`\`sql
[SQL-запрос]
\`\`\`</code></pre>

<h2>Few-shot примеры: разнообразные типы запросов</h2>
<p>Включите примеры для каждого типа SQL, который ожидаете:</p>

<pre><code>## Примеры:

Вопрос: Сколько активных пользователей за последний месяц?
\`\`\`sql
SELECT COUNT(DISTINCT user_id) AS active_users
FROM user_activity
WHERE last_active >= CURRENT_DATE - INTERVAL '1 month';
\`\`\`

Вопрос: Топ-5 товаров по выручке с разбивкой по категориям
\`\`\`sql
SELECT p.category, p.name, SUM(oi.quantity * oi.price) AS revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'paid'
GROUP BY p.category, p.name
ORDER BY revenue DESC
LIMIT 5;
\`\`\`

Вопрос: Как изменилась выручка по месяцам за последний год?
\`\`\`sql
SELECT
    DATE_TRUNC('month', o.created_at) AS month,
    SUM(o.total) AS revenue,
    LAG(SUM(o.total)) OVER (ORDER BY DATE_TRUNC('month', o.created_at))
        AS prev_month_revenue,
    ROUND(
        (SUM(o.total) - LAG(SUM(o.total)) OVER (ORDER BY DATE_TRUNC('month', o.created_at)))
        / NULLIF(LAG(SUM(o.total)) OVER (ORDER BY DATE_TRUNC('month', o.created_at)), 0) * 100, 1
    ) AS growth_pct
FROM orders o
WHERE o.status = 'paid'
    AND o.created_at >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month;
\`\`\`</code></pre>

<div class="callout callout-tip"><strong>Включите в few-shot:</strong> простой SELECT с WHERE, JOIN с агрегацией, window function, подзапрос, CASE WHEN. 4-6 примеров покрывают 80% реальных запросов.</div>

<h2>Chain-of-Thought для сложного SQL</h2>
<p>Для multi-table JOINs и сложных агрегаций — заставьте модель рассуждать:</p>

<pre><code>Вопрос: Какие клиенты сделали больше 5 заказов на сумму свыше 10000 руб
и не покупали ничего за последние 30 дней?

Рассуждай пошагово:
1. Какие таблицы нужны? (customers, orders)
2. Как найти клиентов с 5+ заказами? (GROUP BY + HAVING COUNT >= 5)
3. Как посчитать общую сумму? (HAVING SUM(total) > 10000)
4. Как проверить что не покупали 30 дней? (MAX(created_at) < NOW() - 30 days)
5. Как объединить все условия?</code></pre>

<h3>Structured CoT вывод</h3>
<pre><code>Таблицы: customers (id, name), orders (id, customer_id, total, created_at, status)
Связи: orders.customer_id → customers.id
Фильтры: status = 'paid' (только оплаченные)
Агрегации: COUNT(*) >= 5, SUM(total) > 10000, MAX(created_at) < NOW() - 30 days
Результат:
\`\`\`sql
SELECT c.name, COUNT(*) AS order_count, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'paid'
GROUP BY c.id, c.name
HAVING COUNT(*) >= 5
    AND SUM(o.total) > 10000
    AND MAX(o.created_at) < CURRENT_DATE - INTERVAL '30 days'
ORDER BY total_spent DESC;
\`\`\`</code></pre>

<h2>Диалект SQL имеет значение</h2>
<p>Разные БД — разный синтаксис. Указывайте явно:</p>
<ul>
<li><strong>PostgreSQL:</strong> <code>DATE_TRUNC</code>, <code>ILIKE</code>, <code>::type</code>, <code>GENERATE_SERIES</code></li>
<li><strong>MySQL:</strong> <code>DATE_FORMAT</code>, <code>LIKE BINARY</code>, <code>CAST()</code>, <code>LIMIT</code></li>
<li><strong>BigQuery:</strong> <code>DATE_TRUNC(x, MONTH)</code>, <code>SAFE_DIVIDE</code>, <code>ARRAY_AGG</code></li>
<li><strong>ClickHouse:</strong> <code>toStartOfMonth</code>, <code>arrayJoin</code>, <code>FINAL</code></li>
</ul>

<div class="callout callout-warn"><strong>Без указания диалекта</strong> LLM микширует синтаксис: <code>DATE_TRUNC</code> (PG) + <code>LIMIT</code> (MySQL) + <code>TOP 10</code> (MSSQL). Результат не выполнится ни на одной БД.</div>

<h2>Защита от опасных запросов</h2>
<pre><code># В system prompt:
КРИТИЧЕСКИЕ ОГРАНИЧЕНИЯ:
- Генерируй ТОЛЬКО SELECT
- Никогда не используй: DROP, DELETE, INSERT, UPDATE, ALTER, TRUNCATE, GRANT
- Не используй: xp_cmdshell, EXEC, INTO OUTFILE
- LIMIT обязателен (максимум 1000 строк)

# Post-processing проверка:
import re

DANGEROUS_PATTERNS = [
    r'\\b(DROP|DELETE|INSERT|UPDATE|ALTER|TRUNCATE)\\b',
    r'\\b(GRANT|REVOKE|EXEC)\\b',
    r'--',  # SQL comment injection
    r';\\s*\\w',  # multiple statements
]

def validate_sql(sql: str) -> bool:
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, sql, re.IGNORECASE):
            raise SecurityError(f"Dangerous pattern: {pattern}")
    if not sql.strip().upper().startswith('SELECT'):
        raise SecurityError("Only SELECT queries allowed")
    return True</code></pre>`,
    flashcards: [
      { front: "4 типа few-shot примеров для SQL", back: "1) Простой SELECT с WHERE (агрегация). 2) JOIN с GROUP BY (multi-table). 3) Window function (LAG, RANK). 4) Подзапрос или CASE WHEN. 4-6 примеров покрывают 80% реальных запросов." },
      { front: "Почему диалект SQL важен в промпте", back: "Без указания диалекта LLM микширует синтаксис: DATE_TRUNC (PG) + LIMIT (MySQL). Результат не выполнится. Указывайте явно: PostgreSQL, MySQL, BigQuery, ClickHouse — каждый имеет свой синтаксис дат, строк, LIMIT." },
      { front: "Post-processing валидация SQL", back: "Regex-проверка сгенерированного SQL: 1) Начинается с SELECT? 2) Нет DROP/DELETE/INSERT/UPDATE? 3) Нет множественных statements (;)? 4) Есть LIMIT? Блокировать опасные паттерны ДО выполнения." }
    ],
    quiz: [
      {
        question: "LLM сгенерировала: SELECT * FROM users; DROP TABLE users; Что пошло не так и как защититься?",
        options: [
          "LLM сломалась — нужно перезапустить",
          "Prompt injection в user input — добавить post-processing валидацию SQL",
          "Нужно было использовать GPT-4 вместо GPT-3.5",
          "Это нормальное поведение — SQL валиден"
        ],
        correct: 1,
        explanation: "Множественные statements через ; — классический SQL injection. Защита: 1) System prompt запрещает не-SELECT. 2) Post-processing: regex проверка на DROP/DELETE. 3) Выполнение через read-only DB user."
      },
      {
        question: "Какой Chain-of-Thought шаг критичен для запроса «клиенты, не покупавшие 30 дней»?",
        options: [
          "Определить формат вывода",
          "Использовать MAX(created_at) < NOW() - 30 days в HAVING",
          "Добавить ORDER BY",
          "Выбрать тип JOIN"
        ],
        correct: 1,
        explanation: "MAX(created_at) < NOW() - 30 days в HAVING — ключевая логика. LLM без CoT часто пишет WHERE created_at < NOW() - 30 days, что находит клиентов БЕЗ заказов за 30 дней, но не проверяет, что у них вообще были заказы."
      }
    ],
    sources: [
      { title: "DAIL-SQL (Gao et al.)", desc: "Effectively prompting LLMs for Text-2-SQL", url: "https://arxiv.org/abs/2308.15363", icon: "📄" },
      { title: "DIN-SQL", desc: "Decomposed In-Context Learning with CoT", url: "https://arxiv.org/abs/2304.11015", icon: "📄" },
      { title: "MAC-SQL", desc: "Multi-Agent Collaboration for Text-2-SQL", url: "https://arxiv.org/abs/2312.11242", icon: "📄" }
    ]
  },
  {
    title: "Schema Linking: поиск релевантных таблиц",
    goal: "Реализовать автоматический поиск релевантных таблиц и колонок для больших схем.",
    objectives: [
      "Понять проблему schema linking в больших БД",
      "Реализовать keyword-based linking",
      "Применить embedding-based semantic linking",
      "Комбинировать подходы для максимальной точности"
    ],
    body: `<h2>Проблема: 200 таблиц, а нужно 5</h2>
<p>Enterprise БД содержат сотни таблиц. Включить все в промпт — невозможно (лимит токенов) и вредно (шум снижает качество). Нужно автоматически найти релевантные 5-15 таблиц по запросу пользователя.</p>

<pre><code>Запрос: "Какая средняя продолжительность звонка по каждому менеджеру?"

Из 200 таблиц релевантны:
- calls (id, manager_id, duration_seconds, started_at)
- employees (id, name, department)
- call_outcomes (call_id, result)

НЕ релевантны: invoices, products, support_tickets, ...</code></pre>

<h2>Keyword-based linking</h2>
<p>Самый простой подход: поиск по совпадениям ключевых слов.</p>

<pre><code>def keyword_schema_linking(query: str, schema: dict) -> list:
    """Найди таблицы/колонки по keyword matching."""
    query_words = set(tokenize(query.lower()))
    scores = {}

    for table_name, table_info in schema.items():
        score = 0
        # Совпадение с названием таблицы
        for word in query_words:
            if word in table_name.lower():
                score += 3
            # Совпадение с названиями колонок
            for col in table_info["columns"]:
                if word in col.lower():
                    score += 2
            # Совпадение с описанием
            if word in table_info.get("description", "").lower():
                score += 1
        scores[table_name] = score

    # Топ-K таблиц с ненулевым скором
    return sorted(
        [(t, s) for t, s in scores.items() if s > 0],
        key=lambda x: -x[1]
    )[:10]</code></pre>

<div class="callout callout-warn"><strong>Ограничение keyword matching:</strong> «длительность разговора» не найдёт колонку <code>duration_seconds</code>. «Менеджер» не найдёт таблицу <code>employees</code>. Нужен semantic matching.</div>

<h2>Embedding-based semantic linking</h2>
<p>Конвертируйте описания таблиц и колонок в эмбеддинги, ищите по семантической близости:</p>

<pre><code>from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

# Индексируем схему (офлайн)
schema_docs = []
for table in schema:
    doc = f"Table {table['name']}: {table['description']}. "
    doc += f"Columns: {', '.join(table['columns'])}"
    schema_docs.append(doc)

schema_embeddings = model.encode(schema_docs)

# Поиск (онлайн)
def semantic_schema_linking(query: str, top_k=10) -> list:
    query_embedding = model.encode([query])
    similarities = cosine_similarity(query_embedding, schema_embeddings)
    top_indices = np.argsort(similarities[0])[-top_k:][::-1]
    return [schema_docs[i] for i in top_indices]</code></pre>

<h2>Гибридный подход: keyword + semantic</h2>
<p>Комбинация обоих методов даёт максимальную точность:</p>

<pre><code>def hybrid_schema_linking(query, schema, top_k=10):
    # Keyword scores
    keyword_scores = keyword_schema_linking(query, schema)
    # Semantic scores
    semantic_results = semantic_schema_linking(query, top_k=20)

    # Normalize и объединить
    combined = {}
    for table, score in keyword_scores:
        combined[table] = combined.get(table, 0) + score * 0.6

    for table, sim in semantic_results:
        combined[table] = combined.get(table, 0) + sim * 0.4

    return sorted(combined.items(), key=lambda x: -x[1])[:top_k]</code></pre>

<h2>Column-level linking</h2>
<p>Мало найти таблицы — нужны конкретные колонки. Особенно для JOIN-путей:</p>

<pre><code># Для каждого запроса определить:
# 1. Релевантные таблицы
# 2. Релевантные колонки в этих таблицах
# 3. JOIN-путь между таблицами

def find_join_path(tables: list, schema: dict) -> list:
    """Найди минимальный JOIN-путь между таблицами через FK."""
    # BFS/DFS по графу foreign keys
    # Возвращает список JOIN-условий
    pass

# Пример:
# Запрос: "выручка по клиентам из Москвы"
# Таблицы: customers, orders
# JOIN: customers.id = orders.customer_id
# Колонки: customers.city, orders.total, customers.name</code></pre>

<div class="callout callout-tip"><strong>Практика:</strong> для схем до 30 таблиц — включайте все (keyword linking + ручная курация). Для 30-200 таблиц — hybrid linking. Для 200+ — semantic linking с ручным review критических запросов.</div>`,
    flashcards: [
      { front: "Schema Linking", back: "Автоматический поиск релевантных таблиц и колонок по запросу пользователя. Необходим для больших схем (50+ таблиц), где включить всё в промпт невозможно. Подходы: keyword, embedding, hybrid." },
      { front: "Keyword vs Semantic linking", back: "Keyword: точные совпадения слов (быстро, но «длительность» не найдёт duration_seconds). Semantic: эмбеддинги (медленнее, но ловит синонимы). Hybrid (0.6 keyword + 0.4 semantic) — максимальная точность." },
      { front: "Column-level linking", back: "Мало найти таблицы — нужны конкретные колонки + JOIN-путь. BFS по графу foreign keys для минимального JOIN-пути. Пример: customers.city + orders.total через customers.id = orders.customer_id." }
    ],
    quiz: [
      {
        question: "Запрос: «покажи конверсию лидов по каналам». Схема содержит: leads (source, status), campaigns (channel, budget), analytics (event, page). Keyword matching не найдёт leads через «лиды». Какой подход решит?",
        options: [
          "Увеличить количество keyword-совпадений",
          "Embedding-based semantic linking",
          "Включить все таблицы в промпт",
          "Использовать более мощную LLM"
        ],
        correct: 1,
        explanation: "«Лиды» и «leads» — семантически связаны, но keyword matching не найдёт (разные языки/синонимы). Semantic embedding понимает, что «лид» ≈ «lead» ≈ «potential customer»."
      },
      {
        question: "Для схемы в 150 таблиц какой подход к schema linking оптимален?",
        options: [
          "Включить все 150 таблиц в промпт",
          "Только keyword matching",
          "Hybrid: keyword (0.6) + semantic (0.4), выбрать топ-10 таблиц",
          "Случайный выбор 10 таблиц"
        ],
        correct: 2,
        explanation: "150 таблиц = 15-30K токенов — не влезает в контекст. Hybrid combining keyword precision и semantic recall даёт оптимальный баланс, выбирая 10 наиболее релевантных таблиц."
      }
    ],
    sources: [
      { title: "Schema-Linking Paper (Lei et al.)", desc: "Zero-shot schema linking with LLMs", url: "https://arxiv.org/abs/2308.15363", icon: "📄" },
      { title: "C3-SQL: Contextual Schema Linking", desc: "Clear, Concise, Correct schema selection", url: "https://arxiv.org/abs/2307.07306", icon: "📄" },
      { title: "Sentence Transformers", desc: "Мультиязычные эмбеддинги для semantic search", url: "https://www.sbert.net/", icon: "🔧" }
    ]
  },
  {
    title: "Прототип: первый Text-2-SQL за вечер",
    goal: "Собрать работающую Text-2-SQL систему за 2-3 часа с минимальным кодом.",
    objectives: [
      "Создать полный pipeline: вопрос → schema → SQL → результат",
      "Подключить реальную БД (read-only) для выполнения запросов",
      "Обработать ошибки и показать понятные ответы",
      "Протестировать на 20+ вопросах с известными ответами"
    ],
    body: `<h2>Архитектура прототипа</h2>
<pre><code>Пользователь: "Топ-5 клиентов по выручке"
        ↓
   [Schema Linker]
   → релевантные таблицы: customers, orders
        ↓
   [Prompt Builder]
   → схема + few-shot + вопрос
        ↓
   [LLM: GPT-4o / Claude]
   → SQL-запрос
        ↓
   [SQL Validator]
   → проверка безопасности
        ↓
   [Query Executor]
   → выполнение на read-only БД
        ↓
   [Response Formatter]
   → таблица + SQL + объяснение</code></pre>

<h2>Полный код: 100 строк</h2>
<pre><code>from openai import OpenAI
import psycopg2
import re

client = OpenAI()

# 1. Извлечение схемы
def get_schema(conn) -> str:
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
    """)
    schema = {}
    for table, col, dtype in cur.fetchall():
        schema.setdefault(table, []).append(f"{col} {dtype}")
    return "\\n\\n".join(
        f"CREATE TABLE {t} (\\n  " +
        ",\\n  ".join(cols) + "\\n);"
        for t, cols in schema.items()
    )

# 2. System prompt
SYSTEM_PROMPT = """Ты — SQL-эксперт. Генерируй PostgreSQL SELECT-запросы.
ПРАВИЛА:
- ТОЛЬКО SELECT (никогда INSERT/UPDATE/DELETE/DROP)
- Всегда добавляй LIMIT (макс 1000)
- Для строк: ILIKE
- Даты: YYYY-MM-DD
- Возвращай ТОЛЬКО SQL в &lt;code&gt;sql&lt;/code&gt; блоке

СХЕМА БАЗЫ ДАННЫХ:
{schema}

ПРИМЕРЫ:
Вопрос: Количество заказов за месяц
<pre><code>SELECT COUNT(*) FROM orders
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);</code></pre>

Вопрос: Средняя выручка по категориям
<pre><code>SELECT p.category, AVG(o.total) AS avg_revenue
FROM orders o JOIN products p ON o.product_id = p.id
WHERE o.status = 'paid'
GROUP BY p.category ORDER BY avg_revenue DESC;</code></pre>"""

# 3. Генерация SQL
def generate_sql(question: str, schema: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT.format(schema=schema)},
            {"role": "user", "content": question}
        ],
        temperature=0
    )
    content = response.choices[0].message.content
    # Извлечь SQL из code block
    match = re.search(r'\`\`\`sql\\n(.*?)\\n\`\`\`', content, re.DOTALL)
    return match.group(1) if match else content

# 4. Валидация
def validate_sql(sql: str) -> bool:
    if not sql.strip().upper().startswith('SELECT'):
        return False
    dangerous = re.compile(
        r'\\b(DROP|DELETE|INSERT|UPDATE|ALTER|TRUNCATE|GRANT)\\b',
        re.IGNORECASE
    )
    return not dangerous.search(sql)

# 5. Выполнение
def execute_sql(sql: str, conn) -> list:
    cur = conn.cursor()
    cur.execute(sql)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    return {"columns": columns, "rows": rows}

# 6. Полный pipeline
def text2sql(question: str):
    conn = psycopg2.connect("dbname=analytics user=readonly")
    schema = get_schema(conn)
    sql = generate_sql(question, schema)

    if not validate_sql(sql):
        return {"error": "Сгенерирован небезопасный запрос"}

    try:
        result = execute_sql(sql, conn)
        return {"sql": sql, "result": result}
    except Exception as e:
        return {"sql": sql, "error": str(e)}</code></pre>

<h2>Read-only подключение: обязательно</h2>
<pre><code>-- PostgreSQL: создать read-only пользователя
CREATE ROLE readonly_user WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE analytics TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Ограничить время выполнения запроса
ALTER ROLE readonly_user SET statement_timeout = '30s';

-- Ограничить количество строк
ALTER ROLE readonly_user SET default_limit = 1000;</code></pre>

<div class="callout callout-danger"><strong>НИКОГДА не выполняйте SQL от LLM под пользователем с write-правами.</strong> Даже с валидацией — всегда read-only. Даже для прототипа. Даже «на 5 минут».</div>

<h2>Тестирование прототипа</h2>
<pre><code>test_cases = [
    {"q": "Сколько всего клиентов?", "expected_rows": 1},
    {"q": "Топ-5 товаров по продажам", "expected_rows": 5},
    {"q": "Выручка по месяцам за год", "expected_rows": 12},
    {"q": "Средний чек по категориям", "expected_min_cols": 2},
    {"q": "Клиенты без заказов", "expected_type": "list"},
    # ... 15-20 тестов
]

passed = 0
for test in test_cases:
    result = text2sql(test["q"])
    if "error" not in result:
        passed += 1
        print(f"  PASS: {test['q']}")
        print(f"  SQL: {result['sql'][:80]}...")
    else:
        print(f"  FAIL: {test['q']} — {result['error']}")

print(f"\\nResults: {passed}/{len(test_cases)} passed")</code></pre>

<div class="callout callout-tip"><strong>Baseline:</strong> если 14+ из 20 тестов проходят — прототип жизнеспособен. 10-14 — нужно улучшить схему/промпт. Менее 10 — проблема в схеме или данных.</div>

<h2>Обработка ошибок</h2>
<p>LLM может сгенерировать SQL, который не выполнится. Обрабатывайте:</p>
<ul>
<li><strong>Синтаксические ошибки</strong> — покажите SQL + понятное объяснение</li>
<li><strong>Несуществующие таблицы/колонки</strong> — schema linking не нашёл</li>
<li><strong>Timeout</strong> — запрос слишком тяжёлый, добавьте LIMIT</li>
<li><strong>Пустой результат</strong> — запрос корректен, но данных нет</li>
</ul>`,
    flashcards: [
      { front: "6 шагов Text-2-SQL pipeline", back: "1) Schema extraction (DDL из БД). 2) Schema linking (релевантные таблицы). 3) Prompt building (схема + few-shot + вопрос). 4) SQL generation (LLM). 5) SQL validation (безопасность). 6) Query execution (read-only БД)." },
      { front: "Read-only DB user — почему обязателен", back: "Даже с regex-валидацией, LLM может сгенерировать обходной вредоносный SQL. Read-only user + statement_timeout = двойная защита. Никогда не используйте write-доступ, даже для прототипа." },
      { front: "Baseline тест: 20 вопросов", back: "14+/20 (70%) — прототип жизнеспособен. 10-14 — улучшить схему/промпт. Менее 10 — фундаментальная проблема. Оценивайте: SQL валиден? Результат корректен? Ответ релевантен?" }
    ],
    quiz: [
      {
        question: "Почему нельзя выполнять SQL от LLM под админским пользователем БД, даже с regex-валидацией?",
        options: [
          "Regex-валидация замедляет выполнение",
          "LLM может сгенерировать SQL, обходящий regex-паттерны",
          "Админский пользователь не поддерживает SELECT",
          "Это не проблема — regex достаточно"
        ],
        correct: 1,
        explanation: "Regex-валидация покрывает 90% случаев, но LLM может сгенерировать обходные конструкции. Read-only user — defence in depth: даже если SQL пройдёт валидацию, он не сможет изменить данные."
      },
      {
        question: "Прототип проходит 8 из 20 тестов. Где искать проблему?",
        options: [
          "Переключиться на более мощную LLM",
          "Проверить описание схемы и few-shot примеры",
          "Увеличить temperature для разнообразия",
          "Добавить больше тестов"
        ],
        correct: 1,
        explanation: "Менее 50% accuracy указывает на фундаментальную проблему: LLM не понимает схему или few-shot примеры нерелевантны. Проверьте: описания колонок, sample data, разнообразие примеров."
      }
    ],
    sources: [
      { title: "Vanna AI", desc: "Open-source Text-2-SQL фреймворк", url: "https://github.com/vanna-ai/vanna", icon: "🔧" },
      { title: "LangChain SQL Agent", desc: "SQL agent с tool use", url: "https://python.langchain.com/docs/tutorials/sql_qa/", icon: "🦜" },
      { title: "LlamaIndex SQL Query Engine", desc: "Text-2-SQL в LlamaIndex", url: "https://docs.llamaindex.ai/en/stable/examples/index_structs/struct_indices/SQLIndexDemo/", icon: "🦙" }
    ]
  },
  {
    title: "Evaluation: Spider, BIRD и кастомные бенчмарки",
    goal: "Построить evaluation pipeline для Text-2-SQL: стандартные бенчмарки + кастомные тесты.",
    objectives: [
      "Использовать Spider и BIRD для оценки модели",
      "Создать golden dataset из реальных запросов",
      "Измерять Execution Accuracy автоматически",
      "Проводить error analysis для итеративного улучшения"
    ],
    body: `<h2>Зачем evaluation</h2>
<p>Без систематической evaluation вы не знаете, улучшился ли промпт после изменений. «На глаз лучше» — не метрика. Нужен воспроизводимый pipeline.</p>

<h2>Стандартные бенчмарки</h2>

<h3>Spider</h3>
<p>10,181 вопросов + 5,693 SQL на 200 БД. Разные диалекты, JOINs, подзапросы, вложенные SELECT. Золотой стандарт.</p>
<ul>
<li><strong>Easy:</strong> простые SELECT, WHERE, ORDER BY</li>
<li><strong>Medium:</strong> JOINs, GROUP BY, HAVING</li>
<li><strong>Hard:</strong> подзапросы, UNION, EXCEPT</li>
<li><strong>Extra Hard:</strong> вложенные подзапросы, window functions</li>
</ul>

<h3>BIRD</h3>
<p>12,751 вопрос на 95 БД. Сложнее Spider: dirty data, domain knowledge, внешние знания. Ближе к реальному продакшену.</p>

<pre><code># Пример из BIRD (сложный):
Question: "What is the average age of the researchers who
have published papers in both conferences and journals?"
# Требует: UNION двух подзапросов + INTERSECT + AVG</code></pre>

<h2>Golden Dataset из реальных запросов</h2>
<p>Стандартные бенчмарки не отражают вашу БД. Создайте свой:</p>

<pre><code>golden_dataset = [
    {
        "question": "Какая выручка за последний квартал?",
        "sql": "SELECT SUM(total) FROM orders WHERE status='paid' AND created_at >= DATE_TRUNC('quarter', CURRENT_DATE)",
        "difficulty": "easy",
        "category": "revenue",
        "tables": ["orders"]
    },
    {
        "question": "Топ-5 менеджеров по количеству закрытых сделок с разбивкой по месяцам",
        "sql": "SELECT e.name, DATE_TRUNC('month', d.closed_at) AS month, COUNT(*) FROM deals d JOIN employees e ON d.manager_id = e.id WHERE d.status = 'won' GROUP BY e.name, month ORDER BY month DESC, COUNT(*) DESC",
        "difficulty": "hard",
        "category": "sales",
        "tables": ["deals", "employees"]
    },
    # 50-100 записей
]</code></pre>

<h3>Как собирать golden dataset</h3>
<ol>
<li><strong>Логи аналитиков</strong> — реальные SQL-запросы + что хотел пользователь</li>
<li><strong>Support tickets</strong> — «помогите узнать X» → соответствующий SQL</li>
<li><strong>Ручное создание</strong> — 10-20 вопросов от каждого stakeholder</li>
<li><strong>Synthetic augmentation</strong> — LLM генерирует варианты из существующих</li>
</ol>

<h2>Execution Accuracy pipeline</h2>
<pre><code>import subprocess
import json

def evaluate_text2sql(golden_dataset, system_fn):
    results = []

    for item in golden_dataset:
        # Генерируем SQL через нашу систему
        generated_sql = system_fn(item["question"])

        # Выполняем оба запроса
        expected = execute(item["sql"])
        try:
            actual = execute(generated_sql)
            # Сравниваем результаты
            ex_match = compare_results(expected, actual)
        except Exception as e:
            actual = None
            ex_match = False

        results.append({
            "question": item["question"],
            "expected_sql": item["sql"],
            "generated_sql": generated_sql,
            "execution_match": ex_match,
            "difficulty": item["difficulty"],
            "category": item["category"],
            "error": None if actual else str(e)
        })

    # Aggregate metrics
    total = len(results)
    ex_acc = sum(1 for r in results if r["execution_match"]) / total

    # По сложности
    by_difficulty = {}
    for r in results:
        d = r["difficulty"]
        by_difficulty.setdefault(d, {"correct": 0, "total": 0})
        by_difficulty[d]["total"] += 1
        if r["execution_match"]:
            by_difficulty[d]["correct"] += 1

    return {
        "overall_ex": ex_acc,
        "by_difficulty": {
            k: v["correct"]/v["total"]
            for k, v in by_difficulty.items()
        },
        "failures": [r for r in results if not r["execution_match"]]
    }</code></pre>

<h2>Error Analysis: где мы ошибаемся</h2>
<p>После evaluation — классифицируйте ошибки:</p>

<pre><code>error_categories = {
    "wrong_table": "Выбрал неверную таблицу",
    "wrong_column": "Использовал неверную колонку",
    "missing_join": "Не добавил нужный JOIN",
    "wrong_filter": "Неправильное условие WHERE",
    "missing_aggregation": "Не использовал GROUP BY",
    "wrong_date_format": "Неверный формат даты",
    "hallucinated_column": "Использовал несуществующую колонку",
    "syntax_error": "SQL синтаксическая ошибка"
}

# Для каждой ошибки — определить причину и fix
# wrong_table → улучшить schema linking
# wrong_column → добавить описания колонок
# missing_join → добавить JOIN-паттерны в промпт</code></pre>

<div class="callout callout-tip"><strong>Правило 80/20:</strong> 80% ошибок обычно приходятся от 2-3 категорий. Найдите их через error analysis и сфокусируйте улучшения. Не пытайтесь чинить всё сразу.</div>`,
    flashcards: [
      { front: "Spider vs BIRD", back: "Spider: 10K вопросов, 200 БД, чистые данные, стандарт. BIRD: 12K вопросов, 95 БД, dirty data + domain knowledge, ближе к production. Spider — базовый бенчмарк, BIRD — стресс-тест." },
      { front: "Golden Dataset для Text-2-SQL", back: "50-100 пар (вопрос → эталонный SQL + результат). Источники: логи аналитиков, support tickets, ручное создание. Execution Accuracy = результат SQL совпадает. Основа для CI/CD и A/B тестов." },
      { front: "Error Analysis категории", back: "8 типов ошибок: wrong_table, wrong_column, missing_join, wrong_filter, missing_aggregation, wrong_date_format, hallucinated_column, syntax_error. 80% ошибок — 2-3 категории. Фокус на них." }
    ],
    quiz: [
      {
        question: "Evaluation показывает: Easy 90%, Medium 65%, Hard 30%. Где сфокусировать улучшения?",
        options: [
          "Easy — довести до 100%",
          "Hard — подтянуть до 50%",
          "Medium — самый большой прирост от 65% до 80%",
          "Равномерно по всем уровням"
        ],
        correct: 2,
        explanation: "Medium — оптимальная цель: 65% → 80% = +15pp. Easy уже хорош (diminishing returns), Hard может требовать фундаментальных изменений (multi-hop, CTE). Medium = JOINs + GROUP BY — улучшается better prompts и schema."
      },
      {
        question: "Самая частая ошибка — hallucinated_column (LLM использует несуществующие колонки). Как исправить?",
        options: [
          "Увеличить temperature",
          "Добавить полные описания колонок + sample data в промпт",
          "Использовать более мощную LLM",
          "Убрать few-shot примеры"
        ],
        correct: 1,
        explanation: "Hallucinated columns = модель не знает точного набора колонок. Полная схема + sample data + COMMENT ON описания — модель видит реальные колонки и не выдумывает."
      }
    ],
    sources: [
      { title: "Spider Benchmark", desc: "10K+ вопросов, 200 БД, лидерборд", url: "https://yale-lily.github.io/spider", icon: "🕷️" },
      { title: "BIRD Benchmark", desc: "Dirty data + domain knowledge benchmark", url: "https://bird-bench.github.io/", icon: "🐦" },
      { title: "Test-suite Accuracy Paper", desc: "Почему Execution Accuracy > Exact Match", url: "https://arxiv.org/abs/2405.01465", icon: "📄" }
    ]
  },
  {
    title: "Production: безопасность, кеширование, observability",
    goal: "Превратить прототип в production-ready систему с многоуровневой защитой и мониторингом.",
    objectives: [
      "Построить многоуровневую защиту от SQL injection",
      "Реализовать query caching для повторяющихся вопросов",
      "Настроить observability: tracing, latency, error rates",
      "Оптимизировать стоимость и latency"
    ],
    body: `<h2>Production Architecture</h2>
<pre><code>┌──────────────────────────────────────────────┐
│              API Gateway                      │
│  (auth, rate limiting, request validation)     │
├──────────────────────────────────────────────┤
│         Query Processing Pipeline             │
│                                               │
│  User Query                                   │
│      ↓                                        │
│  [Input Guard] → injection? toxic?            │
│      ↓                                        │
│  [Semantic Cache] → hit? return cached        │
│      ↓                                        │
│  [Schema Linker] → relevant tables            │
│      ↓                                        │
│  [Prompt Builder] → schema + few-shot + Q     │
│      ↓                                        │
│  [LLM] → SQL                                  │
│      ↓                                        │
│  [SQL Validator] → safe? correct dialect?     │
│      ↓                                        │
│  [Query Executor] → read-only, timeout 30s    │
│      ↓                                        │
│  [Result Formatter] → table + explanation     │
│      ↓                                        │
│  [Output Guard] → PII? sensitive data?        │
│      ↓                                        │
│  Response to user                             │
└──────────────────────────────────────────────┘</code></pre>

<h2>Многоуровневая защита</h2>

<h3>Уровень 1: Read-only DB user</h3>
<pre><code>-- PostgreSQL: максимальная изоляция
CREATE ROLE text2sql_readonly WITH LOGIN PASSWORD 'xxx';
GRANT CONNECT ON DATABASE analytics TO text2sql_readonly;
GRANT USAGE ON SCHEMA public TO text2sql_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO text2sql_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO text2sql_readonly;

-- Лимиты
ALTER ROLE text2sql_readonly SET statement_timeout = '30s';
ALTER ROLE text2sql_readonly SET idle_in_transaction_session_timeout = '10s';

-- Скрыть чувствительные колонки через views
CREATE VIEW safe_customers AS
    SELECT id, name, city, plan, created_at
    FROM customers;  -- без email, phone, ssn</code></pre>

<h3>Уровень 2: SQL AST валидация</h3>
<p>Вместо regex — парсинг SQL в AST и проверка структуры:</p>
<pre><code>import sqlglot

def validate_sql_ast(sql: str) -> tuple[bool, str]:
    try:
        parsed = sqlglot.parse_one(sql, dialect="postgres")
    except sqlglot.errors.ParseError as e:
        return False, f"SQL parse error: {e}"

    # Проверка: только SELECT
    if not isinstance(parsed, sqlglot.exp.Select):
        return False, "Only SELECT queries allowed"

    # Проверка: нет подзапросов с side effects
    for subquery in parsed.find_all(sqlglot.exp.Subquery):
        if not isinstance(subquery.this, sqlglot.exp.Select):
            return False, "Non-SELECT subquery detected"

    # Проверка: нет INTO (SELECT INTO = write)
    if parsed.find(sqlglot.exp.Into):
        return False, "SELECT INTO not allowed"

    # Проверка: есть LIMIT
    if not parsed.find(sqlglot.exp.Limit):
        sql += " LIMIT 1000"

    return True, sql</code></pre>

<div class="callout callout-tip"><strong>sqlglot</strong> — AST-парсер для SQL. Гораздо надёжнее regex: понимает структуру SQL, а не просто ищет ключевые слова. Поддерживает все диалекты.</div>

<h3>Уровень 3: Allowlist таблиц</h3>
<pre><code>ALLOWED_TABLES = {
    "customers", "orders", "products", "order_items",
    "employees", "departments", "categories"
}

def check_table_allowlist(sql: str) -> bool:
    parsed = sqlglot.parse_one(sql, dialect="postgres")
    tables = {t.name for t in parsed.find_all(sqlglot.exp.Table)}
    unknown = tables - ALLOWED_TABLES
    if unknown:
        raise SecurityError(f"Tables not allowed: {unknown}")
    return True</code></pre>

<h2>Query Caching</h2>
<pre><code>import hashlib
from functools import lru_cache

class QueryCache:
    def __init__(self):
        self.exact_cache = {}  # exact match
        # semantic cache через Redis + embeddings

    def get(self, question: str):
        key = hashlib.md5(question.lower().strip().encode()).hexdigest()
        return self.exact_cache.get(key)

    def set(self, question: str, sql: str, result: dict):
        key = hashlib.md5(question.lower().strip().encode()).hexdigest()
        self.exact_cache[key] = {"sql": sql, "result": result}

# Semantic cache: похожие вопросы → тот же SQL
# cos(question_emb, cached_emb) >= 0.95 → return cached SQL</code></pre>

<h2>Observability</h2>
<pre><code>import time
import logging

logger = logging.getLogger("text2sql")

def text2sql_traced(question: str) -> dict:
    trace = {"question": question, "start": time.time()}

    # Schema linking
    t0 = time.time()
    tables = schema_linker.find(question)
    trace["schema_linking_ms"] = (time.time() - t0) * 1000
    trace["tables_found"] = len(tables)

    # SQL generation
    t0 = time.time()
    sql = generate_sql(question, tables)
    trace["generation_ms"] = (time.time() - t0) * 1000
    trace["sql"] = sql
    trace["tokens_used"] = response.usage.total_tokens

    # Validation
    is_valid, validated_sql = validate_sql_ast(sql)
    trace["valid"] = is_valid

    # Execution
    t0 = time.time()
    try:
        result = execute(validated_sql)
        trace["execution_ms"] = (time.time() - t0) * 1000
        trace["rows_returned"] = len(result)
    except Exception as e:
        trace["execution_error"] = str(e)

    trace["total_ms"] = (time.time() - trace["start"]) * 1000
    logger.info(json.dumps(trace))
    return trace</code></pre>

<h3>Метрики для мониторинга</h3>
<ul>
<li><strong>Accuracy:</strong> % запросов, вернувших корректный результат (user feedback)</li>
<li><strong>Latency:</strong> p50, p95, p99 (total, и по этапам отдельно)</li>
<li><strong>Cost:</strong> средняя стоимость запроса ($/request)</li>
<li><strong>Error rate:</strong> % SQL-ошибок, timeout, validation failures</li>
<li><strong>Cache hit rate:</strong> % запросов из кэша</li>
</ul>

<h2>Cost Optimization</h2>
<ul>
<li><strong>Model routing:</strong> простые SELECT → gpt-4o-mini ($0.15/M), сложные JOINs → gpt-4o ($2.5/M)</li>
<li><strong>Schema compression:</strong> включать только релевантные таблицы → меньше input токенов</li>
<li><strong>Caching:</strong> повторяющиеся вопросы → 0 стоимость</li>
<li><strong>Prompt caching:</strong> Anthropic/OpenAI кэшируют system prompt → -50-90% на схему</li>
</ul>

<div class="callout callout-warn"><strong>Production checklist:</strong> read-only user ✓, AST validation ✓, table allowlist ✓, timeout 30s ✓, tracing ✓, alerting на error rate >5% ✓, rollback plan ✓</div>`,
    flashcards: [
      { front: "3 уровня SQL безопасности", back: "1) Read-only DB user (statement_timeout, SELECT only). 2) AST валидация через sqlglot (структурная проверка, не regex). 3) Table allowlist (только разрешённые таблицы). Defence in depth." },
      { front: "sqlglot для SQL валидации", back: "AST-парсер для SQL. Парсит SQL в дерево и проверяет: только SELECT? нет INTO? нет side-effect подзапросов? Надёжнее regex — понимает структуру. Поддерживает PostgreSQL, MySQL, BigQuery, ClickHouse." },
      { front: "Observability для Text-2-SQL", back: "Tracing каждого запроса: schema_linking_ms, generation_ms, execution_ms, tokens_used, rows_returned, errors. Метрики: accuracy (user feedback), latency p50/p95, cost/request, cache hit rate, error rate." }
    ],
    quiz: [
      {
        question: "Regex-валидация пропустила: SELECT * FROM users INTO OUTFILE '/tmp/dump'. Почему AST-валидация через sqlglot это поймает?",
        options: [
          "Regex не ищет слово INTO",
          "sqlglot парсит SQL в AST и находит узел exp.Into — запрещённая конструкция",
          "sqlglot проверяет права доступа пользователя",
          "Regex работает только для PostgreSQL"
        ],
        correct: 1,
        explanation: "sqlglot парсит SQL в Abstract Syntax Tree и находит узел exp.Into, независимо от формата записи. Regex может пропустить обфусцированный SQL (пробелы, регистр, комментарии)."
      },
      {
        question: "Какой timeout рекомендуется для выполнения SQL-запросов от LLM в продакшене?",
        options: [
          "5 секунд — слишком жёстко для аналитических запросов",
          "30 секунд — баланс между UX и защитой от тяжёлых запросов",
          "5 минут — хватит для любого запроса",
          "Без timeout — пусть выполняется"
        ],
        correct: 1,
        explanation: "30 секунд — стандарт: большинство аналитических SELECT выполняются за 1-10 сек. 30 сек защищает от cartesian products и full table scans. 5 сек — слишком жёстко для JOINs по большим таблицам."
      }
    ],
    sources: [
      { title: "sqlglot", desc: "Python SQL parser и transpiler", url: "https://github.com/tobymao/sqlglot", icon: "🔧" },
      { title: "Vanna AI Security", desc: "Production security best practices для Text-2-SQL", url: "https://vanna.ai/docs/", icon: "🛡️" },
      { title: "PostgreSQL Security", desc: "Row-level security и read-only roles", url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html", icon: "🐘" }
    ]
  },
  {
    title: "Advanced: multi-turn, self-correction, complex queries",
    goal: "Освоить продвинутые паттерны: диалоговый Text-2-SQL, автоматическое исправление ошибок, сложные запросы.",
    objectives: [
      "Реализовать multi-turn Text-2-SQL с контекстом диалога",
      "Применить self-correction: SQL error → retry с фидбеком",
      "Обрабатывать ambiguous вопросы через clarification",
      "Генерировать CTE и window functions через декомпозицию"
    ],
    body: `<h2>Multi-turn: диалоговый Text-2-SQL</h2>
<p>Пользователи редко задают идеальный вопрос с первого раза. Они уточняют, меняют фильтры, drill-down:</p>

<pre><code>User: Покажи выручку по регионам
AI: [SQL + таблица: Север 5M, Юг 3M, Запад 4M, Восток 2M]

User: А теперь только за Q1
AI: [Добавляет WHERE created_at >= '2026-01-01' AND < '2026-04-01']

User: И разбей по менеджерам
AI: [Добавляет JOIN employees + GROUP BY manager]

User: Топ-3 из каждого региона
AI: [Добавляет ROW_NUMBER() OVER (PARTITION BY region)]</code></pre>

<h3>Контекст диалога</h3>
<pre><code>class ConversationContext:
    def __init__(self):
        self.history = []  # (question, sql, result)
        self.current_tables = set()
        self.current_filters = []

    def build_prompt(self, new_question: str) -> str:
        context_parts = []

        if self.history:
            context_parts.append("Предыдущие запросы:")
            for q, sql, _ in self.history[-3:]:  # последние 3
                context_parts.append(f"Q: {q}\\nSQL: {sql}")

        if self.current_filters:
            context_parts.append(
                f"Текущие фильтры: {self.current_filters}"
            )

        context_parts.append(f"Новый вопрос: {new_question}")
        context_parts.append(
            "Модифицируй предыдущий SQL или создай новый."
        )

        return "\\n\\n".join(context_parts)</code></pre>

<h2>Self-Correction: retry при ошибках</h2>
<p>LLM генерирует SQL → выполнение → ошибка → LLM исправляет:</p>

<pre><code>def text2sql_with_retry(question, max_retries=2):
    for attempt in range(max_retries + 1):
        sql = generate_sql(question)

        try:
            result = execute(sql)
            return {"sql": sql, "result": result}

        except Exception as e:
            if attempt < max_retries:
                # Фидбек: SQL + ошибка → исправить
                error_prompt = f"""Предыдущий SQL вызвал ошибку:
SQL: {sql}
Ошибка: {str(e)}

Исправь SQL-запрос. Вопрос: {question}
Подсказка: проверь названия таблиц и колонок."""

                sql = generate_sql(error_prompt)
            else:
                return {
                    "error": "Не удалось выполнить запрос",
                    "last_sql": sql,
                    "db_error": str(e)
                }</code></pre>

<div class="callout callout-tip"><strong>Self-correction повышает EX на 5-15%.</strong> Основные ошибки, которые LLM исправляет: неправильные имена колонок (по error message), отсутствующие JOINs, неверные типы данных.</div>

<h2>Clarification: неоднозначные вопросы</h2>
<p>Многие вопросы неоднозначны. Вместо угадывания — спросите:</p>

<pre><code>CLARIFICATION_PROMPT = """Проанализируй вопрос пользователя
и определи, есть ли неоднозначности.

Вопрос: "Покажи самых активных клиентов"

Неоднозначности:
1. "Активных" = по количеству заказов? по сумме? по частоте?
2. Период: за всё время? за последний месяц? за год?
3. Сколько "самых"? Топ-5? Топ-10? Все?

Если есть неоднозначности — сформулируй уточняющие вопросы.
Если вопрос однозначный — ответь: CLARIFICATION_NOT_NEEDED"""

def maybe_clarify(question: str) -> str | None:
    response = llm.generate(CLARIFICATION_PROMPT.format(q=question))
    if "CLARIFICATION_NOT_NEEDED" in response:
        return None  # можно генерировать SQL
    return response  # показать пользователю</code></pre>

<h2>Сложные запросы: декомпозиция через CTE</h2>
<p>Для сложных запросов — разбейте задачу на подзадачи через Common Table Expressions:</p>

<pre><code>Вопрос: "Для каждого региона найди менеджера с наибольшей
выручкой и сравни его результат со средним по региону"

Декомпозиция:
1. Посчитать выручку по менеджерам с разбивкой по регионам
2. Найти топ-1 менеджера в каждом регионе
3. Посчитать среднюю выручку по региону
4. Сравнить топ-1 со средним

CTE-ответ:
\`\`\`sql
WITH manager_revenue AS (
    SELECT e.name, e.region,
           SUM(o.total) AS revenue
    FROM employees e
    JOIN orders o ON e.id = o.manager_id
    WHERE o.status = 'paid'
    GROUP BY e.name, e.region
),
ranked AS (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY region ORDER BY revenue DESC
    ) AS rank
    FROM manager_revenue
),
region_avg AS (
    SELECT region, AVG(revenue) AS avg_revenue
    FROM manager_revenue
    GROUP BY region
)
SELECT r.name, r.region, r.revenue,
       ra.avg_revenue,
       r.revenue - ra.avg_revenue AS above_avg
FROM ranked r
JOIN region_avg ra ON r.region = ra.region
WHERE r.rank = 1;
\`\`\`</code></pre>

<h3>Chain-of-Thought для декомпозиции</h3>
<pre><code>DECOMPOSE_PROMPT = """Разбей сложный SQL-запрос на шаги:

Вопрос: {question}

Шаг 1: Какие данные нужны? (таблицы, колонки)
Шаг 2: Какие фильтрации?
Шаг 3: Какие агрегации?
Шаг 4: Какие window functions / ранжирование?
Шаг 5: Как объединить в один запрос?

Для каждого шага напиши промежуточный SQL (CTE).
В конце — финальный SQL со всеми CTE."""</code></pre>

<h2>Production Checklist (финальная)</h2>

<h3>Безопасность</h3>
<ul>
<li>☐ Read-only DB user с statement_timeout</li>
<li>☐ AST валидация через sqlglot</li>
<li>☐ Table/column allowlist</li>
<li>☐ Input/output guard (injection, PII)</li>
<li>☐ Логирование всех запросов</li>
</ul>

<h3>Качество</h3>
<ul>
<li>☐ Golden dataset: 50+ вопросов с эталонными SQL</li>
<li>☐ Evaluation pipeline в CI/CD</li>
<li>☐ Self-correction при SQL ошибках</li>
<li>☐ Clarification для неоднозначных вопросов</li>
<li>☐ Multi-turn контекст</li>
</ul>

<h3>Производительность</h3>
<ul>
<li>☐ Semantic cache для повторяющихся вопросов</li>
<li>☐ Model routing (simple → mini, complex → 4o)</li>
<li>☐ Schema compression (только релевантные таблицы)</li>
<li>☐ Tracing: latency по этапам</li>
<li>☐ Alerting: error rate > 5%</li>
</ul>

<div class="callout callout-danger"><strong>Главный принцип:</strong> Text-2-SQL — это не замена аналитикам, а инструмент для self-service. Для критических бизнес-решений — всегда показывайте SQL и давайте проверить результат.</div>`,
    flashcards: [
      { front: "Multi-turn Text-2-SQL", back: "Контекст диалога: последние 3 пары (вопрос, SQL). Новый вопрос = модификация предыдущего SQL (добавить фильтр, GROUP BY, JOIN). Хранить текущие таблицы и фильтры в ConversationContext." },
      { front: "Self-Correction", back: "SQL error → retry с фидбеком: SQL + error message → LLM исправляет. Повышает Execution Accuracy на 5-15%. Типичные исправления: имена колонок (по error), JOINs, типы данных. Максимум 2 retry." },
      { front: "CTE декомпозиция для сложных запросов", back: "Разбить сложную задачу на шаги → каждый шаг = CTE. Chain-of-Thought: данные → фильтры → агрегации → window functions → финальный SQL. Для multi-hop reasoning, ranking, сравнений." }
    ],
    quiz: [
      {
        question: "Пользователь: «Покажи топ-5». Топ-5 чего? Какой подход лучше?",
        options: [
          "Угадать наиболее вероятную интерпретацию и сгенерировать SQL",
          "Попросить уточнение: «Топ-5 по какому показателю и за какой период?»",
          "Вернуть ошибку: неоднозначный запрос",
          "Сгенерировать SELECT * LIMIT 5"
        ],
        correct: 1,
        explanation: "Неоднозначные вопросы требуют clarification. Угадывание приводит к неправильным результатам без предупреждения. Clarification: «Топ-5 по какому показателю (выручка, количество, средний чек) и за какой период?»"
      },
      {
        question: "Self-correction: SQL вызвал 'column \"revenue\" does not exist'. Что делать?",
        options: [
          "Отказаться и попросить пользователя переформулировать",
          "Retry: передать SQL + error в LLM для исправления",
          "Игнорировать ошибку и вернуть пустой результат",
          "Заменить revenue на SUM(total) автоматически"
        ],
        correct: 1,
        explanation: "Error message содержит подсказку: column не существует. LLM с этим контекстом исправит: revenue → правильное имя колонки (напр. total или amount). Self-correction повышает accuracy на 5-15%."
      }
    ],
    sources: [
      { title: "MAC-SQL: Multi-Agent Collaboration", desc: "Selector + Decomposer + Refiner agents", url: "https://arxiv.org/abs/2312.11242", icon: "📄" },
      { title: "CHESS: Contextual Heuristic Search", desc: "Self-correction pipeline для Text-2-SQL", url: "https://arxiv.org/abs/2405.16755", icon: "📄" },
      { title: "DPO for Text-2-SQL", desc: "Fine-tuning на corrections для self-improvement", url: "https://arxiv.org/abs/2404.08880", icon: "📄" },
      { title: "sqlglot Documentation", desc: "SQL parsing, transpilation, optimization", url: "https://sqlglot.com/", icon: "🔧" }
    ]
  }
];

// === State ===
let currentLesson = -1;
let completedLessons = new Set(JSON.parse(localStorage.getItem("text2sql-completed") || "[]"));

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function init() {
    renderSidebar();
    updateProgress();
    $("#btnStart").addEventListener("click", () => openLesson(0));
    $("#btnPrev").addEventListener("click", () => openLesson(currentLesson - 1));
    $("#btnNext").addEventListener("click", () => openLesson(currentLesson + 1));
    $("#btnComplete").addEventListener("click", toggleComplete);
    $("#btnRestart").addEventListener("click", restart);
    $("#mobileMenu").addEventListener("click", () => {
        $("#sidebar").classList.toggle("open");
    });
}

function renderSidebar() {
    const nav = $("#lessonNav");
    nav.innerHTML = COURSE.map((lesson, i) => {
        const completed = completedLessons.has(i);
        return '<button class="lesson-btn ' + (completed ? "completed" : "") + '" data-idx="' + i + '">' +
            '<span class="lesson-num">' + (completed ? "\u2713" : (i + 1)) + '</span>' +
            '<span class="lesson-btn-text">' + lesson.title + '</span>' +
        '</button>';
    }).join("");

    nav.querySelectorAll(".lesson-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            openLesson(parseInt(btn.dataset.idx));
            $("#sidebar").classList.remove("open");
        });
    });
}

function openLesson(idx) {
    if (idx < 0 || idx >= COURSE.length) return;
    currentLesson = idx;
    const lesson = COURSE[idx];

    $("#welcomeScreen").classList.add("hidden");
    $("#finalReview").classList.add("hidden");
    $("#lessonView").classList.remove("hidden");

    $("#lessonBadge").textContent = "\u0423\u0440\u043E\u043A " + (idx + 1) + " \u0438\u0437 " + COURSE.length;
    $("#lessonTitle").textContent = lesson.title;
    $("#lessonGoal").textContent = lesson.goal;

    $("#objectivesList").innerHTML = lesson.objectives.map(o => "<li>" + o + "</li>").join("");
    $("#lessonBody").innerHTML = lesson.body;

    renderFlashcards(lesson.flashcards);
    renderQuiz(lesson.quiz);
    renderSources(lesson.sources);

    $("#btnPrev").style.visibility = idx === 0 ? "hidden" : "visible";
    $("#btnNext").textContent = idx === COURSE.length - 1 ? "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u043A\u0443\u0440\u0441" : "\u0414\u0430\u043B\u0435\u0435 \u2192";
    $("#btnNext").onclick = idx === COURSE.length - 1
        ? () => showFinalReview()
        : () => openLesson(idx + 1);

    const isCompleted = completedLessons.has(idx);
    $("#btnComplete").textContent = isCompleted ? "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u2713" : "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0443\u0440\u043E\u043A \u2713";
    $("#btnComplete").classList.toggle("done", isCompleted);

    $$(".lesson-btn").forEach((btn, i) => btn.classList.toggle("active", i === idx));
    window.scrollTo(0, 0);
}

function renderFlashcards(cards) {
    const grid = $("#flashcardsGrid");
    grid.innerHTML = cards.map((card, i) =>
        '<div class="flashcard" data-idx="' + i + '">' +
            '<div class="flashcard-inner">' +
                '<div class="flashcard-front">' + card.front + '</div>' +
                '<div class="flashcard-back">' + card.back + '</div>' +
            '</div>' +
        '</div>'
    ).join("");

    grid.querySelectorAll(".flashcard").forEach(fc => {
        fc.addEventListener("click", () => fc.classList.toggle("flipped"));
    });
}

function renderQuiz(questions) {
    const container = $("#quizContainer");
    container.innerHTML = questions.map((q, qi) =>
        '<div class="quiz-question" data-qi="' + qi + '">' +
            '<p>' + q.question + '</p>' +
            '<div class="quiz-options">' +
                q.options.map((opt, oi) =>
                    '<div class="quiz-option" data-oi="' + oi + '">' + opt + '</div>'
                ).join('') +
            '</div>' +
            '<div class="quiz-feedback" data-qi="' + qi + '"></div>' +
        '</div>'
    ).join("");

    container.querySelectorAll(".quiz-question").forEach(qEl => {
        const qi = parseInt(qEl.dataset.qi);
        const q = questions[qi];
        qEl.querySelectorAll(".quiz-option").forEach(opt => {
            opt.addEventListener("click", () => {
                if (opt.classList.contains("disabled")) return;
                const oi = parseInt(opt.dataset.oi);
                const isCorrect = oi === q.correct;
                qEl.querySelectorAll(".quiz-option").forEach(o => {
                    o.classList.add("disabled");
                    if (parseInt(o.dataset.oi) === q.correct) o.classList.add("correct");
                });
                if (!isCorrect) opt.classList.add("wrong");
                const fb = qEl.querySelector(".quiz-feedback");
                fb.textContent = q.explanation;
                fb.className = "quiz-feedback show " + (isCorrect ? "correct" : "wrong");
            });
        });
    });
}

function renderSources(sources) {
    const grid = $("#sourcesGrid");
    grid.innerHTML = sources.map(s =>
        '<a class="source-card" href="' + s.url + '" target="_blank" rel="noopener">' +
            '<span class="source-icon">' + s.icon + '</span>' +
            '<div class="source-info">' +
                '<div class="source-title">' + s.title + '</div>' +
                '<div class="source-desc">' + s.desc + '</div>' +
            '</div>' +
        '</a>'
    ).join("");
}

function toggleComplete() {
    if (completedLessons.has(currentLesson)) completedLessons.delete(currentLesson);
    else completedLessons.add(currentLesson);
    localStorage.setItem("text2sql-completed", JSON.stringify([...completedLessons]));
    updateProgress();
    renderSidebar();
    const isCompleted = completedLessons.has(currentLesson);
    $("#btnComplete").textContent = isCompleted ? "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u2713" : "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0443\u0440\u043E\u043A \u2713";
    $("#btnComplete").classList.toggle("done", isCompleted);
    $$(".lesson-btn").forEach((btn, i) => btn.classList.toggle("active", i === currentLesson));
}

function updateProgress() {
    const pct = (completedLessons.size / COURSE.length) * 100;
    $("#progressFill").style.width = pct + "%";
    $("#progressText").textContent = completedLessons.size + " / " + COURSE.length + " \u0443\u0440\u043E\u043A\u043E\u0432";
}

function showFinalReview() {
    $("#lessonView").classList.add("hidden");
    $("#finalReview").classList.remove("hidden");
    $("#reviewContent").innerHTML = '<div class="review-grid">' +
        COURSE.map((lesson, i) =>
            '<div class="review-item">' +
                '<span class="review-check">' + (completedLessons.has(i) ? "\u2705" : "\u2B1C") + '</span>' +
                '<span class="review-text">' + (i + 1) + ". " + lesson.title + '</span>' +
            '</div>'
        ).join('') + '</div>';
    window.scrollTo(0, 0);
}

function restart() {
    completedLessons.clear();
    localStorage.removeItem("text2sql-completed");
    currentLesson = -1;
    updateProgress();
    renderSidebar();
    $("#finalReview").classList.add("hidden");
    $("#lessonView").classList.add("hidden");
    $("#welcomeScreen").classList.remove("hidden");
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", init);
