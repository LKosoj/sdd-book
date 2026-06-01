// ============================================================
// LLM Evaluation — Course Data & Logic
// ============================================================

const courseData = [
  {
    id: 1,
    title: "Зачем оценивать LLM",
    goal: "Понять, почему \"мне кажется, стало лучше\" — это не оценка, и какие бывают подходы к evaluation.",
    objectives: [
      "Объяснить, почему vibes-based evaluation ненадёжна",
      "Различать offline и online evaluation",
      "Знать три уровня evaluation: capability, quality, safety"
    ],
    content: `
      <h4>Проблема "vibes"</h4>
      <p>Самый распространённый способ оценить LLM — открыть чат, задать пару вопросов и решить: "хорошо" или "плохо". Это <strong>vibes-based evaluation</strong> — субъективная, невоспроизводимая и обманчивая.</p>
      <p>Проблемы vibes-based подхода:</p>
      <ul>
        <li><strong>Selection bias</strong> — вы тестируете на удобных примерах, игнорируя edge cases</li>
        <li><strong>Recency bias</strong> — последний ответ влияет на общее впечатление непропорционально</li>
        <li><strong>Non-reproducible</strong> — другой человек (или вы через неделю) придёт к другому выводу</li>
        <li><strong>Масштаб</strong> — невозможно протестировать 1000 случаев вручную каждый раз при изменении</li>
      </ul>

      <div class="key-concept">
        <strong>Goodhart's Law:</strong> "Когда метрика становится целью, она перестаёт быть хорошей метрикой." MMLU score 90% не значит, что модель полезна для вашей задачи. Всегда оценивайте на своих данных.
      </div>

      <h4>Offline vs Online Evaluation</h4>
      <ul>
        <li><strong>Offline</strong> — оценка на заранее подготовленном датасете до деплоя. Быстро, дёшево, воспроизводимо. Но не отражает реальное использование</li>
        <li><strong>Online</strong> — оценка на реальном трафике после деплоя. A/B тесты, user satisfaction, task completion rate. Медленно, но отражает реальность</li>
      </ul>

      <h4>Три уровня evaluation</h4>
      <ul>
        <li><strong>Capability (способности)</strong> — что модель умеет? Код, математика, рассуждения, знания. Бенчмарки: MMLU, HumanEval, GSM8K</li>
        <li><strong>Quality (качество)</strong> — насколько хорошо модель выполняет конкретную задачу? Helpful, accurate, relevant. LLM-as-Judge, human eval</li>
        <li><strong>Safety (безопасность)</strong> — избегает ли модель вредного вывода? Jailbreak resistance, toxicity, PII leakage. Red teaming</li>
      </ul>

      <h4>Когда оценивать?</h4>
      <p>Evaluation — не разовое событие, а непрерывный процесс:</p>
      <ul>
        <li><strong>При выборе модели</strong> — сравнение кандидатов для задачи</li>
        <li><strong>При изменении промпта</strong> — не сломали ли мы что-то?</li>
        <li><strong>При обновлении модели</strong> — новая версия лучше старой?</li>
        <li><strong>В продакшне</strong> — качество не деградирует со временем?</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда заменила Sonnet 4.5 на o3 после того, как o3 показал +6% на MMLU. В продакшне p95-latency вырос в 4 раза, cost в 7 раз, а пользовательская помеха ("ассистент медленно отвечает") выросла на 23%. <strong>Правильно:</strong> сначала составить eval-набор реальных задач компании; сравнить quality × latency × cost. <strong>Антипаттерн:</strong> деплоить модель только потому, что лидерборд её похвалил.
      </div>
    `,
    flashcards: [
      { front: "Vibes-based evaluation", back: "Субъективная оценка \"мне кажется, модель отвечает хорошо\". Проблемы: selection bias, recency bias, невоспроизводимость, невозможность масштабирования." },
      { front: "Offline vs Online eval", back: "Offline = на подготовленном датасете до деплоя (быстро, дёшево). Online = на реальном трафике после деплоя (медленно, но отражает реальность)." },
      { front: "Три уровня evaluation", back: "Capability (что умеет), Quality (насколько хорошо), Safety (не вредит ли). Каждый уровень требует своих метрик и инструментов." },
      { front: "Goodhart's Law в LLM eval", back: "Когда метрика становится целью оптимизации, она перестаёт быть хорошим индикатором качества. MMLU 90% ≠ модель полезна для вашей задачи." },
      { front: "Eval-driven development", back: "Подход: при каждом изменении (промпт, модель, температура) автоматически прогонять eval-набор. Защита от регрессии и фундамент CI/CD для LLM-систем." },
      { front: "Selection bias в vibes-eval", back: "Тестировщик неосознанно выбирает удобные примеры, на которых модель работает. Edge cases и сложные сценарии игнорируются — отсюда ложный оптимизм." },
      { front: "Когда запускать eval?", back: "Минимум 4 точки: при выборе модели, при изменении промпта, при обновлении версии модели, в продакшене как мониторинг качества." }
    ],
    quiz: [
      {
        question: "Почему нельзя полагаться на vibes-based evaluation?",
        options: [
          "Это слишком дорого",
          "Она субъективна, невоспроизводима и подвержена когнитивным искажениям",
          "LLM не поддерживают vibes",
          "Это требует GPU-кластер"
        ],
        correct: 1,
        explanation: "Vibes-based evaluation страдает от selection bias, recency bias и невоспроизводимости. Два человека на одних данных придут к разным выводам."
      },
      {
        question: "Модель показывает 90% на MMLU, но плохо справляется с вашей задачей. Что это иллюстрирует?",
        options: [
          "MMLU сломан",
          "Goodhart's Law — метрика бенчмарка не равна полезности для конкретной задачи",
          "Модель нужно дообучить",
          "Нужно использовать более мощную модель"
        ],
        correct: 1,
        explanation: "Goodhart's Law: когда метрика становится целью, она перестаёт быть хорошей метрикой. MMLU измеряет общие знания, не вашу конкретную задачу."
      },
      {
        question: "Менеджер просит решить: запускать eval только на офлайн-датасете или ещё и в продакшене? Что ответить?",
        options: [
          "Только офлайн — продакшн дорогой",
          "Только онлайн — офлайн не отражает реальность",
          "Оба: офлайн ловит регрессии до деплоя, онлайн — реальные дрейфы качества",
          "Достаточно опроса пользователей"
        ],
        correct: 2,
        explanation: "Офлайн eval — быстрый и воспроизводимый фильтр на CI, онлайн eval — единственный способ увидеть дрейф качества в реальном трафике. Они дополняют друг друга."
      },
      {
        question: "Какой подход НЕЛЬЗЯ использовать как единственный способ оценки LLM в продакшене?",
        options: [
          "Golden dataset с regression testing",
          "LLM-as-Judge с калибровкой против людей",
          "Vibes-based — открыл чат, задал 5 вопросов",
          "Online A/B-эксперимент по user satisfaction"
        ],
        correct: 2,
        explanation: "Vibes-based не масштабируется и не воспроизводится. Это пригодно как первая проверка \"работает ли вообще\", но не как продакшен-метрика."
      },
      {
        question: "Какой уровень evaluation отвечает за защиту от jailbreak и токсичных ответов?",
        options: ["Capability", "Quality", "Safety", "Ни один — это работа модерации"],
        correct: 2,
        explanation: "Safety-уровень: red teaming, jailbreak resistance, PII leakage, toxicity. Отдельный класс метрик и тестов, не пересекающийся с capability/quality."
      }
    ],
    sources: [
      { title: "Challenges in LLM Evaluation (Chang et al., 2023)", url: "https://arxiv.org/abs/2307.03109", icon: "📄" },
      { title: "Anthropic — Test and Evaluate", url: "https://docs.anthropic.com/en/docs/test-and-evaluate", icon: "🔗" },
      { title: "OpenAI Cookbook — Evaluation", url: "https://cookbook.openai.com/articles/evaluation", icon: "🔗" }
    ]
  },
  {
    id: 2,
    title: "Классические метрики",
    goal: "Освоить традиционные NLP-метрики и понять, почему их недостаточно для оценки современных LLM.",
    objectives: [
      "Применять BLEU, ROUGE и accuracy правильно",
      "Понимать ограничения perplexity",
      "Знать, когда автоматические метрики работают, а когда — нет"
    ],
    content: `
      <h4>BLEU (Bilingual Evaluation Understudy)</h4>
      <div class="metric-card">
        <h5>BLEU — совпадение n-грамм</h5>
        <p>Сравнивает n-граммы (1-4 слова) ответа с reference-ответом. Score 0-1. Хорошо для перевода, плохо для генерации, где много правильных вариантов.</p>
      </div>
      <p>BLEU считает, сколько n-грамм из сгенерированного текста совпадают с эталоном. Проблема: "Кот сидит на коврике" и "На коврике сидит кот" — смысл одинаковый, но BLEU будет низким.</p>

      <h4>ROUGE (Recall-Oriented Understudy for Gisting Evaluation)</h4>
      <div class="metric-card">
        <h5>ROUGE — recall для суммаризации</h5>
        <p>ROUGE-L измеряет длину наибольшей общей подпоследовательности (LCS). Лучше BLEU для суммаризации, но всё ещё surface-level метрика.</p>
      </div>

      <h4>Perplexity</h4>
      <div class="metric-card">
        <h5>Perplexity — уверенность модели</h5>
        <p>Мера того, насколько модель "удивлена" текстом. Ниже = лучше. Полезна для сравнения language models, но не говорит о качестве ответов.</p>
      </div>
      <p>Perplexity = exp(средний negative log-likelihood). Модель с perplexity 10 "выбирает" в среднем из 10 слов на каждом шаге. Но низкая perplexity ≠ хорошие ответы.</p>

      <h4>Accuracy (Exact Match)</h4>
      <p>Для задач с одним правильным ответом (классификация, QA, multiple choice):</p>
      <pre><code>accuracy = correct_answers / total_questions

# Multiple choice: сравниваем выбранный вариант
# Classification: сравниваем предсказанный класс
# QA: exact match или fuzzy match (F1)</code></pre>

      <h4>Полу-семантические метрики: BERTScore и MoverScore</h4>
      <p>Между поверхностными n-gram и полноценным LLM-as-Judge есть промежуточный класс — embedding-based метрики:</p>
      <ul>
        <li><strong>BERTScore</strong> — cosine similarity между токен-эмбеддингами reference и кандидата (precision/recall/F1). Лучше BLEU для парафразов, но всё ещё чувствителен к выбору базовой модели.</li>
        <li><strong>MoverScore</strong> — Earth Mover's Distance между эмбеддингами. Стабильнее BERTScore на длинных текстах.</li>
      </ul>
      <p><strong>Когда использовать:</strong> tracking трендов, дешёвый pre-filter перед LLM-as-Judge. <strong>Когда НЕ использовать:</strong> финальная оценка chat-моделей, оценка кода или JSON-структуры.</p>

      <h4>Почему этого недостаточно?</h4>
      <ul>
        <li><strong>Множественность правильных ответов</strong> — "Париж" и "столица Франции" — оба правильных ответа на "Столица Франции?", но BLEU/EM может не засчитать</li>
        <li><strong>Surface-level</strong> — BLEU не понимает смысл, только совпадение слов</li>
        <li><strong>Нет оценки качества</strong> — модель может генерировать грамматически правильный, но фактически неверный текст с высоким BLEU</li>
        <li><strong>Не подходит для open-ended</strong> — код, эссе, рассуждения невозможно оценить через n-gram overlap</li>
      </ul>

      <div class="key-concept">
        <strong>Правило:</strong> автоматические метрики (BLEU, ROUGE, perplexity) хороши как первый фильтр и для tracking трендов. Но для финальной оценки качества нужны LLM-as-Judge или human evaluation.
      </div>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда измеряла качество чат-бота через BLEU и видела стабильно 0.45 — "не растём". После перехода на LLM-as-Judge оказалось, что качество выросло на 18%, просто бот стал писать парафразами. <strong>Правильно:</strong> для chat — pairwise LLM-as-Judge + win rate; BERTScore как дешёвый pre-filter. <strong>Антипаттерн:</strong> оптимизировать BLEU на open-ended генерации — это оптимизация поверхности, а не смысла.
      </div>
    `,
    flashcards: [
      { front: "BLEU — что измеряет?", back: "Совпадение n-грамм (1-4 слова) между сгенерированным и эталонным текстом. Хорошо для перевода, плохо для open-ended генерации." },
      { front: "Perplexity", back: "Мера \"удивлённости\" модели текстом. exp(avg negative log-likelihood). Низкая perplexity ≠ хорошие ответы — это метрика языкового моделирования, не качества." },
      { front: "Почему BLEU плох для чатботов?", back: "BLEU сравнивает surface-level слова. \"Париж\" и \"столица Франции\" — одинаковый смысл, но низкий BLEU. Не оценивает фактическую корректность." },
      { front: "ROUGE-L", back: "Recall-метрика, измеряет длину наибольшей общей подпоследовательности (LCS) между кандидатом и reference. Подходит для оценки суммаризации." },
      { front: "BERTScore", back: "Cosine similarity между токен-эмбеддингами reference и кандидата. Полу-семантическая метрика: лучше BLEU для парафразов, но зависит от выбора базовой модели." },
      { front: "MoverScore", back: "Earth Mover's Distance между эмбеддингами. Стабильнее BERTScore на длинных текстах, но всё ещё не заменяет LLM-as-Judge для chat-моделей." },
      { front: "Exact Match (EM)", back: "Строгое сравнение строк: ответ либо точно совпал, либо нет. Подходит для multiple choice и classification, плох для свободной формы ответа." }
    ],
    quiz: [
      {
        question: "Perplexity модели снизилась с 15 до 10. Что это значит?",
        options: [
          "Модель стала давать лучшие ответы пользователям",
          "Модель стала лучше предсказывать следующий токен (меньше \"удивлена\" текстом)",
          "Модель стала безопаснее",
          "Ничего, perplexity — бесполезная метрика"
        ],
        correct: 1,
        explanation: "Perplexity измеряет, насколько хорошо модель предсказывает текст. Снижение = лучше language modeling. Но это НЕ гарантирует, что ответы стали полезнее для пользователя."
      },
      {
        question: "Какая метрика лучше всего подходит для оценки суммаризации?",
        options: ["BLEU", "Perplexity", "ROUGE-L", "Accuracy"],
        correct: 2,
        explanation: "ROUGE-L (наибольшая общая подпоследовательность) лучше всего подходит для суммаризации — она учитывает порядок слов и не требует точного совпадения фраз."
      },
      {
        question: "Когда BLEU всё ещё уместная метрика?",
        options: [
          "Оценка чат-бота с открытыми ответами",
          "Машинный перевод и формализованная суммаризация с одним каноническим эталоном",
          "Оценка качества кода",
          "Никогда — BLEU полностью устарел"
        ],
        correct: 1,
        explanation: "BLEU создан для MT и до сих пор остаётся базовой метрикой в этой области. Главное условие — есть канонический reference и ограниченное число валидных формулировок."
      },
      {
        question: "Команда внедряет BERTScore вместо BLEU. Какой главный риск нужно учесть?",
        options: [
          "BERTScore вообще не работает",
          "BERTScore чувствителен к выбору базовой embedding-модели и не заменяет judge для chat",
          "BERTScore слишком быстрый",
          "Этой метрики не существует"
        ],
        correct: 1,
        explanation: "Embedding-метрики зависят от базовой модели (mBERT, DeBERTa и т.п.) — смена модели меняет числа. Для финальной оценки chat-систем нужен LLM-as-Judge."
      },
      {
        question: "Какой АНТИПАТТЕРН встречается при использовании автоматических метрик?",
        options: [
          "Использовать BLEU как первичный сигнал на CI",
          "Тренировать модель на максимизацию BLEU/ROUGE и считать это качеством",
          "Дополнять автоматические метрики LLM-as-Judge",
          "Считать perplexity при предтренировке"
        ],
        correct: 1,
        explanation: "Прямая оптимизация поверхностной метрики приводит к Goodhart's Law: метрика растёт, реальное качество — нет. Метрика должна быть индикатором, а не целью."
      }
    ],
    sources: [
      { title: "BLEU (Papineni, 2002)", url: "https://aclanthology.org/P02-1040/", icon: "📄" },
      { title: "ROUGE (Lin, 2004)", url: "https://aclanthology.org/W04-1013/", icon: "📄" },
      { title: "BERTScore (Zhang et al., 2020)", url: "https://arxiv.org/abs/1904.09675", icon: "📄" },
      { title: "MoverScore (Zhao et al., 2019)", url: "https://arxiv.org/abs/1909.02622", icon: "📄" }
    ]
  },
  {
    id: 3,
    title: "Бенчмарки LLM",
    goal: "Разобраться в экосистеме бенчмарков: что измеряют, как интерпретировать и почему не стоит им слепо доверять.",
    objectives: [
      "Знать ключевые бенчмарки и что каждый измеряет",
      "Понимать проблему data contamination",
      "Критически интерпретировать leaderboard-рейтинги"
    ],
    content: `
      <h4>Экосистема бенчмарков</h4>

      <div class="metric-card">
        <h5>MMLU (Massive Multitask Language Understanding)</h5>
        <p>57 предметов, 15K multiple-choice вопросов. Измеряет breadth знаний. GPT-4: 87%. Но: много вопросов из training data (contamination).</p>
      </div>

      <div class="metric-card">
        <h5>HumanEval / MBPP</h5>
        <p>Кодогенерация. HumanEval: 164 Python-функций с тестами. MBPP: 974 задачи. Измеряют pass@k — вероятность, что хотя бы один из k сэмплов пройдёт тесты.</p>
      </div>

      <div class="metric-card">
        <h5>GSM8K</h5>
        <p>8500 математических задач уровня средней школы. Измеряет multi-step reasoning. Простые задачи, но требуют цепочку рассуждений.</p>
      </div>

      <h4>pass@k против pass^k</h4>
      <p>Две метрики выглядят похоже, но измеряют противоположные вещи. Обе считаются от вероятности успеха одной попытки p. Числа ниже — иллюстрация при p = 0.70 (70% успеха на одну попытку):</p>
      <ul>
        <li><strong>pass@k</strong> — успешна хотя бы ОДНА из k попыток. Формула: pass@k = 1 − (1 − p)^k. С ростом k метрика РАСТЁТ: k=1 → 70%, k=3 → 91%, k=5 → 97%. Чем больше попыток, тем выше шанс, что хотя бы одна сработает.</li>
        <li><strong>pass^k</strong> — успешны ВСЕ k попыток. Формула: pass^k = p^k. С ростом k метрика ПАДАЕТ: k=1 → 70%, k=3 → 34%, k=5 → 17%. Чем больше попыток, тем труднее не споткнуться ни разу.</li>
      </ul>
      <p>Важно: эти проценты не зашиты в метрику, они выводятся из p. При другом p числа меняются (например, при p = 0.90: pass@3 ≈ 99.9%, pass^3 ≈ 73%), но направление трендов то же — pass@k растёт с k, pass^k падает.</p>

      <div class="key-concept">
        <strong>Когда что использовать.</strong> pass@k — когда достаточно, чтобы заработало хотя бы раз: кодген с верификатором (тесты, компилятор, линтер), где можно сгенерировать k вариантов и взять первый рабочий. pass^k — когда критична консистентность и надёжность: агент в проде, который должен отрабатывать сценарий повторяемо, без срывов на каждом N-м запуске. Высокий pass@1 при низком pass^5 — сигнал, что система решает задачу, но нестабильно.
      </div>

      <div class="metric-card">
        <h5>MT-Bench</h5>
        <p>80 multi-turn вопросов, оцениваемых GPT-4. Измеряет quality в диалоге: writing, reasoning, math, coding, roleplay. Более репрезентативен, чем MMLU.</p>
      </div>

      <div class="metric-card">
        <h5>Chatbot Arena (LMSYS)</h5>
        <p>Краудсорсинговые battle: пользователи голосуют за лучший ответ из двух анонимных моделей. ELO-рейтинг. Считается наиболее приближенным к реальным предпочтениям людей.</p>
      </div>

      <h4>⚠️ Насыщение классических бенчмарков</h4>
      <p>К 2025–2026 фронтирные модели "кластеризуются у потолка" MMLU (≥90%) и HumanEval (≥95%). Это значит:</p>
      <ul>
        <li>Разница в 1–2% на MMLU между топ-моделями <strong>статистически незначима</strong></li>
        <li>HellaSwag практически бесполезен для frontier-моделей, остался baseline для маленьких/файнтюненных</li>
        <li>Open LLM Leaderboard перешёл на <strong>v2</strong> с MMLU-Pro, GPQA, MUSR, MATH Lvl 5, IFEval, BBH</li>
      </ul>
      <p>Урок 8 расскажет про современный стек бенчмарков (MMLU-Pro, GPQA Diamond, SWE-bench Verified, FrontierMath, HLE, ARC-AGI-2).</p>

      <h4>Data Contamination</h4>
      <p>Главная проблема бенчмарков: данные из бенчмарков попадают в training data. Модель "запоминает" ответы вместо того, чтобы решать задачи.</p>

      <div class="key-concept">
        <strong>Decontamination:</strong> перед оценкой проверять, не было ли данных бенчмарка в training set. EleutherAI lm-eval-harness делает это автоматически: n-gram overlap между бенчмарком и training corpus > 10% = загрязнено. Альтернатива — динамические бенчмарки (LiveBench), которые регулярно обновляются (см. урок 14).
      </div>

      <h4>Как читать leaderboards</h4>
      <ul>
        <li><strong>Разные модели, разные условия</strong> — temperature, max tokens, system prompt — всё влияет на результат</li>
        <li><strong>Cherry-picking</strong> — компании публикуют только выгодные бенчмарки</li>
        <li><strong>Self-reported ≠ independent</strong> — независимые тесты (LMSYS, Open LLM Leaderboard v2) надёжнее</li>
        <li><strong>Разрыв в 1-2% несущественен</strong> — в пределах статистической погрешности</li>
      </ul>

      <h4>Практический совет</h4>
      <p>Используйте бенчмарки как <strong>первый фильтр</strong> при выборе модели. Если модель показывает 60% на MMLU, а ваша задача требует reasoning — она не подойдёт. Но финальное решение принимайте на основе evaluation своих данных.</p>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда взяла модель из топ-3 Chatbot Arena и развернула её для юридического ассистента. Через месяц юристы пожаловались на галлюцинации в цитатах статей. <strong>Правильно:</strong> Arena показывает общие preferences, для domain-задачи нужен domain-eval (LegalBench, собственный golden set с верификацией цитат). <strong>Антипаттерн:</strong> переносить общий лидерборд на специализированную задачу без domain evaluation.
      </div>
    `,
    flashcards: [
      { front: "MMLU", back: "57 предметов, 15K multiple-choice. Измеряет breadth знаний. К 2025–2026 насыщен у фронтирных моделей — используется как baseline, не differentiator." },
      { front: "pass@k (HumanEval)", back: "Вероятность, что хотя бы один из k сгенерированных вариантов кода пройдёт все тесты. pass@1 = greedy, pass@10 = берём 10 попыток." },
      { front: "pass@k vs pass^k", back: "pass@k = 1−(1−p)^k — успешна хотя бы ОДНА из k попыток, растёт с k (p=0.7: k=1→70%, k=3→91%, k=5→97%). pass^k = p^k — успешны ВСЕ k попыток, падает с k (p=0.7: k=1→70%, k=3→34%, k=5→17%). Числа выводятся из p." },
      { front: "Когда pass@k, когда pass^k?", back: "pass@k — когда достаточно, чтобы заработало хотя бы раз (кодген с верификатором: тесты/компилятор отберут рабочий вариант). pass^k — когда критична консистентность и надёжность (агент в проде, повторяемость без срывов)." },
      { front: "Chatbot Arena (LMSYS)", back: "Краудсорсинговые blind battles: пользователи голосуют за лучший из двух анонимных ответов. ELO-рейтинг. Ближе всего к реальным preferences." },
      { front: "Data contamination", back: "Тестовые данные бенчмарка попали в training set. Модель не решает задачи — вспоминает ответы. Решение: n-gram overlap check, динамические бенчмарки." },
      { front: "MT-Bench", back: "80 multi-turn вопросов, оцениваемых GPT-4 в pointwise режиме. Старая, но всё ещё используемая метрика качества чата." },
      { front: "Open LLM Leaderboard v2", back: "Обновлённая версия Hugging Face лидерборда: MMLU-Pro, GPQA, MUSR, MATH Lvl 5, IFEval, BBH. Старый v1 был насыщен у топ-моделей." },
      { front: "Cherry-picking бенчмарков", back: "Антипаттерн: вендор показывает только бенчмарки, где его модель в топе. Защита — смотреть независимые лидерборды и собственный domain-eval." },
      { front: "Статзначимость 1–2% на MMLU", back: "Разница в 1–2 п.п. между топ-моделями на насыщенном бенчмарке обычно находится в пределах ошибки выборки. Не основание для решений." }
    ],
    quiz: [
      {
        question: "Модель A показывает 88% на MMLU, модель B — 86%. Модель A точно лучше?",
        options: [
          "Да, 2% — значимая разница",
          "Необязательно — разница может быть в пределах погрешности, и MMLU не измеряет качество для конкретной задачи",
          "Нет, MMLU — бесполезный бенчмарк",
          "Зависит от размера модели"
        ],
        correct: 1,
        explanation: "Разница в 2% на MMLU может быть статистически незначимой. Главное: MMLU измеряет общие знания, не качество для вашей конкретной задачи."
      },
      {
        question: "Что такое data contamination в контексте бенчмарков?",
        options: [
          "Бенчмарк содержит ошибки",
          "Данные из бенчмарка попали в training data модели, и она \"запоминает\" ответы",
          "Модель генерирует токсичный контент",
          "Бенчмарк устарел"
        ],
        correct: 1,
        explanation: "Data contamination — когда тестовые данные бенчмарка оказываются в training set. Модель не решает задачи, а вспоминает ответы — результаты завышены."
      },
      {
        question: "Вендор рапортует только MMLU и HumanEval, замалчивая GPQA и SWE-bench. Что это?",
        options: [
          "Нормальная практика — больше бенчмарков не нужно",
          "Cherry-picking — отбор удобных бенчмарков. Нужны независимые лидерборды и domain-eval",
          "Признак, что модель не работает",
          "Сэкономили время на тестирование"
        ],
        correct: 1,
        explanation: "Cherry-picking — антипаттерн. Защита: смотреть Open LLM Leaderboard v2, Chatbot Arena, Artificial Analysis и собственный eval."
      },
      {
        question: "Почему HellaSwag к 2025–2026 потерял ценность для фронтирных моделей?",
        options: [
          "Бенчмарк сломан",
          "Все топ-модели показывают >95% — нет разрешающей способности между ними",
          "Это бенчмарк только для русского языка",
          "Авторы его удалили"
        ],
        correct: 1,
        explanation: "Насыщение бенчмарка — общая болезнь классики 2020–2022. Frontier-модели кластеризуются у потолка. HellaSwag сохраняет ценность для маленьких/файнтюненных моделей."
      },
      {
        question: "Команда выбирает модель по топ-3 Chatbot Arena, не делая domain-eval. Какой риск?",
        options: [
          "Никакого, Arena — лучший бенчмарк",
          "Arena измеряет общие preferences; на специализированной задаче (юридический, медицинский ассистент) модель может галлюцинировать",
          "Arena платная",
          "Arena устарела"
        ],
        correct: 1,
        explanation: "Arena показывает усреднённые preferences широкой аудитории. Domain-задача требует domain-eval: LegalBench, MedQA, собственный golden set."
      },
      {
        question: "Агент в проде должен отрабатывать сценарий повторяемо, без срывов на каждом N-м запуске. Какую метрику смотреть?",
        options: [
          "pass@k — нужна хотя бы одна успешная попытка из k",
          "pass^k — нужно, чтобы успешны были ВСЕ k попыток подряд",
          "perplexity — она измеряет надёжность",
          "BLEU — он отражает консистентность"
        ],
        correct: 1,
        explanation: "Консистентность и надёжность измеряет pass^k = p^k: успешны должны быть все k попыток. Она падает с ростом k и обнажает нестабильность. pass@k наоборот растёт с k и подходит, когда достаточно одной удачной попытки (кодген с верификатором)."
      }
    ],
    sources: [
      { title: "MMLU (Hendrycks, 2021)", url: "https://arxiv.org/abs/2009.03300", icon: "📄" },
      { title: "Chatbot Arena (LMSYS)", url: "https://chat.lmsys.org/", icon: "🔗" },
      { title: "Open LLM Leaderboard v2 (HuggingFace)", url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard", icon: "🔗" },
      { title: "Artificial Analysis — независимый лидерборд", url: "https://artificialanalysis.ai/", icon: "🔗" }
    ]
  },
  {
    id: 4,
    title: "LLM-as-Judge",
    goal: "Научиться использовать LLM для оценки других LLM — самый практичный подход к evaluation.",
    objectives: [
      "Настраивать LLM-as-Judge с правильным промптом",
      "Минимизировать bias (позиционный, verbose, self-preference)",
      "Калибровать judge против human evaluation"
    ],
    content: `
      <h4>Почему LLM-as-Judge</h4>
      <p>Классические метрики не ловят смысл. Human evaluation — дорого и медленно. <strong>LLM-as-Judge</strong> — золотая середина: использует мощную модель (GPT-4, Claude) для оценки ответов другой модели.</p>

      <pre><code>// Типичный LLM-as-Judge промпт (pairwise со swap)
System: You are an expert evaluator. Compare two responses
to the same question and pick the better one.
Do NOT reward longer responses unless they add real value.
Output JSON: { "winner": "A" | "B" | "tie", "reason": "..." }

User: Question: {question}
Response A: {response_a}
Response B: {response_b}

# В пайплайне запускайте дважды: (A,B) и (B,A) — усредняйте</code></pre>

      <h4>Два режима оценки</h4>
      <ul>
        <li><strong>Pointwise (score)</strong> — judge даёт оценку одному ответу по шкале. Проще, но нестабильно (оценки "прыгают")</li>
        <li><strong>Pairwise (comparison)</strong> — judge сравнивает два ответа и выбирает лучший. Более надёжно, используется в Chatbot Arena</li>
      </ul>

      <div class="key-concept">
        <strong>Pairwise > Pointwise:</strong> людям и LLM проще сказать "A лучше B", чем поставить абсолютную оценку. Pairwise даёт более стабильные и воспроизводимые результаты.
      </div>

      <h4>Bias в LLM-as-Judge</h4>
      <ul>
        <li><strong>Position bias</strong> — склонность выбирать первый (или последний) вариант в pairwise. <em>Решение:</em> показывать ответы в обоих порядках и усреднять</li>
        <li><strong>Verbosity bias</strong> — более длинные ответы получают лучшие оценки, даже если они не лучше. <em>Решение:</em> включить в промпт "do not reward length"</li>
        <li><strong>Self-preference bias</strong> — GPT-4 оценивает ответы в стиле GPT-4 выше. <em>Решение:</em> использовать judge-модель, отличную от оцениваемых; ensemble из 2+ judges</li>
        <li><strong>Authority bias</strong> — модель "увереннее" звучит → оценка выше. <em>Решение:</em> просить проверять факты, а не стиль</li>
      </ul>
      <p>Этот урок даёт базу. Урок 11 расскажет о продвинутых техниках: permutation calibration, rubric-as-a-judge, autoraters (Google), открытые judge-модели Prometheus 2 и JudgeLM.</p>

      <h4>Калибровка</h4>
      <p>Перед использованием LLM-as-Judge в продакшне:</p>
      <ul>
        <li>Подготовьте 50-100 пар (вопрос, ответ, human rating)</li>
        <li>Запустите judge и посчитайте согласие с человеком (Cohen's kappa, Kendall's tau)</li>
        <li>Если согласие &lt; 0.6 — переработайте промпт judge или добавьте few-shot примеры</li>
        <li>Периодически re-калибруйте на свежих данных</li>
      </ul>

      <h4>Структурированный output</h4>
      <p>Всегда просите judge возвращать <code>structured JSON</code>, а не свободный текст. Это позволяет автоматически агрегировать результаты, строить дашборды и обнаруживать аномалии.</p>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда внедрила pairwise judge без swap-augmentation. Через неделю заметили, что новая версия "выигрывает" на 8% — но только когда стоит в позиции A. После добавления swap (запускать (A,B) и (B,A)) win rate упал до 51% — модели почти равны. <strong>Правильно:</strong> swap-augmentation обязателен; победитель — тот, кто выиграл оба порядка. <strong>Антипаттерн:</strong> делать выводы по одному порядку без проверки на position bias.
      </div>
    `,
    flashcards: [
      { front: "LLM-as-Judge", back: "Использование мощной LLM (GPT-4, Claude) для оценки ответов другой модели. Золотая середина между неточными автоматическими метриками и дорогой human evaluation." },
      { front: "Pairwise vs Pointwise", back: "Pointwise = оценка одному ответу (score 1-5). Pairwise = сравнение двух ответов (A лучше B). Pairwise стабильнее и воспроизводимее." },
      { front: "Position bias в LLM-as-Judge", back: "Склонность выбирать первый/последний вариант в pairwise сравнении. Решение: показывать ответы в обоих порядках (swap) и усреднять результаты." },
      { front: "Verbosity bias", back: "Judge оценивает длинные ответы выше, даже если они не лучше коротких. Решение: явная инструкция \"do not reward length\" и контроль длины." },
      { front: "Self-preference bias", back: "Judge на основе GPT-4 предпочитает ответы в стиле GPT-4. Решение: cross-model judge (Claude судит GPT-4 и наоборот) или ensemble из 2+ judges." },
      { front: "Калибровка judge", back: "Минимум 50–100 примеров с human rating, Cohen's kappa или Kendall's tau между judge и человеком. Порог приемлемости — обычно 0.6+." },
      { front: "Структурированный output judge", back: "JSON-формат с полями winner/score/reason. Позволяет агрегировать в дашборды, отслеживать дрейф и автоматизировать pipeline." }
    ],
    quiz: [
      {
        question: "Какой режим LLM-as-Judge даёт более стабильные результаты?",
        options: ["Pointwise (score 1-5)", "Pairwise (A vs B comparison)", "Binary (good/bad)", "Нет разницы"],
        correct: 1,
        explanation: "Pairwise стабильнее: и людям, и LLM проще сравнить два ответа, чем поставить абсолютную оценку. Это основа Chatbot Arena."
      },
      {
        question: "Judge-модель (GPT-4) систематически оценивает длинные ответы выше. Какой это bias?",
        options: ["Position bias", "Self-preference bias", "Verbosity bias", "Authority bias"],
        correct: 2,
        explanation: "Verbosity bias — склонность оценивать длинные ответы выше, даже если они не качественнее коротких. Решение: явно указать в промпте \"do not reward verbosity\"."
      },
      {
        question: "Cohen's kappa между judge и человеком = 0.42. Что делать?",
        options: [
          "Деплоить — это нормальный уровень",
          "Переработать промпт judge, добавить few-shot примеры; не использовать judge как продакшен-метрику до повторной калибровки",
          "Удвоить датасет",
          "Использовать другую LLM как ground truth"
        ],
        correct: 1,
        explanation: "Kappa 0.4 — moderate, ниже приемлемого порога 0.6. До калибровки judge нельзя считать продакшен-метрикой."
      },
      {
        question: "Команда использует Claude для оценки Claude. Почему это плохая идея?",
        options: [
          "Claude не умеет оценивать",
          "Self-preference bias: модель систематически предпочитает свой стиль ответа",
          "Это слишком дорого",
          "У Claude нет json-режима"
        ],
        correct: 1,
        explanation: "Self-preference bias задокументирован для всех topcoder-моделей. Решение: cross-model (Claude судит GPT, GPT — Claude) или ensemble из 2+ judges."
      },
      {
        question: "Антипаттерн при настройке pairwise judge:",
        options: [
          "Запускать (A,B) и (B,A) и усреднять",
          "Просить JSON-output",
          "Делать выводы по одному порядку без swap-augmentation",
          "Калибровать против 50–100 human-labeled примеров"
        ],
        correct: 2,
        explanation: "Без swap результаты искажены position bias. Стандарт: запускать оба порядка, победитель — тот, кто выиграл оба прогона; если разнятся — \"tie\"."
      }
    ],
    sources: [
      { title: "Eugene Yan — LLM Evaluators", url: "https://eugeneyan.com/writing/llm-evaluators/", icon: "🔗" },
      { title: "Judging LLM-as-a-Judge (Zheng, 2023)", url: "https://arxiv.org/abs/2306.05685", icon: "📄" },
      { title: "MT-Bench и Chatbot Arena", url: "https://arxiv.org/html/2306.05685v4", icon: "📄" },
      { title: "Robust Multiple Choice Selectors (Zheng, 2023)", url: "https://arxiv.org/abs/2309.03882", icon: "📄" }
    ]
  },
  {
    id: 5,
    title: "Evaluation Pipeline",
    goal: "Построить систематический процесс оценки: от golden dataset до regression testing в CI/CD.",
    objectives: [
      "Создавать golden dataset для своей задачи",
      "Настраивать regression testing при каждом изменении",
      "Проводить A/B evaluation для сравнения версий"
    ],
    content: `
      <h4>Golden Dataset</h4>
      <p><strong>Golden dataset</strong> — набор пар (input, expected output), который служит эталоном для оценки. Это фундамент всего evaluation pipeline.</p>

      <pre><code>// Структура golden dataset
[
  {
    "input": "Объясни квантовую запутанность простыми словами",
    "expected": "...", // эталонный ответ
    "metadata": {
      "category": "science",
      "difficulty": "medium",
      "tags": ["explanation", "physics"]
    }
  },
  ...
]</code></pre>

      <h4>Как собрать golden dataset</h4>
      <ul>
        <li><strong>Реальные запросы</strong> — возьмите 200-500 реальных запросов пользователей</li>
        <li><strong>Экспертные ответы</strong> — domain expert пишет эталонный ответ для каждого</li>
        <li><strong>Разнообразие</strong> — покрывайте разные категории, сложности, edge cases</li>
        <li><strong>Критерии оценки</strong> — для каждого примера определите, что считать "правильным"</li>
        <li><strong>Обновление</strong> — добавляйте новые примеры по мере обнаружения проблем</li>
      </ul>

      <div class="key-concept">
        <strong>Правило 100/500/1000:</strong> Для первого запуска достаточно 100 примеров. Для серьёзной evaluation — 500. Для production monitoring — 1000+. Качество примеров важнее количества.
      </div>

      <h4>Regression Testing</h4>
      <p>Каждый раз при изменении (промпт, модель, температура, system prompt) прогоняйте golden dataset:</p>
      <pre><code>// Regression testing pipeline
1. Изменение внесено (prompt / model / config)
2. Прогнать golden dataset через новую версию
3. Сравнить метрики с baseline:
   - Если новая версия хуже baseline → блокировать deploy
   - Если лучше или равна → разрешить deploy
4. Сохранить результаты для истории</code></pre>

      <h4>Checkpoint-based vs continuous evals</h4>
      <p>Eval-петля бывает двух типов, и они не взаимоисключающие — зрелые команды используют оба:</p>
      <ul>
        <li><strong>Checkpoint-based</strong> — явные контрольные точки в процессе. На каждой точке прогон проверяется против заданных критериев, и если они не выполнены, дефект чинят ДО продолжения работы. Подходит для пошаговых изменений: завершили этап промпт-инжиниринга — прошли чекпойнт — двинулись дальше. Дёшево, потому что запуск инициируется осознанно, а не по таймеру.</li>
        <li><strong>Continuous</strong> — запуск автоматически каждые N минут или после каждого крупного изменения. Полный прогон тестов плюс линт. Ловит регрессии рано, не дожидаясь ручной проверки, но стоит дороже: каждый прогон полного golden set — это деньги на API и латентность.</li>
      </ul>
      <p><strong>Trade-off.</strong> Continuous даёт раннее обнаружение регрессий ценой стоимости и латентности — гонять 1000 примеров каждые 10 минут разорительно. Checkpoint дешевле и быстрее, но регрессия может прожить незамеченной между точками. Практичный компромисс: continuous на быстром smoke-наборе (20–50 примеров) после каждого изменения, full golden set — на checkpoint перед мержем или релизом.</p>

      <div class="key-concept">
        <strong>Когда что.</strong> Checkpoint-based — для итеративной разработки промпта/агента, где важно не идти дальше с поломанным этапом. Continuous — для защиты main-ветки и долгих сессий, где регрессию надо поймать сразу. Цена ошибки растёт со временем обнаружения, поэтому критичные пути держат под continuous, остальное — под checkpoint.
      </div>

      <h4>Promptfoo в CI/CD</h4>
      <p>Promptfoo описывает eval как YAML — удобно держать в репозитории и запускать на GitHub Actions:</p>
      <pre><code># promptfooconfig.yaml
prompts:
  - file://prompts/system.txt
providers:
  - openai:gpt-4o-mini
  - anthropic:claude-sonnet-4-5
tests:
  - vars:
      question: "Объясни квантовую запутанность"
    assert:
      - type: llm-rubric
        value: "Ответ корректен, упоминает измерение и нелокальность"
      - type: cost
        threshold: 0.01
      - type: latency
        threshold: 3000</code></pre>

      <h4>DeepEval как pytest для LLM</h4>
      <pre><code># test_chat.py
from deepeval import assert_test
from deepeval.metrics import (
    AnswerRelevancyMetric, FaithfulnessMetric
)
from deepeval.test_case import LLMTestCase

def test_qa_faithfulness():
    case = LLMTestCase(
        input="Сколько лет Земле?",
        actual_output=chat("Сколько лет Земле?"),
        retrieval_context=["Возраст Земли — 4.54 млрд лет"]
    )
    assert_test(case, [
        AnswerRelevancyMetric(threshold=0.7),
        FaithfulnessMetric(threshold=0.8)
    ])</code></pre>

      <h4>A/B Evaluation</h4>
      <p>Сравнение двух версий системы на одних и тех же данных:</p>
      <ul>
        <li>Версия A (baseline) и версия B (candidate) получают одинаковые inputs</li>
        <li>LLM-as-Judge оценивает оба ответа в pairwise режиме</li>
        <li>Результат: win rate B против A, разбивка по категориям</li>
        <li>Решение о deploy: B должна выигрывать статистически значимо (p &lt; 0.05)</li>
      </ul>

      <h4>Метрики для pipeline</h4>
      <ul>
        <li><strong>Pass rate</strong> — % примеров, где ответ прошёл пороговую оценку</li>
        <li><strong>Win rate</strong> — % примеров, где новая версия лучше baseline</li>
        <li><strong>Average score</strong> — средняя оценка по шкале</li>
        <li><strong>Regression rate</strong> — % примеров, где стало хуже (самая важная метрика)</li>
        <li><strong>Cost & latency per case</strong> — quality нельзя оптимизировать в отрыве от p95-latency и $-per-eval</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда сделала eval только на 30 хорошо подобранных примерах и довела win rate до 78%. После выкатки получили шквал жалоб — golden set не покрывал длинные и многоязычные запросы. <strong>Правильно:</strong> 200–500 примеров со стратификацией (короткие/длинные, EN/RU, easy/hard, edge cases). <strong>Антипаттерн:</strong> тренировать промпт против маленького cherry-picked golden set — overfitting на eval.
      </div>
    `,
    flashcards: [
      { front: "Golden Dataset", back: "Набор пар (input, expected output), собранный из реальных запросов с эталонными ответами от экспертов. Фундамент evaluation pipeline." },
      { front: "Regression Testing", back: "При каждом изменении (промпт, модель, config) прогонять golden dataset. Если метрики хуже baseline → блокировать deploy. Защита от деградации качества." },
      { front: "Regression rate", back: "% примеров, где новая версия хуже baseline. Самая важная метрика в evaluation pipeline — показывает, что именно сломалось." },
      { front: "Checkpoint-based vs continuous evals", back: "Checkpoint = явные контрольные точки, проверка против критериев, починка до продолжения (дёшево, но регрессия живёт между точками). Continuous = запуск каждые N минут или после крупных изменений, full тесты + линт (раннее обнаружение ценой стоимости/латентности)." },
      { front: "Promptfoo", back: "YAML-конфиг для eval промптов и моделей, запускается в CI. Поддерживает llm-rubric, cost/latency thresholds, providers OpenAI/Anthropic/локальные." },
      { front: "DeepEval", back: "pytest для LLM: тесты как функции test_*(), 14+ метрик (AnswerRelevancy, Faithfulness, ContextRelevancy...), assert_test() с порогами." },
      { front: "A/B evaluation", back: "Baseline vs candidate на одних inputs. LLM-as-Judge в pairwise режиме со swap. Решение о deploy — статзначимый win rate (p < 0.05)." },
      { front: "Stratified golden set", back: "Покрытие по осям: длина (short/long), язык (EN/RU/др.), сложность (easy/hard), категория задачи. Иначе eval-метрика лжёт о реальном качестве." },
      { front: "Overfitting на eval", back: "Антипаттерн: тренировать промпт против маленького cherry-picked golden set до 95%. В продакшне — провал. Решение: держать holdout-набор, обновлять регулярно." }
    ],
    quiz: [
      {
        question: "Сколько примеров нужно для первого запуска evaluation?",
        options: ["10-20", "100 (достаточно для старта)", "10000", "Миллион"],
        correct: 1,
        explanation: "Правило 100/500/1000: для первого запуска достаточно 100 качественных примеров. 500 — для серьёзной evaluation. 1000+ — для production monitoring."
      },
      {
        question: "При regression testing новая версия показала win rate 48% (baseline = 52%). Что делать?",
        options: [
          "Задеплоить, разница маленькая",
          "Заблокировать deploy — новая версия статистически хуже baseline",
          "Увеличить температуру",
          "Добавить больше данных в golden dataset"
        ],
        correct: 1,
        explanation: "Win rate < 50% означает, что новая версия проигрывает baseline. Если разница статистически значима — deploy блокируется. Это и есть цель regression testing."
      },
      {
        question: "Менеджер просит инструмент для eval промптов в CI на GitHub Actions с YAML-конфигом. Что подойдёт?",
        options: [
          "lm-evaluation-harness — стандартные академические бенчмарки",
          "Promptfoo — YAML-конфиг, providers, llm-rubric, cost/latency assertions",
          "MMLU",
          "Chatbot Arena"
        ],
        correct: 1,
        explanation: "Promptfoo заточен под eval промптов в CI: YAML-конфиг, providers (OpenAI/Anthropic/локальные), llm-rubric, cost и latency thresholds, JUnit-формат отчётов."
      },
      {
        question: "Команда довела win rate до 95% на 25 примерах. Что не так?",
        options: [
          "Всё отлично, можно деплоить",
          "Маленький golden set → overfitting на eval. Нужен холдаут и расширение до 200–500 стратифицированных примеров",
          "Win rate всегда должен быть 100%",
          "Нужно перейти на pointwise"
        ],
        correct: 1,
        explanation: "На малом cherry-picked наборе легко получить 95% за счёт overfitting промпта под примеры. Защита: holdout, рост и стратификация golden set, мониторинг продакшна."
      },
      {
        question: "Какая метрика в eval pipeline САМАЯ диагностически ценная?",
        options: [
          "Average score — даёт одно число",
          "Regression rate — % примеров, где стало хуже baseline; точно указывает, что именно сломалось",
          "Pass rate — % выше порога",
          "Total cost"
        ],
        correct: 1,
        explanation: "Regression rate точечно показывает, что сломалось. Average может оставаться стабильным, маскируя локальные деградации."
      },
      {
        question: "Команда хочет ловить регрессии как можно раньше в долгой сессии разработки, но полный golden set на 1000 примеров дорого гонять каждые 10 минут. Что выбрать?",
        options: [
          "Только checkpoint-based на full golden set перед мержем — этого хватит",
          "Continuous на быстром smoke-наборе (20–50 примеров) после каждого изменения, а full golden set — на checkpoint перед мержем/релизом",
          "Continuous на full golden set каждые 10 минут — стоимость неважна",
          "Отказаться от eval до релиза"
        ],
        correct: 1,
        explanation: "Trade-off continuous evals — раннее обнаружение регрессий ценой стоимости и латентности. Компромисс: continuous на дешёвом smoke-наборе ловит грубые поломки сразу, а full golden set на checkpoint перед мержем даёт полную картину без разорительных частых прогонов."
      }
    ],
    sources: [
      { title: "Anthropic — Test and Evaluate", url: "https://docs.anthropic.com/en/docs/test-and-evaluate", icon: "🔗" },
      { title: "OpenAI Cookbook — Evaluation", url: "https://cookbook.openai.com/articles/evaluation", icon: "🔗" },
      { title: "Promptfoo Documentation", url: "https://www.promptfoo.dev/docs/intro", icon: "🔗" },
      { title: "DeepEval — confident-ai", url: "https://github.com/confident-ai/deepeval", icon: "🔗" }
    ]
  },
  {
    id: 6,
    title: "Human Evaluation",
    goal: "Понять, когда без человека не обойтись и как проводить human eval правильно.",
    objectives: [
      "Определять задачи, требующие human evaluation",
      "Проектировать annotation guidelines",
      "Измерять inter-annotator agreement"
    ],
    content: `
      <h4>Когда нужна human evaluation</h4>
      <ul>
        <li><strong>Новая задача</strong> — нет golden dataset, нет проверенного judge</li>
        <li><strong>Калибровка LLM-as-Judge</strong> — нужно проверить, согласуется ли judge с людьми</li>
        <li><strong>Субъективное качество</strong> — креативность, тон, стиль, юмор</li>
        <li><strong>Безопасность</strong> — red teaming, jailbreak testing, toxicity</li>
        <li><strong>Final sign-off</strong> — финальное утверждение перед деплоем</li>
      </ul>

      <h4>Annotation Guidelines</h4>
      <p>Без чётких инструкций аннотаторы будут оценивать по-разному. Обязательные элементы:</p>
      <pre><code>// Annotation Guideline пример

Задача: Оценить качество ответа чатбота
Шкала: 1-5

1 = Неприемлемо: ответ неправильный, вредный или нерелевантный
2 = Плохо: серьёзные ошибки, но частично полезен
3 = Средне: приемлемо, но есть заметные проблемы
4 = Хорошо: полезно, незначительные недочёты
5 = Отлично: полностью корректный, полезный, хорошо структурированный

Примеры (calibration):
- Score 5: [конкретный пример]
- Score 3: [конкретный пример]
- Score 1: [конкретный пример]</code></pre>

      <div class="key-concept">
        <strong>Калибровочные примеры</strong> — покажите аннотаторам конкретные примеры для каждой оценки шкалы. Без них два аннотатора поставят одному ответу 2 и 4.
      </div>

      <h4>Inter-Annotator Agreement (IAA)</h4>
      <p>Мера того, насколько аннотаторы согласны друг с другом:</p>
      <ul>
        <li><strong>Cohen's Kappa</strong> — для двух аннотаторов, категориальная шкала. 0.8+ = excellent, 0.6-0.8 = good</li>
        <li><strong>Fleiss' Kappa</strong> — для 3+ аннотаторов</li>
        <li><strong>Kendall's tau</strong> — для ранжирования (pairwise comparisons)</li>
        <li><strong>Krippendorff's alpha</strong> — универсальная, поддерживает любые типы шкал и пропуски</li>
      </ul>
      <p>Если IAA &lt; 0.6 — guidelines неясны, аннотаторы нуждаются в тренировке или шкала слишком размыта.</p>

      <h4>Современные инструменты аннотации</h4>
      <ul>
        <li><strong>Label Studio</strong> — open-source классика, гибкая конфигурация шаблонов</li>
        <li><strong>Argilla</strong> — спроектирована под LLM-эпоху: feedback loop, интеграция с datasets/Hub</li>
        <li><strong>Prodigy</strong> — Python-first, активное обучение, fast UI для небольших команд</li>
        <li><strong>Scale AI / Surge AI</strong> — managed услуги с готовыми пулами аннотаторов</li>
      </ul>

      <h4>Hybrid loop: human ↔ judge</h4>
      <p>Production-паттерн: LLM-as-Judge оценивает 100% трафика, люди размечают только спорные кейсы (low confidence judge, выбросы) и кейсы для повторной калибровки. Это снижает стоимость в 10–20× при сохранении качества.</p>

      <h4>Практические советы</h4>
      <ul>
        <li><strong>2-3 аннотатора на пример</strong> — для надёжности и расчёта IAA</li>
        <li><strong>Blind evaluation</strong> — аннотатор не должен знать, какая модель дала ответ</li>
        <li><strong>Batch по 20-50 примеров</strong> — больше → fatigue, качество оценок падает</li>
        <li><strong>Overlap 20%</strong> — для расчёта IAA часть примеров оценивают все аннотаторы</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда наняла внешних аннотаторов через managed-сервис, выдала шкалу 1–5 без калибровочных примеров. Через неделю Cohen's kappa оказался 0.31. <strong>Правильно:</strong> 3–5 калибровочных примеров на каждый уровень шкалы, batch обучения, overlap 20% для постоянного контроля IAA. <strong>Антипаттерн:</strong> верить разметке без проверки IAA — данные становятся шумом.
      </div>
    `,
    flashcards: [
      { front: "Когда нужна human eval?", back: "Новая задача (нет данных для judge), калибровка LLM-as-Judge, субъективное качество (стиль, юмор), safety (red teaming), финальный sign-off перед деплоем." },
      { front: "Inter-Annotator Agreement", back: "Мера согласия между аннотаторами. Cohen's Kappa для 2 человек, Fleiss' для 3+, Krippendorff's alpha — универсально. < 0.6 = guidelines неясны." },
      { front: "Annotation Guidelines", back: "Чёткие инструкции для аннотаторов: шкала с определениями + конкретные калибровочные примеры для каждого уровня. Без них оценки разойдутся." },
      { front: "Argilla", back: "Современный open-source инструмент аннотации, заточенный под LLM-эпоху: feedback loop, интеграция с HuggingFace datasets, поддержка чат-формата." },
      { front: "Prodigy", back: "Python-first аннотация от Explosion AI, активное обучение, fast UI. Подходит для небольших команд и итеративной разметки." },
      { front: "Hybrid loop human ↔ judge", back: "LLM-as-Judge размечает 100% трафика, люди — только спорные/low-confidence кейсы и калибровку. Снижает стоимость в 10–20× при сохранении качества." },
      { front: "Blind evaluation", back: "Аннотатор не знает, какая модель дала ответ. Устраняет brand bias (\"раз GPT-4, значит хорошо\") и self-fulfilling prophecy." },
      { front: "Overlap 20%", back: "20% примеров размечают все аннотаторы — для непрерывного мониторинга IAA. Падение kappa = сигнал перетренировать команду или ревизия guidelines." }
    ],
    quiz: [
      {
        question: "Cohen's Kappa = 0.45. Что это значит?",
        options: [
          "Отличное согласие между аннотаторами",
          "Умеренное согласие — guidelines нужно улучшить или аннотаторов переобучить",
          "Аннотаторы идеально согласны",
          "Это метрика для LLM, не для людей"
        ],
        correct: 1,
        explanation: "Kappa 0.45 = moderate agreement. Порог хорошего согласия — 0.6. Нужно улучшить annotation guidelines, добавить калибровочные примеры или упростить шкалу."
      },
      {
        question: "Почему важна blind evaluation?",
        options: [
          "Это ускоряет процесс",
          "Аннотатор не знает, какая модель дала ответ, что устраняет предвзятость",
          "Это дешевле",
          "Это нужно только для академических статей"
        ],
        correct: 1,
        explanation: "Если аннотатор знает, что ответ от GPT-4, он может неосознанно оценить его выше. Blind evaluation устраняет этот bias — как в Chatbot Arena."
      },
      {
        question: "Какой инструмент лучше для итеративной аннотации с активным обучением в небольшой команде?",
        options: ["Scale AI", "Prodigy", "MMLU", "DeepEval"],
        correct: 1,
        explanation: "Prodigy — Python-first, активное обучение, fast UI, подходит небольшим командам. Scale AI — managed для больших объёмов; MMLU и DeepEval — другие классы инструментов."
      },
      {
        question: "Команда обнаружила, что human eval стоит дорого. Какой паттерн снижает стоимость без потери качества?",
        options: [
          "Уволить аннотаторов, оставить только LLM-as-Judge",
          "Hybrid loop: judge размечает 100% трафика, люди — только low-confidence кейсы и калибровку",
          "Уменьшить шкалу до 1–2",
          "Не использовать blind evaluation"
        ],
        correct: 1,
        explanation: "Hybrid loop сокращает human eval в 10–20× при сохранении качества: judge берёт массовку, люди — спорные кейсы и калибровку judge."
      },
      {
        question: "АНТИПАТТЕРН в human evaluation:",
        options: [
          "Калибровочные примеры для каждого уровня шкалы",
          "Принять разметку без проверки IAA — \"люди же согласны\"",
          "Blind evaluation",
          "Overlap 20% между аннотаторами"
        ],
        correct: 1,
        explanation: "Без замера IAA вы не знаете, согласны ли аннотаторы. Низкий kappa = данные содержат шум, тренировка/выбор моделей на них приведёт к ложным выводам."
      }
    ],
    sources: [
      { title: "Label Studio", url: "https://labelstud.io/", icon: "🔗" },
      { title: "Argilla — feedback loop для LLM", url: "https://docs.argilla.io/", icon: "🔗" },
      { title: "Prodigy (Explosion AI)", url: "https://prodi.gy/", icon: "🔗" },
      { title: "Cohen's Kappa — Wikipedia", url: "https://en.wikipedia.org/wiki/Cohen%27s_kappa", icon: "📄" }
    ]
  },
  {
    id: 7,
    title: "Инструменты для Evaluation",
    goal: "Освоить практический инструментарий: от open-source фреймворков до production-платформ.",
    objectives: [
      "Запускать lm-eval-harness для бенчмарков",
      "Настраивать RAGAS для RAG evaluation",
      "Интегрировать evaluation в CI/CD",
      "Выбирать инструмент под задачу"
    ],
    content: `
      <h4>lm-eval-harness (EleutherAI)</h4>
      <div class="metric-card">
        <h5>lm-eval — стандартизированные бенчмарки</h5>
        <p>60+ встроенных задач (MMLU, HellaSwag, ARC, GSM8K). Поддержка HuggingFace, OpenAI, vLLM. Автоматический decontamination check. Бэкенд Open LLM Leaderboard.</p>
      </div>
      <pre><code># Установка и запуск
pip install lm-eval

# Оценка модели на MMLU
lm_eval --model hf \\
  --model_args pretrained=meta-llama/Llama-3-8B \\
  --tasks mmlu \\
  --batch_size auto

# Несколько бенчмарков сразу
lm_eval --model openai \\
  --model_args model=gpt-4o-mini \\
  --tasks mmlu,gsm8k,humaneval \\
  --output_path results/</code></pre>

      <h4>RAGAS, DeepEval, LangSmith</h4>
      <p>Эти инструменты уже разобраны в уроках 5 и 12. Здесь — расширенная матрица выбора.</p>

      <h4>Матрица выбора инструмента</h4>
      <div class="metric-card">
        <h5>Когда что выбирать</h5>
        <table>
          <thead><tr><th>Задача</th><th>Инструмент</th><th>Почему</th></tr></thead>
          <tbody>
            <tr><td>Академические бенчмарки</td><td>lm-eval-harness, HELM</td><td>Стандарт; decontamination, leaderboard-совместимость</td></tr>
            <tr><td>Eval промптов в CI</td><td>Promptfoo</td><td>YAML-конфиг, cost/latency assertions, JUnit отчёты</td></tr>
            <tr><td>Unit-тесты LLM</td><td>DeepEval</td><td>pytest-стиль, 14+ метрик, простая интеграция</td></tr>
            <tr><td>RAG-системы</td><td>RAGAS, ARES, TruLens</td><td>Faithfulness, answer/context relevance</td></tr>
            <tr><td>Production observability</td><td>Langfuse, Arize Phoenix, LangSmith</td><td>Трэйсинг, дашборды, drift monitoring</td></tr>
            <tr><td>Safety / red teaming</td><td>Inspect AI (UK AISI), Promptfoo red-team</td><td>Стандарт безопасности, jailbreak suites</td></tr>
            <tr><td>Holistic / fairness</td><td>HELM (Stanford)</td><td>Accuracy + fairness + safety + bias</td></tr>
            <tr><td>OpenAI-only стек</td><td>OpenAI Evals</td><td>Нативная интеграция, поддержка structured outputs</td></tr>
            <tr><td>MLOps интеграция</td><td>MLflow Evaluate, W&B Weave</td><td>Связь с tracking, experiment management</td></tr>
            <tr><td>Compliance / PII / hallucination detection</td><td>Patronus AI, Galileo Luna</td><td>Готовые детекторы, audit trail</td></tr>
          </tbody>
        </table>
      </div>

      <h4>Inspect AI (UK AISI) — отдельно про safety</h4>
      <p>Открытый research-grade фреймворк от UK AI Safety Institute. Используется Anthropic, DeepMind, METR, Apollo Research для evaluation потенциально опасных capabilities (autonomy, cyber, biorisk). Расширяемые задачи, structured outputs, поддержка agentic eval.</p>

      <h4>Интеграция в CI/CD</h4>
      <pre><code># .github/workflows/eval.yml
name: LLM Evaluation
on: [push]
jobs:
  eval:
    steps:
      - name: Run Promptfoo
        run: promptfoo eval --config promptfooconfig.yaml --output junit.xml

      - name: Run DeepEval regression
        run: pytest tests/llm/ --deepeval

      - name: Check regression vs baseline
        run: |
          python check_regression.py \\
            --current results.json \\
            --baseline baseline.json \\
            --threshold 0.05</code></pre>

      <div class="key-concept">
        <strong>Рекомендуемый стек:</strong> lm-eval (capability бенчмарки) + Promptfoo (CI промптов) + DeepEval (unit-тесты) + RAGAS (если есть RAG) + Langfuse/Arize Phoenix (observability) + Inspect AI (safety). Открытый, гибкий и без vendor lock-in.
      </div>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда выбрала LangSmith как единый стек, но через 6 месяцев оказалось, что vendor lock-in мешает экспериментировать с локальными моделями и safety-evals. <strong>Правильно:</strong> разделять observability (Langfuse/Arize) и eval (Promptfoo/DeepEval), держать переключаемый адаптер. <strong>Антипаттерн:</strong> монолитное решение от одного вендора без exit-стратегии.
      </div>
    `,
    flashcards: [
      { front: "lm-eval-harness", back: "EleutherAI фреймворк: 60+ бенчмарков (MMLU, GSM8K, HumanEval), поддержка HF/OpenAI/vLLM, автоматический decontamination check. Бэкенд Open LLM Leaderboard." },
      { front: "Promptfoo", back: "YAML-конфиг eval промптов, providers OpenAI/Anthropic/локальные, llm-rubric, cost/latency thresholds, JUnit-отчёты. Заточен под CI/CD." },
      { front: "DeepEval", back: "\"pytest для LLM\" — описываете тесты как pytest-функции, 14+ метрик, интеграция в CI/CD. Хорошо для regression testing в production." },
      { front: "TruLens", back: "Open-source feedback functions + OTel-трейсинг. Подходит для мониторинга агентов и RAG-систем с детальным разбором шагов." },
      { front: "Inspect AI (UK AISI)", back: "Research-grade safety-eval фреймворк от UK AI Safety Institute. Используется Anthropic, DeepMind, METR, Apollo для frontier capability evals." },
      { front: "HELM (Stanford)", back: "Holistic Evaluation of Language Models: accuracy + fairness + safety + robustness + bias. Publication-grade, академический стандарт." },
      { front: "Patronus AI / Galileo Luna", back: "Compliance-фокус: готовые детекторы hallucination, PII, copyright. Хороши там, где важен audit trail и regulatory compliance." },
      { front: "Vendor lock-in в eval-стеке", back: "Антипаттерн: монолитное решение от одного вендора. Защита — разделять observability и eval, держать переключаемый адаптер." }
    ],
    quiz: [
      {
        question: "Какой инструмент лучше всего подходит для оценки RAG-системы?",
        options: ["lm-eval-harness", "RAGAS", "MMLU", "HumanEval"],
        correct: 1,
        explanation: "RAGAS специализирован для RAG: faithfulness, answer relevancy, context precision/recall — метрики, которых нет в общих бенчмарках."
      },
      {
        question: "Что проверяет lm-eval-harness перед запуском бенчмарка?",
        options: [
          "Скорость модели",
          "Data contamination — не попали ли тестовые данные в training set",
          "Размер контекстного окна",
          "Количество параметров модели"
        ],
        correct: 1,
        explanation: "lm-eval автоматически проверяет n-gram overlap между бенчмарком и training corpus. Если overlap > 10% — данные помечаются как загрязнённые."
      },
      {
        question: "Команде нужен publication-grade eval с фокусом на fairness и safety. Что подойдёт?",
        options: ["DeepEval", "HELM (Stanford)", "MMLU", "Chatbot Arena"],
        correct: 1,
        explanation: "HELM — Holistic Evaluation of Language Models: accuracy + fairness + safety + robustness + bias. Стэнфордский академический стандарт."
      },
      {
        question: "Нужен safety-eval с поддержкой agentic capabilities (autonomy, cyber). Что выбрать?",
        options: [
          "MMLU",
          "Inspect AI (UK AISI) — research-grade, используется Anthropic/DeepMind/METR",
          "Promptfoo (только) — без поддержки frontier-safety",
          "BLEU"
        ],
        correct: 1,
        explanation: "Inspect AI спроектирован под frontier safety evals: capability autonomy, cyber, biorisk. Используется ведущими AI-лабораториями для pre-deployment evals."
      },
      {
        question: "Какой АНТИПАТТЕРН в выборе eval-стека?",
        options: [
          "Сочетать open-source инструменты по задачам",
          "Монолитное решение от одного вендора без exit-стратегии",
          "Использовать Promptfoo в CI",
          "Разделять observability и eval"
        ],
        correct: 1,
        explanation: "Vendor lock-in мешает экспериментировать с локальными моделями и сменой провайдеров. Best practice — переключаемый адаптер и инструменты по задачам."
      }
    ],
    sources: [
      { title: "EleutherAI lm-eval-harness", url: "https://github.com/EleutherAI/lm-evaluation-harness", icon: "🔗" },
      { title: "Promptfoo", url: "https://www.promptfoo.dev/docs/intro", icon: "🔗" },
      { title: "DeepEval — confident-ai", url: "https://github.com/confident-ai/deepeval", icon: "🔗" },
      { title: "Inspect AI (UK AISI)", url: "https://github.com/UKGovernmentBEIS/inspect_ai", icon: "🔗" },
      { title: "Stanford HELM", url: "https://crfm.stanford.edu/helm/", icon: "🔗" }
    ]
  },
  {
    id: 8,
    title: "Современные бенчмарки 2025–2026",
    goal: "Освоить актуальный стек бенчмарков, заменивший насыщенную классику, и научиться выбирать бенчмарк под use case.",
    objectives: [
      "Знать стек MMLU-Pro / GPQA / SWE-bench Verified / FrontierMath / HLE / ARC-AGI-2",
      "Понимать, почему классические бенчмарки 2020–2022 потеряли разрешающую способность",
      "Выбирать бенчмарк под конкретную задачу"
    ],
    content: `
      <h4>Почему классика больше не различает фронтирные модели</h4>
      <p>К 2025–2026 топ-модели "кластеризуются у потолка" MMLU (≥90%), HumanEval (≥95%), HellaSwag (≥95%). Разница в 1–2 п.п. статистически незначима. Open LLM Leaderboard перешёл на v2.</p>

      <h4>Современный стек</h4>

      <div class="metric-card">
        <h5>MMLU-Pro</h5>
        <p>10 вариантов ответа (вместо 4), обязательный CoT, более сложные вопросы. Снижает угадывание и тестирует reasoning, а не только память.</p>
      </div>

      <div class="metric-card">
        <h5>GPQA Diamond</h5>
        <p>"Graduate-level Google-Proof Q&amp;A". Вопросы такого уровня, что эксперты PhD с интернетом ошибаются в 60%. На конец 2025 топовые модели достигают ~92%.</p>
      </div>

      <div class="metric-card">
        <h5>SWE-bench Verified / SWE-bench Pro</h5>
        <p>Реальные задачи из GitHub issue → patch. Verified — отфильтрованный набор; Pro — расширение с более сложными задачами. Считается лучшим прокси для production coding.</p>
      </div>

      <div class="metric-card">
        <h5>LiveCodeBench</h5>
        <p>Кодинг-задачи с date-tagging: задача оценивается только на моделях, у которых cutoff раньше публикации задачи. Защита от contamination.</p>
      </div>

      <div class="metric-card">
        <h5>AIME-2025 / FrontierMath</h5>
        <p>AIME — олимпиадная математика. FrontierMath — research-level математика; на 2026 модели только начинают подходить к ~30%.</p>
      </div>

      <div class="metric-card">
        <h5>Humanity's Last Exam (HLE)</h5>
        <p>2500 вопросов от Center for AI Safety + Scale AI, экспертный уровень по сотням областей. Прогноз середины 2026 — mid-40s, остаётся одним из самых сложных бенчмарков.</p>
      </div>

      <div class="metric-card">
        <h5>ARC-AGI-2</h5>
        <p>Абстрактное визуально-логическое рассуждение. Защищён от training-leakage за счёт уникальности паттернов. Считается одним из главных тестов general intelligence.</p>
      </div>

      <h4>Правило выбора бенчмарка</h4>
      <ul>
        <li><strong>Знания / reasoning</strong> → MMLU-Pro, GPQA Diamond</li>
        <li><strong>Код</strong> → SWE-bench Verified/Pro (real-world), LiveCodeBench (contamination-resistant)</li>
        <li><strong>Математика</strong> → AIME-2025, FrontierMath</li>
        <li><strong>Frontier capability</strong> → HLE, ARC-AGI-2</li>
        <li><strong>Domain-задача</strong> → собственный golden set или domain benchmark (LegalBench, MedQA, MultiMedQA)</li>
      </ul>

      <div class="key-concept">
        <strong>Главное правило:</strong> бенчмарк всегда выбирается под use case. GPQA Diamond и SWE-bench Verified лучше коррелируют с production performance на enterprise tasks, чем MMLU или HellaSwag.
      </div>

      <h4>Что обязательно учитывать</h4>
      <ul>
        <li><strong>Дата cutoff vs дата бенчмарка</strong> — для LiveCodeBench/LiveBench модели с поздним cutoff могут видеть задачи в претрейне</li>
        <li><strong>Self-reported vs independent</strong> — независимые лидерборды (Artificial Analysis, lmsys) надёжнее вендорских пресс-релизов</li>
        <li><strong>Decontamination</strong> — для академических бенчмарков всегда смотреть, есть ли контаминационная проверка</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда выбирает между двумя моделями: A показала 89% на MMLU и 71% на GPQA, B — 87% на MMLU и 84% на GPQA. <strong>Правильно:</strong> для reasoning-heavy продукта выбирать B — MMLU насыщен, разница 2% незначима, а 13% на GPQA — это реальная разница в способности рассуждать. <strong>Антипаттерн:</strong> ранжировать по сумме всех бенчмарков, не учитывая насыщенность.
      </div>
    `,
    flashcards: [
      { front: "MMLU-Pro", back: "Следующее поколение MMLU: 10 вариантов ответа, обязательный CoT, более сложные вопросы. Снижает угадывание и нагрузку на память." },
      { front: "GPQA Diamond", back: "Graduate-level Google-Proof Q&A. PhD-эксперты с интернетом ошибаются в 60%. Один из главных бенчмарков reasoning 2025–2026." },
      { front: "SWE-bench Verified", back: "Отфильтрованный набор реальных GitHub-issue → patch задач. Лучший прокси production-кодинга для LLM-агентов." },
      { front: "LiveCodeBench", back: "Кодинг-бенчмарк с date-tagging: каждая задача оценивается только на моделях с cutoff раньше публикации задачи. Защита от data contamination." },
      { front: "FrontierMath", back: "Research-level математика. Модели в 2026 только подходят к ~30%. Используется для оценки frontier reasoning capability." },
      { front: "Humanity's Last Exam (HLE)", back: "2500 вопросов экспертного уровня от Center for AI Safety + Scale AI. Прогноз mid-40s к середине 2026 — один из самых сложных активных бенчмарков." },
      { front: "ARC-AGI-2", back: "Абстрактное визуально-логическое рассуждение. Защищён от training-leakage уникальностью паттернов. Считается тестом general intelligence." },
      { front: "Правило выбора бенчмарка", back: "Под use case: knowledge/reasoning → MMLU-Pro/GPQA; code → SWE-bench; math → AIME/FrontierMath; frontier → HLE/ARC-AGI-2; domain — собственный или domain bench." }
    ],
    quiz: [
      {
        question: "Чем MMLU-Pro отличается от классического MMLU?",
        options: [
          "Меньше вопросов",
          "10 вариантов ответа вместо 4, обязательный CoT, более сложные задачи",
          "Только английский",
          "Только multiple choice по физике"
        ],
        correct: 1,
        explanation: "MMLU-Pro увеличил число вариантов до 10 (снижает угадывание), сделал CoT обязательным и переработал вопросы — снижает потолок и возвращает разрешающую способность."
      },
      {
        question: "Команде нужно оценить агента, который патчит реальные баги в репозитории. Что выбрать?",
        options: ["MMLU", "SWE-bench Verified", "HellaSwag", "ARC"],
        correct: 1,
        explanation: "SWE-bench Verified — отфильтрованные реальные GitHub-issue → patch задачи. Лучший прокси production-кодинга, особенно с agentic scaffold."
      },
      {
        question: "Почему модель A с 89% MMLU и 71% GPQA хуже модели B с 87% MMLU и 84% GPQA для reasoning-heavy задачи?",
        options: [
          "Сумма у B меньше",
          "MMLU насыщен, разница 2% незначима; на GPQA разница 13% реально различает способность рассуждать",
          "У A больше параметров",
          "Никакой разницы"
        ],
        correct: 1,
        explanation: "Это типичная ловушка: на насыщенных бенчмарках разница не информативна. GPQA Diamond ещё разрешает топ-модели и точнее предсказывает reasoning-производительность."
      },
      {
        question: "В чём смысл date-tagging в LiveCodeBench?",
        options: [
          "Удобство для UI",
          "Защита от contamination: задача оценивается только на моделях с cutoff раньше её публикации",
          "Поддержка multilingual",
          "Это бенчмарк только для Python"
        ],
        correct: 1,
        explanation: "LiveCodeBench регулярно публикует новые задачи. Для каждой модели сравниваются только задачи, опубликованные после её cutoff — модель не могла их видеть в претрейне."
      },
      {
        question: "АНТИПАТТЕРН при чтении современных лидербордов:",
        options: [
          "Смотреть независимые источники (Artificial Analysis, lmsys)",
          "Учитывать насыщенность бенчмарка",
          "Рапортовать только MMLU/HellaSwag для frontier-модели как differentiator",
          "Считать domain-eval отдельно"
        ],
        correct: 2,
        explanation: "Классические бенчмарки 2020–2022 насыщены — frontier-модели у потолка. Использовать их как differentiator — антипаттерн. Они годятся как baseline."
      }
    ],
    sources: [
      { title: "Humanity's Last Exam — Artificial Analysis", url: "https://artificialanalysis.ai/evaluations/humanitys-last-exam", icon: "🔗" },
      { title: "Iternal — LLM Selection Guide", url: "https://iternal.ai/llm-selection-guide", icon: "📄" },
      { title: "LXT — LLM Benchmarks 2025", url: "https://www.lxt.ai/blog/llm-benchmarks/", icon: "📄" },
      { title: "ARC-AGI v2 leaderboard", url: "https://llm-stats.com/benchmarks/arc-agi-v2", icon: "🔗" },
      { title: "Humanity's Last Exam — Wikipedia", url: "https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam", icon: "🔗" }
    ]
  },
  {
    id: 9,
    title: "Agentic evaluation",
    goal: "Понять, чем оценка agent-систем отличается от оценки однотурного чата, и как считать success rate, trajectory quality, cost и reliability.",
    objectives: [
      "Знать, почему outcome-only оценка недостаточна для агентов",
      "Применять мультиметрику success + trajectory + cost + reliability",
      "Знать ключевые agentic-бенчмарки: τ²-bench, WebArena, OSWorld, GAIA, AppWorld"
    ],
    content: `
      <h4>Зачем отдельная eval для агентов</h4>
      <p>Agent — это система, принимающая многошаговые действия с инструментами и средой. Одношаговая accuracy не описывает её качество. "Success rates на OSWorld, WebArena, GAIA выросли в 5–7 раз между 2023 и 2026" — но за этим стоит не только умнее модель, но и новые scaffolds.</p>

      <h4>Мультиметрика</h4>
      <ul>
        <li><strong>Success rate</strong> — % задач, выполненных корректно (с проверкой состояния среды)</li>
        <li><strong>Trajectory quality</strong> — длина траектории, число лишних шагов, число ошибок tool-use</li>
        <li><strong>Cost</strong> — суммарные токены × цены + tool-calls; нормировать на success</li>
        <li><strong>Reliability / variance</strong> — std success rate между прогонами; высокий разброс = ненадёжная система</li>
      </ul>

      <div class="key-concept">
        <strong>Outcome-only insufficient:</strong> агент, который "случайно" выполнил задачу за 50 шагов, и агент, который сделал то же за 5, имеют одинаковый success rate, но разное product-качество. Trajectory + cost + variance — обязательны.
      </div>

      <h4>Ключевые бенчмарки 2025–2026</h4>

      <div class="metric-card">
        <h5>τ-bench / τ²-bench (Sierra)</h5>
        <p>Tool-agent-user среды: retail и airline. τ² в 2026 добавил voice и knowledge retrieval. Считается одним из самых реалистичных agentic-бенчмарков для customer service.</p>
      </div>

      <div class="metric-card">
        <h5>WebArena</h5>
        <p>True web autonomy: 812 long-horizon задач в реалистичной web-среде (e-commerce, forums, gitlab, maps). Прогресс: baseline 14.41% → IBM CUGA 61.7% к началу 2025.</p>
      </div>

      <div class="metric-card">
        <h5>OSWorld / AndroidWorld</h5>
        <p>Реальные desktop/mobile среды. Агент управляет ОС через скриншоты и actions. Самые сложные сценарии: cross-app workflows.</p>
      </div>

      <div class="metric-card">
        <h5>GAIA</h5>
        <p>Compound tool-use и multi-step reasoning. Задачи требуют комбинации web-search, file-handling, code-execution.</p>
      </div>

      <div class="metric-card">
        <h5>AgentBench / AppWorld</h5>
        <p>AgentBench — 8 окружений, 1091 задача. AppWorld — 9 apps, 457 APIs; фокус на cross-app координацию.</p>
      </div>

      <h4>Scaffold-sensitivity</h4>
      <p>Один и тот же LLM в разных scaffold (ReAct vs explicit planner vs CodeAct) даёт разный success rate. При сравнении агентов всегда фиксируйте scaffold и репортуйте конфигурацию.</p>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда сравнивает двух агентов: A даёт 72% success, B — 68%. Но trajectory B в среднем 6 шагов, A — 22; cost B в 4× меньше; variance A — 18%, B — 5%. <strong>Правильно:</strong> B — выбираемый продакшен-кандидат (стабильнее, дешевле, быстрее). <strong>Антипаттерн:</strong> выбирать только по success rate без trajectory/cost/variance — путь к нестабильной и дорогой системе.
      </div>
    `,
    flashcards: [
      { front: "Почему outcome-only недостаточно для агентов?", back: "Один и тот же success rate может скрывать кратно разную trajectory, cost и variance. Trajectory quality, cost и reliability — обязательные оси." },
      { front: "τ²-bench (Sierra)", back: "Tool-agent-user среды retail/airline, в 2026 добавили voice и knowledge retrieval. Реалистичный agentic-бенчмарк для customer service." },
      { front: "WebArena", back: "812 long-horizon задач в реалистичной web-среде. Прогресс: baseline 14.41% → 61.7% (IBM CUGA, 2025)." },
      { front: "OSWorld", back: "Agent управляет реальной ОС через скриншоты и actions. Самые сложные сценарии — cross-app workflows; считается одним из топ-сложных бенчмарков." },
      { front: "GAIA", back: "Compound tool-use + multi-step reasoning. Задачи требуют комбинации web-search, file-handling, code-execution." },
      { front: "AppWorld", back: "9 apps, 457 APIs. Фокус на cross-app coordination и долгие траектории с реалистичными side-effects." },
      { front: "Scaffold-sensitivity", back: "Один и тот же LLM в разных scaffold (ReAct vs planner vs CodeAct) показывает разный success rate. При сравнении агентов scaffold обязательно фиксируется." },
      { front: "Reliability (variance)", back: "Стандартное отклонение success rate между прогонами. Высокий разброс = ненадёжная система; для продакшена critical — <10%." }
    ],
    quiz: [
      {
        question: "Почему success rate без trajectory недостаточно для оценки агента?",
        options: [
          "Trajectory — это про красоту кода",
          "Один и тот же success может скрывать разное число шагов, стоимость и надёжность",
          "Trajectory не измеряется",
          "Хватает одного outcome"
        ],
        correct: 1,
        explanation: "Два агента с одинаковым success rate могут стоить кратно разное и быть кратно разной надёжности. Trajectory, cost, variance — обязательны."
      },
      {
        question: "Что измеряет WebArena?",
        options: [
          "Точность ответов на MMLU",
          "Способность агента выполнять long-horizon задачи в реалистичной web-среде",
          "BLEU перевода",
          "Latency single-turn ответа"
        ],
        correct: 1,
        explanation: "WebArena — 812 long-horizon задач в realистичной web-среде. Прогресс между 2023 и 2025 — кратный, что говорит о росте agentic capabilities."
      },
      {
        question: "Команда сравнивает агентов: A — success 72%, trajectory 22 шага; B — success 68%, trajectory 6 шагов. Что выбрать для продакшена?",
        options: [
          "A — у него выше success rate",
          "B — короче трасса, обычно дешевле и стабильнее; разница в success 4 п.п. часто перекрывается экономикой",
          "Нельзя сравнивать",
          "Подбросить монетку"
        ],
        correct: 1,
        explanation: "Outcome-only ловушка. В продакшене chosen — это compromise по success × cost × latency × variance. Чаще побеждает B, особенно при кратной экономии и низкой variance."
      },
      {
        question: "Зачем фиксировать scaffold при сравнении агентов?",
        options: [
          "Это академическая формальность",
          "Один и тот же LLM с разным scaffold (ReAct vs planner vs CodeAct) даёт разный success rate — сравнение без scaffold бесполезно",
          "Чтобы быстрее тестировать",
          "Не нужно фиксировать"
        ],
        correct: 1,
        explanation: "Scaffold-sensitivity задокументирована: вне фиксированного scaffold невозможно сказать, что именно различает агенты — модель или обвязка."
      },
      {
        question: "Какой агентский бенчмарк лучше всего подходит для customer-service сценариев?",
        options: ["OSWorld", "τ²-bench (retail/airline, voice, knowledge)", "FrontierMath", "HumanEval"],
        correct: 1,
        explanation: "τ²-bench специально про tool-agent-user сценарии customer service: retail, airline, voice, knowledge retrieval. Самый близкий прокси для production CS-агентов."
      }
    ],
    sources: [
      { title: "τ²-bench — Sierra Research", url: "https://github.com/sierra-research/tau2-bench", icon: "🔗" },
      { title: "τ-bench paper (2506.07982)", url: "https://arxiv.org/pdf/2506.07982", icon: "📄" },
      { title: "Benchmarking Agents — каталог", url: "https://benchmarkingagents.com/benchmarks-list/", icon: "🔗" },
      { title: "Evidently AI — AI Agent Benchmarks", url: "https://www.evidentlyai.com/blog/ai-agent-benchmarks", icon: "🔗" },
      { title: "Marktechpost — Top agentic benchmarks 2026", url: "https://www.marktechpost.com/2026/04/26/top-7-benchmarks-that-actually-matter-for-agentic-reasoning-in-large-language-models/", icon: "🔗" }
    ]
  },
  {
    id: 10,
    title: "Reasoning models evaluation",
    goal: "Понять, чем оценка reasoning-моделей (o-series, R1, extended thinking) отличается от обычных LLM, и научиться измерять CoT-faithfulness и token-efficiency.",
    objectives: [
      "Знать ограничения accuracy-only оценки для reasoning-моделей",
      "Измерять step necessity и token efficiency",
      "Избегать reward hacking при тренировке PRM"
    ],
    content: `
      <h4>Почему обычной accuracy недостаточно</h4>
      <p>Reasoning-модели (o-series, DeepSeek-R1, Claude extended thinking) выдают длинные цепочки рассуждений. Та же accuracy может быть достигнута:</p>
      <ul>
        <li>За 200 токенов CoT (token-efficient)</li>
        <li>За 8000 токенов с overthinking (token-inefficient, дороже в production)</li>
        <li>Со "сбитой" логикой, но угадывающимся финальным ответом (reasoning hallucinations)</li>
      </ul>

      <h4>CoT faithfulness: три режима</h4>
      <p>Работа "The illusion of reasoning" предлагает классификацию:</p>
      <ul>
        <li><strong>Genuine reasoning</strong> — CoT улучшает accuracy, шаги важны и неперемешиваемы</li>
        <li><strong>Scaffolding</strong> — CoT помогает, но шаги взаимозаменяемы (модель просто использует "размышляющее" пространство)</li>
        <li><strong>Decoration</strong> — CoT не влияет на ответ; шаги можно удалить без потери качества</li>
      </ul>

      <h4>Step necessity</h4>
      <p>Метрика: % случаев, когда удаление шага CoT ломает финальный ответ. По данным reasoning-исследований 2025:</p>
      <ul>
        <li><strong>DeepSeek-R1-distill на матзадачах:</strong> step necessity 91–93%</li>
        <li><strong>Обычные модели (DeepSeek-V3.2) на тех же задачах:</strong> ~4%</li>
        <li><strong>Вывод:</strong> training objective определяет faithfulness CoT</li>
      </ul>

      <div class="key-concept">
        <strong>Token efficiency:</strong> для production важно соотношение accuracy_gain / tokens. Модель, которая поднимает accuracy на 3 п.п. ценой 5× токенов и латентности — часто хуже выбор, чем менее точная, но компактная.
      </div>

      <h4>Reward hacking и PRM</h4>
      <p>Process reward models (PRM) — отдельный judge, оценивающий каждый шаг CoT. Идея красивая, но DeepSeek в R1 отказались от neural PRM:</p>
      <blockquote>"DeepSeek abstained from applying neural reward models — outcome-based or process-based — to reasoning tasks, predicated on the observation that neural reward models are susceptible to reward hacking."</blockquote>
      <p>Вместо PRM — rule-based accuracy reward (финальный ответ проверяется детерминированной функцией) + format reward (соблюдение структуры). Простые правила работают надёжнее обучаемых PRM на reasoning-задачах.</p>

      <h4>Overthinking</h4>
      <p>Симптом, когда модель тратит на простую задачу 10× больше токенов, чем нужно. Контр-меры:</p>
      <ul>
        <li>Параметр <code>reasoning_effort</code> (o-series): low/medium/high — переключение режима</li>
        <li>Параметр <code>budget_tokens</code> для extended thinking — жёсткий cap</li>
        <li>Eval отдельно: длинна CoT vs прирост accuracy</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда заменила обычный Sonnet на reasoning-режим (extended thinking). Accuracy выросла с 78% до 84%, но avg tokens — с 800 до 6200, latency p95 — с 4 с до 41 с. <strong>Правильно:</strong> reasoning-режим включать только на сложных задачах (классификатор сложности на входе) или ограничивать budget_tokens. <strong>Антипаттерн:</strong> всегда включать максимум reasoning — путь к 8× costs без пропорционального gains.
      </div>
    `,
    flashcards: [
      { front: "Почему accuracy недостаточно для reasoning-моделей?", back: "Одна accuracy достигается за 200 или 8000 токенов CoT. Token efficiency, step necessity и latency — обязательные оси." },
      { front: "Три режима CoT-faithfulness", back: "Genuine (шаги важны), Scaffolding (помогают, но взаимозаменяемы), Decoration (можно удалить). Reasoning-модели тяготеют к genuine на матзадачах." },
      { front: "Step necessity", back: "% шагов, удаление которых ломает финальный ответ. R1-distill на матзадачах: 91–93%, обычная V3.2: ~4%. Training objective определяет faithfulness." },
      { front: "Token efficiency", back: "Accuracy_gain / tokens. Production-метрика: модель с +3 п.п. accuracy за 5× токенов часто хуже, чем менее точная, но компактная." },
      { front: "Почему DeepSeek отказались от neural PRM?", back: "Neural PRM подвержены reward hacking на reasoning. Заменили rule-based accuracy reward + format reward — детерминированно и надёжно." },
      { front: "Overthinking", back: "Симптом, когда модель тратит 10× больше токенов, чем нужно. Контр-меры: reasoning_effort=low/medium, budget_tokens, классификатор сложности на входе." },
      { front: "reasoning_effort (o-series)", back: "API-параметр OpenAI o-моделей: low/medium/high. Переключение режима reasoning под задачу для контроля cost и latency." },
      { front: "budget_tokens (Anthropic)", back: "Параметр extended thinking: жёсткий cap на токены reasoning. Защита от overthinking и контроль cost." }
    ],
    quiz: [
      {
        question: "Что измеряет step necessity?",
        options: [
          "Длину промпта",
          "% шагов CoT, удаление которых ломает финальный ответ",
          "Latency",
          "Точность токенизации"
        ],
        correct: 1,
        explanation: "Step necessity — мера CoT-faithfulness. Высокая (91–93% у R1) = genuine reasoning; низкая (~4% у обычной V3.2) = шаги декоративны."
      },
      {
        question: "Почему DeepSeek отказались от neural PRM в R1?",
        options: [
          "Слишком дорого",
          "Neural PRM подвержены reward hacking — модель находит способ обмануть PRM, не улучшая reasoning. Заменили rule-based reward",
          "Не было данных",
          "PRM не работают на math"
        ],
        correct: 1,
        explanation: "Neural reward models на reasoning поддаются hacking. Rule-based accuracy reward + format reward — проще, дешевле, надёжнее на верифицируемых задачах."
      },
      {
        question: "Команда включила extended thinking всегда. Что произошло?",
        options: [
          "Accuracy выросла на 100%",
          "Avg tokens и latency выросли многократно при умеренном росте accuracy; cost подскочил",
          "Latency снизилась",
          "Ничего не изменилось"
        ],
        correct: 1,
        explanation: "Постоянный максимум reasoning — антипаттерн. Включайте reasoning по классификатору сложности или ограничивайте budget_tokens; считайте token efficiency."
      },
      {
        question: "Что такое overthinking в контексте reasoning-моделей?",
        options: [
          "Модель ошибается",
          "Модель тратит непропорционально много токенов на простые задачи без прироста accuracy",
          "Слишком короткий CoT",
          "Это синоним hallucination"
        ],
        correct: 1,
        explanation: "Overthinking — раздутый CoT без прироста точности. Контр-меры: reasoning_effort=low/medium, budget_tokens, гейтинг reasoning по сложности задачи."
      },
      {
        question: "АНТИПАТТЕРН в evaluation reasoning-моделей:",
        options: [
          "Измерять accuracy × token efficiency × latency",
          "Считать только финальную accuracy и игнорировать длину CoT и cost",
          "Использовать reasoning_effort=low для простых задач",
          "Замерять step necessity"
        ],
        correct: 1,
        explanation: "Accuracy без token efficiency и latency скрывает реальную production-стоимость reasoning-моделей. На практике они часто становятся неоправданно дорогими."
      }
    ],
    sources: [
      { title: "DeepSeek-R1 paper", url: "https://arxiv.org/html/2501.12948v1", icon: "📄" },
      { title: "The illusion of reasoning (2603.22816)", url: "https://arxiv.org/pdf/2603.22816", icon: "📄" },
      { title: "Are reasoning models more faithful? (2501.08156)", url: "https://arxiv.org/pdf/2501.08156", icon: "📄" },
      { title: "HuggingFace — DeepSeek-R1 explained", url: "https://huggingface.co/blog/NormalUhr/deepseek-r1-explained", icon: "🔗" }
    ]
  },
  {
    id: 11,
    title: "LLM-as-Judge: продвинутые техники",
    goal: "Освоить продвинутые техники LLM-as-Judge: permutation calibration, rubric-as-a-judge, autoraters, открытые judge-модели.",
    objectives: [
      "Применять swap- и permutation-augmentation для борьбы с position bias",
      "Использовать rubric-as-a-judge для структурированных оценок",
      "Знать открытые judge-модели Prometheus 2, JudgeLM, PandaLM"
    ],
    content: `
      <h4>От базы (урок 4) к продвинутому уровню</h4>
      <p>Урок 4 рассказал основы: pointwise vs pairwise, классические bias и калибровку kappa-метриками. Здесь — техники, которые отделяют production-grade judge от прототипа.</p>

      <h4>Permutation-based calibration</h4>
      <p>Стандартный swap (A,B) → (B,A) убирает простой position bias. Permutation calibration идёт дальше: для каждого набора вариантов прогоняется все перестановки или случайная подвыборка из них.</p>
      <blockquote>"Rubric-based LLM-as-a-Judge is not inherently point-wise; simple permutation-based calibration can substantially improve its reliability."</blockquote>
      <p>На практике для 3+ кандидатов используют random-permutation set из 4–8 порядков и считают итоговый ранг.</p>

      <h4>Rubric-as-a-Judge</h4>
      <p>Вместо одного "score 1–5" judge оценивает по нескольким структурированным dimensions:</p>
      <pre><code>// Rubric
{
  "correctness": { "weight": 0.4, "scale": "1-5" },
  "completeness": { "weight": 0.2, "scale": "1-5" },
  "helpfulness": { "weight": 0.2, "scale": "1-5" },
  "safety": { "weight": 0.1, "scale": "0|1" },
  "style": { "weight": 0.1, "scale": "1-5" }
}

// Output (JSON):
{ "correctness": 4, "completeness": 5, ... , "weighted": 4.2 }</code></pre>
      <p>OpenRubrics (2025) предложил синтетическую генерацию rubric'ов под задачу через LLM — масштабируемая альтернатива ручному дизайну.</p>

      <h4>Autoraters: калибровка к preference distribution</h4>
      <p>Google в работе "Calibrating Autoraters" (2510.00263) предлагает калибровать judge не к одной "правильной" метке, а к распределению предпочтений. Идея:</p>
      <blockquote>"Human judgment does not correspond to a single label, but a distribution."</blockquote>
      <p>Поэтому judge должен предсказывать P(выбор A) ∈ [0,1], а не бинарное A/B. Калибруется как probability calibration (Brier score, ECE).</p>

      <h4>Открытые judge-модели</h4>
      <ul>
        <li><strong>Prometheus 2</strong> — open-source evaluator (7B/8x7B), специально обученный judge. Альтернатива GPT-4 для бюджетных pipeline.</li>
        <li><strong>JudgeLM</strong> — отдельная серия моделей-судей; добавляет "reference drop" augmentation против reference-bias.</li>
        <li><strong>PandaLM</strong> — open judge для pairwise, поддерживает русский в ограниченном объёме.</li>
        <li><strong>Arena-Hard-Auto (LMSYS)</strong> — фреймворк для автоматического pairwise eval с большим набором задач; сильно коррелирует с LMSYS Arena.</li>
      </ul>

      <div class="key-concept">
        <strong>Held-out human alignment set:</strong> для серьёзного judge — отдельный набор 200–500 человек-размеченных кейсов, на которых judge не обучался и не калибровался. Регулярная проверка correlate(judge, human) на этом наборе обнаруживает дрейф judge.
      </div>

      <h4>Ensemble of judges</h4>
      <p>Снижает self-preference и idiosyncrasies одной модели. Простейший вариант: majority vote из 2–3 судей разных вендоров (Claude + GPT-4 + Gemini), tie-break — третий или человек.</p>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда внедрила single-judge на основе GPT-4 для оценки своих GPT-4-powered сервисов. После нескольких релизов корреляция с human alignment set упала с 0.78 до 0.51. <strong>Причина:</strong> self-preference, накопленное по мере того, как продукт стал писать в стиле, который "нравится" judge. <strong>Правильно:</strong> ensemble (Claude + GPT + Gemini) или cross-judge; регулярный re-calibration на свежем human set. <strong>Антипаттерн:</strong> судить модели одним judge их же семейства без периодической калибровки.
      </div>
    `,
    flashcards: [
      { front: "Permutation-based calibration", back: "Расширение swap-augmentation: для каждого набора вариантов прогоняется несколько перестановок, итоговый ранг усредняется. Снижает position bias на 3+ кандидатах." },
      { front: "Rubric-as-a-Judge", back: "Judge оценивает по нескольким структурированным dimensions (correctness, completeness, helpfulness, safety, style) с весами. JSON-output, легко агрегировать." },
      { front: "OpenRubrics (2025)", back: "Синтетическая генерация rubric'ов под задачу через LLM. Масштабируемая альтернатива ручному дизайну критериев." },
      { front: "Autoraters (Google, 2025)", back: "Калибровка judge не к одной метке, а к preference distribution: предсказание P(выбор A) ∈ [0,1]. Калибруется через Brier score / ECE." },
      { front: "Prometheus 2", back: "Open-source evaluator-модель (7B/8x7B), специально обученный judge. Бюджетная альтернатива GPT-4 в judge-pipeline." },
      { front: "JudgeLM", back: "Серия моделей-судей с reference drop augmentation против reference-bias. Open weights." },
      { front: "Arena-Hard-Auto (LMSYS)", back: "Автоматический pairwise eval-фреймворк с большим набором задач, сильно коррелирует с человеческими preferences LMSYS Arena." },
      { front: "Held-out human alignment set", back: "Отдельный набор 200–500 человек-размеченных кейсов, на которых judge НЕ калибровался. Регулярная проверка corr(judge, human) на этом наборе ловит дрейф." }
    ],
    quiz: [
      {
        question: "Чем permutation-based calibration лучше простого swap?",
        options: [
          "Она быстрее",
          "Учитывает несколько порядков для 3+ кандидатов, не только pair (A,B) ↔ (B,A)",
          "Не нужна",
          "Это синоним swap"
        ],
        correct: 1,
        explanation: "Swap решает позиционный bias для пары. При 3+ кандидатах нужны больше перестановок — permutation calibration усредняет ранг по 4–8 порядкам."
      },
      {
        question: "В чём ключевая идея autoraters от Google?",
        options: [
          "Дешевле LLM-as-Judge",
          "Калибровать judge к распределению предпочтений (P(A) ∈ [0,1]) вместо одной метки",
          "Использовать только open models",
          "Заменить human eval"
        ],
        correct: 1,
        explanation: "Human judgment — это распределение, не одна метка. Judge должен предсказывать вероятность предпочтения, и калибруется как probability classifier (Brier, ECE)."
      },
      {
        question: "Команда использует GPT-4 как single judge для своих GPT-4-сервисов. Какой главный риск?",
        options: [
          "Слишком дорого",
          "Self-preference: judge систематически предпочитает свой стиль, корреляция с human alignment set падает со временем",
          "Низкая скорость",
          "Нет JSON-режима"
        ],
        correct: 1,
        explanation: "Self-preference bias — задокументирован. Решение: ensemble (Claude + GPT + Gemini), cross-judge, и регулярная re-calibration на freshly labeled human set."
      },
      {
        question: "Зачем нужен held-out human alignment set?",
        options: [
          "Это backup",
          "Регулярная проверка корреляции judge-человек ловит дрейф judge и накопление bias",
          "Чтобы тренировать модели",
          "Не нужен — kappa достаточно"
        ],
        correct: 1,
        explanation: "Без свежей сверки с людьми вы не знаете, остался ли judge калиброванным. Held-out set — единственный надёжный сигнал дрейфа."
      },
      {
        question: "Какой АНТИПАТТЕРН в продвинутой LLM-as-Judge eval?",
        options: [
          "Ensemble judges",
          "Permutation calibration",
          "Single-judge той же модели-семьи, что и оцениваемые сервисы, без re-calibration",
          "Rubric-as-a-judge"
        ],
        correct: 2,
        explanation: "Self-preference + дрейф = искажение метрики. Любой долгоживущий judge должен быть либо ensemble, либо cross-family, и регулярно re-калиброван."
      }
    ],
    sources: [
      { title: "Eugene Yan — LLM Evaluators (overview)", url: "https://eugeneyan.com/writing/llm-evaluators/", icon: "🔗" },
      { title: "Calibrating Autoraters (Google, 2510.00263)", url: "https://arxiv.org/pdf/2510.00263", icon: "📄" },
      { title: "Judging the Judges (2604.23178)", url: "https://arxiv.org/html/2604.23178", icon: "📄" },
      { title: "MT-Bench / Chatbot Arena (2306.05685)", url: "https://arxiv.org/html/2306.05685v4", icon: "📄" },
      { title: "Silent Judge — shortcut bias (2509.26072)", url: "https://arxiv.org/pdf/2509.26072", icon: "📄" },
      { title: "OpenRubrics (2510.07743)", url: "https://arxiv.org/html/2510.07743v1", icon: "📄" }
    ]
  },
  {
    id: 12,
    title: "RAG evaluation",
    goal: "Освоить специализированные метрики и фреймворки для оценки RAG-систем: faithfulness, answer/context relevance, ARES, MIRAGE.",
    objectives: [
      "Знать trinity RAGAS: faithfulness, answer relevancy, context precision/recall",
      "Различать retrieval-only и end-to-end метрики",
      "Знать production-цели (≥0.9 / ≥0.85 / ≥0.8) и инструменты ARES, RGB, CRAG, MIRAGE"
    ],
    content: `
      <h4>Почему общие метрики не подходят RAG</h4>
      <p>RAG-система = retriever + LLM. Сбой может быть в любой части:</p>
      <ul>
        <li>Retriever нашёл нерелевантный контекст — LLM сгенерирует правильную форму, но неправильный смысл</li>
        <li>Retriever нашёл правильный, но LLM проигнорировал — галлюцинация в финальном ответе</li>
        <li>Все верно, но LLM добавил лишнее, не подтверждённое контекстом</li>
      </ul>
      <p>Нужны метрики, разделяющие эти источники ошибок.</p>

      <h4>Trinity RAGAS</h4>

      <div class="metric-card">
        <h5>Faithfulness</h5>
        <p>Соответствие финального ответа полученному контексту. Каждое утверждение в ответе должно поддерживаться источниками. Reference-free.</p>
      </div>

      <div class="metric-card">
        <h5>Answer Relevancy</h5>
        <p>Насколько ответ релевантен вопросу. Reference-free, вычисляется через embedding-similarity вопроса и generated query-вариантов из ответа.</p>
      </div>

      <div class="metric-card">
        <h5>Context Precision / Recall</h5>
        <p>Precision = доля retrieved chunks, реально использованных в ответе. Recall = доля нужных chunks, попавших в retrieval. Требует ground truth.</p>
      </div>

      <h4>Production targets (labelyourdata.com)</h4>
      <ul>
        <li>Faithfulness ≥ <strong>0.9</strong></li>
        <li>Answer relevancy ≥ <strong>0.85</strong></li>
        <li>Context precision ≥ <strong>0.8</strong></li>
        <li>Hallucination rate &lt; <strong>5%</strong></li>
        <li>Citation coverage ≥ <strong>90%</strong> для compliance-сценариев</li>
      </ul>

      <h4>Retrieval-only метрики</h4>
      <ul>
        <li><strong>precision@k</strong>, <strong>recall@k</strong> — доля релевантных в top-k</li>
        <li><strong>MRR (Mean Reciprocal Rank)</strong> — средняя обратная позиция первого релевантного</li>
        <li><strong>nDCG</strong> — учитывает позицию и graded relevance</li>
      </ul>

      <h4>Альтернативные фреймворки</h4>
      <ul>
        <li><strong>ARES</strong> — context relevance + answer faithfulness + answer relevance; обучает специальные judge-модели на синтетических данных</li>
        <li><strong>RGB (Retrieval-Augmented Generation Benchmark)</strong> — granular noise control: оценивает устойчивость к шумным контекстам</li>
        <li><strong>CRAG</strong> — comprehensive RAG benchmark с категориями (simple, comparison, condition, aggregation)</li>
        <li><strong>MIRAGE</strong> — 7560 QA пар, 37800 контекстов из Wikipedia; специально для evaluation длинно-контекстных RAG</li>
      </ul>

      <div class="key-concept">
        <strong>Связь с rag-course проекта:</strong> там подробно про Contextual Retrieval (Anthropic), late chunking, multimodal RAG (ColPali). Здесь — про то, как мерить, что именно работает.
      </div>

      <h4>Eval pipeline для RAG</h4>
      <ol>
        <li>Собрать golden set: (question, ideal_context_ids, expected_answer)</li>
        <li>Прогнать retriever, измерить precision@k / recall@k / MRR</li>
        <li>Прогнать end-to-end, измерить faithfulness / answer_relevancy</li>
        <li>Сравнить baseline и candidate, найти источник деградации (retrieval или generation)</li>
      </ol>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда переехала с ada-002 на новый embedding и получила +12% answer accuracy в продакшене. Но faithfulness упал с 0.91 до 0.79 — модель стала добавлять "разумные" утверждения, не подтверждённые контекстом. <strong>Правильно:</strong> faithfulness — обязательная метрика наряду с accuracy; падение faithfulness — это рост hallucination rate. <strong>Антипаттерн:</strong> следить только за accuracy/relevancy без faithfulness — деградация фактической надёжности проходит мимо радара.
      </div>
    `,
    flashcards: [
      { front: "Faithfulness (RAGAS)", back: "Соответствие финального ответа полученному контексту. Каждое утверждение должно поддерживаться источниками. Reference-free, target ≥0.9 для продакшена." },
      { front: "Answer Relevancy", back: "Насколько ответ релевантен вопросу. Reference-free, вычисляется через embedding-similarity вопроса и query-вариантов из ответа. Target ≥0.85." },
      { front: "Context Precision / Recall", back: "Precision = доля retrieved chunks, реально использованных. Recall = доля нужных chunks, попавших в retrieval. Требует ground truth." },
      { front: "Retrieval метрики", back: "precision@k, recall@k, MRR (Mean Reciprocal Rank), nDCG. Измеряют качество retriever отдельно от LLM." },
      { front: "ARES", back: "Альтернатива RAGAS: context relevance + answer faithfulness + answer relevance. Обучает специальные judge-модели на синтетических данных." },
      { front: "RGB", back: "Retrieval-Augmented Generation Benchmark с granular noise control. Оценивает устойчивость к шумным контекстам — важно для production." },
      { front: "MIRAGE", back: "7560 QA пар, 37800 контекстов из Wikipedia. Специально для evaluation длинно-контекстных RAG." },
      { front: "Hallucination rate / Citation coverage", back: "% утверждений без поддержки в источниках / % утверждений с явными ссылками. Production: HR <5%, CC ≥90% для compliance." }
    ],
    quiz: [
      {
        question: "Какая метрика RAGAS измеряет, что ответ соответствует полученному контексту?",
        options: ["Answer Relevancy", "Faithfulness", "Context Precision", "MRR"],
        correct: 1,
        explanation: "Faithfulness — каждое утверждение в ответе должно быть подтверждено retrieved контекстом. Это reference-free и target ≥0.9 для продакшена."
      },
      {
        question: "Команда обновила embedding-модель: answer accuracy +12%, faithfulness 0.91 → 0.79. Что это значит?",
        options: [
          "Всё отлично — accuracy выросла",
          "Рост hallucination rate: модель добавляет утверждения без подтверждения контекстом. Деградация фактической надёжности",
          "Это нормально",
          "Faithfulness неважна"
        ],
        correct: 1,
        explanation: "Падение faithfulness — рост hallucination. Accuracy может расти за счёт \"разумных\" утверждений без источников — для compliance это критично."
      },
      {
        question: "Где использовать MRR?",
        options: [
          "Для end-to-end RAG",
          "Для retrieval-only оценки: средняя обратная позиция первого релевантного chunk",
          "Для faithfulness",
          "Для chat-оценки"
        ],
        correct: 1,
        explanation: "MRR — retrieval-only метрика. Помогает локализовать, retrieval это узкое место или генерация."
      },
      {
        question: "Почему context precision/recall требуют ground truth, а faithfulness — нет?",
        options: [
          "Это случайно",
          "Precision/recall сравнивают retrieved chunks с эталонным набором релевантных (нужны метки). Faithfulness проверяет согласованность ответа и контекста (можно без меток)",
          "Faithfulness требует ground truth, а precision — нет",
          "Это одно и то же"
        ],
        correct: 1,
        explanation: "Faithfulness — reference-free: judge сравнивает ответ и контекст. Precision/recall меряют качество retrieval против размеченных релевантных chunks."
      },
      {
        question: "АНТИПАТТЕРН в RAG eval:",
        options: [
          "Следить только за accuracy/answer_relevancy без faithfulness",
          "Использовать ARES вместе с RAGAS",
          "Замерять precision@k и MRR",
          "Иметь golden set 200–500 пар"
        ],
        correct: 0,
        explanation: "Без faithfulness деградация фактической надёжности (hallucinations) не виден на дашборде. Для compliance-сценариев это критично."
      }
    ],
    sources: [
      { title: "RAGAS Documentation", url: "https://docs.ragas.io/en/stable/getstarted/rag_eval/", icon: "🔗" },
      { title: "RAGAS paper (2309.15217)", url: "https://arxiv.org/pdf/2309.15217", icon: "📄" },
      { title: "ARES (2311.09476)", url: "https://arxiv.org/pdf/2311.09476", icon: "📄" },
      { title: "MIRAGE (2504.17137)", url: "https://arxiv.org/html/2504.17137v1", icon: "📄" },
      { title: "LabelYourData — RAG evaluation guide", url: "https://labelyourdata.com/articles/llm-fine-tuning/rag-evaluation", icon: "🔗" }
    ]
  },
  {
    id: 13,
    title: "Production observability и OTel GenAI",
    goal: "Освоить production observability LLM-систем на базе OpenTelemetry GenAI Semantic Conventions и выбрать платформу под задачу.",
    objectives: [
      "Знать OTel GenAI Semantic Conventions и их статус",
      "Сравнивать Langfuse, Arize Phoenix, LangSmith, Helicone, W&B Weave",
      "Считать TTFT, ITL, p50/p95/p99 и eval-on-eval cost"
    ],
    content: `
      <h4>OpenTelemetry GenAI Semantic Conventions</h4>
      <p>GenAI SIG в OpenTelemetry с 2024 разрабатывает стандарт описания LLM-вызовов: модель, токены, cost, prompt/completion content, tool calls. На март 2026 большинство конвенций остаётся в статусе <em>experimental</em>, но платформы уже интегрируют.</p>
      <p>Что трэйсится:</p>
      <ul>
        <li><strong>gen_ai.system / gen_ai.request.model</strong> — провайдер и модель</li>
        <li><strong>gen_ai.usage.input_tokens / output_tokens</strong> — стоимостные метрики</li>
        <li><strong>gen_ai.response.finish_reason</strong> — нормальный stop, length, content_filter</li>
        <li><strong>gen_ai.prompt / gen_ai.completion</strong> — сами тексты (опционально, в зависимости от политики)</li>
        <li><strong>tool calls</strong> — имя, аргументы, результат, latency на шаг</li>
      </ul>

      <h4>Сравнение платформ</h4>
      <div class="metric-card">
        <h5>Когда что выбирать</h5>
        <table>
          <thead><tr><th>Платформа</th><th>Сильная сторона</th><th>Когда выбирать</th></tr></thead>
          <tbody>
            <tr><td><strong>Langfuse</strong></td><td>OTel-native, open-source, distributed traces</td><td>Базовая production-observability без vendor lock-in</td></tr>
            <tr><td><strong>Arize Phoenix</strong></td><td>OpenInference, RAG-фокус, eval-views</td><td>RAG-системы, faithfulness и retrieval-debugging</td></tr>
            <tr><td><strong>LangSmith</strong></td><td>Proprietary, бесшовно с LangChain</td><td>LangChain-стек, готовы платить за интеграцию</td></tr>
            <tr><td><strong>W&B Weave</strong></td><td>@weave.op decorator, integration с W&B tracking</td><td>ML-команды с существующим W&B стеком</td></tr>
            <tr><td><strong>Helicone</strong></td><td>URL-swap (минимум интеграции), built-in caching</td><td>Быстрый старт + economy через кеш</td></tr>
            <tr><td><strong>Braintrust</strong></td><td>Eval-first, enterprise focus</td><td>Команды, где eval — главный продукт</td></tr>
            <tr><td><strong>Galileo</strong></td><td>Luna-2 real-time guardrails, multi-step assessment</td><td>Compliance-heavy и safety-critical продакшн</td></tr>
            <tr><td><strong>Datadog GenAI</strong></td><td>Native OTel GenAI в Datadog Agent v1.37</td><td>Команды, уже сидящие на Datadog</td></tr>
          </tbody>
        </table>
      </div>

      <h4>Cost и latency: ключевые метрики</h4>
      <ul>
        <li><strong>TTFT (Time To First Token)</strong> — время от запроса до первого токена. Критично для UX streaming.</li>
        <li><strong>ITL (Inter-Token Latency)</strong> — среднее время между токенами. Определяет "ощущаемую скорость".</li>
        <li><strong>p50 / p95 / p99 latency</strong> — медиана и хвосты. "By tracking p95 or p99, you ensure almost everyone has acceptably fast experience."</li>
        <li><strong>$/успешный запрос</strong> — стоимость с учётом неудач и retries</li>
        <li><strong>Cost bloat</strong> — рост среднего числа токенов на ответ без роста качества</li>
      </ul>

      <h4>Eval-on-eval cost</h4>
      <p>LLM-as-Judge сам стоит денег. На больших eval-наборах cost судьи может превышать cost тестируемых моделей. Контр-меры:</p>
      <ul>
        <li><strong>Semantic cache</strong> — кешировать judge-результаты для повторяющихся (Q, A) пар (cosine ≥0.95)</li>
        <li><strong>Batch API</strong> — OpenAI/Anthropic batch endpoints, скидка -50%</li>
        <li><strong>Cer-Eval</strong> (2505.03814) — certifiable cost-efficient eval с теоретическими гарантиями выборки</li>
      </ul>

      <h4>Drift monitoring</h4>
      <p>Production-eval — не одноразовая проверка, а непрерывный процесс. Что отслеживать:</p>
      <ul>
        <li>Распределение входных запросов (input drift)</li>
        <li>Output длина, ratio refusals, ratio tool-calls (output drift)</li>
        <li>Score из online LLM-as-Judge на sampled трафике (quality drift)</li>
        <li>Cost per request, p95 latency (operational drift)</li>
      </ul>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда забыла мониторить p95 latency и cost per request. Внутренний промпт вырос на 1200 токенов после "улучшения" — quality не изменился, а $-расход вырос в 3×, p95 — на 60%. <strong>Правильно:</strong> алерт на ΔTokens_per_request > 20% между деплоями. <strong>Антипаттерн:</strong> наблюдать только за quality-метрикой; cost и latency требуют отдельных алертов.
      </div>
    `,
    flashcards: [
      { front: "OTel GenAI Semantic Conventions", back: "Стандарт OpenTelemetry для LLM-вызовов: модель, токены, cost, prompt/completion, tool calls. С 2024, большинство атрибутов в статусе experimental, активно используется." },
      { front: "Langfuse", back: "OTel-native, open-source платформа observability. Distributed traces, eval-views, без vendor lock-in. Подходит как базовый production-стэк." },
      { front: "Arize Phoenix", back: "OpenInference-based observability с фокусом на RAG: retrieval debugging, faithfulness views, eval-инструменты внутри." },
      { front: "LangSmith", back: "Proprietary observability от LangChain. Бесшовно с LangChain стеком, но vendor lock-in и платная." },
      { front: "Helicone", back: "URL-swap (минимум интеграции) + built-in caching. Хорош для быстрого старта и economy через кеш на повторяющихся промптах." },
      { front: "TTFT / ITL", back: "TTFT — время до первого токена (важно для UX streaming). ITL — среднее время между токенами, определяет ощущаемую скорость." },
      { front: "Eval-on-eval cost", back: "Сам LLM-as-Judge стоит денег. Контр-меры: semantic cache (cosine ≥0.95), Batch API (-50%), Cer-Eval с теоретическими гарантиями." },
      { front: "Drift monitoring", back: "Непрерывное наблюдение input/output/quality/operational дрейфов. Алерты на резкий рост tokens-per-request, refusal rate, p95 latency." }
    ],
    quiz: [
      {
        question: "Что описывает OTel GenAI Semantic Conventions?",
        options: [
          "API OpenAI",
          "Стандарт OpenTelemetry для трэйсинга LLM-вызовов: модель, токены, prompt/completion, tool calls",
          "Только цены",
          "Это про базы данных"
        ],
        correct: 1,
        explanation: "OTel GenAI Semantic Conventions — стандарт описания LLM-вызовов в observability. Позволяет не зависеть от вендора при сборе телеметрии."
      },
      {
        question: "Команде нужна observability для RAG-системы с детализированным retrieval debugging. Что выбрать?",
        options: ["Datadog GenAI", "Arize Phoenix", "Helicone", "Только consoles"],
        correct: 1,
        explanation: "Arize Phoenix построен на OpenInference и специально заточен под RAG: faithfulness views, retrieval debugging, eval-инструменты внутри платформы."
      },
      {
        question: "Почему важно отдельно мониторить p95/p99 latency, а не только среднее?",
        options: [
          "Среднее всегда лжёт",
          "Хвостовые задержки определяют UX для значимой доли пользователей; среднее их маскирует",
          "Среднее нельзя посчитать",
          "Это требование GDPR"
        ],
        correct: 1,
        explanation: "p95/p99 показывают опыт 5–1% худших запросов. Если p99 = 30с, то 1% пользователей ждёт 30с — для chat это неприемлемо. Среднее это маскирует."
      },
      {
        question: "Eval-on-eval cost вырос непропорционально. Какие контр-меры эффективны?",
        options: [
          "Уменьшить датасет в 10× — потеря репрезентативности",
          "Semantic cache на (Q,A) парах (cosine ≥0.95) + Batch API (-50%) + Cer-Eval для гарантированной выборки",
          "Использовать только perplexity",
          "Перейти на vibes-based"
        ],
        correct: 1,
        explanation: "Semantic cache + Batch API + теоретически обоснованная выборка (Cer-Eval) дают значительную экономию без потери качества eval."
      },
      {
        question: "АНТИПАТТЕРН в production observability:",
        options: [
          "Алерт на ΔTokens_per_request > 20%",
          "Мониторить только quality-метрики, игнорируя cost и p95 latency",
          "Использовать OTel GenAI Semantic Conventions",
          "Sampled LLM-as-Judge на онлайн-трафике"
        ],
        correct: 1,
        explanation: "Quality без cost и latency скрывает деградации экономики и UX. Cost bloat и p95-всплески требуют собственных алертов."
      }
    ],
    sources: [
      { title: "OpenTelemetry — GenAI Observability", url: "https://opentelemetry.io/blog/2026/genai-observability/", icon: "🔗" },
      { title: "OpenTelemetry — AI Agent Observability", url: "https://opentelemetry.io/blog/2025/ai-agent-observability/", icon: "🔗" },
      { title: "MLflow — GenAI Tracing OTel SemConv", url: "https://mlflow.org/docs/latest/genai/tracing/opentelemetry/genai-semconv/", icon: "🔗" },
      { title: "Datadog — LLM OTel Semantic Convention", url: "https://www.datadoghq.com/blog/llm-otel-semantic-convention/", icon: "🔗" },
      { title: "Helicone — LLM observability platforms guide", url: "https://www.helicone.ai/blog/the-complete-guide-to-LLM-observability-platforms", icon: "🔗" },
      { title: "Anyscale — LLM serving metrics", url: "https://docs.anyscale.com/llm/serving/benchmarking/metrics", icon: "🔗" }
    ]
  },
  {
    id: 14,
    title: "Что устарело: антипаттерны evaluation 2026",
    goal: "Систематизировать антипаттерны evaluation и знать, чем их заменять в 2026 году.",
    objectives: [
      "Знать 7 устаревших практик и их современные замены",
      "Понимать, как contamination формирует ошибочные выводы",
      "Знать LiveBench, LiveCodeBench, AntiLeak-Bench"
    ],
    content: `
      <h4>Антипаттерны и замены</h4>

      <div class="metric-card">
        <h5>1. MMLU/HellaSwag для frontier-моделей</h5>
        <p><strong>Антипаттерн:</strong> рапортовать классику с 90%+ score как differentiator. <strong>Замена:</strong> MMLU-Pro, GPQA Diamond, GPQA Pro. Для маленьких моделей классика остаётся как baseline.</p>
      </div>

      <div class="metric-card">
        <h5>2. Чистый BLEU/ROUGE для chat</h5>
        <p><strong>Антипаттерн:</strong> оптимизировать BLEU на open-ended генерации. <strong>Замена:</strong> LLM-as-Judge с pairwise + swap calibration; BERTScore как дешёвый pre-filter.</p>
      </div>

      <div class="metric-card">
        <h5>3. Pairwise judge без swap</h5>
        <p><strong>Антипаттерн:</strong> делать выводы по одному порядку (A,B). <strong>Замена:</strong> swap-augmentation (A,B) и (B,A), permutation для 3+ кандидатов.</p>
      </div>

      <div class="metric-card">
        <h5>4. Статичный leaderboard без обновления</h5>
        <p><strong>Антипаттерн:</strong> верить лидерборду 2022 года для модели 2026. <strong>Замена:</strong> LiveBench (обновляется каждые несколько месяцев), LiveCodeBench (date-tagged), AntiLeak-Bench (knowledge post-cutoff).</p>
      </div>

      <div class="metric-card">
        <h5>5. Self-preference judge</h5>
        <p><strong>Антипаттерн:</strong> single-judge той же модели-семьи, что и оцениваемые сервисы. <strong>Замена:</strong> ensemble (Claude + GPT + Gemini), cross-family judge, регулярная re-calibration на held-out human set.</p>
      </div>

      <div class="metric-card">
        <h5>6. Eval только на golden set без production traces</h5>
        <p><strong>Антипаттерн:</strong> "у нас 92% на golden, всё хорошо", без онлайн eval. <strong>Замена:</strong> online evaluation, drift monitoring, sampled LLM-as-Judge на трафике.</p>
      </div>

      <div class="metric-card">
        <h5>7. Только outcome score для агентов</h5>
        <p><strong>Антипаттерн:</strong> сравнивать агентов по success rate. <strong>Замена:</strong> мульти-dimensional eval (success × trajectory × cost × reliability/variance).</p>
      </div>

      <div class="metric-card">
        <h5>8. Refusal penalty / sycophancy</h5>
        <p><strong>Антипаттерн:</strong> судьи и пользователи штрафуют отказы (ethical refusals "8% win vs 36% для normal"). <strong>Замена:</strong> отдельный refusal eval + sycophancy benchmarks (BBQ, RewardBench).</p>
      </div>

      <h4>Data contamination как проблема</h4>
      <p>Документировано: contamination до <strong>45%</strong> на популярных бенчмарках. Без проверки результаты системно завышены. Решения:</p>
      <ul>
        <li><strong>LiveBench</strong> — обновляется каждые несколько месяцев, math из последних 12 месяцев</li>
        <li><strong>LiveCodeBench</strong> — date-tagged задачи; модели оцениваются только на post-cutoff</li>
        <li><strong>AntiLeak-Bench</strong> — запросы о знаниях, появившихся после cutoff модели</li>
        <li><strong>n-gram overlap check</strong> на стороне eval-фреймворка (lm-eval-harness)</li>
      </ul>

      <div class="key-concept">
        <strong>Trade-off динамических бенчмарков:</strong> постоянное обновление усложняет longitudinal-сравнения. "Shifting target makes it difficult to maintain a consistent baseline." Решение: фиксировать "год бенчмарка" в отчётах, держать обе версии (snapshot + live).
      </div>

      <h4>Leaderboard Illusion</h4>
      <p>Работа "Leaderboard Illusion" (2504.20879) показала: судьи и пользователи систематически штрафуют ethical refusals и предпочитают confident-sounding ответы. Это деформирует ELO в Arena и подобных. Митигация — отдельные refusal/safety evals, не растворённые в общем рейтинге.</p>

      <div class="key-concept">
        <strong>Мини-кейс.</strong> Команда хвалится: "наша модель на 4 п.п. лучше на MMLU и HumanEval". Через 2 месяца независимые тесты на GPQA Pro и SWE-bench Verified показывают противоположный результат. <strong>Причина:</strong> contamination + насыщенность классических бенчмарков. <strong>Правильно:</strong> рапортовать стек 2025–2026 (MMLU-Pro, GPQA, SWE-bench Verified, LiveBench, ARC-AGI-2) и держать собственный domain-eval. <strong>Антипаттерн:</strong> мерить frontier-модели классикой и забывать про contamination check.
      </div>
    `,
    flashcards: [
      { front: "Антипаттерн: MMLU для frontier-модели", back: "Замена: MMLU-Pro, GPQA Diamond. Классика насыщена и не различает топ-модели. Допустимо как baseline для маленьких моделей." },
      { front: "Антипаттерн: pairwise judge без swap", back: "Замена: swap-augmentation (A,B) и (B,A), permutation calibration для 3+ кандидатов. Без swap результаты искажены position bias." },
      { front: "Антипаттерн: статичный leaderboard", back: "Замена: LiveBench, LiveCodeBench (date-tagged), AntiLeak-Bench. Для frontier-моделей contamination через статику почти неизбежна." },
      { front: "LiveBench", back: "Динамический бенчмарк: обновляется каждые несколько месяцев, math из последних 12 месяцев, ground-truth значения. Защита от contamination." },
      { front: "LiveCodeBench", back: "Date-tagged кодинг-бенчмарк. Каждая задача оценивается только на моделях с cutoff раньше публикации задачи." },
      { front: "AntiLeak-Bench", back: "Бенчмарк, тестирующий знания, появившиеся после cutoff модели. Защита от leakage по дате." },
      { front: "Refusal penalty (Leaderboard Illusion)", back: "Ethical refusals выигрывают 8% битв vs 36% для normal-ответов. Antithesis: судьи и пользователи штрафуют отказы, искажая Arena ELO." },
      { front: "Data contamination — масштаб проблемы", back: "Документировано до 45% contamination на популярных бенчмарках. Без проверки результаты системно завышены." }
    ],
    quiz: [
      {
        question: "Какая замена MMLU/HellaSwag для frontier-моделей?",
        options: [
          "Никакая, они достаточны",
          "MMLU-Pro, GPQA Diamond, GPQA Pro — снижают потолок и возвращают разрешающую способность",
          "Только HumanEval",
          "BLEU"
        ],
        correct: 1,
        explanation: "Frontier-модели у потолка классики. MMLU-Pro (10 опций + CoT) и GPQA Diamond (graduate-level) ещё разрешают топ-модели."
      },
      {
        question: "Почему статичный leaderboard опасен для frontier-моделей?",
        options: [
          "Он скучный",
          "Contamination: тестовые данные могут попасть в претрейн, до 45% на популярных бенчмарках, результаты искажены",
          "Он бесплатный",
          "Это работа для backend"
        ],
        correct: 1,
        explanation: "Документирован уровень contamination до 45%. LiveBench/LiveCodeBench/AntiLeak-Bench регулярно обновляются и защищают от leakage."
      },
      {
        question: "Команда сравнивает агентов только по success rate. Какой риск?",
        options: [
          "Никакого",
          "Маскируются различия в trajectory, cost, variance — выбор может быть неоптимальным для production",
          "Success rate всегда показывает правду",
          "Сравнение быстрее"
        ],
        correct: 1,
        explanation: "Outcome-only — один из задокументированных антипаттернов 2026 для agentic eval. Стандарт — multi-dim: success × trajectory × cost × reliability."
      },
      {
        question: "Что предлагает Leaderboard Illusion как митигацию?",
        options: [
          "Удалить лидерборды",
          "Отдельные refusal/safety evals, не растворённые в общем рейтинге — иначе judges и пользователи штрафуют ethical refusals",
          "Использовать только классику",
          "Перейти на BLEU"
        ],
        correct: 1,
        explanation: "В Arena ethical refusals выигрывают 8% битв vs 36% для normal-ответов. Без отдельного refusal eval safety проигрывает в общем рейтинге."
      },
      {
        question: "Чем заменить single-judge для оценки моделей того же семейства?",
        options: [
          "Тем же judge, чаще запускать",
          "Ensemble (Claude + GPT + Gemini) или cross-family judge + регулярная re-calibration на held-out human set",
          "Vibes-based",
          "MMLU"
        ],
        correct: 1,
        explanation: "Self-preference + дрейф = искажение метрики. Ensemble или cross-family judge с регулярной калибровкой — стандарт production-grade eval."
      }
    ],
    sources: [
      { title: "LiveBench", url: "https://github.com/livebench/livebench", icon: "🔗" },
      { title: "Contamination survey (2406.19314)", url: "https://arxiv.org/pdf/2406.19314", icon: "📄" },
      { title: "Static → Dynamic survey (2502.17521)", url: "https://arxiv.org/html/2502.17521v2", icon: "📄" },
      { title: "Leaderboard Illusion (2504.20879)", url: "https://arxiv.org/pdf/2504.20879", icon: "📄" },
      { title: "LLM-Stats — Contaminated LLM blog", url: "https://llm-stats.com/blog/research/what-is-a-contaminated-llm", icon: "🔗" }
    ]
  }
];

// ============================================================
// Final Review Questions
// ============================================================

const finalQuiz = [
  {
    question: "Какая проблема НЕ характерна для vibes-based evaluation?",
    options: ["Selection bias", "Recency bias", "Слишком высокая стоимость", "Невоспроизводимость"],
    correct: 2,
    explanation: "Vibes-based evaluation как раз дешёвая (просто спросить модель). Проблемы — в субъективности, невоспроизводимости и bias."
  },
  {
    question: "Perplexity снизилась. Можно ли утверждать, что модель стала полезнее для пользователя?",
    options: [
      "Да, однозначно",
      "Нет, perplexity измеряет качество language modeling, не полезность ответов",
      "Да, если снижение больше 5%",
      "Perplexity не связана с качеством"
    ],
    correct: 1,
    explanation: "Perplexity = насколько хорошо модель предсказывает следующий токен. Это language modeling метрика, не user-facing quality. Нужна отдельная evaluation ответов."
  },
  {
    question: "Data contamination в бенчмарках — это:",
    options: [
      "Бенчмарк содержит грамматические ошибки",
      "Тестовые данные попали в training set модели",
      "Модель не может обработать бенчмарк",
      "Бенчмарк устарел"
    ],
    correct: 1,
    explanation: "Data contamination — тестовые данные бенчмарка оказываются в training data. Модель запоминает ответы, результаты искусственно завышены."
  },
  {
    question: "Какой bias заставляет LLM-Judge предпочитать длинные ответы?",
    options: ["Position bias", "Verbosity bias", "Self-preference bias", "Authority bias"],
    correct: 1,
    explanation: "Verbosity bias — длинные ответы получают лучшие оценки. Решение: добавить в промпт \"do not reward verbosity\"."
  },
  {
    question: "Для первого запуска evaluation pipeline достаточно:",
    options: ["10 примеров", "100 качественных примеров", "10000 примеров", "Миллиона примеров"],
    correct: 1,
    explanation: "Правило 100/500/1000: 100 для старта, 500 для серьёзной evaluation, 1000+ для production monitoring."
  },
  {
    question: "Cohen's Kappa = 0.82 между аннотаторами. Это:",
    options: ["Плохое согласие", "Умеренное согласие", "Отличное согласие — можно доверять результатам", "Недостаточно данных"],
    correct: 2,
    explanation: "Kappa 0.8+ = excellent agreement. Аннотаторы хорошо понимают guidelines, результатам можно доверять."
  },
  {
    question: "Какой инструмент специализирован для evaluation RAG-систем?",
    options: ["lm-eval-harness", "RAGAS", "Chatbot Arena", "MMLU"],
    correct: 1,
    explanation: "RAGAS (RAG Assessment) — специализированные метрики для RAG: faithfulness, answer relevancy, context precision/recall."
  },
  {
    question: "Pairwise evaluation (A vs B) лучше pointwise (score 1-5), потому что:",
    options: [
      "Оно быстрее",
      "И людям, и LLM проще сравнить два ответа, чем поставить абсолютную оценку — стабильнее результаты",
      "Оно дешевле",
      "Не требует промпта"
    ],
    correct: 1,
    explanation: "Pairwise стабильнее: сравнивать проще, чем оценивать абсолютно. Это основа Chatbot Arena и даёт более воспроизводимые результаты."
  },
  {
    question: "Чем MMLU-Pro отличается от MMLU?",
    options: [
      "Меньше вопросов",
      "10 вариантов ответа вместо 4, обязательный CoT, более сложные задачи",
      "Только русский язык",
      "Только медицина"
    ],
    correct: 1,
    explanation: "MMLU-Pro поднял потолок, увеличив число опций до 10 и сделав CoT обязательным. Frontier-модели получают разрешение на этом бенчмарке."
  },
  {
    question: "Команда оценивает агентов. Что НЕЛЬЗЯ делать?",
    options: [
      "Считать success × trajectory × cost × variance",
      "Фиксировать scaffold при сравнении",
      "Выбирать продакшен-кандидата только по success rate без trajectory/cost/variance",
      "Использовать τ²-bench для customer service"
    ],
    correct: 2,
    explanation: "Outcome-only ловушка: одинаковый success rate может скрывать кратные различия в trajectory/cost/variance. Стандарт — multi-dim eval."
  },
  {
    question: "Reasoning-модели и token efficiency. Что важно?",
    options: [
      "Считать только финальную accuracy",
      "Сопоставлять accuracy_gain с длиной CoT и cost; ограничивать через reasoning_effort / budget_tokens",
      "Всегда включать максимум reasoning",
      "Использовать BLEU"
    ],
    correct: 1,
    explanation: "Reasoning-режим может давать +3 п.п. ценой 5× токенов. Token efficiency — обязательная ось; reasoning_effort/budget_tokens — инструменты контроля."
  },
  {
    question: "Faithfulness в RAG показывает:",
    options: [
      "Скорость retrieval",
      "Соответствие финального ответа полученному контексту; каждое утверждение поддержано источниками",
      "Размер chunk",
      "Точность токенизации"
    ],
    correct: 1,
    explanation: "Faithfulness — reference-free метрика согласованности ответ ↔ контекст. Target ≥0.9 для продакшена; падение = рост hallucination."
  },
  {
    question: "OTel GenAI Semantic Conventions решают какую проблему?",
    options: [
      "Уменьшают стоимость моделей",
      "Дают стандартизированный способ собирать телеметрию LLM-вызовов независимо от вендора",
      "Заменяют LLM-as-Judge",
      "Это про SQL"
    ],
    correct: 1,
    explanation: "OTel GenAI — стандарт телеметрии (модель, токены, prompt/completion, tool calls). Позволяет не зависеть от вендора observability."
  },
  {
    question: "АНТИПАТТЕРН evaluation 2026:",
    options: [
      "MMLU-Pro и GPQA Diamond вместо классики",
      "LiveBench для frontier-моделей",
      "Single judge той же модели-семьи без re-calibration; outcome-only для агентов; статичный leaderboard для frontier-моделей",
      "Ensemble judges"
    ],
    correct: 2,
    explanation: "Все три — задокументированные антипаттерны: self-preference, outcome-only ловушка, contamination через статичный leaderboard."
  }
];

// ============================================================
// App State & Logic
// ============================================================

let state = {
  currentLesson: -1,
  completed: new Set(),
  quizAnswered: {}
};

const $ = (sel) => document.querySelector(sel);

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
  $("#lesson-badge").textContent = "Урок " + (index + 1);
  $("#lesson-title").textContent = lesson.title;
  $("#objectives-list").innerHTML = lesson.objectives.map(o => "<li>" + o + "</li>").join("");
  $("#content-section").innerHTML = "<h3>📖 Материал</h3>" + lesson.content;

  buildFlashcards(lesson.flashcards);
  buildQuiz(lesson.quiz, lesson.id);
  buildSources(lesson.sources);

  $("#btn-prev").style.visibility = index === 0 ? "hidden" : "visible";
  $("#btn-next").textContent = index === courseData.length - 1 ? "Завершить →" : "Далее →";

  state.completed.add(index);
  updateProgress();
  buildSidebar();
  window.scrollTo(0, 0);
}

function buildFlashcards(cards) {
  const container = $("#flashcards");
  container.innerHTML = cards.map((card, i) =>
    "<div class=\"flashcard\" data-card=\"" + i + "\">" +
    "<div class=\"flashcard-inner\">" +
    "<div class=\"flashcard-front\">" + card.front + "</div>" +
    "<div class=\"flashcard-back\">" + card.back + "</div>" +
    "</div></div>"
  ).join("");

  container.querySelectorAll(".flashcard").forEach(card => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
}

function buildQuiz(questions, lessonId) {
  const container = $("#quiz");
  container.innerHTML = questions.map((q, qi) => {
    const key = lessonId + "-" + qi;
    const answered = state.quizAnswered[key];
    return "<div class=\"quiz-question\" data-key=\"" + key + "\" data-correct=\"" + q.correct + "\">" +
      "<h4>" + (qi + 1) + ". " + q.question + "</h4>" +
      "<div class=\"quiz-options\">" +
      q.options.map((opt, oi) => {
        let cls = "quiz-option";
        if (answered !== undefined) {
          cls += " disabled";
          if (oi === q.correct) cls += " correct";
          else if (oi === answered && oi !== q.correct) cls += " wrong";
        }
        return "<button class=\"" + cls + "\" data-option=\"" + oi + "\" data-key=\"" + key + "\">" + opt + "</button>";
      }).join("") +
      "</div>" +
      "<div class=\"quiz-feedback " + (answered !== undefined ? "show" : "") + " " +
      (answered !== undefined ? (answered === q.correct ? "correct-fb" : "wrong-fb") : "") +
      "\" data-key=\"" + key + "\">" +
      (answered !== undefined ? (answered === q.correct ? "✅ Правильно! " : "❌ Неверно. ") + q.explanation : "") +
      "</div></div>";
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

  questionEl.querySelectorAll(".quiz-option").forEach((opt, i) => {
    opt.classList.add("disabled");
    if (i === correctIdx) opt.classList.add("correct");
    else if (i === selectedIdx && i !== correctIdx) opt.classList.add("wrong");
  });

  const feedback = questionEl.querySelector(".quiz-feedback");
  const parts = key.split("-").map(Number);
  const explanation = courseData[parts[0] - 1]?.quiz[parts[1]]?.explanation || "";
  feedback.textContent = (selectedIdx === correctIdx ? "✅ Правильно! " : "❌ Неверно. ") + explanation;
  feedback.className = "quiz-feedback show " + (selectedIdx === correctIdx ? "correct-fb" : "wrong-fb");
}

function buildSources(sources) {
  const container = $("#sources");
  if (!sources || sources.length === 0) {
    $("#sources-section").classList.add("hidden");
    return;
  }
  $("#sources-section").classList.remove("hidden");
  container.innerHTML = sources.map(s =>
    "<a href=\"" + s.url + "\" target=\"_blank\" rel=\"noopener\" class=\"source-card\">" +
    "<span class=\"source-icon\">" + s.icon + "</span>" +
    "<div><div class=\"source-title\">" + s.title + "</div>" +
    "<div class=\"source-url\">" + s.url + "</div></div></a>"
  ).join("");
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
  state.currentLesson = courseData.length;
  $("#welcome").classList.add("hidden");
  $("#lesson-view").classList.add("hidden");
  $("#review-view").classList.remove("hidden");
  buildFinalQuiz();
  buildSidebar();
  window.scrollTo(0, 0);
}

function buildFinalQuiz() {
  const container = $("#final-quiz");
  container.innerHTML = finalQuiz.map((q, qi) =>
    "<div class=\"quiz-question\" data-fkey=\"" + qi + "\" data-correct=\"" + q.correct + "\">" +
    "<h4>" + (qi + 1) + ". " + q.question + "</h4>" +
    "<div class=\"quiz-options\">" +
    q.options.map((opt, oi) =>
      "<button class=\"quiz-option\" data-foption=\"" + oi + "\" data-fkey=\"" + qi + "\">" + opt + "</button>"
    ).join("") +
    "</div><div class=\"quiz-feedback\" data-fkey=\"" + qi + "\"></div></div>"
  ).join("");

  const answeredFinal = {};

  container.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const fkey = btn.dataset.fkey;
      if (answeredFinal[fkey] !== undefined) return;

      const questionEl = btn.closest(".quiz-question");
      const correctIdx = parseInt(questionEl.dataset.correct);
      const selectedIdx = parseInt(btn.dataset.foption);

      answeredFinal[fkey] = selectedIdx;

      questionEl.querySelectorAll(".quiz-option").forEach((opt, i) => {
        opt.classList.add("disabled");
        if (i === correctIdx) opt.classList.add("correct");
        else if (i === selectedIdx && i !== correctIdx) opt.classList.add("wrong");
      });

      const feedback = questionEl.querySelector(".quiz-feedback");
      feedback.textContent = (selectedIdx === correctIdx ? "✅ " : "❌ ") + finalQuiz[fkey].explanation;
      feedback.className = "quiz-feedback show " + (selectedIdx === correctIdx ? "correct-fb" : "wrong-fb");

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
  $("#review-score").textContent = score + " / " + total + " (" + pct + "%)";
  if (pct >= 80) {
    $("#review-message").textContent = "🎉 Отлично! Вы хорошо разбираетесь в LLM evaluation. Пора строить pipeline!";
  } else if (pct >= 50) {
    $("#review-message").textContent = "👍 Хорошая база. Пересмотрите уроки, где были ошибки.";
  } else {
    $("#review-message").textContent = "📚 Стоит пройти курс ещё раз, уделив внимание каждому уроку.";
  }
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-text").textContent = state.completed.size + " / " + courseData.length + " уроков";
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

document.addEventListener("DOMContentLoaded", init);
