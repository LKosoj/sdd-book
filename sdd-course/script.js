// ============================================================
// SDD на практике — Course Data & Logic
// ============================================================

const courseData = [
  {
    id: 1,
    title: "Что такое SDD и почему сейчас",
    goal: "Понять, почему индустрия перешла от vibe coding к Specification-Driven Development и какие проблемы это решает.",
    objectives: [
      "Объяснить, что такое SDD и чем он отличается от классического Waterfall",
      "Понимать парадокс продуктивности AI-разработки",
      "Знать 5 уровней зрелости AI-assisted разработки"
    ],
    content: `
      <h4>Смерть Vibe Coding</h4>
      <p>К 2026 году стало очевидно: <strong>vibe coding</strong> (интуитивная генерация кода на основе коротких промптов) не масштабируется за пределы прототипов. Исследование <strong>METR (Model Evaluation & Threat Research)</strong> показало — разработчики, использующие неструктурированные промпты, в среднем работали <strong>на 19% медленнее</strong> из-за «циклов отладки», которые поглощали время, сэкономленное на генерации.</p>

      <div class="key-concept">
        <strong>SDD (Specification-Driven Development)</strong> — методология, в которой спецификация выступает как <em>первичный артефакт</em> и источник истины. Код — это «build output», как .c файл компилируется в бинарник. Спецификация = то, что компилируется в код.
      </div>

      <h4>Это НЕ Waterfall</h4>
      <p>SDD — не возврат к тяжёлой каскадной модели. Это новая дисциплина <strong>контекстной инженерии</strong>, где спецификации пишутся на языках, оптимизированных для восприятия LLM, и интегрируются в CI/CD. Спецификации — живые документы, которые эволюционируют вместе с кодом.</p>

      <h4>Парадокс продуктивности</h4>
      <p>Академическая работа <em>«The Productivity-Reliability Paradox»</em> (arXiv 2025) применяет <strong>Теорию трансакционных издержек (TCE)</strong> к взаимодействию человека и AI:</p>
      <ul>
        <li><strong>Специфичность активов:</strong> сгенерированный код привязан к конкретной кодовой базе. Стоимость переписывания = колоссальная</li>
        <li><strong>Поведенческая неопределённость:</strong> LLM недетерминированы — одинаковые промпты дают разные результаты, модели галлюцинируют API и нарушают конвенции</li>
        <li><strong>Вывод:</strong> чем сложнее кодовая база, тем строже должны быть спецификации</li>
      </ul>

      <h4>5 уровней зрелости</h4>
      <div class="metric-card">
        <h5>Модель зрелости AI-разработки</h5>
        <ul>
          <li><strong>Level 0:</strong> Code-First — человек архитектор, AI = автодополнение</li>
          <li><strong>Level 1:</strong> Vibe Coding — человек старший разработчик, AI = стажёр</li>
          <li><strong>Level 2:</strong> AI-Assisted — человек ревьюер, AI = junior</li>
          <li><strong>Level 3:</strong> Agentic — человек менеджер, AI генерирует PR с тестами</li>
          <li><strong>Level 4: SDD</strong> — человек архитектор/PM, AI = исполнитель контрактов</li>
          <li><strong>Level 5:</strong> Autonomous — человек governance, AI = фабрика</li>
        </ul>
      </div>

      <h4>Проблемы, которые решает SDD</h4>
      <ul>
        <li><strong>Двусмысленность (Ambiguity):</strong> «напиши сложение двух чисел» — float или int?</li>
        <li><strong>Несогласованность (Inconsistency):</strong> AI генерирует код в разных стилях</li>
        <li><strong>Баги:</strong> тонкие логические ошибки, которые AI не видит</li>
        <li><strong>Безопасность:</strong> SQL Injection, XSS в сгенерированном коде</li>
        <li><strong>Потеря контекста:</strong> AI не видит архитектурных ограничений</li>
      </ul>
    `,
    flashcards: [
      { front: "SDD — определение", back: "Specification-Driven Development: спецификация = первичный артефакт и источник истины. Код — это build output, генерируемый из спецификации. Не Waterfall — живые документы, интегрированные в CI/CD." },
      { front: "Парадокс продуктивности (METR)", back: "Разработчики с неструктурированными промптами на 19% МЕДЛЕННЕЕ: циклы отладки съедают время, сэкономленное на генерации. Решение: строгие спецификации перед кодом." },
      { front: "5 уровней зрелости", back: "0: Code-First. 1: Vibe Coding. 2: AI-Assisted. 3: Agentic. 4: SDD (человек=архитектор, AI=исполнитель контрактов). 5: Autonomous pipelines." }
    ],
    quiz: [
      {
        question: "Почему разработчики с AI-инструментами работали на 19% медленнее (исследование METR)?",
        options: [
          "AI-модели слишком медленные",
          "Неструктурированные промпты создавали циклы отладки, которые поглощали время, сэкономленное на генерации",
          "Разработчики не умели пользоваться AI",
          "AI генерировал слишком много кода"
        ],
        correct: 1,
        explanation: "METR: неструктурированные промпты → AI генерирует код с ошибками → разработчик тратит время на отладку → общее время растёт. SDD решает это через спецификации."
      },
      {
        question: "SDD — это:",
        options: [
          "Возврат к Waterfall-методологии",
          "Новая дисциплина контекстной инженерии, где спецификации оптимизированы для LLM и интегрированы в CI/CD",
          "Только для больших enterprise-проектов",
          "Замена разработчиков на AI"
        ],
        correct: 1,
        explanation: "SDD — не Waterfall. Спецификации — живые документы, эволюционирующие с кодом. Это контекстная инженерия: спецификации пишутся для восприятия LLM."
      }
    ],
    sources: [
      { title: "From Vibe Coding to Spec-Driven Development (Towards Data Science)", url: "https://towardsdatascience.com/from-vibe-coding-to-spec-driven-development/", icon: "📄" },
      { title: "SDD: The Definitive 2026 Guide (BCMS)", url: "https://thebcms.com/blog/spec-driven-development", icon: "📄" },
      { title: "The Productivity-Reliability Paradox (arXiv)", url: "https://arxiv.org/html/2605.01160v1", icon: "📄" }
    ]
  },
  {
    id: 2,
    title: "SDD-цикл: от Конституции до Реализации",
    goal: "Освоить 6-фазный цикл SDD и понять роль каждого этапа.",
    objectives: [
      "Знать все 6 фаз SDD-цикла и их назначение",
      "Создавать constitution.md для проекта",
      "Понимать, где в цикле нужны human checkpoints"
    ],
    content: `
      <h4>6 фаз SDD-цикла</h4>
      <p>Спецификация → код — не один прыжок, а последовательность этапов с human checkpoints:</p>

      <div class="key-concept">
        <strong>SDD Pipeline:</strong>
        <br>Phase 0: Constitution → Phase 1: Specify → Phase 2: Clarify → Phase 3: Plan → Phase 4: Tasks → Phase 5-6: Implement & Iterate
        <br>Каждая фаза имеет checkpoint для верификации.
      </div>

      <h4>Phase 0: Constitution (constitution.md)</h4>
      <p>Незыблемые принципы проекта — контекст, который AI получает при каждом вызове:</p>
      <pre><code># constitution.md
## Tech Stack
- Backend: Python 3.12, FastAPI, SQLAlchemy
- Frontend: React 18, TypeScript, Tailwind
- Database: PostgreSQL 16, pgvector
- Deploy: Docker, Kubernetes, AWS EKS

## Coding Standards
- Strict TypeScript (no 'any')
- All public APIs have tests
- No secrets in code (use environment variables)
- RESTful API with OpenAPI 3.1 schema

## Security Rules
- Rate limiting on all public endpoints
- Input validation via Pydantic models
- OWASP Top 10 compliance</code></pre>

      <h4>Phase 1: Specify (specification.md)</h4>
      <p>Что и зачем — <strong>без технических деталей</strong>. Фокус на намерении:</p>
      <pre><code># Feature: Payment Processing

## User Story
As a customer, I want to pay with a credit card
so that I can complete my purchase.

## Acceptance Criteria
- Valid card → 200 + payment confirmed
- Invalid card → 402 + error message
- Rate limit: 10 attempts/min → 429

## Constraints
- PCI DSS Level 1 compliance
- Payment processing < 3 seconds
- Support Visa, Mastercard, Mir</code></pre>

      <h4>Phase 2: Clarify (Remove Ambiguity)</h4>
      <p>Структурированный проход по спецификации для выявления:</p>
      <ul>
        <li>Edge cases — что при пустом поле? при null?</li>
        <li>Empty states — что показывать, когда данных нет?</li>
        <li>Error handling — какие ошибки возможны?</li>
        <li>Boundary values — максимальные/минимальные значения?</li>
      </ul>
      <p><strong>Checkpoint:</strong> все ответы записываются В спецификацию до продвижения.</p>

      <h4>Phase 3: Plan (plan.md)</h4>
      <p>Технический план: архитектура, модели данных, API-контракты, зависимости:</p>
      <pre><code># Plan: Payment Processing

## Architecture
- PaymentService → StripeAdapter → Stripe API
- Webhook handler for async events

## Data Model
- Payment: id, order_id, amount, currency,
  status, created_at
- PaymentEvent: id, payment_id, type, payload

## API Contract
POST /payments → CreatePaymentRequest
GET  /payments/{id} → PaymentResponse
POST /webhooks/stripe → void</code></pre>

      <h4>Phase 4: Tasks (tasks.md)</h4>
      <p>Атомарные задачи для AI-агента. Каждая — 1-4 часа, scope для одного PR:</p>
      <pre><code># Tasks

## Task 1: Payment Model
- Create SQLAlchemy model
- Create Alembic migration
- Write unit tests
- Acceptance: model passes all tests

## Task 2: Stripe Adapter
- Implement StripeAdapter class
- Handle create/get/cancel
- Write integration tests (mocked)
- Acceptance: all tests pass</code></pre>

      <h4>Phase 5-6: Implement & Iterate</h4>
      <p>AI генерирует код из spec/plan срезов. Человек валидирует против спецификации. После merge — любое изменение начинается с ревизии спецификации.</p>
    `,
    flashcards: [
      { front: "6 фаз SDD-цикла", back: "0: Constitution (guardrails). 1: Specify (what & why). 2: Clarify (remove ambiguity). 3: Plan (technical blueprint). 4: Tasks (atomic decomposition). 5-6: Implement & Iterate." },
      { front: "Constitution.md — зачем?", back: "Незыблемые принципы проекта: tech stack, coding standards, security rules. AI получает это при каждом вызове. Immutable context — нельзя менять без пересмотра всей архитектуры." },
      { front: "Phase 2: Clarify — зачем?", back: "Структурированный проход по spec для выявления edge cases, empty states, error handling, boundary values. Все ответы → В спецификацию. Иначе AI будет угадывать." }
    ],
    quiz: [
      {
        question: "В какой фазе SDD описывается ЧТО и ЗАЧЕМ без технических деталей?",
        options: ["Phase 0: Constitution", "Phase 1: Specify", "Phase 3: Plan", "Phase 4: Tasks"],
        correct: 1,
        explanation: "Specify = что и зачем (user stories, acceptance criteria, constraints). Технические детали — в Plan (Phase 3). Разделение намерения и реализации."
      },
      {
        question: "Почему Phase 2 (Clarify) критична?",
        options: [
          "Это формальность",
          "Выявляет edge cases и empty states ДО генерации кода. Иначе AI будет угадывать и создавать баги",
          "Ускоряет генерацию",
          "Это требуется по закону"
        ],
        correct: 1,
        explanation: "Clarify: проход по spec для выявления двусмысленностей. Все ответы → в spec. Без этого AI генерирует код, который «работает», но не покрывает edge cases."
      }
    ],
    sources: [
      { title: "Spec-Driven Development (specdriven.ai)", url: "https://specdriven.ai/", icon: "🔗" },
      { title: "SDD: The Definitive 2026 Guide (BCMS)", url: "https://thebcms.com/blog/spec-driven-development", icon: "📄" }
    ]
  },
  {
    id: 3,
    title: "AI-Readable спецификации: EARS и Behavioral Contracts",
    goal: "Научиться писать спецификации, которые LLM может однозначно интерпретировать и верифицировать.",
    objectives: [
      "Применять EARS-нотацию для написания требований",
      "Писать behavioral contracts с pre/postconditions",
      "Создавать machine-checkable specs"
    ],
    content: `
      <h4>EARS — Easy Approach to Requirements Syntax</h4>
      <p>Стандартная нотация для AI-readable спецификаций. Каждый паттерн сводится к одному тестируемому утверждению:</p>

      <div class="key-concept">
        <strong>5 паттернов EARS:</strong>
        <br>• <strong>Ubiquitous:</strong> THE [system] SHALL [behavior]
        <br>• <strong>Event-driven:</strong> WHEN [event] THE [system] SHALL [behavior]
        <br>• <strong>State-driven:</strong> WHILE [state] THE [system] SHALL [behavior]
        <br>• <strong>Unwanted behavior:</strong> IF [condition] THEN THE [system] SHALL [response]
        <br>• <strong>Optional:</strong> WHERE [feature] THE [system] SHALL [behavior]
      </div>

      <h4>Примеры EARS</h4>
      <pre><code># Ubiquitous (всегда)
THE system SHALL encrypt all data at rest
using AES-256.

# Event-driven (при событии)
WHEN a user submits a payment THE system
SHALL validate the card via Stripe within
3 seconds.

# State-driven (в состоянии)
WHILE a sync is in progress THE system
SHALL display a non-dismissable progress
indicator.

# Unwanted behavior (при ошибке)
IF credential validation fails 3 times
in 60 seconds THEN THE system SHALL lock
the account for 15 minutes.

# Optional (опционально)
WHERE multi-factor authentication is
enabled THE system SHALL require a TOTP
code after password validation.</code></pre>

      <h4>Behavioral Contracts</h4>
      <p>Для каждого компонента — контракт с предусловиями, постусловиями и инвариантами:</p>
      <pre><code>## Component: PaymentService.create()

### Preconditions (что должно быть истинно ДО):
- order.status = "pending"
- amount > 0 AND amount <= 1000000
- currency IN ["RUB", "USD", "EUR"]
- customer.email IS NOT NULL

### Postconditions (что будет истинно ПОСЛЕ):
- payment.status IN ["confirmed", "failed"]
- IF confirmed: audit_log has entry
- IF failed: error_message IS NOT NULL

### Invariants (всегда истинно):
- payment.amount == order.total
- payment.currency == order.currency
- no secrets logged</code></pre>

      <h4>Machine-Checkable Specs</h4>
      <p>Спецификация → проверяемый контракт в CI:</p>
      <pre><code># openapi.yaml — spec как проверяемый контракт
openapi: 3.1.0
paths:
  /payments/validate:
    post:
      responses:
        '202':
          description: Accepted for async validation
        '400':
          description: Invalid payment data

# CI: проверка контракта
npx @apidevtools/swagger-cli validate openapi.yaml
# → fail, если required fields отсутствуют</code></pre>

      <h4>Связь с BDD (GIVEN/WHEN/THEN)</h4>
      <p>SDD и BDD дополняют друг друга:</p>
      <pre><code># BDD-сценарий (поведение)
GIVEN a customer with a valid cart
WHEN they submit payment with an expired card
THEN the system returns 402 "Card expired"
AND the cart remains intact

# SDD-спецификация (контракт)
IF card.expiry < current_date
THEN THE system SHALL return HTTP 402
AND cart.status SHALL remain "active"</code></pre>

      <h4>Почему AI-readability важна</h4>
      <ul>
        <li>Каждый паттерн EARS = <strong>один тестируемый claim</strong></li>
        <li>Нет двусмысленности в scope, trigger, response</li>
        <li>AI-агент может: прочитать EARS → сгенерировать код → написать тест</li>
        <li>Constitution = список ubiquitous EARS-утверждений о проекте</li>
      </ul>
    `,
    flashcards: [
      { front: "5 паттернов EARS", back: "Ubiquitous (THE system SHALL), Event-driven (WHEN event), State-driven (WHILE state), Unwanted behavior (IF condition THEN), Optional (WHERE feature). Каждый = 1 тестируемый claim." },
      { front: "Behavioral Contract", back: "Preconditions (истинно ДО) + Postconditions (истинно ПОСЛЕ) + Invariants (всегда истинно). Формальный контракт компонента, проверяемый тестами." },
      { front: "Machine-Checkable Spec", back: "Спецификация → проверяемый контракт в CI. Пример: OpenAPI schema в openapi.yaml + swagger-cli validate. Spec становится исполняемым тестом." }
    ],
    quiz: [
      {
        question: "Какой EARS-паттерн подходит для: «При 3 неудачных попытках входа за 60 секунд система блокирует аккаунт»?",
        options: [
          "Ubiquitous (THE system SHALL)",
          "Unwanted behavior (IF condition THEN response)",
          "Event-driven (WHEN event)",
          "Optional (WHERE feature)"
        ],
        correct: 1,
        explanation: "Unwanted behavior: IF [3 failures in 60s] THEN [lock account for 15 min]. Этот паттерн описывает реакцию на нежелательное поведение."
      },
      {
        question: "Behavioral Contract включает:",
        options: [
          "Только описание фичи",
          "Preconditions + Postconditions + Invariants — формальный контракт, проверяемый тестами",
          "Только acceptance criteria",
          "User stories и задачи"
        ],
        correct: 1,
        explanation: "Behavioral Contract: что истинно ДО вызова (pre), что истинно ПОСЛЕ (post), что ВСЕГДА истинно (invariants). Формальный, machine-checkable контракт."
      }
    ],
    sources: [
      { title: "SDD: The Definitive 2026 Guide — EARS notation (BCMS)", url: "https://thebcms.com/blog/spec-driven-development", icon: "📄" },
      { title: "SDD: BDD's Second Chance? (Medium)", url: "https://medium.com/@cheparsky/ai-in-testing-10-spec-driven-development-bdds-second-chance-or-just-more-docs-151e30ecc97e", icon: "📄" }
    ]
  },
  {
    id: 4,
    title: "Инструменты SDD",
    goal: "Разобраться в ведущихих SDD-инструментах и выбрать подходящий для своего стека.",
    objectives: [
      "Знать 6 основных SDD-инструментов и их различия",
      "Выбирать инструмент под тип проекта (greenfield/brownfield)",
      "Настраивать GitHub Spec Kit"
    ],
    content: `
      <h4>Ландшафт инструментов 2026</h4>
      <p>Инструменты делятся на две категории: <strong>living-spec</strong> (синхронизация с кодом) и <strong>static-spec</strong> (структурирование upfront, ручная синхронизация).</p>

      <div class="metric-card">
        <h5>1. Intent — Living Specs</h5>
        <p>Спецификации автоматически обновляются при изменении кода. Multi-agent оркестрация. Context Engine для 400K+ файлов. VS Code extension. Лучший для: brownfield + large codebase.</p>
      </div>

      <div class="metric-card">
        <h5>2. AWS Kiro — Agentic IDE</h5>
        <p>IDE со встроенным spec mode. Обязательный 3-фазный pipeline: Requirements → Design → Tasks. Event-driven hooks. Лучший для: AWS-центричные стеки. Минус: жёсткий pipeline не подходит для brownfield.</p>
      </div>

      <div class="metric-card">
        <h5>3. GitHub Spec Kit — Open Source</h5>
        <p>Python CLI, MIT лицензия, 93+ звезды. Agent-agnostic: работает с 8+ AI-ассистентами. .specify/ папка для артефактов. Лучший для: open-source проекты, разнообразие AI-инструментов.</p>
      </div>

      <div class="metric-card">
        <h5>4. OpenSpec — Proposal-First</h5>
        <p>Цикл: Propose → Apply → Archive. Предложенные изменения живут отдельно (как git-ветки). 3 команды на фичу. Лучший для: brownfield, итеративные изменения.</p>
      </div>

      <div class="metric-card">
        <h5>5. BMAD-METHOD — Enterprise Planning</h5>
        <p>12+ ролевых агентов (Analyst, PM, Architect). Docs-as-code подход. Генерация PRD, architecture docs, technical plans. Лучший для: enterprise, framework-heavy проекты.</p>
      </div>

      <div class="metric-card">
        <h5>6. Cursor + .cursorrules — Pseudo-Specs</h5>
        <p>Cursor-native. Rules с YAML frontmatter и glob-паттернами. Plan Mode. Не полноценный SDD-инструмент, но для Cursor-пользователей — быстрый старт.</p>
      </div>

      <h4>GitHub Spec Kit: быстрый старт</h4>
      <pre><code># Установка
pip install github-spec-kit

# Инициализация проекта
specify init my-project

# Создать спецификацию
specify new-feature "User Authentication"
# → Генерирует: specification.md, plan.md, tasks.md

# Использовать с AI-ассистентом
specify implement --agent claude-code
# → Claude Code читает spec и генерирует код

# Проверить соответствие
specify verify --pr 42
# → Отчёт: какие acceptance criteria покрыты</code></pre>

      <h4>Выбор инструмента</h4>
      <ul>
        <li><strong>Greenfield + AWS</strong> → Kiro</li>
        <li><strong>Greenfield + open-source</strong> → Spec Kit</li>
        <li><strong>Brownfield + large codebase</strong> → Intent</li>
        <li><strong>Brownfield + итеративный</strong> → OpenSpec</li>
        <li><strong>Enterprise + planning</strong> → BMAD</li>
        <li><strong>Cursor-пользователь</strong> → Cursor + .cursorrules</li>
      </ul>
    `,
    flashcards: [
      { front: "Living-spec vs Static-spec", back: "Living: spec автоматически обновляется при изменении кода (Intent). Static: структурирование upfront, ручная синхронизация (Spec Kit). Living лучше для долгосрочных проектов." },
      { front: "GitHub Spec Kit — ключевые фичи", back: "Python CLI, MIT, agent-agnostic (8+ AI-ассистентов). .specify/ для артефактов. Команды: init, new-feature, implement, verify. Лучший open-source вариант." },
      { front: "Kiro — ограничение для brownfield", back: "Обязательный 3-фазный pipeline (Requirements→Design→Tasks) создаёт friction для brownfield. Команда Kiro признала: «not everyone starts from requirements»." }
    ],
    quiz: [
      {
        question: "Для brownfield проекта с 400K+ файлами лучший инструмент:",
        options: ["AWS Kiro", "Intent — Context Engine для семантического анализа больших кодовых баз", "Cursor .cursorrules", "BMAD"],
        correct: 1,
        explanation: "Intent Context Engine обрабатывает 400K+ файлов через semantic dependency graph. Brownfield SDD начинается с понимания кодовой базы, а не с написания спецификаций."
      },
      {
        question: "Почему Kiro не подходит для brownfield?",
        options: [
          "Он слишком дорогой",
          "Обязательный 3-фазный pipeline (Requirements→Design→Tasks) создаёт friction для проектов с уже существующей архитектурой",
          "Он не поддерживает AI",
          "Он только для Python"
        ],
        correct: 1,
        explanation: "Kiro: жёсткий pipeline от requirements. Brownfield: архитектура уже определена, нужно начать с понимания существующего кода, а не с написания новых requirements."
      }
    ],
    sources: [
      { title: "6 Best SDD Tools for AI Coding 2026 (Augment Code)", url: "https://www.augmentcode.com/tools/best-spec-driven-development-tools", icon: "📄" },
      { title: "Spec-Driven Development With GitHub Spec Kit (Microsoft)", url: "https://developer.microsoft.com/blog/spec-driven-development-spec-kit", icon: "📄" },
      { title: "SDD for Brownfield Codebases (Augment Code)", url: "https://www.augmentcode.com/guides/spec-driven-development-brownfield-codebases", icon: "📄" }
    ]
  },
  {
    id: 5,
    title: "Живые спецификации и Spec Drift",
    goal: "Освоить управление жизненным циклом спецификаций и предотвращение их дрейфа.",
    objectives: [
      "Различать living-spec и static-spec подходы",
      "Обнаруживать и предотвращать spec drift",
      "Версионировать спецификации в Git"
    ],
    content: `
      <h4>Living Specs vs Static Specs</h4>
      <div class="key-concept">
        <strong>Living Spec:</strong> спецификация автоматически обновляется при изменении кода. Изменение кода → обновление spec. Изменение spec → регенерация затронутого кода. Два направления синхронизации.
        <br><br>
        <strong>Static Spec:</strong> структурированный документ upfront. При отклонении кода — ручная синхронизация. Spec Kit, BMAD — статические.
      </div>

      <h4>Spec Drift — враг SDD</h4>
      <p>Spec drift — постепенное расхождение спецификации и кода. Причины:</p>
      <ul>
        <li><strong>Quick fixes:</strong> разработчик чинит баг в коде, но не обновляет spec</li>
        <li><strong>AI hallucination:</strong> агент добавляет непредусмотренную функциональность</li>
        <li><strong>Implicit changes:</strong> рефакторинг, меняющий поведение, без обновления spec</li>
        <li><strong>Knowledge loss:</strong> ушли архитекторы, tribal knowledge не в spec</li>
      </ul>

      <h4>3 паттерна для предотвращения drift</h4>

      <div class="metric-card">
        <h5>Change Spec</h5>
        <p>Scope: одно изменение. Для: bug fixes, feature additions, рефакторинг. Правило: обновлять spec при каждом AI-assisted изменении.</p>
      </div>

      <div class="metric-card">
        <h5>Dependency Boundary Spec</h5>
        <p>Scope: контракт интеграционной точки. Для: service extraction, monolith decomposition. Правило: валидировать против production traffic, не документации.</p>
      </div>

      <div class="metric-card">
        <h5>Migration Spec</h5>
        <p>Scope: многофазное архитектурное изменение. Для: модернизация, миграция БД. Правило: каждый шаг должен быть независимо deployable.</p>
      </div>

      <h4>Версионирование в Git</h4>
      <pre><code># Структура в репозитории
.specify/
├── constitution.md        # Immutable principles
├── features/
│   ├── auth.md           # Living spec
│   ├── payments.md       # Living spec
│   └── notifications.md  # Living spec
├── plans/
│   ├── auth-plan.md
│   └── payments-plan.md
└── tasks/
    ├── auth-tasks.md
    └── payments-tasks.md

# Git flow для spec changes:
git checkout -b spec/update-auth
# Edit auth.md
git commit -m "spec: add 2FA requirement"
git push → PR → Review → Merge
# Spec change triggers:
# - CI spec-validation check
# - AI agent re-generates affected code</code></pre>

      <h4>Автоматический дрейф-контроль</h4>
      <pre><code># CI pipeline: drift detection
steps:
  - name: Extract behavior from code
    run: analyze_codebase --output actual.json

  - name: Extract behavior from spec
    run: parse_specs --output expected.json

  - name: Compare
    run: |
      diff_drift actual.json expected.json
      # Exit code 1 if drift > threshold
      # Generates drift-report.md</code></pre>
    `,
    flashcards: [
      { front: "Spec Drift — причины", back: "Quick fixes (код обновлён, spec — нет), AI hallucination (добавил непредусмотренное), Implicit changes (рефакторинг без spec update), Knowledge loss (ушли люди)." },
      { front: "Living Spec — два направления", back: "Код изменился → spec обновляется автоматически. Spec изменился → код регенерируется. Intent — единственный инструмент с полной living-spec синхронизацией." },
      { front: "3 паттерна предотвращения drift", back: "Change Spec (одно изменение), Dependency Boundary Spec (контракт интеграции), Migration Spec (многофазная миграция). Каждый — для своего scope изменений." }
    ],
    quiz: [
      {
        question: "AI-агент добавил фичу, которой нет в спецификации. Это:",
        options: [
          "Бонусная функциональность",
          "Spec drift — AI hallucination. Код отклонился от спецификации. Нужно удалить код ИЛИ обновить спецификацию",
          "Нормальное поведение AI",
          "Не требует действий"
        ],
        correct: 1,
        explanation: "AI hallucination в коде = spec drift. Агент добавил непредусмотренную функциональность. Решение: удалить код или обновить spec через PR."
      },
      {
        question: "Какой паттерн spec-drift prevention подходит для monolith decomposition?",
        options: [
          "Change Spec",
          "Dependency Boundary Spec — контракт интеграционной точки, валидация против production traffic",
          "Migration Spec",
          "Static Spec"
        ],
        correct: 1,
        explanation: "Dependency Boundary Spec: контракт на границе раздела. Валидация против реального production traffic, а не документации. Гарантирует, что декомпозиция не сломает интеграции."
      }
    ],
    sources: [
      { title: "SDD for Brownfield Codebases (Augment Code)", url: "https://www.augmentcode.com/guides/spec-driven-development-brownfield-codebases", icon: "📄" },
      { title: "Spec-Driven Development (specdriven.ai)", url: "https://specdriven.ai/", icon: "🔗" }
    ]
  },
  {
    id: 6,
    title: "SDD в CI/CD Pipeline",
    goal: "Интегрировать проверку спецификаций в CI/CD для автоматической верификации.",
    objectives: [
      "Настраивать spec-compliance checks в CI",
      "Создавать golden dataset для spec verification",
      "Интегрировать SDD с GitHub Actions"
    ],
    content: `
      <h4>Spec-Compliance Gate</h4>
      <p>Каждый PR проходит проверку соответствия спецификации перед merge:</p>
      <pre><code># .github/workflows/spec-check.yml
name: SDD Compliance
on: [pull_request]

jobs:
  spec-verify:
    steps:
      - name: Checkout specs
        uses: actions/checkout@v4

      - name: Parse specifications
        run: |
          specify parse .specify/features/
          --output specs.json

      - name: Analyze code changes
        run: |
          specify analyze-code --pr \${{ github.event.pull_request.number }}
          --output code-behavior.json

      - name: Check compliance
        run: |
          specify verify --specs specs.json
          --code code-behavior.json
          --threshold 95%
          # Blocks merge if < 95% compliance

      - name: Generate report
        if: always()
        run: specify report --pr \${{ github.event.pull_request.number }}</code></pre>

      <h4>Golden Dataset для Specs</h4>
      <div class="key-concept">
        <strong>Golden Dataset:</strong> набор эталонных примеров для каждой спецификации. При изменении spec или AI-модели — прогоняется через golden dataset. Если > 5% примеров ухудшились — PR блокируется.
      </div>

      <pre><code># golden/auth.json — эталонные примеры
{
  "feature": "User Authentication",
  "scenarios": [
    {
      "name": "Valid login",
      "input": {"email": "user@test.com", "password": "Str0ng!"},
      "expected": {"status": 200, "body": {"token": "jwt..."}}
    },
    {
      "name": "Invalid password",
      "input": {"email": "user@test.com", "password": "wrong"},
      "expected": {"status": 401, "body": {"error": "Invalid credentials"}}
    },
    {
      "name": "Rate limit",
      "input": {"email": "user@test.com", "password": "wrong", "attempts": 6},
      "expected": {"status": 429, "body": {"error": "Rate limit exceeded"}}
    }
  ]
}</code></pre>

      <h4>Regression Testing Specs</h4>
      <pre><code># При изменении спецификации:
specify regression-test \
  --spec .specify/features/auth.md \
  --golden golden/auth.json \
  --max-regression 5%

# Вывод:
# ✓ Scenario "Valid login" — PASS
# ✗ Scenario "Rate limit" — FAIL
#   Expected: 429, Got: 200
#   Regression: 33.3% (threshold: 5%)
# → PR BLOCKED</code></pre>

      <h4>Multi-variant Implementations</h4>
      <p>Spec отделён от кода → можно генерировать несколько реализаций:</p>
      <ul>
        <li>Python-реализация vs Go-реализация — из одной спецификации</li>
        <li>REST API vs gRPC — из одного spec</li>
        <li>Разные Figma mocks → разные UI-реализации</li>
        <li>A/B тестирование реализаций</li>
      </ul>

      <h4>Полный CI/CD Pipeline</h4>
      <pre><code>PR opened →
  ├── Spec parse (валидность spec)
  ├── Code analysis (извлечение behavior)
  ├── Spec compliance check (> 95%)
  ├── Golden dataset regression (< 5%)
  ├── OpenAPI contract validation
  ├── Standard CI (lint, test, build)
  └── Spec drift report
→ All pass = merge allowed
→ Any fail = PR blocked + report</code></pre>
    `,
    flashcards: [
      { front: "Spec-Compliance Gate", back: "CI-проверка: PR → parse specs → analyze code changes → verify compliance. Если < 95% acceptance criteria покрыто — PR блокируется." },
      { front: "Golden Dataset для Specs", back: "Набор эталонных сценариев для каждой фичи. При изменении spec или AI — прогон regression. > 5% ухудшений = блокировка PR." },
      { front: "Multi-variant из одной spec", back: "Spec отделён от кода → несколько реализаций из одной спецификации: Python vs Go, REST vs gRPC, разные UI. A/B тестирование реализаций." }
    ],
    quiz: [
      {
        question: "Spec-Compliance Gate блокирует PR, если:",
        options: [
          "Код не проходит linting",
          "Менее 95% acceptance criteria из спецификации покрыто кодом",
          "Нет unit-тестов",
          "PR слишком большой"
        ],
        correct: 1,
        explanation: "Spec-Compliance: автоматическая проверка, что код реализует все acceptance criteria из спецификации. < 95% = блокировка. Это SDD-эквивалент code coverage."
      },
      {
        question: "Что даёт отделение спецификации от кода?",
        options: [
          "Ускоряет разработку",
          "Позволяет генерировать несколько реализаций из одной спецификации (Python vs Go, REST vs gRPC)",
          "Уменьшает размер кодовой базы",
          "Автоматически исправляет баги"
        ],
        correct: 1,
        explanation: "Spec = контракт. Из одной спецификации можно сгенерировать Python и Go реализации, REST и gRPC API, разные UI. A/B тестирование реализаций."
      }
    ],
    sources: [
      { title: "SDD: The Definitive 2026 Guide (BCMS)", url: "https://thebcms.com/blog/spec-driven-development", icon: "📄" },
      { title: "SDD for Brownfield Codebases (Augment Code)", url: "https://www.augmentcode.com/guides/spec-driven-development-brownfield-codebases", icon: "📄" }
    ]
  },
  {
    id: 7,
    title: "Brownfield SDD и продвинутые паттерны",
    goal: "Применять SDD к существующим проектам и знать продвинутые паттерны.",
    objectives: [
      "Применять 5-шаговый brownfield SDD workflow",
      "Реверс-инжинирить спецификации из существующего кода",
      "Избегать типичных pitfalls"
    ],
    content: `
      <h4>Brownfield SDD: 5 шагов</h4>
      <p>Brownfield SDD отличается от greenfield: спецификация следует за пониманием, а не наоборот.</p>

      <div class="key-concept">
        <strong>Brownfield Pipeline:</strong>
        <br>1. Build Semantic Understanding → 2. Reverse-Engineer Specs → 3. Write Narrow Change Specs → 4. Implement & Verify → 5. Iterate
      </div>

      <h4>Step 1: Build Semantic Understanding</h4>
      <p>Прежде чем писатьать spec — понять существующую кодовую базу:</p>
      <ul>
        <li>Семантический анализ зависимостей (dependency maps)</li>
        <li>Идентификация архитектурных паттернов</li>
        <li>Обнаружение неявных контрактов</li>
        <li>Требуется хотя бы один инженер, знающий архитектуру</li>
      </ul>

      <h4>Step 2: Reverse-Engineer Specs</h4>
      <pre><code># Извлечение спецификаций из существующего кода
specify reverse-engineer \
  --codebase ./src \
  --output .specify/reverse/

# Результат:
# .specify/reverse/
# ├── api-contracts.yaml  # Извлечённые API-контракты
# ├── behavior-map.json   # Карта поведения
# └── dependency-graph.md # Граф зависимостей

# Human review обязательна!
# AI может не увидеть неявные контракты</code></pre>

      <h4>Step 3: Narrow Change Specs</h4>
      <p>В brownfield — узкие спецификации, scoped к одному изменению:</p>
      <pre><code># НЕ пытайтесь специфицировать всё сразу
# Сфокусируйтесь на ДЕЛЬТЕ изменения

# spec/add-2fa.md
## Change: Add 2FA to existing auth
### Affected components:
- AuthService.login() — add TOTP check
- UserSettings — add totp_secret field
- LoginResponse — add requires_2fa flag

### NOT affected:
- Password reset flow
- OAuth providers
- Session management</code></pre>

      <h4>Типичные Pitfalls</h4>

      <div class="metric-card">
        <h5>🚫 Pitfall: Full-Pipeline для Brownfield</h5>
        <p>Применение полного SDD-цикла (Constitution → Specify → Plan → Tasks) к существующему проекту. Слишком много overhead для малых изменений. Решение: narrow change specs.</p>
      </div>

      <div class="metric-card">
        <h5>🚫 Pitfall: Tribal Knowledge Loss</h5>
        <p>Архитекторы ушли, неявные контракты не задокументированы. AI не может их вывести. Решение: интервью с оставшимися инженерами + реверс-инжиниринг.</p>
      </div>

      <div class="metric-card">
        <h5>🚫 Pitfall: Spec Theater</h5>
        <p>Команда пишет спецификации «для галочки», но не использует их для верификации. Spec становится бесполезной бюрократией. Решение: spec-compliance gate в CI (нет gate — spec бесполезен).</p>
      </div>

      <h4>Формальные методы: Dafny</h4>
      <p>Для критически важных систем — формальная верификация:</p>
      <pre><code>// Dafny: формальная спецификация
method Withdraw(account: Account, amount: nat)
  requires amount <= account.balance
  ensures account.balance == old(account.balance) - amount
  ensures account.transactions.Count == old(account.transactions.Count) + 1
{
  account.balance := account.balance - amount;
  account.transactions.Add(new Transaction(amount));
}
// Dafny математически ДОКАЗЫВАЕТ, что код соответствует spec</code></pre>
      <p><strong>DafnyPro</strong> (POPL 2026): LLM + формальные методы. Claude Sonnet 3.5 + DafnyPro = 86% correct proofs на DafnyBench.</p>
    `,
    flashcards: [
      { front: "Brownfield SDD — отличие от Greenfield", back: "Brownfield: спецификация СЛЕДУЕТ за пониманием. Сначала — понять кодовую базу (semantic analysis), потом — узкие spec для конкретных изменений. Не пытайтесь специфицировать всё." },
      { front: "Spec Theater", back: "Команда пишет спецификации «для галочки», без автоматической верификации. Spec = бесполезная бюрократия. Антидот: spec-compliance gate в CI." },
      { front: "Dafny + LLM (DafnyPro)", back: "Формальная верификация: математическое доказательство, что код соответствует spec. DafnyPro: LLM генерирует аннотации, верификатор доказывает. 86% correct proofs (POPL 2026)." }
    ],
    quiz: [
      {
        question: "Первый шаг Brownfield SDD:",
        options: [
          "Написать constitution.md",
          "Build Semantic Understanding — семантический анализ существующей кодовой базы",
          "Сгенерировать код",
          "Запустить тесты"
        ],
        correct: 1,
        explanation: "Brownfield: сначала — понять кодовую базу (dependency maps, паттерны, неявные контракты). Только потом — писать спецификации для конкретных изменений."
      },
      {
        question: "Spec Theater — это:",
        options: [
          "Интересная техника для spec writing",
          "Команда пишет спецификации для галочки, без автоматической верификации. Антидот: spec-compliance gate в CI",
          "Театральная постановка о SDD",
          "Формальный метод верификации"
        ],
        correct: 1,
        explanation: "Spec Theater: spec написан, но не проверяется автоматически. Spec становится бесполезной бюрократией. Решение: CI gate, блокирующий merge при < 95% compliance."
      }
    ],
    sources: [
      { title: "SDD for Brownfield Codebases (Augment Code)", url: "https://www.augmentcode.com/guides/spec-driven-development-brownfield-codebases", icon: "📄" },
      { title: "DafnyPro: LLM-Assisted Verification (POPL 2026)", url: "https://popl26.sigplan.org/details/dafny-2026-papers/12/DafnyPro-LLM-Assisted-Automated-Verification-for-Dafny-Programs", icon: "📄" },
      { title: "Why AI Coding Agents Still Need Clear Specs (The Main Thread)", url: "https://www.the-main-thread.com/p/spec-trap-agent-work", icon: "📄" }
    ]
  }
];

// ============================================================
// Final Review — 8 вопросов из всех уроков
// ============================================================
const finalQuiz = [
  { question: "Исследование METR показало, что разработчики с неструктурированными промптами:", options: ["Работали на 50% быстрее", "Работали на 19% медленнее из-за циклов отладки", "Не заметили разницы", "Получали лучший код"], correct: 1, explanation: "METR: неструктурированные промпты → циклы отладки съедают сэкономленное время → общее время +19%." },
  { question: "Phase 2 (Clarify) в SDD-цикле предназначена для:", options: ["Генерации кода", "Выявления edge cases, empty states и двусмысленностей ДО генерации кода", "Тестирования", "Деплоя"], correct: 1, explanation: "Clarify: структурированный проход по spec. Все ответы → в spec. Иначе AI угадывает и создаёт баги." },
  { question: "EARS-паттерн «IF condition THEN response» описывает:", options: ["Постоянное поведение", "Реакцию на нежелательное поведение (unwanted behavior)", "Опциональную фичу", "Event-driven поведение"], correct: 1, explanation: "Unwanted behavior: IF [3 failed logins in 60s] THEN [lock account for 15 min]. Реакция на ошибку." },
  { question: "Для brownfield проекта с 400K+ файлами лучший SDD-инструмент:", options: ["AWS Kiro", "Intent — Context Engine для семантического анализа", "GitHub Spec Kit", "Cursor"], correct: 1, explanation: "Intent Context Engine: 400K+ файлов через semantic dependency graph. Brownfield SDD начинается с понимания кодовой базы." },
  { question: "Spec Drift — это:", options: ["Обновление спецификации", "Постепенное расхождение spec и кода (quick fixes, AI hallucination, implicit changes)", "Удаление спецификации", "Рефакторинг кода"], correct: 1, explanation: "Spec drift: код отклоняется от spec. Причины: quick fixes, AI hallucination, implicit changes, knowledge loss." },
  { question: "Golden Dataset в контексте SDD:", options: ["Набор лучших практик", "Эталонные сценарии для regression testing спецификаций", "Архив старых спецификаций", "Список AI-моделей"], correct: 1, explanation: "Golden Dataset: эталонные примеры. При изменении spec → regression test. > 5% ухудшений = PR blocked." },
  { question: "Spec Theater — это:", options: ["Театр про SDD", "Spec написан, но не проверяется автоматически — бесполезная бюрократия", "Интересный UI для spec", "Формальный метод"], correct: 1, explanation: "Spec Theater: spec есть, верификации нет. Антидот: spec-compliance gate в CI с блокировкой merge." },
  { question: "DafnyPro (POPL 2026) — это:", options: ["IDE для Python", "LLM + формальная верификация: 86% correct proofs на DafnyBench", "SDD-фреймворк", "Инструмент для CI/CD"], correct: 1, explanation: "DafnyPro: LLM генерирует verification annotations, верификатор математически доказывает корректность. 86% correct proofs." }
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
  $("#welcome").classList.add("hidden"); $("#review-view").classList.add("hidden"); $("#lesson-view").classList.remove("hidden");
  const l = courseData[index];
  $("#lesson-badge").textContent = "Урок " + (index + 1);
  $("#lesson-title").textContent = l.title;
  $("#objectives-list").innerHTML = l.objectives.map(o => '<li>' + o + '</li>').join('');
  $("#content-section").innerHTML = '<h3>📖 Материал</h3>' + l.content;
  buildFlashcards(l.flashcards); buildQuiz(l.quiz, l.id); buildSources(l.sources);
  $("#btn-prev").style.visibility = index === 0 ? 'hidden' : 'visible';
  $("#btn-next").textContent = index === courseData.length - 1 ? 'Завершить →' : 'Далее →';
  state.completed.add(index); updateProgress(); buildSidebar(); window.scrollTo(0, 0);
}

function buildFlashcards(cards) {
  const c = $("#flashcards");
  c.innerHTML = cards.map(card =>
    '<div class="flashcard"><div class="flashcard-inner">' +
    '<div class="flashcard-front">' + card.front + '</div>' +
    '<div class="flashcard-back">' + card.back + '</div>' +
    '</div></div>'
  ).join('');
  c.querySelectorAll('.flashcard').forEach(f => f.addEventListener('click', () => f.classList.toggle('flipped')));
}

function buildQuiz(questions, lessonId) {
  const c = $("#quiz");
  c.innerHTML = questions.map((q, qi) => {
    const key = lessonId + '-' + qi;
    const a = state.quizAnswered[key];
    return '<div class="quiz-question" data-key="' + key + '" data-correct="' + q.correct + '">' +
      '<h4>' + (qi + 1) + '. ' + q.question + '</h4><div class="quiz-options">' +
      q.options.map((o, oi) => {
        let cls = 'quiz-option';
        if (a !== undefined) { cls += ' disabled'; if (oi === q.correct) cls += ' correct'; else if (oi === a) cls += ' wrong'; }
        return '<button class="' + cls + '" data-option="' + oi + '" data-key="' + key + '">' + o + '</button>';
      }).join('') + '</div><div class="quiz-feedback' + (a !== undefined ? ' show ' + (a === q.correct ? 'correct-fb' : 'wrong-fb') : '') + '">' +
      (a !== undefined ? (a === q.correct ? '✅ Правильно! ' : '❌ Неверно. ') + q.explanation : '') + '</div></div>';
  }).join('');
  c.querySelectorAll('.quiz-option').forEach(b => b.addEventListener('click', () => handleAnswer(b)));
}

function handleAnswer(btn) {
  const key = btn.dataset.key;
  if (state.quizAnswered[key] !== undefined) return;
  const q = btn.closest('.quiz-question'), ci = parseInt(q.dataset.correct), si = parseInt(btn.dataset.option);
  state.quizAnswered[key] = si;
  q.querySelectorAll('.quiz-option').forEach((o, i) => { o.classList.add('disabled'); if (i === ci) o.classList.add('correct'); else if (i === si) o.classList.add('wrong'); });
  const fb = q.querySelector('.quiz-feedback');
  const [lid, qi] = key.split('-').map(Number);
  const exp = courseData[lid - 1]?.quiz[qi]?.explanation || '';
  fb.textContent = (si === ci ? '✅ Правильно! ' : '❌ Неверно. ') + exp;
  fb.className = 'quiz-feedback show ' + (si === ci ? 'correct-fb' : 'wrong-fb');
}

function buildSources(sources) {
  if (!sources || !sources.length) { $("#sources-section").classList.add('hidden'); return; }
  $("#sources-section").classList.remove('hidden');
  $("#sources").innerHTML = sources.map(s =>
    '<a href="' + s.url + '" target="_blank" class="source-card"><span class="source-icon">' + s.icon + '</span>' +
    '<div><div class="source-title">' + s.title + '</div><div class="source-url">' + s.url + '</div></div></a>'
  ).join('');
}

function prevLesson() { if (state.currentLesson > 0) goToLesson(state.currentLesson - 1); }
function nextLesson() { state.currentLesson < courseData.length - 1 ? goToLesson(state.currentLesson + 1) : showReview(); }

function showReview() {
  state.currentLesson = 7;
  $("#welcome").classList.add('hidden'); $("#lesson-view").classList.add('hidden'); $("#review-view").classList.remove('hidden');
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
  c.querySelectorAll('.quiz-option').forEach(b => b.addEventListener('click', () => {
    const fk = b.dataset.fkey;
    if (af[fk] !== undefined) return;
    const q = b.closest('.quiz-question'), ci = parseInt(q.dataset.correct), si = parseInt(b.dataset.foption);
    af[fk] = si;
    q.querySelectorAll('.quiz-option').forEach((o, i) => { o.classList.add('disabled'); if (i === ci) o.classList.add('correct'); else if (i === si) o.classList.add('wrong'); });
    const fb = q.querySelector('.quiz-feedback');
    fb.textContent = (si === ci ? '✅ ' : '❌ ') + finalQuiz[fk].explanation;
    fb.className = 'quiz-feedback show ' + (si === ci ? 'correct-fb' : 'wrong-fb');
    if (Object.keys(af).length === finalQuiz.length) {
      const s = Object.entries(af).filter(([k, v]) => v === finalQuiz[k].correct).length;
      showResult(s, finalQuiz.length);
    }
  }));
}

function showResult(score, total) {
  $("#review-result").classList.remove('hidden');
  const pct = Math.round(score / total * 100);
  $("#review-score").textContent = score + ' / ' + total + ' (' + pct + '%)';
  $("#review-message").textContent = pct >= 80
    ? '🎉 Отлично! Вы готовы применять SDD на практике!'
    : pct >= 50 ? '👍 Хорошая база. Пересмотрите уроки с ошибками.'
    : '📚 Стоит пройти курс ещё раз.';
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + '%';
  $("#progress-text").textContent = state.completed.size + ' / ' + courseData.length + ' уроков';
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

document.addEventListener('DOMContentLoaded', init);
