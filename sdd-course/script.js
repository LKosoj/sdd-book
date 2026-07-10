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
      <p>К 2026 году стало очевидно: <strong>vibe coding</strong> (интуитивная генерация кода на основе коротких промптов) не масштабируется за пределы прототипов. Исследование <strong>METR (Model Evaluation & Threat Research)</strong> (arXiv 2507.09089) показало: опытные разработчики, решавшие реальные issues с AI-инструментами, в среднем работали <strong>на 19% медленнее</strong>, чем без них. Исследование сравнивало условия «с AI» и «без AI» и не тестировало структуру промптов; одна из возможных интерпретаций замедления — «циклы отладки», поглощающие время, сэкономленное на генерации (в 2026 METR частично пересмотрела надёжность выводов).</p>

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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда финтех-стартапа за 6 месяцев накопила 47% legacy-кода, сгенерированного через vibe coding. Аудит обнаружил 23 SQL Injection и 8 race conditions. Переход на SDD занял 3 месяца: написали спецификации для критических endpoints, прогнали через spec-compliance gate. За следующий квартал — 0 уязвимостей в новом коде.
      </div>
    `,
    flashcards: [
      { front: "SDD — определение", back: "Specification-Driven Development: спецификация = первичный артефакт и источник истины. Код — это build output, генерируемый из спецификации. Не Waterfall — живые документы, интегрированные в CI/CD." },
      { front: "Парадокс продуктивности (METR)", back: "METR (arXiv 2507.09089): опытные разработчики с AI на реальных issues — на 19% МЕДЛЕННЕЕ, чем без AI. Одна из интерпретаций — циклы отладки съедают сэкономленное время; структуру промптов исследование не тестировало." },
      { front: "5 уровней зрелости", back: "0: Code-First. 1: Vibe Coding. 2: AI-Assisted. 3: Agentic. 4: SDD (человек=архитектор, AI=исполнитель контрактов). 5: Autonomous pipelines." },
      { front: "TCE и AI-разработка", back: "Теория трансакционных издержек: специфичность активов (код привязан к кодовой базе) + поведенческая неопределённость (LLM недетерминированы) = чем сложнее проект, тем строже должны быть спецификации." },
      { front: "Vibe coding — почему не масштабируется", back: "Короткие промпты → AI угадывает контракт → код «работает», но содержит баги, не покрывает edge cases. За пределами прототипов — циклы отладки разрушают продуктивность." },
      { front: "Контекстная инженерия", back: "Дисциплина создания контекста для LLM: constitution.md, спецификации, behavioral contracts, retrieval. Не Waterfall — живые артефакты, эволюционирующие вместе с кодом." },
      { front: "5 проблем, решаемых SDD", back: "Ambiguity (что значит «сложение»?), Inconsistency (разные стили), Bugs (логические ошибки), Security (SQL Injection в LLM-коде), Loss of context (архитектурные ограничения)." }
    ],
    quiz: [
      {
        question: "Как чаще всего интерпретируют 19% замедление разработчиков с AI-инструментами (исследование METR)?",
        options: [
          "AI-модели слишком медленные",
          "Циклы отладки AI-кода поглощали время, сэкономленное на генерации (одна из возможных интерпретаций — само исследование причины не измеряло)",
          "Разработчики не умели пользоваться AI",
          "AI генерировал слишком много кода"
        ],
        correct: 1,
        explanation: "METR (arXiv 2507.09089) сравнивала работу опытных разработчиков с AI и без AI на реальных issues и зафиксировала −19%; структура промптов не тестировалась. «Циклы отладки» — распространённая интерпретация. SDD адресует этот риск через спецификации."
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
      },
      {
        question: "На каком уровне зрелости AI-разработки человек выступает как 'архитектор/PM', а AI как 'исполнитель контрактов'?",
        options: ["Level 1: Vibe Coding", "Level 2: AI-Assisted", "Level 4: SDD", "Level 5: Autonomous"],
        correct: 2,
        explanation: "Level 4 (SDD): человек определяет контракт, AI исполняет. Это уровень зрелости, где спецификации становятся центральным артефактом."
      },
      {
        question: "Что такое 'специфичность активов' в TCE-анализе AI-разработки?",
        options: [
          "Уникальность модели LLM",
          "Сгенерированный код привязан к конкретной кодовой базе, стоимость переписывания колоссальная",
          "Тип лицензии",
          "Стоимость GPU"
        ],
        correct: 1,
        explanation: "Asset specificity: код, сгенерированный для одного проекта, плохо переносится. Это повышает трансакционные издержки, а значит — нужны более строгие контракты (спецификации)."
      },
      {
        question: "Какое утверждение о SDD верно?",
        options: [
          "Это требует написать всю спецификацию upfront перед любым кодом",
          "Спецификации — живые документы, эволюционирующие вместе с кодом",
          "SDD заменяет разработчиков на AI",
          "SDD применим только к greenfield проектам"
        ],
        correct: 1,
        explanation: "SDD — живые спецификации. Они меняются вместе с пониманием продукта. Это итеративный процесс, а не Waterfall."
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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> SaaS-команда внедрила SDD-цикл. Самым ценным оказался Phase 2 (Clarify): на одной из фич clarify-проход выявил 11 неучтённых edge cases (пустой cart, expired session, partial refunds). До SDD эти кейсы всплывали в проде через 2-3 спринта. Теперь — ловятся до генерации кода.
      </div>
    `,
    flashcards: [
      { front: "6 фаз SDD-цикла", back: "0: Constitution (guardrails). 1: Specify (what & why). 2: Clarify (remove ambiguity). 3: Plan (technical blueprint). 4: Tasks (atomic decomposition). 5-6: Implement & Iterate." },
      { front: "Constitution.md — зачем?", back: "Незыблемые принципы проекта: tech stack, coding standards, security rules. AI получает это при каждом вызове. Immutable context — нельзя менять без пересмотра всей архитектуры." },
      { front: "Phase 2: Clarify — зачем?", back: "Структурированный проход по spec для выявления edge cases, empty states, error handling, boundary values. Все ответы → В спецификацию. Иначе AI будет угадывать." },
      { front: "Specify vs Plan", back: "Specify: что и зачем (user stories, acceptance criteria) — без технических деталей. Plan: архитектура, модели данных, API-контракты — технический blueprint. Разделение намерения и реализации." },
      { front: "Размер задачи в Phase 4", back: "Атомарная задача = 1-4 часа = scope одного PR. Каждая задача имеет acceptance criteria и проверяется отдельно. Большие задачи → дробить." },
      { front: "Human checkpoints в SDD", back: "После каждой фазы — точка для review человеком. Особенно критичен checkpoint после Clarify (все ли неоднозначности устранены?) и после Plan (правильная ли архитектура?)." },
      { front: "Phase 5-6: Iterate", back: "После merge любое изменение начинается с ревизии спецификации. Spec change → impact analysis → план обновления кода. Это предотвращает spec drift." }
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
      },
      {
        question: "Что должно содержаться в constitution.md?",
        options: [
          "Список всех будущих фич",
          "Tech stack, coding standards, security rules — незыблемые принципы проекта",
          "User stories",
          "Юнит-тесты"
        ],
        correct: 1,
        explanation: "Constitution — immutable context: что используем (стек), как пишем (стандарты), какие правила безопасности. Эти данные передаются AI при каждом вызове."
      },
      {
        question: "Какой максимальный размер задачи в Phase 4 (Tasks)?",
        options: [
          "1-4 часа, scope одного PR",
          "1-2 недели",
          "1 спринт",
          "Не ограничен"
        ],
        correct: 0,
        explanation: "Атомарные задачи: 1-4 часа = scope одного PR. Каждая задача имеет свои acceptance criteria и проверяется отдельно."
      },
      {
        question: "Как SDD относится к Waterfall?",
        options: [
          "SDD = Waterfall с другим названием",
          "SDD — итеративный процесс с живыми спецификациями, эволюционирующими вместе с кодом",
          "SDD — упрощённая Waterfall",
          "SDD заменяет Waterfall полностью"
        ],
        correct: 1,
        explanation: "Waterfall: спецификация замораживается до начала кодирования. SDD: спецификация живёт и обновляется вместе с кодом. Это два разных подхода."
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
      <p>Нотацию EARS создал Alistair Mavin с коллегами в Rolls-Royce (доклад на конференции RE'09, 2009). Сегодня это стандартная нотация для AI-readable спецификаций. Каждый паттерн сводится к одному тестируемому утверждению:</p>

      <div class="key-concept">
        <strong>6 паттернов EARS:</strong>
        <br>• <strong>Ubiquitous:</strong> THE [system] SHALL [behavior]
        <br>• <strong>Event-driven:</strong> WHEN [event] THE [system] SHALL [behavior]
        <br>• <strong>State-driven:</strong> WHILE [state] THE [system] SHALL [behavior]
        <br>• <strong>Unwanted behavior:</strong> IF [condition] THEN THE [system] SHALL [response]
        <br>• <strong>Optional:</strong> WHERE [feature] THE [system] SHALL [behavior]
        <br>• <strong>Complex:</strong> WHILE [state], WHEN [event] THE [system] SHALL [behavior] — комбинация паттернов
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
code after password validation.

# Complex (комбинация While + When)
WHILE offline mode is active, WHEN the
user saves a document THE system SHALL
queue the change for later sync.</code></pre>

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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда переписала legacy-требования (PDF на 80 страниц) в EARS-формат — получилось 312 атомарных утверждений. AI-агент сгенерировал 312 unit-тестов (по одному на утверждение). Test coverage критического модуля вырос с 47% до 89%. Бонус: 28 EARS-утверждений противоречили друг другу — обнаружили на этапе ревизии.
      </div>
    `,
    flashcards: [
      { front: "6 паттернов EARS", back: "Ubiquitous (THE system SHALL), Event-driven (WHEN event), State-driven (WHILE state), Unwanted behavior (IF condition THEN), Optional (WHERE feature), Complex (комбинация WHILE+WHEN). Каждый = 1 тестируемый claim. Автор нотации — Alistair Mavin с коллегами (Rolls-Royce, RE'09, 2009)." },
      { front: "Behavioral Contract", back: "Preconditions (истинно ДО) + Postconditions (истинно ПОСЛЕ) + Invariants (всегда истинно). Формальный контракт компонента, проверяемый тестами." },
      { front: "Machine-Checkable Spec", back: "Спецификация → проверяемый контракт в CI. Пример: OpenAPI schema в openapi.yaml + swagger-cli validate. Spec становится исполняемым тестом." },
      { front: "EARS vs BDD", back: "EARS = формальный контракт (IF/THEN), пишется системно. BDD = сценарий поведения (GIVEN/WHEN/THEN), пишется как пользовательская история. Дополняют друг друга." },
      { front: "Преимущество атомарности EARS", back: "Каждый EARS-утверждение = 1 тестируемый claim. AI генерирует 1 unit-тест на 1 утверждение. Test coverage = % покрытых EARS-утверждений (а не строк кода)." },
      { front: "Ubiquitous EARS — где использовать?", back: "Constitution.md = список ubiquitous EARS: 'THE system SHALL encrypt all data at rest', 'THE system SHALL validate all user inputs'. Это незыблемые инварианты." },
      { front: "Detection противоречий через EARS", back: "Когда требования атомарны (1 EARS = 1 claim), легко обнаружить противоречия. Например, 'system SHALL return 200' + 'system SHALL return 202' на один и тот же endpoint = конфликт." }
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
      },
      {
        question: "EARS-паттерн 'THE system SHALL encrypt all data at rest using AES-256' — это:",
        options: [
          "Event-driven",
          "Ubiquitous — постоянно действующее требование",
          "State-driven",
          "Optional"
        ],
        correct: 1,
        explanation: "Ubiquitous: требование действует всегда, без условий. 'THE system SHALL [behavior]' — синоним инварианта проекта."
      },
      {
        question: "Что общего между EARS и BDD?",
        options: [
          "Они полностью идентичны",
          "Оба декомпозируют требования в проверяемые утверждения, но EARS — контракт, BDD — сценарий",
          "BDD заменяет EARS",
          "Они несовместимы"
        ],
        correct: 1,
        explanation: "EARS и BDD дополняют друг друга. EARS — формальные контракты (IF/THEN). BDD — сценарии (GIVEN/WHEN/THEN). Используются вместе."
      },
      {
        question: "Каково главное преимущество атомарности EARS?",
        options: [
          "Краткость текста",
          "1 EARS = 1 тестируемый claim → можно сгенерировать 1 unit-тест и однозначно проверить компетентность",
          "Универсальность",
          "Простота написания"
        ],
        correct: 1,
        explanation: "Атомарность даёт machine-checkability: каждое утверждение проверяется отдельным тестом. Test coverage = % покрытых EARS-утверждений."
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
        <p>Python CLI, MIT лицензия, более 100 тысяч звёзд на GitHub. Agent-agnostic: работает с 30+ AI-ассистентами. .specify/ папка для артефактов. Лучший для: open-source проекты, разнообразие AI-инструментов.</p>
      </div>

      <div class="metric-card">
        <h5>4. OpenSpec — Proposal-First</h5>
        <p>Цикл: Propose → Apply → Archive. Предложенные изменения живут отдельно (как git-ветки). 3 команды на фичу. Лучший для: brownfield, итеративные изменения.</p>
      </div>

      <div class="metric-card">
        <h5>5. BMAD-METHOD — Enterprise Planning</h5>
        <p>21+ ролевых агентов (Analyst, PM, Architect). Docs-as-code подход. Генерация PRD, architecture docs, technical plans. Лучший для: enterprise, framework-heavy проекты.</p>
      </div>

      <div class="metric-card">
        <h5>6. Cursor + .cursorrules — Pseudo-Specs</h5>
        <p>Cursor-native. Rules с YAML frontmatter и glob-паттернами. Plan Mode. Не полноценный SDD-инструмент, но для Cursor-пользователей — быстрый старт.</p>
      </div>

      <h4>GitHub Spec Kit: быстрый старт</h4>
      <pre><code># Установка (через uv)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Или разово, без установки:
# uvx --from git+https://github.com/github/spec-kit.git specify init my-project

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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Платформенная команда сравнила 3 инструмента на одной фиче (notification preferences). Kiro: 4 часа на полный pipeline, чистый код, но жёсткая структура. Spec Kit: 2 часа, удобный agent-agnostic режим, нужно вручную интегрировать с CI. Cursor + .cursorrules: 30 минут, но spec не отделён от кода — годится только для прототипа. Выбор зависит от scope изменения.
      </div>
    `,
    flashcards: [
      { front: "Living-spec vs Static-spec", back: "Living: spec автоматически обновляется при изменении кода (Intent). Static: структурирование upfront, ручная синхронизация (Spec Kit). Living лучше для долгосрочных проектов." },
      { front: "GitHub Spec Kit — ключевые фичи", back: "Python CLI, MIT, agent-agnostic (30+ AI-ассистентов). .specify/ для артефактов. Команды: init, new-feature, implement, verify. Лучший open-source вариант." },
      { front: "Kiro — ограничение для brownfield", back: "Обязательный 3-фазный pipeline (Requirements→Design→Tasks) создаёт friction для brownfield. Команда Kiro признала: «not everyone starts from requirements»." },
      { front: "OpenSpec — модель работы", back: "Proposal-first: Propose (отдельная папка) → Apply (мердж в основную spec) → Archive. Предложенные изменения живут как git-ветки. Лучший для итеративного brownfield." },
      { front: "BMAD-METHOD", back: "21+ ролевых агентов: Analyst, PM, Architect, etc. Docs-as-code: PRD, architecture docs, technical plans генерируются автоматически. Для enterprise/framework-heavy." },
      { front: "Intent Context Engine", back: "Семантический анализ зависимостей в 400K+ файлов. Обнаруживает неявные контракты в legacy. Multi-agent оркестрация. Лучший для brownfield." },
      { front: ".cursorrules — формат", back: "YAML frontmatter + glob-паттерны + правила. Cursor-native, не отделяет spec от кода. Годится для прототипов и Cursor-пользователей, не полноценный SDD." }
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
      },
      {
        question: "Что значит 'agent-agnostic' в контексте GitHub Spec Kit?",
        options: [
          "Не требует AI",
          "Работает с любым AI-ассистентом (Claude Code, Cursor, GitHub Copilot, Aider и др.) — 30+ интеграций",
          "Работает только с одним AI",
          "Не нужны спецификации"
        ],
        correct: 1,
        explanation: "Agent-agnostic: spec и pipeline не привязаны к конкретному AI-инструменту. Можно сменить Claude Code на Cursor — spec продолжает работать."
      },
      {
        question: "OpenSpec использует подход 'proposal-first'. Это означает:",
        options: [
          "Сначала пишется код, потом spec",
          "Изменения spec живут отдельно (в proposals/) до применения, как git-ветки",
          "Spec всегда заморожена",
          "Нужно одобрение менеджера на каждое изменение"
        ],
        correct: 1,
        explanation: "Propose (отдельная папка) → Apply (мердж в основную spec) → Archive. Изменения spec версионируются как ветки, не ломая стабильную версию."
      },
      {
        question: "Когда Cursor + .cursorrules — правильный выбор?",
        options: [
          "Всегда, это лучший SDD-инструмент",
          "Для прототипов или когда команда уже использует Cursor и не хочет внешних инструментов; не полноценный SDD",
          "Только для Python",
          "Никогда не использовать"
        ],
        correct: 1,
        explanation: ".cursorrules — pseudo-spec, не отделяет spec от кода, не имеет CI-интеграции. Годится для прототипов и небольших проектов в экосистеме Cursor."
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
      <pre><code># Структура в репозитории (GitHub Spec Kit)
.specify/
├── memory/
│   └── constitution.md   # Immutable principles
├── scripts/              # Скрипты автоматизации фаз
└── templates/            # Шаблоны spec/plan/tasks

specs/
├── 001-auth/
│   ├── spec.md           # Living spec
│   ├── plan.md
│   └── tasks.md
└── 002-payments/
    ├── spec.md
    ├── plan.md
    └── tasks.md

# Git flow для spec changes:
git checkout -b spec/update-auth
# Edit specs/001-auth/spec.md
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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> SRE-команда обнаружила, что spec модуля billing не обновлялась 8 месяцев, хотя код менялся еженедельно. Drift-аудит выявил 47 расхождений: 12 — новые endpoints без spec, 19 — изменённые контракты, 16 — undocumented retry logic. После внедрения drift detection в CI и автоматических spec-PR на каждое изменение — drift свелся к < 3% за квартал.
      </div>
    `,
    flashcards: [
      { front: "Spec Drift — причины", back: "Quick fixes (код обновлён, spec — нет), AI hallucination (добавил непредусмотренное), Implicit changes (рефакторинг без spec update), Knowledge loss (ушли люди)." },
      { front: "Living Spec — два направления", back: "Код изменился → spec обновляется автоматически. Spec изменился → код регенерируется. Intent — единственный инструмент с полной living-spec синхронизацией." },
      { front: "3 паттерна предотвращения drift", back: "Change Spec (одно изменение), Dependency Boundary Spec (контракт интеграции), Migration Spec (многофазная миграция). Каждый — для своего scope изменений." },
      { front: "Dependency Boundary Spec", back: "Контракт на границе раздела (между микросервисами/модулями). Валидируется против реального production traffic, а не документации. Критичен при monolith decomposition." },
      { front: "Migration Spec — главное правило", back: "Каждый шаг миграции должен быть независимо deployable. Это позволяет откатиться на любой стадии без потери целостности." },
      { front: "Git flow для spec", back: "Структура: .specify/ (memory/constitution.md, scripts/, templates/) + specs/<NNN-feature>/ со spec.md, plan.md, tasks.md. Изменения spec — через PR с branch spec/*. Merge spec → CI triggers re-generation affected code." },
      { front: "Drift detection в CI", back: "extract_behavior_from_code vs extract_behavior_from_spec → diff_drift. Если расхождение > threshold (обычно 5%) — PR блокируется. Генерируется drift-report.md." }
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
      },
      {
        question: "В чём ключевое различие living-spec и static-spec?",
        options: [
          "Living-spec короче",
          "Living-spec синхронизируется автоматически в обе стороны (код↔spec); static — ручная синхронизация",
          "Static-spec лучше для prototypes",
          "Они идентичны"
        ],
        correct: 1,
        explanation: "Living-spec: код → spec обновляется автоматически; spec → код регенерируется. Static-spec: spec пишется upfront, синхронизация ручная."
      },
      {
        question: "Главное правило Migration Spec:",
        options: [
          "Все шаги делаются одновременно",
          "Каждый шаг миграции должен быть независимо deployable — можно откатиться на любой стадии",
          "Никаких rollback'ов",
          "Только в выходные"
        ],
        correct: 1,
        explanation: "Migration Spec разбивает крупное архитектурное изменение на независимые шаги. Каждый шаг — атомарный deploy с возможностью отката."
      },
      {
        question: "Что делает drift detection в CI?",
        options: [
          "Удаляет старый код",
          "Сравнивает поведение, извлечённое из кода и из спецификации; блокирует PR при drift > threshold",
          "Генерирует новый код",
          "Удаляет тесты"
        ],
        correct: 1,
        explanation: "Drift detection: extract behavior from code → extract behavior from spec → diff. Если расхождение > порога (обычно 5%) — PR блокируется."
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
          specify parse specs/
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
  --spec specs/001-auth/spec.md \
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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> E-commerce платформа добавила spec-compliance gate в CI. За первый месяц 23% PR отклонились автоматически: 41% — невыполненные acceptance criteria, 28% — золотой dataset показал regression, 31% — drift detector обнаружил undocumented changes. После 3 месяцев авторы PR начали обновлять spec ДО написания кода — 91% PR проходили с первой попытки.
      </div>
    `,
    flashcards: [
      { front: "Spec-Compliance Gate", back: "CI-проверка: PR → parse specs → analyze code changes → verify compliance. Если < 95% acceptance criteria покрыто — PR блокируется." },
      { front: "Golden Dataset для Specs", back: "Набор эталонных сценариев для каждой фичи. При изменении spec или AI — прогон regression. > 5% ухудшений = блокировка PR." },
      { front: "Multi-variant из одной spec", back: "Spec отделён от кода → несколько реализаций из одной спецификации: Python vs Go, REST vs gRPC, разные UI. A/B тестирование реализаций." },
      { front: "OpenAPI как machine-checkable spec", back: "openapi.yaml — формальный контракт API. CI: swagger-cli validate проверяет валидность. Можно сгенерировать клиентов на 30+ языках из одного OpenAPI." },
      { front: "5 этапов SDD CI/CD pipeline", back: "1) Spec parse (валидность). 2) Code analysis. 3) Compliance check. 4) Golden dataset regression. 5) Drift report. Любой fail → PR blocked." },
      { front: "Threshold = 95% compliance", back: "Стандарт: 95% acceptance criteria из spec должны быть покрыты кодом. Это аналог code coverage, но более строгий: проверяется поведение, а не строки кода." },
      { front: "Regression threshold = 5%", back: "Если > 5% сценариев из golden dataset стали хуже после изменения spec/AI — PR блокируется. Защищает от случайного ухудшения качества." }
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
      },
      {
        question: "Зачем нужен Golden Dataset для спецификаций?",
        options: [
          "Это просто хороший набор тестов",
          "Эталонные сценарии для regression testing: при изменении spec/AI прогоняются и сравниваются с эталоном",
          "Для документации",
          "Для маркетинга"
        ],
        correct: 1,
        explanation: "Golden Dataset фиксирует ожидаемое поведение. При любом изменении (spec, AI-модель, код) прогоняется через golden — если > 5% сценариев ухудшились, PR блокируется."
      },
      {
        question: "Каков типичный порог regression в golden dataset?",
        options: ["50%", "5% — больше = блокировка PR", "0% — никакой regression", "20%"],
        correct: 1,
        explanation: "5% — стандартная толерантность. Учитывает шум недетерминизма LLM, но не позволяет существенно деградировать качеству."
      },
      {
        question: "Что значит 'multi-variant implementations'?",
        options: [
          "Много версий одного файла",
          "Из одной спецификации можно сгенерировать разные реализации (Python/Go, REST/gRPC) — для A/B тестирования",
          "Много форк-веток",
          "Разные стили кода"
        ],
        correct: 1,
        explanation: "Spec отделён от кода, поэтому одну спецификацию можно реализовать на нескольких языках/протоколах. A/B тестирование реализаций становится тривиальным."
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
      <p>Прежде чем писать spec — понять существующую кодовую базу:</p>
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

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда взяла 15-летний legacy ERP-проект (1.2M строк) и попыталась применить full SDD-pipeline. Через 4 недели — только Phase 0 (Constitution) и черновик Phase 1. После переключения на brownfield approach (semantic analysis + narrow change specs) — за 6 недель добавили 12 фич с полными specs + CI-gate. Урок: не пытайтесь описать legacy одной спецификацией.
      </div>
    `,
    flashcards: [
      { front: "Brownfield SDD — отличие от Greenfield", back: "Brownfield: спецификация СЛЕДУЕТ за пониманием. Сначала — понять кодовую базу (semantic analysis), потом — узкие spec для конкретных изменений. Не пытайтесь специфицировать всё." },
      { front: "Spec Theater", back: "Команда пишет спецификации «для галочки», без автоматической верификации. Spec = бесполезная бюрократия. Антидот: spec-compliance gate в CI." },
      { front: "Dafny + LLM (DafnyPro)", back: "Формальная верификация: математическое доказательство, что код соответствует spec. DafnyPro: LLM генерирует аннотации, верификатор доказывает. 86% correct proofs (POPL 2026)." },
      { front: "5 шагов brownfield SDD", back: "1) Build Semantic Understanding. 2) Reverse-Engineer Specs. 3) Write Narrow Change Specs. 4) Implement & Verify. 5) Iterate. В brownfield spec следует за пониманием." },
      { front: "Narrow Change Specs", back: "Спецификация одного изменения, не всего проекта. Включает: affected components + NOT affected. Защищает от переусложнения и spec theater." },
      { front: "Tribal Knowledge Loss", back: "Архитекторы ушли → неявные контракты не задокументированы → AI не может их вывести. Решение: интервью с оставшимися + reverse-engineering."},
      { front: "Reverse-engineer specs", back: "Извлечение спецификаций из существующего кода: API contracts, behavior map, dependency graph. Обязательна human review — AI может не увидеть implicit invariants." }
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
      },
      {
        question: "Почему НЕ нужно применять полный SDD-pipeline к brownfield?",
        options: [
          "Это не работает технически",
          "Слишком много overhead — Constitution+Specify+Plan+Tasks для legacy проекта неэффективны; используйте narrow change specs",
          "Brownfield не нужны спецификации",
          "Это запрещено"
        ],
        correct: 1,
        explanation: "Full pipeline предполагает greenfield. В brownfield архитектура уже задана — нужны узкие спецификации для каждого изменения, а не описание всей системы."
      },
      {
        question: "Что такое DafnyPro?",
        options: [
          "Новый язык программирования",
          "LLM + формальная верификация Dafny — Claude генерирует аннотации, Dafny математически доказывает корректность (POPL 2026)",
          "IDE для Python",
          "Тип AI-агента"
        ],
        correct: 1,
        explanation: "DafnyPro: LLM (Claude Sonnet 3.5) генерирует verification annotations, Dafny формально доказывает корректность. 86% correct proofs на DafnyBench."
      },
      {
        question: "Что должны включать Narrow Change Specs?",
        options: [
          "Описание всей системы",
          "Только affected components",
          "Affected components + NOT affected — явное определение границ изменения",
          "Юнит-тесты"
        ],
        correct: 2,
        explanation: "Включение 'NOT affected' критично: помогает AI и ревьюерам понять scope. Защищает от scope creep и hallucinations."
      }
    ],
    sources: [
      { title: "SDD for Brownfield Codebases (Augment Code)", url: "https://www.augmentcode.com/guides/spec-driven-development-brownfield-codebases", icon: "📄" },
      { title: "DafnyPro: LLM-Assisted Verification (POPL 2026)", url: "https://popl26.sigplan.org/details/dafny-2026-papers/12/DafnyPro-LLM-Assisted-Automated-Verification-for-Dafny-Programs", icon: "📄" },
      { title: "Why AI Coding Agents Still Need Clear Specs (The Main Thread)", url: "https://www.the-main-thread.com/p/spec-trap-agent-work", icon: "📄" }
    ]
  },
  {
    id: 8,
    title: "Spec Kit изнутри: устройство и расширение",
    goal: "Разобраться в архитектуре GitHub Spec Kit и научиться расширять его под свои процессы.",
    objectives: [
      "Понимать структуру .specify/ и связь между файлами",
      "Настраивать кастомные slash-команды Spec Kit",
      "Интегрировать Spec Kit с собственным CI/CD"
    ],
    content: `
      <h4>Архитектура Spec Kit</h4>
      <p>GitHub Spec Kit — Python CLI под MIT-лицензией, выпущен GitHub в сентябре 2025. К середине 2026 — более 100 тысяч звёзд, активная контрибьюторская база. Идея: <strong>не библиотека шаблонов, а исполнимая методология</strong>.</p>

      <div class="key-concept">
        <strong>Ядро Spec Kit:</strong>
        <br>• <code>specify CLI</code> — оркестратор pipeline
        <br>• <code>.specify/</code> — каталог артефактов в репозитории
        <br>• <code>templates/</code> — markdown-шаблоны для каждой фазы
        <br>• <code>agents/</code> — адаптеры под AI-ассистенты (Claude Code, Cursor, Aider, Copilot CLI...)
      </div>

      <h4>Структура артефактов</h4>
      <pre><code>.specify/
├── memory/
│   └── constitution.md   # Phase 0
├── scripts/              # Скрипты автоматизации фаз
└── templates/            # Шаблоны spec/plan/tasks

specs/
└── &lt;NNN-feature-name&gt;/   # Например, 001-user-auth
    ├── spec.md           # Phase 1: Specify
    ├── plan.md           # Phase 3: Plan
    └── tasks.md          # Phase 4: Tasks</code></pre>
      <p>Результаты Phase 2 (/clarify) записываются в секцию Clarifications внутри spec.md. Отдельные clarify.md, compliance/ и golden/ — не часть официального Spec Kit; далее в уроке они используются как <strong>авторское расширение</strong> структуры.</p>

      <h4>Slash-команды</h4>
      <p>Spec Kit добавляет slash-команды в поддерживаемые AI-ассистенты (в новых версиях — с префиксом <code>/speckit.*</code>). Стандартные:</p>
      <ul>
        <li><code>/constitution</code> — создание/обновление принципов проекта (Phase 0)</li>
        <li><code>/specify &lt;feature&gt;</code> — старт новой фичи, генерирует spec.md skeleton</li>
        <li><code>/clarify</code> — запускает интерактивный clarify-проход (ответы — в spec.md)</li>
        <li><code>/plan</code> — генерирует plan.md из spec.md</li>
        <li><code>/tasks</code> — декомпозиция plan.md в tasks.md</li>
        <li><code>/implement</code> — исполнение задач из tasks.md</li>
      </ul>
      <p>Команды <code>/verify</code> в официальном наборе нет — далее она используется как гипотетическое расширение для spec-compliance check.</p>

      <h4>Кастомные команды</h4>
      <p>В <code>.specify/commands/</code> можно добавить свои команды:</p>
      <pre><code># .specify/commands/security-review.md
---
name: security-review
description: OWASP Top 10 audit для фичи
inputs:
  - feature: name of the feature
---

You are a security auditor. Analyze the feature
"{{feature}}" against OWASP Top 10 (2021).

For each item:
- Status: covered / not-applicable / vulnerable
- Evidence: ссылка на код или spec-section
- Recommended action

Output: specs/{{feature}}/security.md</code></pre>

      <h4>Agent-агностичность через адаптеры</h4>
      <p>Spec Kit поддерживает 30+ AI-ассистентов через единый интерфейс:</p>
      <pre><code># Claude Code (CLAUDE.md инжектируется автоматически)
specify implement --agent claude-code

# Cursor (генерирует .cursorrules)
specify implement --agent cursor

# GitHub Copilot CLI
specify implement --agent copilot

# Aider
specify implement --agent aider

# Qwen Code CLI
specify implement --agent qwen-code

# Custom adapter (Python plugin)
specify implement --agent custom://my-adapter</code></pre>

      <h4>Интеграция с CI/CD</h4>
      <pre><code># .github/workflows/spec-gate.yml
on: [pull_request]

jobs:
  spec-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Spec Kit
        run: |
          pip install uv
          uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

      - name: Verify PR against specs
        run: |
          specify verify \\
            --pr \${{ github.event.pull_request.number }} \\
            --threshold 95 \\
            --format gh-annotations

      - name: Golden regression
        run: |
          specify regression-test \\
            --golden .specify/golden/ \\
            --max-regression 5</code></pre>

      <h4>Идеи расширений (гипотетические примеры)</h4>
      <p>Следующие расширения — <strong>не существующие пакеты</strong>, а иллюстрация того, как могла бы развиваться экосистема Spec Kit:</p>
      <ul>
        <li><strong>specify-mcp</strong> — MCP server, отдающий .specify/ как контекст для любого AI</li>
        <li><strong>specify-export</strong> — экспорт в OpenAPI, JSON Schema, AsyncAPI</li>
        <li><strong>specify-ide</strong> — VS Code extension с inline-просмотром compliance</li>
        <li><strong>specify-mutation</strong> — мутационное тестирование спецификаций (см. урок 12)</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда из ~30 инженеров внедрила Spec Kit с кастомной командой <code>/threat-model</code> (STRIDE-анализ). За первый квартал команда написала 47 спецификаций, threat model автоматически генерировался на этапе Phase 1. Безопасники заметили: критические STRIDE-категории (Spoofing, Tampering) покрыты в 92% spec — до Spec Kit было 38%.
      </div>
    `,
    flashcards: [
      { front: "Лицензия и природа Spec Kit", back: "GitHub Spec Kit: Python CLI, MIT-лицензия, выпущен GitHub в сентябре 2025. Не библиотека шаблонов, а исполнимая методология (CLI + templates + adapters)." },
      { front: "Структура артефактов Spec Kit", back: ".specify/ (memory/constitution.md, scripts/, templates/) + specs/<NNN-feature-name>/{spec,plan,tasks}.md. Каждая фича — отдельная нумерованная папка под specs/. Результаты clarify — секция Clarifications в spec.md." },
      { front: "6 стандартных slash-команд", back: "/constitution, /specify, /clarify, /plan, /tasks, /implement (в новых версиях — с префиксом /speckit.*). Покрывают весь SDD-pipeline. Команды /verify нет — это гипотетическое расширение. Каждая команда — markdown с frontmatter, можно копировать и кастомизировать." },
      { front: "Agent-агностичность", back: "Spec Kit поддерживает 30+ AI-ассистентов через адаптеры: claude-code, cursor, copilot, aider, qwen-code, etc. Единая команда specify implement --agent <name>." },
      { front: "Кастомные команды", back: "В .specify/commands/ можно добавить свои markdown-команды с frontmatter (name, description, inputs). Пример: /security-review, /threat-model, /pii-audit." },
      { front: "Идеи расширений (гипотетические)", back: "specify-mcp (MCP server для контекста), specify-export (OpenAPI/JSON Schema/AsyncAPI), specify-ide (VS Code extension), specify-mutation (мутационное тестирование спецификаций). Иллюстративные примеры, а не существующие пакеты." },
      { front: "Как Spec Kit инжектируется в Claude Code", back: "При --agent claude-code Spec Kit генерирует CLAUDE.md с инструкциями плюс slash-команды как файлы в .claude/commands/. AI получает доступ к контексту через стандартный механизм Claude Code." }
    ],
    quiz: [
      {
        question: "В чём ключевая идея Spec Kit?",
        options: [
          "Это библиотека готовых шаблонов спецификаций",
          "Исполнимая методология: CLI + templates + adapters под разные AI-ассистенты",
          "Replacement для GitHub Copilot",
          "Только CI-инструмент"
        ],
        correct: 1,
        explanation: "Spec Kit — не просто markdown-шаблоны, а CLI, оркестрирующий все фазы SDD через slash-команды и адаптеры под разные AI-ассистенты."
      },
      {
        question: "Что лежит в specs/<NNN-feature-name>/?",
        options: [
          "Только spec.md",
          "spec.md + plan.md + tasks.md",
          "Только golden dataset",
          "Юнит-тесты"
        ],
        correct: 1,
        explanation: "Каждая фича — отдельная нумерованная папка под specs/ с артефактами фаз SDD: spec.md (Phase 1, включая секцию Clarifications из Phase 2), plan.md (Phase 3), tasks.md (Phase 4)."
      },
      {
        question: "Как добавить кастомную команду в Spec Kit?",
        options: [
          "Это невозможно",
          "Создать markdown-файл в .specify/commands/ с frontmatter (name, description, inputs)",
          "Только через PR в основной репозиторий Spec Kit",
          "Через npm-плагин"
        ],
        correct: 1,
        explanation: "Расширение через .specify/commands/<name>.md с YAML frontmatter. Spec Kit подхватывает команду и делает её доступной как /<name> в AI-ассистенте."
      },
      {
        question: "Что означает 'agent-agnostic' в Spec Kit?",
        options: [
          "Не использует AI",
          "Работает с 30+ AI-ассистентами через адаптеры (claude-code, cursor, copilot, aider, qwen-code, ...)",
          "Только для GitHub Copilot",
          "Запускается без интернета"
        ],
        correct: 1,
        explanation: "Spec Kit имеет отдельные адаптеры для каждого AI-ассистента, конвертирующие SDD-pipeline в специфичные для агента артефакты (CLAUDE.md для Claude Code, .cursorrules для Cursor и т.д.)."
      },
      {
        question: "Что делал бы specify-mcp — гипотетическое расширение из урока?",
        options: [
          "Запускает MCP server, отдающий содержимое .specify/ как контекст для любого MCP-совместимого AI",
          "Подменяет git",
          "Запускает Spec Kit как Docker-контейнер",
          "Это IDE-плагин"
        ],
        correct: 0,
        explanation: "specify-mcp (иллюстративный пример, не существующий пакет) реализовывал бы Model Context Protocol сервер: подключение .specify/ как контекста к любому MCP-клиенту (Claude Desktop, Claude Code, кастомные агенты)."
      }
    ],
    sources: [
      { title: "GitHub Spec Kit Repository", url: "https://github.com/github/spec-kit", icon: "🔗" },
      { title: "Spec-Driven Development With GitHub Spec Kit (Microsoft)", url: "https://developer.microsoft.com/blog/spec-driven-development-spec-kit", icon: "📄" },
      { title: "GitHub Spec Kit Documentation", url: "https://github.com/github/spec-kit/blob/main/README.md", icon: "📚" }
    ]
  },
  {
    id: 9,
    title: "AWS Kiro: Spec Mode и event-driven hooks",
    goal: "Освоить специфические возможности Kiro IDE — встроенный spec mode и автоматизацию через event hooks.",
    objectives: [
      "Использовать Kiro Spec Mode для генерации трёхфазных артефактов",
      "Настраивать event-driven hooks для автоматизации",
      "Понимать, когда Kiro лучше Spec Kit и наоборот"
    ],
    content: `
      <h4>Что такое Kiro</h4>
      <p>AWS Kiro — agentic IDE с встроенным SDD-режимом. Публичное превью открылось 14–15 июля 2025 на AWS Summit New York, general availability — 17 ноября 2025. Ключевое отличие: <strong>SDD-pipeline встроен в редактор</strong>, а не запускается через CLI.</p>

      <div class="key-concept">
        <strong>3-фазный pipeline Kiro:</strong>
        <br>1. <strong>Requirements</strong> — EARS-нотация (что и зачем)
        <br>2. <strong>Design</strong> — техническая архитектура (как)
        <br>3. <strong>Tasks</strong> — атомарные задачи
        <br>В отличие от Spec Kit, нет отдельной Constitution-фазы — она встраивается в Requirements.
      </div>

      <h4>Запуск Spec Mode</h4>
      <p>В Kiro spec mode активируется командой <code>Cmd+Shift+P → "Kiro: New Spec"</code>. Затем:</p>
      <ol>
        <li>Kiro задаёт серию clarifying questions</li>
        <li>Генерирует requirements.md (EARS)</li>
        <li>После approval генерирует design.md</li>
        <li>После approval генерирует tasks.md</li>
        <li>Каждая задача может быть исполнена через "Run task"</li>
      </ol>

      <h4>Event-driven Hooks</h4>
      <p>Kiro поддерживает hooks — JSON-файлы в <code>.kiro/hooks/</code>, реагирующие на локальные события IDE (PostFileSave, PostFileCreate, PostFileDelete, SessionStart и др.). Триггеров на PR-события не существует — такую автоматизацию выносят в CI:</p>
      <pre><code>// .kiro/hooks/spec-compliance.json
{
  "name": "spec-compliance-on-save",
  "trigger": "PostFileSave",
  "matcher": "src/.*\\\\.ts$",
  "action": {
    "type": "agent",
    "prompt": "Файл сохранён. Проверь его соответствие .kiro/specs/&lt;feature&gt;/requirements.md. Если есть drift — предложи обновление spec ИЛИ rollback кода."
  },
  "enabled": true
}

// .kiro/hooks/generate-tests.json
{
  "name": "generate-tests-on-requirements-save",
  "trigger": "PostFileSave",
  "matcher": "requirements\\\\.md$",
  "action": {
    "type": "agent",
    "prompt": "Сгенерируй test cases для каждого EARS-требования в сохранённом requirements.md."
  },
  "enabled": true
}</code></pre>

      <h4>Steering Docs</h4>
      <p>Kiro имеет понятие <strong>steering docs</strong> — постоянного контекста проекта в <code>.kiro/steering/</code>:</p>
      <pre><code>.kiro/
├── steering/
│   ├── product.md        # Продукт и цели (constitution-эквивалент)
│   ├── tech.md           # Стек и coding standards
│   └── structure.md      # Структура проекта (+ свои кастомные файлы)
├── specs/
│   └── &lt;feature&gt;/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
└── hooks/
    ├── spec-compliance.json
    └── generate-tests.json</code></pre>

      <h4>Сравнение Kiro и Spec Kit</h4>
      <div class="metric-card">
        <h5>Kiro: плюсы</h5>
        <ul>
          <li>Встроено в IDE — нет переключения контекста</li>
          <li>Event hooks автоматизируют рутину</li>
          <li>Богатый UX (visual review, side-by-side diff с spec)</li>
          <li>Глубокая интеграция с AWS (Bedrock, CodeCatalyst)</li>
        </ul>
      </div>

      <div class="metric-card">
        <h5>Kiro: минусы</h5>
        <ul>
          <li>Жёсткий 3-фазный pipeline (плохо для brownfield)</li>
          <li>Привязан к AWS-экосистеме</li>
          <li>Vendor lock-in: spec-формат — Kiro-specific</li>
          <li>Closed-source</li>
        </ul>
      </div>

      <h4>Когда выбирать Kiro</h4>
      <ul>
        <li>AWS-центричный стек (используете Bedrock, Lambda, CodeCatalyst)</li>
        <li>Greenfield проекты</li>
        <li>Команда предпочитает IDE-native опыт</li>
        <li>Нужна автоматизация через event hooks</li>
      </ul>

      <h4>Когда выбирать Spec Kit</h4>
      <ul>
        <li>Open-source проекты или strict no-lock-in</li>
        <li>Brownfield (Kiro слишком жёсткий)</li>
        <li>Мультиоблачные или non-AWS стеки</li>
        <li>Нужно работать с разными AI-ассистентами</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Стартап на AWS Bedrock выбрал Kiro для нового микросервиса. За 5 недель: 18 фич полностью прошли 3-фазный pipeline, hook на PostFileSave автоматически детектировал 14 spec drift и генерировал test cases по EARS-требованиям. Минус: при попытке портировать spec в open-source репо столкнулись с vendor lock-in — пришлось переписывать в Spec Kit формате (1 неделя работы).
      </div>
    `,
    flashcards: [
      { front: "Kiro — что это", back: "AWS Kiro: agentic IDE с встроенным SDD-pipeline. Публичное превью — 14–15 июля 2025 (AWS Summit New York), GA — 17 ноября 2025. Глубокая интеграция с AWS Bedrock и CodeCatalyst." },
      { front: "3 фазы Kiro Spec Mode", back: "Requirements (EARS) → Design (архитектура) → Tasks (атомарные задачи). Нет отдельной Constitution-фазы — она в steering docs." },
      { front: "Steering Docs", back: "Постоянный контекст проекта в .kiro/steering/: product.md, tech.md, structure.md (+ кастомные файлы). Аналог constitution.md в Spec Kit, но автоматически инжектируется в каждый AI-вызов IDE." },
      { front: "Event-driven hooks", back: "JSON-файлы в .kiro/hooks/, реагируют на локальные события IDE (PostFileSave, PostFileCreate, PostFileDelete, SessionStart и др.). Триггеров на PR-события нет. Каждый hook запускает prompt для агента или команду. Автоматизация рутинных задач." },
      { front: "Когда выбирать Kiro", back: "AWS-центричный стек, greenfield, IDE-native опыт нужен, автоматизация через hooks. Не годится: brownfield (жёсткий pipeline), open-source (vendor lock-in)." },
      { front: "Главная слабость Kiro", back: "Vendor lock-in: spec-формат — Kiro-specific. Портирование в Spec Kit или другой инструмент требует переписывания. Привязка к AWS." },
      { front: "Kiro vs Spec Kit — формат spec", back: "Kiro: .kiro/specs/<feature>/{requirements,design,tasks}.md (закрытый формат). Spec Kit: specs/<NNN-feature-name>/{spec,plan,tasks}.md (открытый MIT)." }
    ],
    quiz: [
      {
        question: "Сколько фаз в Kiro Spec Mode?",
        options: ["2 (Spec + Code)", "3 (Requirements → Design → Tasks)", "6 (как в Spec Kit)", "Не структурирован"],
        correct: 1,
        explanation: "Kiro: жёсткий 3-фазный pipeline. Requirements (EARS) → Design (архитектура) → Tasks (исполнители). Constitution встроен в steering docs."
      },
      {
        question: "Что такое Kiro steering docs?",
        options: [
          "Документация Kiro IDE",
          "Постоянный контекст проекта в .kiro/steering/ — аналог constitution.md, автоматически инжектируется в каждый AI-вызов",
          "Тестовые сценарии",
          "Лог-файлы IDE"
        ],
        correct: 1,
        explanation: "Steering docs: product.md, tech.md, structure.md (плюс кастомные файлы). Это immutable context, всегда передаваемый AI."
      },
      {
        question: "Когда event-driven hook на PostFileSave полезен?",
        options: [
          "Никогда",
          "Автоматически проверять spec drift при каждом сохранении изменённого файла, до коммита",
          "Только для тестов",
          "Только для CI"
        ],
        correct: 1,
        explanation: "Hook на PostFileSave ловит изменения раньше, чем они доходят до CI. Drift детектируется на этапе работы в IDE, а не на PR."
      },
      {
        question: "Главный минус Kiro для open-source проектов:",
        options: [
          "Дорогой",
          "Vendor lock-in: spec-формат — Kiro-specific, портирование требует переписывания",
          "Не работает в Linux",
          "Не поддерживает Python"
        ],
        correct: 1,
        explanation: "Kiro spec формат закрытый. Команда, использующая Kiro, привязана к AWS-экосистеме. Open-source проекты обычно выбирают Spec Kit (MIT)."
      },
      {
        question: "Для какого сценария Kiro подходит ЛУЧШЕ всего?",
        options: [
          "Brownfield 15-летнего legacy",
          "Greenfield-микросервис на AWS Bedrock с нуля",
          "Open-source библиотеки",
          "Мульти-облачный проект"
        ],
        correct: 1,
        explanation: "Kiro оптимален для greenfield на AWS: жёсткий 3-фазный pipeline + Bedrock интеграция + IDE-native опыт работают идеально для нового проекта."
      }
    ],
    sources: [
      { title: "AWS Kiro (официальный сайт)", url: "https://kiro.dev/", icon: "🔗" },
      { title: "Kiro Specs Documentation", url: "https://kiro.dev/docs/specs/", icon: "📚" },
      { title: "6 Best SDD Tools for AI Coding 2026 (Augment Code)", url: "https://www.augmentcode.com/tools/best-spec-driven-development-tools", icon: "📄" }
    ]
  },
  {
    id: 10,
    title: "От vibe coding к agentic engineering",
    goal: "Понять, как роли инженеров меняются на пути от vibe coding к agentic engineering и почему SDD — необходимое звено.",
    objectives: [
      "Различать vibe coding, AI-assisted, agentic engineering",
      "Знать какие практики устаревают, а какие — становятся ключевыми",
      "Применять SDD как мост к agentic engineering"
    ],
    content: `
      <h4>Эволюция AI-разработки (2023→2026)</h4>
      <p>За 3 года индустрия прошла через несколько поколений практик. SDD — пятая стадия зрелости.</p>

      <div class="metric-card">
        <h5>2023: Copilot-as-autocomplete</h5>
        <p>GitHub Copilot заполняет следующую строку. Человек = архитектор + кодер + ревьюер. Spec — в голове.</p>
      </div>

      <div class="metric-card">
        <h5>2024: Chat-driven coding</h5>
        <p>ChatGPT, Cursor: разработчик описывает фичу в чате, копирует код в IDE. Spec — в чат-истории.</p>
      </div>

      <div class="metric-card">
        <h5>Начало 2025: Vibe coding</h5>
        <p>Andrej Karpathy (февраль 2025): "vibe coding" — короткие промпты, AI пишет всё. Подходит для прототипов. METR: -19% продуктивности на complex tasks.</p>
      </div>

      <div class="metric-card">
        <h5>Середина 2025: Agentic coding</h5>
        <p>Claude Code, Aider, Cursor Agent: автономные циклы edit-run-debug. AI ставит задачу, запускает тесты, исправляет ошибки. Без spec — циклы могут блуждать.</p>
      </div>

      <div class="metric-card">
        <h5>2026: Agentic engineering + SDD</h5>
        <p>SDD выступает <strong>контрактом</strong> для agentic loop. Spec = oracle для агента. Drift detection = stop condition. Это и есть Agentic Engineering.</p>
      </div>

      <h4>Роль инженера: от писателя кода до писателя контрактов</h4>
      <table style="width:100%; border-collapse: collapse; margin: 1em 0;">
        <tr style="border-bottom: 2px solid #444;">
          <th style="padding: 8px; text-align: left;">Стадия</th>
          <th style="padding: 8px; text-align: left;">Человек делает</th>
          <th style="padding: 8px; text-align: left;">AI делает</th>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;">Vibe coding</td>
          <td style="padding: 8px;">Короткий промпт</td>
          <td style="padding: 8px;">Весь код, часто с багами</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;">Agentic (без spec)</td>
          <td style="padding: 8px;">Задача в чате</td>
          <td style="padding: 8px;">Автономный edit-run-debug, может блуждать</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;"><strong>Agentic engineering (SDD)</strong></td>
          <td style="padding: 8px;"><strong>Spec, plan, верификация, ревью</strong></td>
          <td style="padding: 8px;"><strong>Реализация спецификации</strong></td>
        </tr>
      </table>

      <h4>Что устаревает</h4>
      <ul>
        <li><strong>Длинные ad-hoc промпты</strong> — заменяются структурированными spec</li>
        <li><strong>Spec в голове</strong> — теперь spec в .specify/, версионируется в git</li>
        <li><strong>Code review без spec-context</strong> — ревьюер сравнивает с spec, а не угадывает intent</li>
        <li><strong>"AI всегда прав"</strong> — anti-pattern; spec — oracle, AI — исполнитель</li>
        <li><strong>Test coverage = % строк</strong> — заменяется spec compliance (% покрытых acceptance criteria)</li>
      </ul>

      <h4>Что становится ключевым</h4>
      <ul>
        <li><strong>Письмо спецификаций</strong> — главный навык 2026</li>
        <li><strong>Clarifying questions</strong> — умение задавать правильные вопросы</li>
        <li><strong>Архитектурное мышление</strong> — AI пишет код, человек проектирует</li>
        <li><strong>Verification design</strong> — golden datasets, spec compliance gates</li>
        <li><strong>Context engineering</strong> — что в constitution, что в spec, что в plan</li>
      </ul>

      <h4>Антипаттерн: agentic без SDD</h4>
      <p>Agentic coding без spec — это <strong>random walk в пространстве решений</strong>. Агент запускает тесты, исправляет, запускает снова. Без spec нет stop condition: «когда задача завершена?» — неопределено. Spec даёт:</p>
      <ul>
        <li>Чёткие acceptance criteria → stop condition</li>
        <li>Drift detection → safety net</li>
        <li>Verification → доверие к результату</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда из 4 senior engineers попробовала «чистый agentic mode» без spec — Claude Code запускал task loops до тех пор, пока тесты не зеленели. За 2 недели — 6 PR, 3 откатили из прода: тесты были зелёные, но spec в голове ревьюера расходился с реализацией. После добавления .specify/ + spec-compliance gate — 0 откатов за следующий квартал.
      </div>
    `,
    flashcards: [
      { front: "5 стадий эволюции AI-разработки", back: "1) Copilot-autocomplete (2023). 2) Chat-driven (2024). 3) Vibe coding (начало 2025). 4) Agentic coding (середина 2025). 5) Agentic engineering = agentic + SDD (2026)." },
      { front: "Vibe coding — кто ввёл термин", back: "Andrej Karpathy, февраль 2025. Короткие промпты, AI пишет всё. Подходит для прототипов, но METR показал -19% продуктивности на complex tasks." },
      { front: "Agentic engineering — определение", back: "Agentic coding + SDD. AI работает в автономном цикле edit-run-debug, но spec выступает oracle и stop condition. Без spec agentic = random walk." },
      { front: "Главный навык 2026", back: "Письмо спецификаций. Человек больше не пишет код — он пишет контракт, который компилируется в код. Cмежные навыки: clarifying questions, architecture, verification design." },
      { front: "Что устаревает в 2026", back: "Длинные ad-hoc промпты, spec в голове, code review без spec-context, 'AI всегда прав', test coverage по строкам кода — всё заменяется на spec-driven альтернативы." },
      { front: "Stop condition для agentic loop", back: "Spec acceptance criteria. Без spec неясно, 'когда задача завершена'. Тесты зеленеют — но это не значит, что реализован правильный intent." },
      { front: "Spec как oracle", back: "В agentic engineering spec выступает oracle — источником истины. AI генерирует код, проверяет против spec, генерирует снова. Drift detection — safety net." }
    ],
    quiz: [
      {
        question: "Кто ввёл термин 'vibe coding' и когда?",
        options: [
          "Anthropic, 2024",
          "Andrej Karpathy, февраль 2025",
          "GitHub, 2023",
          "AWS, 2026"
        ],
        correct: 1,
        explanation: "Karpathy в феврале 2025 описал стиль 'vibe coding' — интуитивный, через короткие промпты. Подходит для прототипов, но не масштабируется."
      },
      {
        question: "В чём ключевое отличие agentic engineering от agentic coding?",
        options: [
          "Скорость",
          "Agentic engineering = agentic + SDD: spec выступает oracle и stop condition, а не просто запуск task loop",
          "Используется другой AI",
          "Они идентичны"
        ],
        correct: 1,
        explanation: "Без spec agentic loop = random walk: тесты зеленеют, но intent может расходиться. SDD добавляет contract и verification."
      },
      {
        question: "Что значит 'AI всегда прав' в SDD-контексте?",
        options: [
          "Это правильный подход",
          "Антипаттерн: spec — oracle, AI — исполнитель. Если AI расходится с spec, виноват AI или spec, но не всегда AI прав",
          "Утверждение Anthropic",
          "Часть Spec Kit"
        ],
        correct: 1,
        explanation: "'AI всегда прав' — антипаттерн. SDD утверждает обратное: spec = источник истины, AI генерирует код для исполнения spec. Drift → проблема в коде, не в spec."
      },
      {
        question: "Что заменяет 'test coverage по строкам кода' в SDD?",
        options: [
          "Spec compliance — % покрытых acceptance criteria",
          "Просто более жёсткий line coverage",
          "Mutation testing",
          "Ничего не меняется"
        ],
        correct: 0,
        explanation: "В SDD coverage измеряется не строками кода, а покрытием spec'а: сколько acceptance criteria из spec реально проверяются тестами."
      },
      {
        question: "Что является stop condition для agentic loop в SDD?",
        options: [
          "Зелёные тесты",
          "Acceptance criteria из spec покрыты — это spec compliance gate",
          "Timeout",
          "Усталость разработчика"
        ],
        correct: 1,
        explanation: "Зелёные тесты ≠ задача выполнена. SDD: stop condition = все acceptance criteria из spec реализованы и верифицированы. Drift detection = safety net."
      }
    ],
    sources: [
      { title: "Andrej Karpathy on Vibe Coding (X)", url: "https://x.com/karpathy/status/1886192184808149383", icon: "🔗" },
      { title: "From Vibe Coding to Spec-Driven Development (Towards Data Science)", url: "https://towardsdatascience.com/from-vibe-coding-to-spec-driven-development/", icon: "📄" },
      { title: "The Productivity-Reliability Paradox (arXiv)", url: "https://arxiv.org/html/2605.01160v1", icon: "📄" }
    ]
  },
  {
    id: 11,
    title: "MCP для спецификаций",
    goal: "Использовать Model Context Protocol для того, чтобы спецификации становились live-контекстом для любого AI-агента.",
    objectives: [
      "Понимать роль MCP в SDD",
      "Настраивать MCP-сервер для .specify/",
      "Использовать spec-as-context в разных AI-агентах"
    ],
    content: `
      <h4>Что такое MCP</h4>
      <p>Model Context Protocol — открытый протокол, опубликованный Anthropic в ноябре 2024, для подключения LLM к внешним источникам контекста. К 2026 — стандарт de-facto: поддерживается Claude Desktop, Claude Code, Cursor, GitHub Copilot, Aider, OpenAI API.</p>

      <div class="key-concept">
        <strong>MCP в SDD:</strong> вместо того чтобы инжектировать spec в каждый промпт, AI обращается к MCP-серверу как к live-источнику. Spec обновился — следующий запрос видит новую версию. Drift detection → MCP уведомляет агента.
      </div>

      <h4>Архитектура spec-MCP</h4>
      <pre><code>┌─────────────┐         ┌──────────────┐
│  AI Agent   │ ──MCP─► │ Spec Server  │
│ (Claude /   │ ◄──────│ (.specify/)  │
│  Cursor)    │         │              │
└─────────────┘         └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ filesystem,  │
                       │ git history, │
                       │ compliance   │
                       │ reports      │
                       └──────────────┘</code></pre>

      <h4>specify-mcp: как мог бы выглядеть MCP-сервер для Spec Kit</h4>
      <p>Далее — <strong>гипотетический пример</strong>: пакета specify-mcp не существует, но он иллюстрирует, как устроен MCP-сервер для спецификаций (такой сервер несложно написать самим).</p>
      <pre><code># Запуск сервера на проекте
specify-mcp serve --project .

# Подключение в Claude Desktop:
# В claude_desktop_config.json:
{
  "mcpServers": {
    "spec-kit": {
      "command": "specify-mcp",
      "args": ["serve", "--project", "/path/to/project"]
    }
  }
}</code></pre>

      <h4>Resources, отдаваемые MCP-сервером</h4>
      <ul>
        <li><code>spec://constitution</code> — содержимое constitution.md</li>
        <li><code>spec://features/&lt;name&gt;</code> — все артефакты фичи</li>
        <li><code>spec://compliance/&lt;feature&gt;</code> — последние compliance-отчёты</li>
        <li><code>spec://drift</code> — current drift report</li>
        <li><code>spec://golden/&lt;feature&gt;</code> — эталонные сценарии</li>
      </ul>

      <h4>Tools, экспонируемые сервером</h4>
      <ul>
        <li><code>verify_compliance(feature)</code> — запустить spec-compliance check</li>
        <li><code>run_golden_test(feature)</code> — прогнать golden dataset</li>
        <li><code>detect_drift()</code> — drift detection</li>
        <li><code>propose_spec_change(feature, diff)</code> — предложить изменение spec</li>
        <li><code>list_acceptance_criteria(feature)</code> — извлечь все EARS-утверждения</li>
      </ul>

      <h4>Пример: agent с spec-MCP</h4>
      <pre><code># Claude Code с подключённым specify-mcp

User: Реализуй фичу payment-retry
Claude: [читает spec://features/payment-retry]
        Спецификация говорит:
        - WHEN payment fails THE system SHALL retry up to 3 times
        - WAIT exponential backoff (1s, 2s, 4s)
        - IF all 3 retries fail THEN log error and notify

        Реализую RetryService...
        [генерирует код]

        [вызывает verify_compliance('payment-retry')]
        Compliance: 100% (3/3 EARS покрыты)

        [вызывает run_golden_test('payment-retry')]
        Golden: 8/8 сценариев PASS</code></pre>

      <h4>Spec-MCP vs spec-в-промпте</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr style="border-bottom: 2px solid #444;">
          <th style="padding: 8px;">Аспект</th>
          <th style="padding: 8px;">Spec в промпте</th>
          <th style="padding: 8px;">Spec через MCP</th>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;">Размер контекста</td>
          <td style="padding: 8px;">Весь spec → токены</td>
          <td style="padding: 8px;">Lazy fetch только нужного</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;">Обновления</td>
          <td style="padding: 8px;">Нужно вручную копировать</td>
          <td style="padding: 8px;">Автоматически live</td>
        </tr>
        <tr style="border-bottom: 1px solid #333;">
          <td style="padding: 8px;">Compliance check</td>
          <td style="padding: 8px;">Отдельный CI job</td>
          <td style="padding: 8px;">Tool, AI вызывает сам</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Drift awareness</td>
          <td style="padding: 8px;">Нет</td>
          <td style="padding: 8px;">AI получает уведомление</td>
        </tr>
      </table>

      <h4>Безопасность MCP-сервера</h4>
      <p>Spec может содержать чувствительные данные (имена клиентов, бизнес-логика). Best practices:</p>
      <ul>
        <li>Запуск только локально (stdio transport) или через защищённый TLS</li>
        <li>Read-only resources по умолчанию; write tools требуют explicit grant</li>
        <li>Audit log всех tool calls</li>
        <li>Никаких credentials внутри spec-файлов (используйте {{env.SECRET}} placeholders)</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда внедрила собственный spec-MCP-сервер (по образцу specify-mcp из примера выше) вместо инжекции spec в каждый промпт. Token cost снизился на 67% (агент берёт только нужные секции spec). Качество не упало — spec compliance 96% (было 94% при копировании всего spec в промпт). Бонус: при изменении spec последующие задачи автоматически видят новую версию.
      </div>
    `,
    flashcards: [
      { front: "MCP — что это и кто создал", back: "Model Context Protocol — открытый протокол от Anthropic (ноябрь 2024) для подключения LLM к внешним источникам контекста. К 2026 — стандарт de-facto." },
      { front: "Зачем MCP в SDD", back: "Spec становится live-контекстом для AI. Вместо инжекции всего spec в промпт — AI делает lazy fetch только нужных секций. Обновления spec видны автоматически." },
      { front: "specify-mcp (гипотетический пример) — что отдаёт", back: "Resources: spec://constitution, spec://features/<name>, spec://compliance/<feature>, spec://drift, spec://golden/<feature>. Каждый ресурс — markdown или JSON. Не существующий пакет, а иллюстрация дизайна spec-MCP-сервера." },
      { front: "specify-mcp (гипотетический пример) — какие tools", back: "verify_compliance(), run_golden_test(), detect_drift(), propose_spec_change(), list_acceptance_criteria(). AI вызывает их в процессе работы." },
      { front: "Главное преимущество spec через MCP vs в промпте", back: "Token cost ниже (lazy fetch), обновления видны автоматически (live), compliance check доступен как tool, drift detection встроен." },
      { front: "Безопасность MCP-сервера", back: "Read-only по умолчанию, write tools требуют grant, stdio/TLS transport, audit log, никаких credentials в spec (используйте env placeholders)." },
      { front: "Поддержка MCP в AI-агентах", back: "К 2026: Claude Desktop, Claude Code, Cursor, GitHub Copilot, Aider, OpenAI API. Подключение через config (claude_desktop_config.json или эквивалент)." }
    ],
    quiz: [
      {
        question: "Кто опубликовал MCP и когда?",
        options: [
          "OpenAI, 2023",
          "Anthropic, ноябрь 2024",
          "GitHub, 2025",
          "Microsoft, 2024"
        ],
        correct: 1,
        explanation: "Model Context Protocol опубликован Anthropic в ноябре 2024 как открытый стандарт. К 2026 — стандарт de-facto для подключения LLM к внешним источникам."
      },
      {
        question: "В чём главное преимущество spec-MCP над инжекцией spec в промпт?",
        options: [
          "Дешевле",
          "Lazy fetch (только нужные секции), live updates, compliance/drift как tools",
          "Быстрее",
          "Безопаснее"
        ],
        correct: 1,
        explanation: "Token cost ниже (lazy fetch), spec обновляется автоматически (live), AI вызывает verify_compliance() как tool. Это качественно другой режим работы."
      },
      {
        question: "Какой resource отдаёт spec-MCP-сервер (пример specify-mcp) для отчёта о drift?",
        options: [
          "spec://drift",
          "spec://compliance",
          "spec://golden",
          "spec://features"
        ],
        correct: 0,
        explanation: "spec://drift — current drift report. AI может прочитать его и предложить spec-update или код-rollback."
      },
      {
        question: "Какой tool позволяет AI запросить полный список acceptance criteria?",
        options: [
          "verify_compliance()",
          "list_acceptance_criteria(feature)",
          "run_golden_test()",
          "detect_drift()"
        ],
        correct: 1,
        explanation: "list_acceptance_criteria(feature) возвращает все EARS-утверждения из spec фичи. AI использует это для генерации тестов и проверки coverage."
      },
      {
        question: "Какая практика безопасности правильная для MCP-сервера со спецификациями?",
        options: [
          "Никаких ограничений — публичный HTTP без auth",
          "Read-only по умолчанию, write tools требуют grant, stdio/TLS transport, audit log, env-placeholders для секретов",
          "Все credentials в spec для удобства",
          "Запретить любой MCP"
        ],
        correct: 1,
        explanation: "Spec может содержать чувствительные данные. Best practices: read-only по умолчанию, аудит вызовов, секреты только через env placeholders, защищённый transport."
      }
    ],
    sources: [
      { title: "Model Context Protocol (Anthropic)", url: "https://www.anthropic.com/news/model-context-protocol", icon: "🔗" },
      { title: "MCP Specification", url: "https://modelcontextprotocol.io/", icon: "📚" },
      { title: "MCP-Compatible Tools (2026)", url: "https://modelcontextprotocol.io/clients", icon: "📄" }
    ]
  },
  {
    id: 12,
    title: "LLM-as-judge и мутационное тестирование спецификаций",
    goal: "Применять продвинутые техники для проверки качества самих спецификаций — не только кода, но и контракта.",
    objectives: [
      "Использовать LLM-as-judge для оценки полноты spec",
      "Проводить мутационное тестирование спецификаций",
      "Калибровать judge через Cohen's kappa"
    ],
    content: `
      <h4>Проблема: кто проверяет проверяющего?</h4>
      <p>SDD гарантирует, что код соответствует spec. Но что, если spec неполный или противоречивый? Нужна верификация самой спецификации.</p>

      <div class="key-concept">
        <strong>Два метода проверки spec:</strong>
        <br>1. <strong>LLM-as-judge</strong> — другая LLM оценивает spec по rubric.
        <br>2. <strong>Mutation testing</strong> — намеренно ломаем spec и смотрим, ловят ли это тесты.
      </div>

      <h4>LLM-as-judge для специфики</h4>
      <p>Принципы:</p>
      <ul>
        <li>Judge — другая модель (или та же с другим промптом), оценивающая spec по rubric</li>
        <li>Rubric: completeness, consistency, testability, ambiguity</li>
        <li>Каждый критерий — score 1-5 + обоснование</li>
        <li>Используется как gate в CI: spec ниже threshold — блокировка</li>
      </ul>

      <pre><code># spec-judge prompt template
You are evaluating a software specification.
Score each criterion 1-5:

1. COMPLETENESS: Are all acceptance criteria specified?
   - Edge cases, empty states, error handling
2. CONSISTENCY: Are there contradicting statements?
3. TESTABILITY: Can each statement be verified
   by an automated test?
4. AMBIGUITY: Are there terms that could be
   interpreted differently?
5. EARS COMPLIANCE: Does each requirement follow
   one of 5 EARS patterns?

For each, provide:
- Score (1-5)
- Specific examples (good or bad)
- Recommended fixes

Output JSON.</code></pre>

      <h4>Калибровка judge через Cohen's kappa</h4>
      <p>LLM-as-judge ненадёжен без калибровки. Метод:</p>
      <ol>
        <li>Возьмите 30-50 эталонных spec, оцените их экспертами (gold labels)</li>
        <li>Запустите LLM-as-judge на тех же spec</li>
        <li>Вычислите Cohen's kappa между human и LLM оценками</li>
        <li><strong>κ &gt; 0.8</strong> — judge можно использовать в проде</li>
        <li><strong>κ 0.6-0.8</strong> — judge как сигнал, не gate</li>
        <li><strong>κ &lt; 0.6</strong> — judge не годится, нужен другой prompt/model</li>
      </ol>

      <h4>Mutation Testing спецификаций</h4>
      <p>Идея: внести ошибки в spec и проверить, ловят ли это тесты или drift detector.</p>

      <div class="metric-card">
        <h5>Стандартные мутации</h5>
        <ul>
          <li><strong>Drop requirement:</strong> удалить случайное EARS-утверждение</li>
          <li><strong>Negate:</strong> заменить SHALL на SHALL NOT</li>
          <li><strong>Swap operator:</strong> заменить &gt; на &gt;= в boundary conditions</li>
          <li><strong>Change threshold:</strong> заменить 3 на 4 в "3 неудачных попыток"</li>
          <li><strong>Remove edge case:</strong> убрать handling for empty input</li>
        </ul>
      </div>

      <h4>Mutation score</h4>
      <pre><code># Запуск мутационного теста
# (specify-mutation — гипотетический инструмент, см. урок 8)
specify-mutation run \\
  --spec specs/001-auth/spec.md \\
  --mutators drop,negate,swap,threshold \\
  --tests tests/auth/

# Вывод:
# Total mutants: 47
# Killed (caught by tests): 38
# Survived (not caught): 9
# Mutation score: 81%
#
# Survived mutants suggest weak tests:
# - Drop "Rate limit applies" — no test failed
# - Negate "Token expiry 15 min" — no test failed
#
# Recommendation: add tests for rate limit
# and token expiry.</code></pre>

      <p><strong>Mutation score &lt; 80%</strong> — слабый test suite, не покрывает spec. <strong>&gt; 90%</strong> — production-ready.</p>

      <h4>Комбинация: judge + mutation</h4>
      <ul>
        <li><strong>Judge</strong> ловит проблемы в самой spec (ambiguity, incompleteness)</li>
        <li><strong>Mutation</strong> ловит слабость test suite относительно spec</li>
        <li>Вместе: spec и tests взаимно проверяют друг друга</li>
      </ul>

      <h4>Workflow в CI</h4>
      <pre><code>spec changed →
  ├── LLM-as-judge (calibrated, kappa > 0.8)
  │   → score < 4.0 → block PR
  ├── Mutation testing
  │   → score < 80% → flag weak tests
  ├── Standard SDD compliance
  └── Golden dataset regression</code></pre>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Команда применила LLM-as-judge + mutation testing к spec модуля payments. Judge нашёл 14 ambiguous statements (пример: «system processes payment quickly» — quickly = ?). Mutation testing показал 71% score: tests не покрывали edge cases для multi-currency. После исправлений: judge score 4.7/5, mutation 93%. За следующий квартал — 0 production-инцидентов в payments.
      </div>
    `,
    flashcards: [
      { front: "Зачем проверять spec, а не только код", back: "Spec может быть неполным, противоречивым или неоднозначным. Без верификации самой spec SDD-гарантии не работают: код будет соответствовать плохому контракту." },
      { front: "LLM-as-judge для spec — критерии", back: "Completeness (все ли acceptance criteria), Consistency (нет противоречий), Testability (каждое утверждение проверяемо), Ambiguity (нет двусмысленностей), EARS compliance." },
      { front: "Cohen's kappa", back: "Метрика согласия между двумя оценщиками. Калибровка judge: на 30-50 эталонных spec сравниваем human vs LLM. κ > 0.8 — judge можно ставить gate. κ < 0.6 — judge не годится." },
      { front: "Mutation testing spec — идея", back: "Внести ошибки в spec (drop requirement, negate SHALL, swap operator, change threshold) и проверить, ловят ли это тесты. Если ошибка не поймана — слабый test suite." },
      { front: "Mutation score thresholds", back: "< 80% — слабый test suite. 80-90% — приемлемо. > 90% — production-ready. Score = killed mutants / total mutants. Survived mutants указывают на пробелы в тестах." },
      { front: "5 стандартных мутаций", back: "Drop requirement, Negate (SHALL → SHALL NOT), Swap operator (> → >=), Change threshold (3 → 4), Remove edge case. Каждая мутация = один тестируемый сценарий пробела." },
      { front: "Judge + mutation = взаимная проверка", back: "Judge ловит слабую spec, mutation ловит слабые tests. Вместе spec и tests проверяют друг друга. Это полная защита от 'spec theater' и 'test theater'." }
    ],
    quiz: [
      {
        question: "Зачем нужна верификация самой спецификации, а не только кода?",
        options: [
          "Не нужна — spec всегда правильный",
          "Spec может быть неполным/противоречивым/неоднозначным; без проверки SDD-гарантии не работают",
          "Это требование ISO",
          "Чтобы продать SDD заказчику"
        ],
        correct: 1,
        explanation: "Если spec плохой, код будет соответствовать плохому контракту. Spec → код = garbage in, garbage out. Verification spec'а — критическая часть SDD."
      },
      {
        question: "Какой Cohen's kappa нужен, чтобы использовать LLM-as-judge как production gate?",
        options: [
          "κ > 0.3",
          "κ > 0.8 — высокое согласие с экспертами",
          "κ > 0.5",
          "Любой"
        ],
        correct: 1,
        explanation: "κ > 0.8 — high agreement, judge можно ставить gate. κ 0.6-0.8 — moderate, judge как сигнал. κ < 0.6 — judge ненадёжен."
      },
      {
        question: "Что такое 'survived mutant' в mutation testing?",
        options: [
          "Тест, который прошёл",
          "Намеренная ошибка в spec, которую тесты НЕ поймали — указывает на слабое тестовое покрытие этого аспекта",
          "Bug в production",
          "Новая фича"
        ],
        correct: 1,
        explanation: "Survived mutant = тесты не заметили ошибку в spec. Это сигнал: добавьте тесты на этот сценарий. Mutation score = killed / total."
      },
      {
        question: "Какой mutation score считается production-ready?",
        options: [
          "< 50%",
          "> 90%",
          "Не важно",
          "Ровно 75%"
        ],
        correct: 1,
        explanation: "< 80% — слабый test suite. 80-90% — приемлемо. > 90% — production-ready: тесты ловят почти все нарушения spec."
      },
      {
        question: "Что даёт комбинация LLM-as-judge + mutation testing?",
        options: [
          "Только дополнительная цена",
          "Spec и tests взаимно проверяют друг друга: judge ловит слабую spec, mutation ловит слабые tests",
          "Они дублируют друг друга",
          "Это устаревшие практики"
        ],
        correct: 1,
        explanation: "Judge ловит проблемы в самой spec (ambiguity, incompleteness). Mutation ловит слабость tests относительно spec. Вместе — защита от 'spec theater' и 'test theater'."
      }
    ],
    sources: [
      { title: "LLM-as-a-Judge: A Guide (Hugging Face)", url: "https://huggingface.co/blog/llm-as-a-judge", icon: "📄" },
      { title: "Mutation Testing for Specifications (ACM)", url: "https://dl.acm.org/doi/10.1145/3597926.3598051", icon: "📄" },
      { title: "Cohen's Kappa Explained", url: "https://en.wikipedia.org/wiki/Cohen%27s_kappa", icon: "📚" }
    ]
  },
  {
    id: 13,
    title: "SDD vs формальные методы и Design-by-Contract",
    goal: "Понять место SDD в ландшафте проверяемых методологий и когда нужны формальные методы поверх SDD.",
    objectives: [
      "Различать SDD, Design-by-Contract и формальные методы",
      "Знать, когда нужна формальная верификация",
      "Применять DafnyPro и аналоги поверх SDD"
    ],
    content: `
      <h4>Спектр проверяемости</h4>
      <p>Методологии можно расположить по силе гарантий:</p>

      <div class="key-concept">
        <strong>От слабых к сильным гарантиям:</strong>
        <br>1. <strong>Vibe coding</strong> — нет гарантий
        <br>2. <strong>SDD</strong> — соответствие spec проверяется тестами (вероятностная гарантия)
        <br>3. <strong>Design-by-Contract (DbC)</strong> — runtime-проверка pre/postconditions
        <br>4. <strong>Property-based testing</strong> — рандомизированная проверка инвариантов
        <br>5. <strong>Формальная верификация</strong> — математическое доказательство (Dafny, TLA+, Coq)
      </div>

      <h4>Design-by-Contract (DbC)</h4>
      <p>Концепция Бертрана Майера (Eiffel, 1986). Контракт встроен в код:</p>
      <pre><code># Python с icontract
from icontract import require, ensure, invariant

@require(lambda amount: amount > 0)
@require(lambda account: account.balance >= amount)
@ensure(lambda result, account, amount:
        account.balance == \\__old__.account.balance - amount)
def withdraw(account, amount):
    account.balance -= amount
    return account.balance

# Если pre/postcondition нарушены — runtime exception</code></pre>

      <p><strong>SDD vs DbC:</strong> в SDD контракт — внешний (.specify/spec.md). В DbC — внутри кода. SDD: верификация в CI. DbC: верификация в runtime. Можно совмещать.</p>

      <h4>Property-based testing</h4>
      <p>Hypothesis (Python), QuickCheck (Haskell): генерируют рандомные входы и проверяют, выполняются ли инварианты:</p>
      <pre><code>from hypothesis import given, strategies as st

@given(amount=st.integers(min_value=1, max_value=1000000),
       balance=st.integers(min_value=0, max_value=10000000))
def test_withdraw_invariants(amount, balance):
    if balance < amount:
        return  # pre-condition fails, skip

    account = Account(balance=balance)
    withdraw(account, amount)

    # Invariant: balance уменьшилась ровно на amount
    assert account.balance == balance - amount
    # Invariant: balance не отрицательная
    assert account.balance >= 0</code></pre>

      <p>Hypothesis сгенерирует 100+ комбинаций и попробует найти контрпример. SDD-spec можно автоматически конвертировать в property-based tests (EARS → @given/assert).</p>

      <h4>Формальная верификация</h4>
      <p>Языки спецификаций с автоматическим доказательством:</p>
      <ul>
        <li><strong>Dafny</strong> (Microsoft Research) — императивный язык с verification annotations</li>
        <li><strong>TLA+</strong> (Leslie Lamport) — для распределённых систем</li>
        <li><strong>Coq, Lean</strong> — proof assistants, требуют ручных доказательств</li>
        <li><strong>F*</strong> — функциональный, используется в Project Everest (TLS)</li>
      </ul>

      <pre><code>// Dafny: математическое доказательство
method Withdraw(account: Account, amount: nat)
  requires amount <= account.balance
  ensures account.balance == old(account.balance) - amount
  ensures account.transactions.Count == old(account.transactions.Count) + 1
{
  account.balance := account.balance - amount;
  account.transactions := account.transactions + [new Transaction(amount)];
}
// Dafny проверяет: для ВСЕХ возможных входов,
// при выполнении preconditions, выполняются postconditions.
// Не sampling, а математическое доказательство.</code></pre>

      <h4>DafnyPro: LLM + формальная верификация</h4>
      <p>POPL 2026 paper: Claude Sonnet 3.5 + DafnyPro = 86% correct proofs на DafnyBench. Workflow:</p>
      <ol>
        <li>Программист пишет SDD-spec (EARS)</li>
        <li>DafnyPro конвертирует spec в Dafny annotations (requires/ensures)</li>
        <li>LLM генерирует код и proof hints</li>
        <li>Dafny verifier математически доказывает корректность</li>
        <li>Если proof fails — LLM итеративно дорабатывает</li>
      </ol>

      <h4>Когда нужны формальные методы поверх SDD</h4>
      <ul>
        <li><strong>Безопасность жизни:</strong> авиаэлектроника, медицинские устройства, ядерные системы</li>
        <li><strong>Криптография:</strong> TLS-реализации, кошельки</li>
        <li><strong>Финансы:</strong> расчёт процентов, multi-currency conversions</li>
        <li><strong>Распределённые алгоритмы:</strong> consensus, leader election (TLA+)</li>
        <li><strong>Smart contracts:</strong> Solidity → Move, Sui Move формально верифицируются</li>
      </ul>

      <h4>Когда формальные методы — overkill</h4>
      <ul>
        <li>CRUD-приложения с базовой бизнес-логикой</li>
        <li>Web UI</li>
        <li>Marketing landing pages</li>
        <li>Внутренние tools и scripts</li>
        <li>MVP / прототипы</li>
      </ul>

      <h4>Слоистая защита: SDD → DbC → Property → Formal</h4>
      <p>Реальные продакшн-системы 2026 используют слоистый подход:</p>
      <ol>
        <li><strong>SDD-spec</strong> (для AI-генерации и compliance check) — обязательно</li>
        <li><strong>DbC assertions</strong> (для runtime safety) — для критических компонентов</li>
        <li><strong>Property-based tests</strong> (для генерации edge cases) — для бизнес-логики</li>
        <li><strong>Formal verification</strong> (для математического доказательства) — для критических инвариантов</li>
      </ol>

      <div class="key-concept">
        <strong>Мини-кейс:</strong> Финтех-команда строила payment engine. Слой 1: SDD-spec для всех endpoints. Слой 2: icontract (DbC) для денежных операций — runtime assertions, что balance не уходит в минус. Слой 3: Hypothesis property tests для multi-currency conversions. Слой 4: Dafny для core transfer algorithm. За год — 0 critical bugs, в отличие от предыдущей системы (12 critical bugs за год без слоёв).
      </div>
    `,
    flashcards: [
      { front: "Спектр проверяемости (5 уровней)", back: "1) Vibe coding (нет гарантий). 2) SDD (тесты). 3) DbC (runtime pre/post). 4) Property-based (рандомизированные инварианты). 5) Formal verification (мат. доказательство)." },
      { front: "SDD vs DbC", back: "SDD: контракт внешний (.specify/), verification в CI. DbC: контракт внутри кода (@require/@ensure), verification в runtime. Можно совмещать: SDD для AI-генерации, DbC для runtime safety." },
      { front: "Property-based testing", back: "Hypothesis (Python), QuickCheck (Haskell): генерируют рандомные входы и проверяют инварианты. EARS-spec можно автоматически конвертировать в property tests." },
      { front: "Dafny — что это", back: "Императивный язык от Microsoft Research с verification annotations (requires/ensures). Доказывает корректность математически, для всех возможных входов, а не sampling." },
      { front: "DafnyPro — результат", back: "POPL 2026: Claude Sonnet 3.5 + DafnyPro = 86% correct proofs на DafnyBench. LLM генерирует код и proof hints, Dafny верифицирует. Итеративный workflow при provability failure." },
      { front: "Когда нужны формальные методы", back: "Safety-critical (авиа, медицина), криптография, распределённые алгоритмы (TLA+), smart contracts (Move). Overkill для: CRUD, UI, MVP, marketing." },
      { front: "Слоистая защита 2026", back: "SDD-spec (обязательно для AI) → DbC (runtime safety критических компонентов) → Property tests (edge cases) → Formal verification (математические инварианты). Каждый слой по необходимости." }
    ],
    quiz: [
      {
        question: "В чём ключевое различие SDD и Design-by-Contract (DbC)?",
        options: [
          "Они идентичны",
          "SDD: контракт внешний (.specify/), CI verification. DbC: контракт внутри кода, runtime verification",
          "DbC устарел",
          "SDD не работает с DbC"
        ],
        correct: 1,
        explanation: "SDD: контракт в .specify/spec.md, проверка в CI. DbC (Eiffel, icontract): @require/@ensure в коде, проверка в runtime. Можно использовать одновременно."
      },
      {
        question: "Что даёт property-based testing по сравнению с обычными unit-тестами?",
        options: [
          "Ничего нового",
          "Генерирует рандомные входы и ищет контрпример для инварианта — может найти edge cases, не учтённые автором тестов",
          "Работает быстрее",
          "Не требует кода"
        ],
        correct: 1,
        explanation: "Hypothesis / QuickCheck: 100+ рандомных входов, минимизация контрпримера. EARS-spec → property tests = автоматизированный edge-case mining."
      },
      {
        question: "Что доказывает Dafny?",
        options: [
          "Что код запускается без exceptions",
          "Для ВСЕХ возможных входов, удовлетворяющих preconditions, выполняются postconditions — математическое доказательство",
          "Только тесты проходят",
          "Только что код компилируется"
        ],
        correct: 1,
        explanation: "Dafny — формальная верификация: математически доказывает корректность для всех возможных входов, не sampling. Использует SMT solvers (Z3)."
      },
      {
        question: "Когда формальная верификация — overkill?",
        options: [
          "Авиаэлектроника",
          "CRUD-приложение, UI, MVP, marketing — высокий cost формальных методов не оправдан для не-критичных систем",
          "Криптография",
          "Никогда"
        ],
        correct: 1,
        explanation: "Формальные методы требуют экспертизы и времени. Для CRUD/UI/MVP — overkill. Применяйте к safety-critical, криптографии, распределённым алгоритмам."
      },
      {
        question: "Что такое DafnyPro?",
        options: [
          "IDE для Dafny",
          "POPL 2026 работа: LLM (Claude Sonnet 3.5) + Dafny = 86% correct proofs на DafnyBench, через итеративный workflow",
          "Коммерческая версия Dafny",
          "Облачная Dafny"
        ],
        correct: 1,
        explanation: "DafnyPro: LLM генерирует Dafny код + proof hints, Dafny verifier пытается доказать. Если не получается — LLM итерирует. 86% correct proofs на DafnyBench."
      }
    ],
    sources: [
      { title: "Design-by-Contract (Bertrand Meyer)", url: "https://en.wikipedia.org/wiki/Design_by_contract", icon: "📚" },
      { title: "Dafny Language (Microsoft Research)", url: "https://dafny.org/", icon: "🔗" },
      { title: "DafnyPro: LLM-Assisted Verification (POPL 2026)", url: "https://popl26.sigplan.org/details/dafny-2026-papers/12/DafnyPro-LLM-Assisted-Automated-Verification-for-Dafny-Programs", icon: "📄" },
      { title: "TLA+ (Leslie Lamport)", url: "https://lamport.azurewebsites.net/tla/tla.html", icon: "🔗" },
      { title: "Hypothesis (Property-based testing)", url: "https://hypothesis.readthedocs.io/", icon: "📚" }
    ]
  }
];

// ============================================================
// Final Review — 13 вопросов из всех уроков
// ============================================================
const finalQuiz = [
  { question: "Исследование METR показало, что разработчики с неструктурированными промптами:", options: ["Работали на 50% быстрее", "Работали на 19% медленнее из-за циклов отладки", "Не заметили разницы", "Получали лучший код"], correct: 1, explanation: "METR: неструктурированные промпты → циклы отладки съедают сэкономленное время → общее время +19%." },
  { question: "Phase 2 (Clarify) в SDD-цикле предназначена для:", options: ["Генерации кода", "Выявления edge cases, empty states и двусмысленностей ДО генерации кода", "Тестирования", "Деплоя"], correct: 1, explanation: "Clarify: структурированный проход по spec. Все ответы → в spec. Иначе AI угадывает и создаёт баги." },
  { question: "EARS-паттерн «IF condition THEN response» описывает:", options: ["Постоянное поведение", "Реакцию на нежелательное поведение (unwanted behavior)", "Опциональную фичу", "Event-driven поведение"], correct: 1, explanation: "Unwanted behavior: IF [3 failed logins in 60s] THEN [lock account for 15 min]. Реакция на ошибку." },
  { question: "Для brownfield проекта с 400K+ файлами лучший SDD-инструмент:", options: ["AWS Kiro", "Intent — Context Engine для семантического анализа", "GitHub Spec Kit", "Cursor"], correct: 1, explanation: "Intent Context Engine: 400K+ файлов через semantic dependency graph. Brownfield SDD начинается с понимания кодовой базы." },
  { question: "Spec Drift — это:", options: ["Обновление спецификации", "Постепенное расхождение spec и кода (quick fixes, AI hallucination, implicit changes)", "Удаление спецификации", "Рефакторинг кода"], correct: 1, explanation: "Spec drift: код отклоняется от spec. Причины: quick fixes, AI hallucination, implicit changes, knowledge loss." },
  { question: "Golden Dataset в контексте SDD:", options: ["Набор лучших практик", "Эталонные сценарии для regression testing спецификаций", "Архив старых спецификаций", "Список AI-моделей"], correct: 1, explanation: "Golden Dataset: эталонные примеры. При изменении spec → regression test. > 5% ухудшений = PR blocked." },
  { question: "Spec Theater — это:", options: ["Театр про SDD", "Spec написан, но не проверяется автоматически — бесполезная бюрократия", "Интересный UI для spec", "Формальный метод"], correct: 1, explanation: "Spec Theater: spec есть, верификации нет. Антидот: spec-compliance gate в CI с блокировкой merge." },
  { question: "Сколько фаз в Kiro Spec Mode?", options: ["2 (Spec + Code)", "3 (Requirements → Design → Tasks)", "6 (как в Spec Kit)", "Не структурирован"], correct: 1, explanation: "Kiro: 3-фазный pipeline Requirements (EARS) → Design (архитектура) → Tasks. Constitution встроен в steering docs." },
  { question: "Кто ввёл термин 'vibe coding' и когда?", options: ["Anthropic, 2024", "Andrej Karpathy, февраль 2025", "GitHub, 2023", "AWS, 2026"], correct: 1, explanation: "Karpathy в феврале 2025 описал стиль vibe coding — интуитивный, через короткие промпты. Подходит для прототипов, но не масштабируется." },
  { question: "Что такое MCP в контексте SDD?", options: ["Тип AI-модели", "Model Context Protocol — открытый протокол от Anthropic для подключения LLM к spec как live-контексту", "CI-инструмент", "База данных"], correct: 1, explanation: "MCP (Anthropic, ноябрь 2024) — открытый протокол. Spec-MCP-сервер (как гипотетический specify-mcp из урока 11) отдаёт .specify/ как live-контекст для AI вместо инжекции в промпт." },
  { question: "Какой Cohen's kappa нужен, чтобы использовать LLM-as-judge как production gate для spec?", options: ["κ > 0.3", "κ > 0.8 — высокое согласие с экспертами", "κ > 0.5", "Любой"], correct: 1, explanation: "κ > 0.8 — high agreement, judge можно ставить gate. κ 0.6-0.8 — moderate signal. κ < 0.6 — judge ненадёжен." },
  { question: "В чём ключевое различие SDD и Design-by-Contract (DbC)?", options: ["Они идентичны", "SDD: контракт внешний (.specify/), CI verification. DbC: контракт внутри кода (@require/@ensure), runtime verification", "DbC устарел", "SDD не работает с DbC"], correct: 1, explanation: "SDD: .specify/spec.md + CI. DbC (Eiffel, icontract): runtime pre/postconditions в коде. Можно использовать слоисто." },
  { question: "DafnyPro (POPL 2026) — это:", options: ["IDE для Python", "LLM + формальная верификация: 86% correct proofs на DafnyBench", "SDD-фреймворк", "Инструмент для CI/CD"], correct: 1, explanation: "DafnyPro: LLM генерирует verification annotations + proof hints, Dafny математически доказывает. 86% correct proofs на DafnyBench." }
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
  $("#btn-reset").addEventListener("click", resetProgress);
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
  state.currentLesson = courseData.length;
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

function resetProgress() {
  state.currentLesson = -1;
  state.completed.clear();
  state.quizAnswered = {};
  $("#welcome").classList.remove("hidden");
  $("#lesson-view").classList.add("hidden");
  $("#review-view").classList.add("hidden");
  buildSidebar();
  updateProgress();
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', init);
