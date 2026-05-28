// === Course Data ===
const COURSE = [
  {
    id: 1,
    title: "От автодополнения к мультиагентным системам",
    goal: "Понять эволюцию AI-ассистентов и роль субагентов в современной разработке",
    objectives: [
      "Различать 4 поколения AI-инструментов для разработки",
      "Объяснить, почему субагенты — это не просто дополнительные чаты",
      "Описать три ключевые функции субагентов: изоляция, специализация, гетерогенность",
      "Назвать основные CLI-агенты 2026 года и их позиционирование"
    ],
    body: `<h2>Эволюция AI-ассистентов: 4 поколения</h2>

<p>К 2026 году индустрия разработки прошла через четыре парадигмальных сдвига. Каждый из них менял не только инструменты, но и саму роль разработчика.</p>

<h3>Поколение 1: Автодополнение (2021-2023)</h3>
<p>Первая версия GitHub Copilot и оригинальный OpenAI Codex были инструментами <strong>автодополнения кода</strong>. Они не могли рассуждать, выполнять команды или взаимодействовать с файловыми системами. Разработчик оставался единственным агентом принятия решений.</p>

<h3>Поколение 2: Чат-ассистенты (2023-2024)</h3>
<p>ChatGPT, Claude и другие чат-интерфейсы позволили вести диалог с моделью. Появились IDE-плагины (Copilot Chat, Cursor), но взаимодействие оставалось <strong>линейным</strong> — один вопрос, один ответ.</p>

<h3>Поколение 3: Автономные агенты (2024-2025)</h3>
<p>Claude Code, Cursor Agent Mode, Devin — агенты, способные читать кодовую базу, редактировать файлы и выполнять команды самостоятельно. Появился <strong>Plan Mode</strong> — декомпозиция задачи на шаги перед выполнением.</p>

<h3>Поколение 4: Мультиагентные системы (2025-2026)</h3>
<p>Субагенты и Agent Teams. Главный агент (оркестратор) разбивает задачи и делегирует их специализированным субагентам, работающим <strong>параллельно</strong>. Это зеркально отражает эволюцию от одноядерных к многоядерным процессорам.</p>

<div class="callout callout-tip">
  <div class="callout-title">💡 Ключевой инсайт</div>
  По данным Gartner, мультиагентные системы вошли в топ-10 стратегических трендов 2026 года. К концу 2026 года 40% корпоративных приложений будут включать специализированных агентов, по сравнению с менее чем 5% в 2025 году.
</div>

<h2>Зачем нужны субагенты?</h2>

<p>Субагенты — это не просто «дополнительные чаты». Это <strong>изолированные вычислительные сущности</strong>, решающие три фундаментальные проблемы:</p>

<h3>1. Защита контекстного окна</h3>
<p>Главный агент не засоряется логами рутинных задач (grep, линтинг, тесты). Каждый субагент получает чистый контекст и возвращает только финальные результаты.</p>

<h3>2. Специализация ролей</h3>
<p>Субагент может быть настроен как <code>SecurityAuditor</code>, <code>CodeReviewer</code> или <code>TestGenerator</code> с уникальными системными промптами и наборами инструментов.</p>

<h3>3. Гетерогенные модели</h3>
<p>Оркестратор на базе Qwen3-Coder может вызвать субагента на Claude Opus 4.7 для сложного рефакторинга, или на локальной Llama для генерации документации. Разные задачи — разные модели.</p>

<h2>Ландшафт CLI-агентов 2026</h2>

<table class="comparison-table">
  <tr><th>Инструмент</th><th>Модель</th><th>Лицензия</th><th>Субагенты</th></tr>
  <tr><td><strong>Qwen Code</strong></td><td>Qwen3-Coder 480B</td><td>Apache 2.0</td><td>Через PAL MCP / clink</td></tr>
  <tr><td><strong>Claude Code</strong></td><td>Opus 4.5-4.7</td><td>Проприетарная</td><td>Нативные + Agent Teams</td></tr>
  <tr><td><strong>OpenAI Codex</strong></td><td>codex-1 (o3-based)</td><td>Open source CLI</td><td>Облачные сабтаски</td></tr>
  <tr><td><strong>Gemini CLI</strong></td><td>Gemini 2.5 Pro</td><td>Open source</td><td>Через PAL MCP</td></tr>
  <tr><td><strong>Cursor</strong></td><td>Multi-model</td><td>Проприетарная</td><td>Background Agents</td></tr>
</table>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Harness Gap (Разрыв в оснастке)</div>
  Теория Harness Gap объясняет, почему открытые модели, достигшие паритета в интеллекте (Qwen3-Coder сравним с Claude Sonnet 4 на бенчмарках), все ещё уступают в зрелости агентных сред выполнения. Разница — не в модели, а в экосистеме вокруг неё.
</div>`,
    flashcards: [
      { front: "Что такое Harness Gap?", back: "Разрыв между интеллектом модели и зрелостью её агентной среды выполнения. Открытые модели догнали проприетарные по бенчмаркам, но уступают в экосистеме." },
      { front: "3 функции субагентов", back: "1) Защита контекстного окна от засорения. 2) Специализация ролей (SecurityAuditor, TestGenerator). 3) Гетерогенные модели (разные LLM для разных задач)." },
      { front: "Поколение 4 AI-ассистентов", back: "Мультиагентные системы (2025-2026): оркестратор разбивает задачи и делегирует субагентам, работающим параллельно. Аналогия с переходом от одноядерных к многоядерным CPU." }
    ],
    quiz: [
      {
        question: "Какой процент корпоративных приложений, по прогнозам Gartner, будет включать AI-агентов к концу 2026 года?",
        options: ["10%", "25%", "40%", "75%"],
        correct: 2,
        explanation: "Gartner прогнозирует, что 40% корпоративных приложений будут включать специализированных агентов к концу 2026 года, по сравнению с менее чем 5% в 2025."
      },
      {
        question: "Что позволяет субагенту использовать разные LLM для разных задач?",
        options: ["Plan Mode", "Гетерогенные модели", "Fan-In паттерн", "MCP Protocol"],
        correct: 1,
        explanation: "Гетерогенные модели — оркестратор может вызвать субагента на одной модели для сложного рефакторинга и на другой для генерации документации."
      }
    ],
    sources: [
      { title: "Qwen3-Coder: Agentic Coding in the World", url: "https://qwenlm.github.io/blog/qwen3-coder/", domain: "qwenlm.github.io" },
      { title: "The Landscape of Agentic CLIs: Claude, Gemini, Qwen", url: "https://www.linkedin.com/pulse/landscape-agentic-command-line-interfaces-analysis-claude-smeyatsky-2bm4f", domain: "linkedin.com" },
      { title: "Best AI Coding Agents 2026: 15 Tested, 3 Worth It", url: "https://www.morphllm.com/ai-coding-agent", domain: "morphllm.com" },
      { title: "PAL MCP Server — Multi-Model Orchestration", url: "https://github.com/BeehiveInnovations/pal-mcp-server", domain: "github.com" }
    ]
  },
  {
    id: 2,
    title: "Qwen Code: архитектура и основы",
    goal: "Установить Qwen Code, понять архитектуру Qwen3-Coder и освоить базовые режимы работы",
    objectives: [
      "Объяснить архитектуру Mixture-of-Experts (MoE) модели Qwen3-Coder-480B",
      "Установить и настроить Qwen Code CLI",
      "Различать Plan Mode и Approval Mode",
      "Понимать роль контекстного окна 256K/1M токенов"
    ],
    body: `<h2>Qwen3-Coder: Фундамент агентной работы</h2>

<p>Флагманская модель <strong>Qwen3-Coder-480B-A35B-Instruct</strong> использует архитектуру <strong>Mixture-of-Experts (MoE)</strong> — «Смесь экспертов». Вместо активации всех 480 миллиардов параметров на каждый токен, модель маршрутизирует задачи к специализированным «экспертам», активируя лишь около 35 миллиардов параметров.</p>

<h3>Что это значит для субагентов?</h3>
<p>MoE-архитектура — это субагенты <em>внутри самой модели</em>. Каждый «эксперт» специализируется на определённом типе задач: один лучше обрабатывает Python-код, другой — SQL-запросы, третий — документацию. Модель-маршрутизатор направляет токены к нужным экспертам, обеспечивая эффективность без потери качества.</p>

<div class="callout callout-tip">
  <div class="callout-title">💡 Бенчмарки Qwen3-Coder</div>
  <strong>SWE-Bench Verified:</strong> 69.6% (один из лучших среди открытых моделей)<br>
  <strong>HumanEval:</strong> 92.1% (vs GPT-4: 87%, Claude 3.5: 88%)<br>
  <strong>Контекст:</strong> 256K токенов нативно, 1M с экстраполяцией
</div>

<h3>Модельный ряд</h3>
<table class="comparison-table">
  <tr><th>Модель</th><th>Параметры</th><th>VRAM</th><th>Лучше для</th></tr>
  <tr><td>Qwen3-Coder 480B-A35B</td><td>480B (MoE, 35B active)</td><td>~120GB</td><td>Сложная оркестрация, enterprise</td></tr>
  <tr><td>Qwen3-Coder 32B</td><td>32B dense</td><td>24GB (16GB quant)</td><td>Рефакторинг, архитектура</td></tr>
  <tr><td>Qwen3-Coder 14B</td><td>14B dense</td><td>12GB (8GB quant)</td><td>Ежедневная работа, код-ревью</td></tr>
  <tr><td>Qwen Coder 7B</td><td>7B dense</td><td>8GB (6GB quant)</td><td>Быстрые задачи, обучение</td></tr>
</table>

<h2>Установка Qwen Code CLI</h2>

<p>Qwen Code — это CLI-инструмент, адаптированный из Gemini CLI и оптимизированный под модели Qwen3-Coder. Распространяется под лицензией Apache 2.0.</p>

<pre><code># Установка Node.js 20+
curl -qL https://www.npmjs.com/install.sh | sh

# Установка Qwen Code
npm install -g @qwen-code/qwen-code@latest

# Проверка
qwen --version</code></pre>

<h3>Настройка провайдера</h3>
<pre><code># Через Alibaba Cloud DashScope (рекомендуется)
export OPENAI_API_KEY="your_api_key"
export OPENAI_BASE_URL="https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
export OPENAI_MODEL="qwen3-coder-plus"

# Или через OpenRouter
export OPENAI_API_KEY="your_openrouter_key"
export OPENAI_BASE_URL="https://openrouter.ai/api/v1"
export OPENAI_MODEL="qwen/qwen3-coder"</code></pre>

<div class="callout callout-tip">
  <div class="callout-title">💡 Бесплатный уровень</div>
  Через Qwen OAuth доступно до <strong>2000 запросов в день бесплатно</strong>, или 1000 запросов через OpenRouter. Это беспрецедентно щедрый бесплатный уровень среди AI coding tools.
</div>

<h2>Режимы работы</h2>

<h3>Plan Mode (Режим планирования)</h3>
<p>Агент анализирует задачу и генерирует последовательность шагов — shell-команд и файловых модификаций. Вы просматриваете план перед выполнением. Идеален для сложных задач, затрагивающих множество файлов.</p>

<pre><code># В Plan Mode агент предложит план:
> "Проведи рефакторинг модуля авторизации"

# Агент выведет:
# 1. Проанализировать текущую структуру auth/
# 2. Выделить interface IAuthProvider в отдельный файл
# 3. Мигрировать с callback на async/await
# 4. Обновить тесты
# [Ожидает подтверждения]</code></pre>

<h3>Approval Mode (Режим подтверждения)</h3>
<p>Каждая файловая операция требует явного подтверждения. Безопасный режим для работы с production-кодом.</p>

<h3>Autonomous Mode (Автономный режим)</h3>
<p>Агент выполняет все действия без подтверждения. Подходит для прототипирования и изолированных сред (Docker-контейнеры, CI).</p>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Qwen Code vs Claude Code: интеграция</div>
  Qwen3-Coder можно использовать <strong>внутри Claude Code</strong> через прокси-API DashScope. Это позволяет получить Plan Mode и Agent Teams Claude Code с моделью Qwen3-Coder:
  <pre><code>export ANTHROPIC_BASE_URL=https://dashscope-intl.aliyuncs.com/api/v2/apps/claude-code-proxy
export ANTHROPIC_AUTH_TOKEN=your-dashscope-apikey</code></pre>
</div>`,
    flashcards: [
      { front: "Что такое MoE в Qwen3-Coder?", back: "Mixture-of-Experts — из 480B параметров активируются только 35B на токен. Маршрутизатор направляет токены к специализированным экспертам. Это субагенты внутри самой модели." },
      { front: "Бесплатный уровень Qwen Code", back: "До 2000 запросов/день через Qwen OAuth, 1000 запросов через OpenRouter. Самый щедрый бесплатный уровень среди AI coding tools." },
      { front: "Plan Mode vs Approval Mode", back: "Plan Mode — агент предлагает план, вы подтверждаете. Approval Mode — каждая файловая операция требует подтверждения. Autonomous — без подтверждений." }
    ],
    quiz: [
      {
        question: "Сколько параметров Qwen3-Coder-480B активируется на каждый токен?",
        options: ["480 миллиардов", "120 миллиардов", "35 миллиардов", "7 миллиардов"],
        correct: 2,
        explanation: "Архитектура MoE активирует только 35B из 480B параметров на каждый токен, обеспечивая эффективность без потери качества."
      },
      {
        question: "Какой результат показывает Qwen3-Coder 32B на SWE-Bench Verified?",
        options: ["43.8%", "55.2%", "69.6%", "80.9%"],
        correct: 2,
        explanation: "69.6% на SWE-Bench Verified — один из лучших результатов среди открытых моделей, превосходит GPT-4 (43.8%) и Claude 3.5 Sonnet (49%)."
      }
    ],
    sources: [
      { title: "Qwen3-Coder: Agentic Coding in the World (официальный блог)", url: "https://qwenlm.github.io/blog/qwen3-coder/", domain: "qwenlm.github.io" },
      { title: "Qwen AI Review 2025: Best Model for Coding", url: "https://www.index.dev/blog/qwen-ai-coding-review", domain: "index.dev" },
      { title: "Qwen3-Coder-Next: Scaling to 300 Turns", url: "https://qwen.ai/blog?id=qwen3-coder-next", domain: "qwen.ai" }
    ]
  },
  {
    id: 3,
    title: "Qwen Code: субагенты на практике",
    goal: "Освоить создание и управление субагентами через PAL MCP и clink в Qwen Code",
    objectives: [
      "Установить и настроить PAL MCP Server для Qwen Code",
      "Создавать субагентов с разными ролями через clink",
      "Использовать изоляцию контекста для параллельных задач",
      "Применять мульти-модельный код-ревью"
    ],
    body: `<h2>PAL MCP: Мост к мультиагентной оркестрации</h2>

<p>Qwen Code <strong>не имеет встроенной системы субагентов</strong>, в отличие от Claude Code. Однако PAL MCP Server (Provider Abstraction Layer, ранее Zen MCP) полностью решает эту проблему, превращая Qwen Code в полноценную оркестрационную платформу.</p>

<p>PAL MCP — это open-source сервер (11.6K GitHub stars, Apache 2.0), который:</p>
<ul>
  <li>Подключает <strong>множественные AI-модели</strong> в один промпт (Gemini, OpenAI, Anthropic, Grok, Ollama)</li>
  <li>Обеспечивает <strong>CLI-to-CLI Bridge</strong> через инструмент <code>clink</code></li>
  <li>Позволяет запускать <strong>изолированные CLI-инстанции</strong> как субагентов</li>
</ul>

<h3>Установка PAL MCP</h3>
<pre><code># Клонирование и установка
git clone https://github.com/BeehiveInnovations/pal-mcp-server.git
cd pal-mcp-server
pip install -r requirements.txt

# Добавление в конфиг Qwen Code (~/.qwen/config.json)
{
  "mcpServers": {
    "pal": {
      "command": "python",
      "args": ["/path/to/pal-mcp-server/server.py"],
      "env": {
        "OPENAI_API_KEY": "***",
        "ANTHROPIC_API_KEY": "***",
        "GEMINI_API_KEY": "***"
      }
    }
  }
}</code></pre>

<h2>Инструмент clink: CLI-to-CLI Bridge</h2>

<p><code>clink</code> (CLI + Link) — ключевая функция PAL MCP, позволяющая запускать <strong>внешние AI CLI как субагентов</strong> внутри вашей текущей сессии.</p>

<h3>Пример 1: Код-ревью с изоляцией контекста</h3>
<pre><code># Qwen Code (оркестратор) запускает Codex как субагента
# для изолированного код-ревью
> clink with codex codereviewer to audit auth module for security issues

# Результат:
# Codex запускается в отдельном процессе с чистым контекстом
# Анализирует auth/ модуль на уязвимости
# Возвращает только финальный отчёт в Qwen Code
# Контекст Qwen Code остаётся чистым</code></pre>

<h3>Пример 2: Мульти-модельный код-ревью</h3>
<pre><code># Запрос в Qwen Code:
> "Perform a codereview using gemini pro and o3, then use planner
   to create a fix strategy"

# Что происходит:
# 1. Qwen Code систематически ревьюит код
# 2. PAL MCP консультируется с Gemini Pro (вторая оценка)
# 3. PAL MCP получает оценку от O3 (третья перспектива)
# 4. Planner создаёт унифицированный план исправлений</code></pre>

<h2>Роли субагентов</h2>

<p>Каждый субагент получает <strong>специализированный системный промпт</strong>:</p>

<table class="comparison-table">
  <tr><th>Роль</th><th>Описание</th><th>Инструменты</th></tr>
  <tr><td><code>planner</code></td><td>Декомпозиция задач, создание планов</td><td>Read, Write, WebSearch</td></tr>
  <tr><td><code>codereviewer</code></td><td>Ревью кода на качество и паттерны</td><td>Read, Grep, Glob</td></tr>
  <tr><td><code>security-auditor</code></td><td>Поиск уязвимостей и CVE</td><td>Read, Grep, WebSearch</td></tr>
  <tr><td><code>test-generator</code></td><td>Генерация unit/integration тестов</td><td>Read, Write, Shell</td></tr>
  <tr><td><code>doc-writer</code></td><td>Генерация документации</td><td>Read, Write, WebFetch</td></tr>
</table>

<h3>Пример: Комплексный workflow</h3>
<pre><code># 1. Qwen Code (оркестратор) получает задачу:
> "Добавь OAuth2 авторизацию в REST API"

# 2. Planner декомпозирует:
#    - Создать AuthMiddleware
#    - Добавить token validation
#    - Написать refresh token endpoint
#    - Обновить документацию

# 3. Параллельное выполнение:
clink with claude-code security-auditor --audit oauth2 implementation
clink with codex test-generator --generate tests for auth module

# 4. Каждый субагент возвращает результаты
# 5. Qwen Code синтезирует финальный результат</code></pre>

<div class="callout callout-tip">
  <div class="callout-title">💡 Context Revival — уникальная фича PAL MCP</div>
  Когда контекст Qwen Code сбрасывается (превышение лимита), просто попросите «continue with O3» — ответ другой модели магически восстановит понимание Qwen Code без повторного чтения документов!
</div>

<h2>Изоляция контекста: почему это важно</h2>

<p>Без субагентов каждая операция засоряет контекстное окно главного агента. При мульти-файловом рефакторинге это приводит к:</p>
<ul>
  <li><strong>Деградации качества</strong> — модель «забывает» начало разговора</li>
  <li><strong>Росту стоимости</strong> — больше токенов = больше денег</li>
  <li><strong>Потере фокуса</strong> — агент начинает путаться в деталях</li>
</ul>

<p>Субагенты через PAL MCP решают все три проблемы: каждый работает в изолированном контексте и возвращает только сжатые результаты.</p>`,
    flashcards: [
      { front: "Что такое PAL MCP?", back: "Provider Abstraction Layer — open-source MCP-сервер (11.6K stars), подключающий множественные AI-модели и CLI-инструменты как субагентов. Работает с Qwen Code, Claude Code, Codex, Gemini CLI." },
      { front: "Что делает инструмент clink?", back: "CLI-to-CLI Bridge — запускает внешние AI CLI (Codex, Claude Code, Gemini CLI) как изолированных субагентов внутри текущей сессии. Каждый субагент получает чистый контекст и возвращает только финальные результаты." },
      { front: "Context Revival", back: "Фича PAL MCP: при сбросе контекста основного CLI, ответ от другой модели (например O3) восстанавливает понимание без повторного чтения документов." }
    ],
    quiz: [
      {
        question: "Как Qwen Code получает возможность работы с субагентами?",
        options: ["Встроенная функция sub-agent", "Через PAL MCP Server и инструмент clink", "Только через OpenCrabs", "Субагенты не поддерживаются"],
        correct: 1,
        explanation: "Qwen Code не имеет встроенной системы субагентов. PAL MCP Server (open-source, 11.6K stars) через инструмент clink обеспечивает CLI-to-CLI Bridge для запуска изолированных субагентов."
      },
      {
        question: "Какая проблема НЕ решается изоляцией контекста через субагентов?",
        options: ["Деградация качества при длинных сессиях", "Рост стоимости из-за лишних токенов", "Необходимость CI/CD пайплайна", "Потеря фокуса агентом"],
        correct: 2,
        explanation: "CI/CD — это инфраструктурная задача, не связанная с управлением контекстом. Субагенты решают деградацию качества, рост стоимости и потерю фокуса."
      }
    ],
    sources: [
      { title: "PAL MCP Server — GitHub", url: "https://github.com/BeehiveInnovations/pal-mcp-server", domain: "github.com" },
      { title: "Qwen Code CLI: AI Terminal Wizard", url: "https://medium.com/@vignarajj/qwen-code-cli-the-ai-terminal-wizard-taking-on-claude-code-and-gemini-cli-0f76058a8b36", domain: "medium.com" },
      { title: "Qwen Review, Pricing & Alternatives (2026)", url: "https://utilo.io/en/home/tools/dzBJkj1cbe4iCn5HfgVdzCUsrRg", domain: "utilo.io" }
    ]
  },
  {
    id: 4,
    title: "Qwen Code: продвинутая оркестрация",
    goal: "Освоить мульти-модельные workflow, обход Harness Gap и паттерны enterprise-оркестрации",
    objectives: [
      "Настроить мульти-модельный workflow с разными LLM для разных задач",
      "Применять стратегию обхода Harness Gap через сторонние оркестраторы",
      "Реализовать паттерн Orchestrator-Worker в Qwen Code",
      "Понимать ограничения и анти-паттерны мультиагентной работы"
    ],
    body: `<h2>Мульти-модельная оркестрация</h2>

<p>Одна из сильнейших сторон Qwen Code + PAL MCP — возможность <strong>использовать разные модели для разных подзадач</strong> в рамках одного workflow.</p>

<h3>Принцип: Правильная модель для правильной задачи</h3>
<table class="comparison-table">
  <tr><th>Задача</th><th>Рекомендуемая модель</th><th>Почему</th></tr>
  <tr><td>Оркестрация, планирование</td><td>Qwen3-Coder 480B</td><td>MoE, отличное понимание кодовой базы</td></tr>
  <tr><td>Сложный рефакторинг</td><td>Claude Opus 4.7</td><td>Лучший reasoning depth</td></tr>
  <tr><td>Быстрый код-ревью</td><td>Gemini 2.5 Pro</td><td>Быстрый, хорошее покрытие edge cases</td></tr>
  <tr><td>Безопасность</td><td>O3 / GPT-5</td><td>Сильный security analysis</td></tr>
  <tr><td>Документация</td><td>Llama (локально)</td><td>Приватность, нулевая стоимость</td></tr>
</table>

<h3>Пример: Production deployment workflow</h3>
<pre><code># Задача: "Подготовь микросервис к production deployment"

# Шаг 1: Qwen Code (оркестратор) анализирует проект
> "Проанализируй проект и создай deployment checklist"

# Шаг 2: Параллельное делегирование
clink with claude-code security-auditor \\
  "Проверь зависимости на CVE, найди hardcoded secrets"

clink with codex codereviewer \\
  "Проверь обработку ошибок, retry logic, graceful shutdown"

# Локальная модель (через Ollama):
pal ask-ollama "Сгенерируй README.md и CHANGELOG.md"

# Шаг 3: Qwen Code синтезирует результаты
# Создаёт Dockerfile, docker-compose.yml, CI/CD конфиг</code></pre>

<h2>Обход Harness Gap</h2>

<p><strong>Harness Gap</strong> — это разрыв между «сырым» интеллектом модели и зрелостью окружающей инфраструктуры. Qwen3-Coder сравним с Claude Sonnet 4 на бенчмарках, но Claude Code имеет:</p>
<ul>
  <li>Нативные субагенты и Agent Teams</li>
  <li>Auto-compaction контекста</li>
  <li>Встроенные MCP-интеграции</li>
  <li>Custom hooks и pre-commit validation</li>
</ul>

<h3>Стратегии обхода:</h3>

<h4>1. PAL MCP как универсальный мост</h4>
<p>PAL MCP добавляет Qwen Code все недостающие возможности: мульти-модельность, субагентов, conversation threading. Это самый зрелый подход с 11.6K stars и 74 релизами.</p>

<h4>2. OpenCrabs — специализированный оркестратор</h4>
<p>Open-source оркестратор, заточенный под multi-agent coding. Обеспечивает:</p>
<ul>
  <li>Координацию файловых блокировок (чтобы два агента не редактировали один файл)</li>
  <li>Shared task list с статусами</li>
  <li>Автоматическое разрешение конфликтов</li>
</ul>

<h4>3. Claude Code как фронтенд для Qwen3-Coder</h4>
<pre><code># Используем инфраструктуру Claude Code с моделью Qwen
export ANTHROPIC_BASE_URL=https://dashscope-intl.aliyuncs.com/api/v2/apps/claude-code-proxy
export ANTHROPIC_AUTH_TOKEN=your-dashscope-apikey

# Теперь Claude Code CLI работает с Qwen3-Coder
# Нативные субагенты + Agent Teams + модель Qwen</code></pre>

<div class="callout callout-danger">
  <div class="callout-title">🚫 Анти-паттерны мультиагентной работы</div>
  <strong>1. Бесконечная вложенность:</strong> Субагент, порождающий субагентов — recipe for disaster. Ограничивайте глубину до 1 уровня.<br><br>
  <strong>2. Общие файлы без блокировок:</strong> Два агента, редактирующих один файл одновременно = конфликт слияния. Используйте OpenCrabs или ручное разделение директорий.<br><br>
  <strong>3. Over-delegation:</strong> Не делегируйте тривиальные задачи. Overhead субагента (создание контекста, возврат результата) превышает выгоду для простых операций.
</div>

<h2>Enterprise-паттерн: Orchestrator-Worker</h2>

<p>Самый распространённый паттерн в production:</p>

<pre><code># Структура проекта
.claude/agents/
  planner.md          # Декомпозиция задач
  frontend-dev.md     # UI/React компоненты
  backend-dev.md      # API/бизнес-логика
  security-auditor.md # Проверка безопасности
  test-engineer.md    # Тесты

# Файл planner.md:
---
name: planner
description: Decomposes tasks into sub-tasks
tools: [Read, Write, WebSearch]
---
You are a task decomposition specialist.
Given a feature request:
1. Identify all affected modules
2. Create ordered sub-tasks with dependencies
3. Assign roles (frontend, backend, security, test)
4. Output plan.md with checklist</code></pre>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Экономика мультиагентной работы</div>
  Каждый субагент — это <strong>отдельный API-запрос</strong> с полным контекстом. Мульти-модельный ревью с 3 моделями стоит в 3-5x дороже одиночного. Используйте субагентов только для задач, где качество критичнее стоимости: security audit, production deployment, архитектурные решения.
</div>`,
    flashcards: [
      { front: "Что такое Harness Gap?", back: "Разрыв между интеллектом модели и зрелостью её экосистемы. Qwen3-Coder ≈ Claude Sonnet 4 по бенчмаркам, но Claude Code имеет нативные Agent Teams, auto-compaction, custom hooks." },
      { front: "3 стратегии обхода Harness Gap", back: "1) PAL MCP как универсальный мост (11.6K stars). 2) OpenCrabs — специализированный оркестратор. 3) Claude Code CLI как фронтенд с моделью Qwen3-Coder через DashScope proxy." },
      { front: "Правило глубины субагентов", back: "Максимум 1 уровень вложенности. Субагент НЕ должен порождать своих субагентов — это приводит к потере контроля, экспоненциальному росту стоимости и хаосу." }
    ],
    quiz: [
      {
        question: "Какой подход позволяет использовать нативные Agent Teams Claude Code с моделью Qwen3-Coder?",
        options: ["PAL MCP clink", "OpenCrabs", "DashScope proxy API для Claude Code", "Ollama integration"],
        correct: 2,
        explanation: "Через DashScope proxy API (ANTHROPIC_BASE_URL) Claude Code CLI работает с моделью Qwen3-Coder, получая все нативные возможности включая Agent Teams."
      },
      {
        question: "Какая задача НЕ подходит для делегирования субагенту?",
        options: ["Security audit production кода", "Переименование переменной в одном файле", "Мульти-файловый рефакторинг", "Генерация тестов для нового модуля"],
        correct: 1,
        explanation: "Переименование переменной — тривиальная задача. Overhead создания субагента (новый контекст, API-вызов, возврат) превышает выгоду. Делегируйте только сложные задачи."
      }
    ],
    sources: [
      { title: "OpenCrabs — Multi-Agent Orchestration", url: "https://github.com/RoggeOhta/awesome-codex-cli", domain: "github.com" },
      { title: "Qwen3-Coder-Next Tech Report", url: "https://github.com/QwenLM/Qwen3-Coder/blob/main/qwen3_coder_next_tech_report.pdf", domain: "github.com" },
      { title: "Cross-LLM Sub-Agent Orchestration Skills", url: "https://github.com/shinpr/sub-agents-skills", domain: "github.com" }
    ]
  },
  {
    id: 5,
    title: "OpenAI Codex: субагенты и параллелизм",
    goal: "Понять архитектуру субагентов Codex, облачную песочницу и паттерны параллельного выполнения",
    objectives: [
      "Различать локальный Codex CLI и облачный Codex",
      "Понимать механизм порождения субагентов (Subagent GA)",
      "Настраивать параллельные задачи с изоляцией",
      "Применять корпоративный governance для агентов"
    ],
    body: `<h2>Архитектура OpenAI Codex</h2>

<p>Современный OpenAI Codex (CLI v0.130.0, май 2026) — это не просто локальный терминальный инструмент. Это <strong>комплексная система</strong>, интегрированная с облачной средой выполнения. Базовая модель — <code>codex-1</code>, специализированная версия o3, оптимизированная через обучение с подкреплением на реальных сценариях разработки.</p>

<h3>Два режима работы</h3>
<table class="comparison-table">
  <tr><th>Аспект</th><th>Локальный CLI</th><th>Облачный Codex</th></tr>
  <tr><td><strong>Среда</strong></td><td>Ваш терминал</td><td>Изолированная песочница (sandbox)</td></tr>
  <tr><td><strong>Безопасность</strong></td><td>На ваш страх и риск</td><td>Полная изоляция, sandbox</td></tr>
  <tr><td><strong>Субагенты</strong></td><td>Через PAL MCP</td><td>Нативные Subagent Tasks</td></tr>
  <tr><td><strong>Использование</strong></td><td>DevOps, автоматизация</td><td>Параллельная разработка</td></tr>
</table>

<h2>Механизм субагентов (Subagent GA)</h2>

<p>В марте 2026 года OpenAI выпустил <strong>Subagents GA</strong> — полноценную поддержку параллельных субагентов в Codex. Это утверждение де-факто индустриального стандарта параллельного AI-кодирования.</p>

<h3>Как это работает</h3>
<pre><code># В облачном Codex:
> "Проведи полный аудит модуля платежей"

# Codex автоматически:
# 1. Порождает субагента "security-review" в изолированной песочнице
# 2. Порождает субагента "test-coverage" для анализа тестов
# 3. Порождает субагента "performance" для профилирования
# 4. Каждый работает параллельно в своей sandbox
# 5. Результаты агрегируются в финальный отчёт</code></pre>

<h3>Ключевые особенности</h3>
<ul>
  <li><strong>Sandbox isolation:</strong> Каждый субагент работает в отдельной песочнице с полной копией репозитория. Никаких конфликтов файлов.</li>
  <li><strong>Автоматическая декомпозиция:</strong> Модель сама определяет, когда задача достаточно сложна для субагентов.</li>
  <li><strong>Git-based state:</strong> Каждый субагент работает в отдельной ветке. Слияние через стандартный PR-процесс.</li>
</ul>

<div class="callout callout-tip">
  <div class="callout-title">💡 Только 1 из 10 агентных проектов доходит до production</div>
  По данным Gartner, основная причина сбоев — не недостаток интеллекта моделей, а отсутствие governance layer: делегирование, видимость, восстановление после ошибок. Codex решает это через sandbox-изоляцию.
</div>

<h2>Сравнение с Qwen Code</h2>

<table class="comparison-table">
  <tr><th>Аспект</th><th>OpenAI Codex</th><th>Qwen Code</th></tr>
  <tr><td><strong>Субагенты</strong></td><td>Нативные (Subagent GA)</td><td>Через PAL MCP / clink</td></tr>
  <tr><td><strong>Изоляция</strong></td><td>Облачная sandbox</td><td>Процессная (отдельный CLI)</td></tr>
  <tr><td><strong>Модели</strong></td><td>Только OpenAI (codex-1)</td><td>Любые (Qwen, Claude, Gemini, Ollama)</td></tr>
  <tr><td><strong>Стоимость</strong></td><td>$20/мес + API usage</td><td>Бесплатно (2000 req/day) или self-host</td></tr>
  <tr><td><strong>Open source</strong></td><td>CLI да, backend нет</td><td>Полностью Apache 2.0</td></tr>
</table>

<h2>Governance для корпоративной среды</h2>

<p>Ключевые принципы управления AI-агентами в enterprise:</p>

<ol>
  <li><strong>Visibility:</strong> Логирование всех действий агентов. Кто, что, когда, почему.</li>
  <li><strong>Approval Gates:</strong> Критические операции (deploy, DB migration) требуют подтверждения человека.</li>
  <li><strong>Rollback:</strong> Каждый шаг агента = git commit. Откат к любому checkpoint.</li>
  <li><strong>Rate Limiting:</strong> Ограничение количества параллельных субагентов и API-вызовов.</li>
</ol>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Ограничения Codex</div>
  <strong>Vendor lock-in:</strong> Codex работает только с моделями OpenAI. Невозможно подключить Claude или локальную модель для отдельных задач. В этом ключевое преимущество Qwen Code + PAL MCP — гетерогенность моделей.
</div>`,
    flashcards: [
      { front: "Что такое Subagent GA в Codex?", back: "General Availability субагентов (март 2026) — нативная поддержка параллельных субагентов в облачной песочнице. Каждый субагент работает в изолированной sandbox с отдельной git-веткой." },
      { front: "Главное отличие Codex от Qwen Code", back: "Codex: нативные субагенты, но vendor lock-in (только OpenAI). Qwen Code: субагенты через PAL MCP, но гетерогенные модели (любой LLM) и полный open-source." },
      { front: "Почему только 1/10 агентных проектов доходит до production?", back: "Основная причина — отсутствие governance layer: делегирование, видимость, восстановление после ошибок. Не недостаток интеллекта моделей." }
    ],
    quiz: [
      {
        question: "Какой тип изоляции используют субагенты в облачном Codex?",
        options: ["Процессная изоляция", "Облачная sandbox", "Docker-контейнеры", "Виртуальные машины"],
        correct: 1,
        explanation: "Codex использует облачную sandbox-изоляцию — каждый субагент работает в отдельной песочнице с полной копией репозитория и отдельной git-веткой."
      },
      {
        question: "Что является основным недостатком Codex по сравнению с Qwen Code?",
        options: ["Нет субагентов", "Vendor lock-in на модели OpenAI", "Нет CLI-интерфейса", "Высокая стоимость лицензии"],
        correct: 1,
        explanation: "Codex работает только с моделями OpenAI. Невозможно подключить Claude, Gemini или локальную модель. Qwen Code + PAL MCP поддерживает любые модели."
      }
    ],
    sources: [
      { title: "Codex Subagents: Parallel AI Coding at Scale", url: "https://atalupadhyay.wordpress.com/2026/03/17/codex-subagents-parallel-ai-coding-at-scale/", domain: "atalupadhyay.wordpress.com" },
      { title: "Codex Gets Subagents: Industry Standard Pattern", url: "https://pub.spillwave.com/codex-gets-subagents-the-parallel-ai-coding-pattern-is-now-industry-standard-how-does-it-stack-35bd217ef11f", domain: "spillwave.com" },
      { title: "Multi-Agent System Architecture Patterns", url: "https://www.clickittech.com/ai/multi-agent-system-architecture/", domain: "clickittech.com" }
    ]
  },
  {
    id: 6,
    title: "Claude Code: субагенты и Agent Teams",
    goal: "Освоить нативные субагенты и экспериментальные Agent Teams в Claude Code",
    objectives: [
      "Различать паттерны Fan-Out/Fan-In и Agent Teams",
      "Создавать субагентов через .claude/agents/ директорию",
      "Настраивать и использовать Agent Teams для комплексных задач",
      "Управлять потреблением токенов в мультиагентной среде"
    ],
    body: `<h2>Два уровня мультиагентности в Claude Code</h2>

<p>Claude Code предлагает <strong>два принципиально разных</strong> подхода к мультиагентной работе:</p>

<table class="comparison-table">
  <tr><th>Аспект</th><th>Субагенты (Subagents)</th><th>Agent Teams</th></tr>
  <tr><td><strong>Паттерн</strong></td><td>Fan-Out / Fan-In</td><td>Непрерывная коллаборация</td></tr>
  <tr><td><strong>Состояние</strong></td><td>Изолированное</td><td>Общий список задач</td></tr>
  <tr><td><strong>Коммуникация</strong></td><td>Только с оркестратором</td><td>Peer-to-Peer + Lead</td></tr>
  <tr><td><strong>Токены</strong></td><td>Умеренное потребление</td><td>Высокое потребление</td></tr>
  <tr><td><strong>Статус</strong></td><td>Stable</td><td>Experimental</td></tr>
</table>

<h2>Нативные субагенты: Fan-Out / Fan-In</h2>

<h3>Определение через YAML + Markdown</h3>
<p>Субагенты определяются как markdown-файлы с YAML-фронтматтером в директории <code>.claude/agents/</code>:</p>

<pre><code># .claude/agents/researcher.md
---
name: researcher
description: Technical research specialist
tools:
  - WebSearch
  - WebFetch
  - Read
---
You are a technical research specialist.
When given a topic:
1. Find latest documentation and release notes
2. Locate working code examples
3. Identify common pitfalls
4. Return structured findings with source URLs</code></pre>

<h3>Механика Fan-Out / Fan-In</h3>
<ol>
  <li><strong>Fan-Out:</strong> Оркестратор использует инструмент <code>Task</code> для параллельного запуска нескольких субагентов. Каждый получает изолированный контекст.</li>
  <li><strong>Выполнение:</strong> Субагенты работают независимо, не зная друг о друге.</li>
  <li><strong>Fan-In:</strong> Результаты возвращаются оркестратору для синтеза.</li>
</ol>

<pre><code># Пример использования:
> "Проведи исследование трёх подходов к state management
   в React и порекомендуй лучший для нашего проекта"

# Claude Code (оркестратор):
# 1. Fan-Out: запускает 3 субагента researcher параллельно
#    - Субагент 1: исследует Redux Toolkit
#    - Субагент 2: исследует Zustand
#    - Субагент 3: исследует Jotai
# 2. Fan-In: объединяет результаты
# 3. Синтезирует рекомендацию с учётом контекста проекта</code></pre>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Ограничения нативных субагентов</div>
  <ul style="margin:0.5rem 0 0 1rem;">
    <li>Субагенты <strong>не могут порождать других субагентов</strong> (запрет на бесконечную вложенность)</li>
    <li>Коммуникация только через оркестратора (Hub-and-Spoke)</li>
    <li>Нет общего состояния в реальном времени</li>
  </ul>
</div>

<h2>Agent Teams: Полноценная коллаборация</h2>

<p><strong>Agent Teams</strong> — экспериментальная функция, включаемая через переменную окружения:</p>

<pre><code>export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code></pre>

<h3>Ключевые возможности</h3>
<ul>
  <li><strong>Shared Task List:</strong> Агенты видят прогресс друг друга и адаптируются</li>
  <li><strong>Lead Agent:</strong> Один агент — тимлид, декомпозирующий задачи</li>
  <li><strong>Peer-to-Peer:</strong> Агенты оспаривают решения, запрашивают уточнения</li>
  <li><strong>Directory Ownership:</strong> Явное владение директориями для предотвращения конфликтов</li>
</ul>

<h3>Пример: Fullstack feature</h3>
<pre><code># Задача: "Добавь user profile page с настройками"

# Lead Agent декомпозирует:
# 1. frontend-agent: React компоненты, forms, validation
# 2. backend-agent: API endpoints, DB migration
# 3. test-agent: E2E тесты, integration тесты

# Взаимодействие:
# - frontend ждёт определения API types от backend
# - test ждёт API contract от обоих
# - backend уведомляет о готовности → frontend стартует
# - все результаты видны в shared task list</code></pre>

<h2>Экономика токенов</h2>

<p>Мультиагентная работа значительно увеличивает потребление токенов:</p>

<table class="comparison-table">
  <tr><th>Режим</th><th>Токены/час</th><th>Стоимость/час</th></tr>
  <tr><td>Одиночный агент</td><td>50-100K</td><td>$1-3</td></tr>
  <tr><td>3 субагента (Fan-Out)</td><td>150-300K</td><td>$3-9</td></tr>
  <tr><td>Agent Teams (3 агента)</td><td>400-800K</td><td>$8-24</td></tr>
</table>

<div class="callout callout-danger">
  <div class="callout-title">🚫 Когнитивная нагрузка</div>
  Как отмечает Саймон Уиллисон (соавтор Django): «Мультиагентные системы не упрощают работу — они её трансформируют. Агенты генерируют код, но человек должен проверять, корректировать курс и удерживать ментальную модель нескольких одновременных процессов.»
</div>`,
    flashcards: [
      { front: "Fan-Out / Fan-In в Claude Code", back: "Паттерн субагентов: оркестратор параллельно запускает N изолированных субагентов (Fan-Out), каждый выполняет подзадачу, результаты агрегируются обратно (Fan-In). Субагенты не знают друг о друге." },
      { front: "Agent Teams vs Subagents", back: "Subagents: изолированные, только hub-and-spoke, умеренные токены. Agent Teams: общий task list, peer-to-peer коммуникация, Lead Agent, высокое потребление токенов, experimental." },
      { front: "Где определяются субагенты Claude Code?", back: "В директории .claude/agents/ как markdown-файлы с YAML-фронтматтером. Содержат name, description, список tools и системный промпт." }
    ],
    quiz: [
      {
        question: "Какой паттерн коммуникации используют нативные субагенты Claude Code?",
        options: ["Peer-to-Peer", "Mesh network", "Hub-and-Spoke (только через оркестратор)", "Broadcast"],
        correct: 2,
        explanation: "Нативные субагенты общаются только с оркестратором (Hub-and-Spoke). Они не знают друг о друге и не имеют общего состояния. Peer-to-Peer доступен только в Agent Teams."
      },
      {
        question: "Что происходит при превышении контекста в Agent Teams?",
        options: ["Автоматическое сжатие (auto-compaction)", "Перезапуск всех агентов", "Удаление самых старых агентов", "Ничего, контекст безлимитный"],
        correct: 0,
        explanation: "Claude Code использует auto-compaction — автоматическое сжатие контекста при приближении к лимиту. Это сохраняет когерентность длинных сессий."
      }
    ],
    sources: [
      { title: "Claude Code Agent Teams", url: "https://www.sitepoint.com/anthropic-claude-code-agent-teams/", domain: "sitepoint.com" },
      { title: "How to Coordinate Multiple AI Agents", url: "https://www.developersdigest.tech/blog/how-to-coordinate-multiple-ai-agents", domain: "developersdigest.tech" },
      { title: "Claude Code Docs: Manage Costs", url: "https://code.claude.com/docs/en/costs", domain: "code.claude.com" },
      { title: "Building Effective AI Agents (Anthropic)", url: "https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf", domain: "resources.anthropic.com" }
    ]
  },
  {
    id: 7,
    title: "Сравнительный анализ и паттерны оркестрации",
    goal: "Систематизировать знания о четырёх основных паттернах оркестрации и выбрать оптимальный для своей задачи",
    objectives: [
      "Различать 4 паттерна: Orchestrator-Worker, Pipeline, Router, Evaluator-Optimizer",
      "Выбирать инструмент (Qwen/Codex/Claude) под конкретную задачу",
      "Проектировать мультиагентную архитектуру для своего проекта",
      "Распознавать и избегать анти-паттернов"
    ],
    body: `<h2>Четыре паттерна оркестрации</h2>

<p>На основе руководства Anthropic «Building Effective AI Agents» и исследований Arize AI, выделяем четыре фундаментальных паттерна:</p>

<h3>1. Orchestrator-Worker (Оркестратор-Исполнитель)</h3>
<p>Центральный LLM динамически разбивает задачу и делегирует Worker-агентам. Идеален для задач с <strong>неизвестной заранее структурой</strong>.</p>

<pre><code># Пример в Qwen Code + PAL MCP:
> "Проведи полный аудит этого микросервиса"

# Оркестратор (Qwen) анализирует и делегирует:
# Worker 1 (Claude): code quality review
# Worker 2 (O3): security analysis
# Worker 3 (Gemini): performance profiling
# Синтез: объединённый отчёт с приоритизацией</code></pre>

<p><strong>Лучший инструмент:</strong> Qwen Code + PAL MCP (гибкость моделей)</p>

<h3>2. Pipeline (Конвейер)</h3>
<p>Задача проходит через <strong>последовательность этапов</strong>, где выход одного — вход следующего. Идеален для задач с <strong>известной структурой</strong>.</p>

<pre><code># Пример: Feature Development Pipeline
# Stage 1: Planner → plan.md
# Stage 2: Implementor → код по плану
# Stage 3: Test Generator → тесты
# Stage 4: Reviewer → проверка качества
# Stage 5: Deployer → CI/CD конфиг

# Каждый stage — отдельный субагент</code></pre>

<p><strong>Лучший инструмент:</strong> Claude Code (Agent Teams) или Codex (sandbox)</p>

<h3>3. Router (Маршрутизатор)</h3>
<p>Входящий запрос <strong>классифицируется</strong> и направляется к специализированному агенту. Идеален для <strong>разнородных входящих задач</strong>.</p>

<pre><code># Пример: Issue Triage Router
# Входящий GitHub issue →
#   "bug" → bug-fixer agent
#   "feature" → feature-implementor agent
#   "question" → docs-lookup agent
#   "security" → security-auditor agent</code></pre>

<p><strong>Лучший инструмент:</strong> Qwen Code (бесплатный уровень для массовой обработки)</p>

<h3>4. Evaluator-Optimizer</h3>
<p>Один агент генерирует, второй оценивает. <strong>Цикл повторяется</strong> до достижения порогового качества.</p>

<pre><code># Пример: Code Generation Loop
# Generator: пишет функцию
# Evaluator: запускает тесты, проверяет coverage
# Если coverage < 80% → Generator дорабатывает
# Если coverage >= 80% → выход из цикла</code></pre>

<p><strong>Лучший инструмент:</strong> Codex (sandbox isolation для безопасного запуска тестов)</p>

<h2>Сводная матрица выбора</h2>

<table class="comparison-table">
  <tr><th>Критерий</th><th>Qwen Code</th><th>Codex</th><th>Claude Code</th></tr>
  <tr><td><strong>Стоимость</strong></td><td>🟢 Бесплатно / self-host</td><td>🟡 $20 + API</td><td>🔴 $20-200/мес</td></tr>
  <tr><td><strong>Нативные субагенты</strong></td><td>🔴 Через PAL MCP</td><td>🟢 Subagent GA</td><td>🟢 Subagents + Teams</td></tr>
  <tr><td><strong>Гетерогенные модели</strong></td><td>🟢 Любые LLM</td><td>🔴 Только OpenAI</td><td>🟡 Ограниченно</td></tr>
  <tr><td><strong>Open Source</strong></td><td>🟢 Apache 2.0</td><td>🟡 CLI only</td><td>🔴 Проприетарный</td></tr>
  <tr><td><strong>Бенчмарки</strong></td><td>🟢 69.6% SWE-bench</td><td>🟡 ~70% (codex-1)</td><td>🟢 80.9% SWE-bench</td></tr>
  <tr><td><strong>Безопасность</strong></td><td>🟡 Process isolation</td><td>🟢 Cloud sandbox</td><td>🟡 Process isolation</td></tr>
  <tr><td><strong>Enterprise</strong></td><td>🟢 Self-host, privacy</td><td>🟡 SOC 2</td><td>🟢 SOC 2, HIPAA</td></tr>
</table>

<h2>Анти-паттерны мультиагентной работы</h2>

<div class="callout callout-danger">
  <div class="callout-title">🚫 5 анти-паттернов, которые убивают продуктивность</div>
  <strong>1. Бесконечная вложенность:</strong> Субагент → субагент → субагент. Глубина = 1, максимум 2.<br><br>
  <strong>2. Over-delegation:</strong> Делегирование тривиальных задач. Overhead > выгода.<br><br>
  <strong>3. Общие файлы без блокировок:</strong> Два агента редактируют один файл = merge conflict. Разделяйте директории.<br><br>
  <strong>4. Игнорирование стоимости:</strong> 3-агентный ревью = 3-5x стоимость. Используйте только когда качество критично.<br><br>
  <strong>5. Отсутствие human-in-the-loop:</strong> Полная автономность без checkpoints. Только 1/10 проектов доходит до production без governance.
</div>`,
    flashcards: [
      { front: "4 паттерна оркестрации", back: "1) Orchestrator-Worker (динамическая декомпозиция). 2) Pipeline (последовательные этапы). 3) Router (классификация и маршрутизация). 4) Evaluator-Optimizer (генерация-оценка цикл)." },
      { front: "Когда использовать Qwen Code?", back: "Когда нужны: гетерогенные модели, бесплатный/self-host вариант, open-source, приватность данных. Идеален для паттернов Orchestrator-Worker и Router." },
      { front: "Главный анти-паттерн мультиагентности", back: "Бесконечная вложенность субагентов. Глубина должна быть максимум 1-2 уровня. Каждый дополнительный уровень экспоненциально увеличивает стоимость и снижает контроль." }
    ],
    quiz: [
      {
        question: "Какой паттерн оркестрации лучше всего подходит для обработки разнородных GitHub issues?",
        options: ["Orchestrator-Worker", "Pipeline", "Router", "Evaluator-Optimizer"],
        correct: 2,
        explanation: "Router классифицирует входящие запросы и направляет к специализированным агентам: bug → bug-fixer, feature → implementor, security → auditor."
      },
      {
        question: "В каком сценарии Qwen Code имеет явное преимущество перед Codex и Claude Code?",
        options: ["Нативные Agent Teams", "Облачная sandbox-изоляция", "Мульти-модельная оркестрация с гетерогенными LLM", "Встроенный CI/CD"],
        correct: 2,
        explanation: "Qwen Code + PAL MCP позволяет использовать разные LLM (Claude, Gemini, O3, Ollama) для разных подзадач — уникальная возможность, недоступная в Codex (только OpenAI)."
      }
    ],
    sources: [
      { title: "Building Effective AI Agents (Anthropic)", url: "https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf", domain: "resources.anthropic.com" },
      { title: "Orchestrator-Worker Agents: Practical Comparison", url: "https://arize.com/blog/orchestrator-worker-agents-a-practical-comparison-of-common-agent-frameworks/", domain: "arize.com" },
      { title: "120+ Agentic AI Tools Mapped (2026)", url: "https://www.stackone.com/blog/ai-agent-tools-landscape-2026/", domain: "stackone.com" }
    ]
  },
  {
    id: 8,
    title: "Production: безопасность, экономика, лучшие практики",
    goal: "Подготовиться к внедрению мультиагентных workflow в production с учётом безопасности и стоимости",
    objectives: [
      "Рассчитать стоимость мультиагентного workflow",
      "Настроить governance layer для enterprise",
      "Применить чек-лист из 10 пунктов перед production-деплоем",
      "Выбрать оптимальную стратегию для своей команды"
    ],
    body: `<h2>Экономика мультиагентной разработки</h2>

<h3>Реальная стоимость владения</h3>
<table class="comparison-table">
  <tr><th>Инструмент</th><th>Free Tier</th><th>Pro</th><th>Enterprise</th></tr>
  <tr><td><strong>Qwen Code</strong></td><td>2000 req/day бесплатно</td><td>API: $1.2-15/M tokens</td><td>Self-host: $0 + GPU</td></tr>
  <tr><td><strong>Claude Code</strong></td><td>Нет</td><td>$20-200/мес</td><td>Enterprise: договорная</td></tr>
  <tr><td><strong>OpenAI Codex</strong></td><td>Open source CLI</td><td>$20/мес + API</td><td>SOC 2: договорная</td></tr>
</table>

<h3>Мультипликатор субагентов</h3>
<p>Каждый субагент = отдельный API-запрос с полным контекстом:</p>
<ul>
  <li><strong>Одиночный агент:</strong> ~50-100K токенов/час = $1-3/час</li>
  <li><strong>3 субагента (Fan-Out):</strong> ~200-350K токенов/час = $4-10/час</li>
  <li><strong>Agent Teams (3 агента):</strong> ~500K-1M токенов/час = $10-30/час</li>
</ul>

<div class="callout callout-tip">
  <div class="callout-title">💡 Правило 80/20 для субагентов</div>
  80% задач решаются одиночным агентом. Используйте субагентов только для 20% задач, где параллелизм и специализация дают измеримую выгоду: security audit, production deployment, архитектурные решения, мульти-модельный ревью.
</div>

<h2>Governance Layer: 5 столпов</h2>

<h3>1. Visibility (Видимость)</h3>
<pre><code># Логирование всех действий агентов
# Каждый шаг = structured log entry
{
  "agent": "security-auditor",
  "action": "file_read",
  "target": "src/auth/oauth.ts",
  "timestamp": "2026-05-28T10:30:00Z",
  "tokens_used": 2340,
  "result": "found 2 CVEs"
}</code></pre>

<h3>2. Approval Gates</h3>
<pre><code># Критические операции требуют подтверждения:
# - Database migrations
# - Production deployments
# - Deletion of files
# - External API calls
# - Secret/credential modifications</code></pre>

<h3>3. Rollback Strategy</h3>
<p>Каждое действие агента = git commit. При ошибке — откат к любому checkpoint через <code>git checkout</code>.</p>

<h3>4. Rate Limiting</h3>
<pre><code># Ограничения для enterprise:
- Максимум 5 параллельных субагентов
- Лимит 100 API-вызовов в час на агента
- Бюджет $50/день на команду
- Автоматическая пауза при превышении</code></pre>

<h3>5. Audit Trail</h3>
<p>Полная запись всех решений: какой агент, что предложил, почему, что было принято/отклонено человеком.</p>

<h2>Чек-лист перед production</h2>

<div class="callout callout-warn">
  <div class="callout-title">✅ 10 пунктов production-readiness</div>
  <ol style="margin: 0.5rem 0 0 1rem; line-height: 2;">
    <li>Субагенты ограничены глубиной 1</li>
    <li>Файловые конфликты решены (разделение директорий / OpenCrabs)</li>
    <li>Каждое действие = git commit (rollback ready)</li>
    <li>Approval gates на критических операциях</li>
    <li>Логирование всех действий агентов</li>
    <li>Rate limiting настроен</li>
    <li>Бюджет на токены определён и контролируется</li>
    <li>Human-in-the-loop на архитектурных решениях</li>
    <li>Тестовый прогон на staging перед production</li>
    <li>Incident response plan для сбоев агентов</li>
  </ol>
</div>

<h2>Выбор стратегии для вашей команды</h2>

<table class="comparison-table">
  <tr><th>Размер команды</th><th>Рекомендация</th><th>Бюджет/мес</th></tr>
  <tr><td>1-3 разработчика</td><td>Qwen Code + одиночный агент</td><td>$0-20</td></tr>
  <tr><td>5-10 разработчиков</td><td>Qwen Code + PAL MCP (субагенты)</td><td>$50-200</td></tr>
  <tr><td>10-50 разработчиков</td><td>Claude Code + Agent Teams</td><td>$200-1000</td></tr>
  <tr><td>Enterprise</td><td>Гибрид: Qwen (Router) + Claude (Pipeline)</td><td>$1000+</td></tr>
</table>

<h2>Заключение: будущее мультиагентной разработки</h2>

<p>Мы находимся в точке перехода от <strong>промпт-ориентированных «роев»</strong> к <strong>спецификация-ориентированной оркестрации</strong>. В будущем:</p>

<ul>
  <li><strong>Spec-driven:</strong> Агенты будут работать не от промпта, а от формальной спецификации (как TDD, но для AI)</li>
  <li><strong>Self-improving:</strong> Qwen Team активно исследует самосовершенствование Coding Agent</li>
  <li><strong>300+ turns:</strong> Qwen3-Coder-Next масштабирует агентное кодирование до 300 поворотов диалога</li>
  <li><strong>Unified governance:</strong> Единые стандарты управления AI-агентами для enterprise</li>
</ul>

<div class="callout callout-tip">
  <div class="callout-title">🎯 Главный вывод курса</div>
  Координация и «строительные леса» (scaffolding) агентов превосходят по значимости чистую интеллектуальную мощность модели. Qwen Code + PAL MCP даёт максимальную гибкость, Claude Code — максимальную зрелость, Codex — максимальную безопасность. Выбирайте инструмент под задачу, а не задачу под инструмент.
</div>`,
    flashcards: [
      { front: "Мультипликатор субагентов", back: "3 субагента (Fan-Out) = 3-5x стоимость одиночного агента. Agent Teams (3 агента) = 10-15x. Используйте субагентов только для 20% задач, где параллелизм даёт измеримую выгоду." },
      { front: "5 столпов governance", back: "1) Visibility — логирование. 2) Approval Gates — подтверждение критических операций. 3) Rollback — каждое действие = git commit. 4) Rate Limiting — лимиты. 5) Audit Trail — запись решений." },
      { front: "Будущее: Spec-driven orchestration", back: "Переход от промпт-ориентированных роев к спецификация-ориентированной оркестрации. Агенты будут работать от формальной спецификации, как TDD для AI." }
    ],
    quiz: [
      {
        question: "Какая рекомендуемая максимальная глубина вложенности субагентов?",
        options: ["Без ограничений", "3 уровня", "1-2 уровня", "5 уровней"],
        correct: 2,
        explanation: "Рекомендуемая глубина — 1, максимум 2 уровня. Бесконечная вложенность приводит к потере контроля и экспоненциальному росту стоимости."
      },
      {
        question: "Что является главным выводом курса?",
        options: [
          "Qwen Code лучше всех",
          "Claude Code — единственный production-ready инструмент",
          "Координация и scaffolding важнее интеллекта модели",
          "Субагенты не нужны для реальной разработки"
        ],
        correct: 2,
        explanation: "Координация и строительные леса (scaffolding) агентов превосходят по значимости чистую интеллектуальную мощность модели. Выбирайте инструмент под задачу."
      }
    ],
    sources: [
      { title: "Qwen3-Coder-Next: Scaling to 300 Turns", url: "https://qwen.ai/blog?id=qwen3-coder-next", domain: "qwen.ai" },
      { title: "Best AI Coding Agents 2026", url: "https://www.morphllm.com/ai-coding-agent", domain: "morphllm.com" },
      { title: "Multi-Agent Systems: Why Most Fail", url: "https://www.facebook.com/groups/3670562573177653/posts/4521541694746399/", domain: "facebook.com" },
      { title: "PAL MCP Server", url: "https://github.com/BeehiveInnovations/pal-mcp-server", domain: "github.com" }
    ]
  }
];

// === App State ===
let currentLesson = 0;
let completedLessons = JSON.parse(localStorage.getItem("subagents-completed") || "[]");
let quizAnswers = {};

// === Render Functions ===
function startCourse() {
  document.getElementById("course-header").style.display = "none";
  document.getElementById("main-layout").style.display = "grid";
  renderSidebar();
  loadLesson(1);
}

function showOverview() {
  document.getElementById("main-layout").style.display = "none";
  document.getElementById("course-header").style.display = "block";
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function renderSidebar() {
  const list = document.getElementById("lesson-list");
  list.innerHTML = COURSE.map((lesson, i) => {
    const num = i + 1;
    const isActive = num === currentLesson;
    const isCompleted = completedLessons.includes(num);
    return `<li class="${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}"
                onclick="loadLesson(${num})">
      <span class="lesson-num">${num}</span>${lesson.title}
    </li>`;
  }).join("");
  updateProgress();
}

function updateProgress() {
  const pct = (completedLessons.length / COURSE.length) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-text").textContent =
    completedLessons.length + " / " + COURSE.length;
}

function loadLesson(num) {
  currentLesson = num;
  const lesson = COURSE[num - 1];
  const content = document.getElementById("content");

  let html = `<div class="lesson-goal"><strong>🎯 Цель урока:</strong> ${lesson.goal}</div>`;

  html += `<div class="objectives"><h4>📋 После этого урока вы сможете:</h4><ul>`;
  lesson.objectives.forEach(obj => { html += `<li>${obj}</li>`; });
  html += `</ul></div>`;

  html += `<div class="lesson-body">${lesson.body}</div>`;

  // Flashcards
  html += `<div class="flashcards-section"><h3>🃏 Флэш-карточки</h3><div class="flashcard-grid">`;
  lesson.flashcards.forEach((fc, i) => {
    html += `<div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front">${fc.front}</div>
        <div class="flashcard-back">${fc.back}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;

  // Quiz
  html += `<div class="quiz-section"><h3>✅ Проверь себя</h3>`;
  lesson.quiz.forEach((q, qi) => {
    const qid = `q${num}_${qi}`;
    html += `<div class="quiz-question"><p>${qi + 1}. ${q.question}</p><div class="quiz-options">`;
    q.options.forEach((opt, oi) => {
      html += `<div class="quiz-option" id="${qid}_opt${oi}"
                onclick="checkAnswer('${qid}', ${oi}, ${q.correct}, ${num})">${opt}</div>`;
    });
    html += `</div><div class="quiz-feedback" id="${qid}_feedback"></div></div>`;
  });
  html += `</div>`;

  // Sources
  if (lesson.sources && lesson.sources.length > 0) {
    html += `<div class="sources-section"><h3>📚 Источники</h3>`;
    lesson.sources.forEach(s => {
      html += `<a class="source-card" href="${s.url}" target="_blank" rel="noopener">
        ${s.title}<span class="source-domain">${s.domain}</span></a>`;
    });
    html += `</div>`;
  }

  // Navigation
  const isCompleted = completedLessons.includes(num);
  html += `<div class="lesson-nav">`;
  if (num > 1) {
    html += `<button class="nav-btn" onclick="loadLesson(${num - 1})">← Урок ${num - 1}</button>`;
  } else {
    html += `<div></div>`;
  }
  if (num < COURSE.length) {
    html += `<button class="nav-btn ${isCompleted ? "complete" : "primary"}"
              onclick="completeAndNext(${num})">${isCompleted ? "✓ Далее" : "Завершить и далее →"}</button>`;
  } else {
    html += `<button class="nav-btn ${isCompleted ? "complete" : "primary"}"
              onclick="completeCourse(${num})">${isCompleted ? "✓ Курс пройден!" : "Завершить курс 🎉"}</button>`;
  }
  html += `</div>`;

  content.innerHTML = html;
  content.scrollTop = 0;
  renderSidebar();

  // Close mobile sidebar
  document.getElementById("sidebar").classList.remove("open");
}

function checkAnswer(qid, selected, correct, lessonNum) {
  if (quizAnswers[qid] !== undefined) return;
  quizAnswers[qid] = selected;

  const lesson = COURSE[lessonNum - 1];
  const qi = parseInt(qid.split("_")[1].replace("q", ""));
  const q = lesson.quiz[qi];

  // Disable all options
  q.options.forEach((_, oi) => {
    const el = document.getElementById(`${qid}_opt${oi}`);
    el.classList.add("disabled");
    if (oi === correct) el.classList.add("correct");
    if (oi === selected && selected !== correct) el.classList.add("wrong");
  });

  // Show feedback
  const fb = document.getElementById(`${qid}_feedback`);
  fb.textContent = q.explanation;
  fb.className = `quiz-feedback show ${selected === correct ? "correct" : "wrong"}`;
}

function completeAndNext(num) {
  if (!completedLessons.includes(num)) {
    completedLessons.push(num);
    localStorage.setItem("subagents-completed", JSON.stringify(completedLessons));
  }
  loadLesson(num + 1);
}

function completeCourse(num) {
  if (!completedLessons.includes(num)) {
    completedLessons.push(num);
    localStorage.setItem("subagents-completed", JSON.stringify(completedLessons));
  }
  renderSidebar();

  const content = document.getElementById("content");
  const pct = Math.round((completedLessons.length / COURSE.length) * 100);
  content.innerHTML = `
    <div class="final-review">
      <h3>🎉 Поздравляем! Курс завершён!</h3>
      <div class="final-score">${pct}%</div>
      <p style="text-align:center;margin:1rem 0;">Вы изучили все 8 уроков по субагентам в AI Coding Tools.</p>
      <h4>Ключевые выводы:</h4>
      <ul style="margin:1rem 0 1rem 1.5rem;">
        <li><strong>Qwen Code</strong> — максимальная гибкость и бесплатный уровень, субагенты через PAL MCP</li>
        <li><strong>Claude Code</strong> — наиболее зрелые нативные субагенты и Agent Teams</li>
        <li><strong>OpenAI Codex</strong> — лучшая sandbox-изоляция, но vendor lock-in</li>
        <li><strong>Главный принцип:</strong> Координация важнее интеллекта модели</li>
      </ul>
      <p style="text-align:center;margin-top:1.5rem;">
        <button class="nav-btn primary" onclick="completedLessons=[];localStorage.removeItem('subagents-completed');loadLesson(1);">Пройти заново</button>
      </p>
    </div>`;
}
