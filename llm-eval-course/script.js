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
      <h4>Проблема \"vibes\"</h4>
      <p>Самый распространённый способ оценить LLM — открыть чат, задать пару вопросов и решить: \"хорошо\" или \"плохо\". Это <strong>vibes-based evaluation</strong> — субъективная, невоспроизводимая и обманчивая.</p>
      <p>Проблемы vibes-based подхода:</p>
      <ul>
        <li><strong>Selection bias</strong> — вы тестируете на удобных примерах, игнорируя edge cases</li>
        <li><strong>Recency bias</strong> — последний ответ влияет на общее впечатление непропорционально</li>
        <li><strong>Non-reproducible</strong> — другой человек (или вы через неделю) придёт к другому выводу</li>
        <li><strong>Масштаб</strong> — невозможно протестировать 1000 случаев вручную каждый раз при изменении</li>
      </ul>

      <div class="key-concept">
        <strong>Goodhart's Law:</strong> \"Когда метрика становится целью, она перестаёт быть хорошей метрикой.\" MMLU score 90% не значит, что модель полезна для вашей задачи. Всегда оценивайте на своих данных.
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
    `,
    flashcards: [
      { front: "Vibes-based evaluation", back: "Субъективная оценка \"мне кажется, модель отвечает хорошо\". Проблемы: selection bias, recency bias, невоспроизводимость, невозможность масштабирования." },
      { front: "Offline vs Online eval", back: "Offline = на подготовленном датасете до деплоя (быстро, дёшево). Online = на реальном трафике после деплоя (медленно, но отражает реальность)." },
      { front: "Три уровня evaluation", back: "Capability (что умеет), Quality (насколько хорошо), Safety (не вредит ли). Каждый уровень требует своих метрик и инструментов." }
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
      }
    ],
    sources: [
      { title: "Challenges in LLM Evaluation (Chang et al., 2023)", url: "https://arxiv.org/abs/2307.03109", icon: "📄" },
      { title: "A Survey on Evaluation of Large Language Models", url: "https://arxiv.org/abs/2307.03109", icon: "📄" }
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
      <p>BLEU считает, сколько n-грамм из сгенерированного текста совпадают с эталоном. Проблема: \"Кот сидит на коврике\" и \"На коврике сидит кот\" — смысл одинаковый, но BLEU будет низким.</p>

      <h4>ROUGE (Recall-Oriented Understudy for Gisting Evaluation)</h4>
      <div class="metric-card">
        <h5>ROUGE — recall для суммаризации</h5>
        <p>ROUGE-L измеряет длину наибольшей общей подпоследовательности (LCS). Лучше BLEU для суммаризации, но всё ещё surface-level метрика.</p>
      </div>

      <h4>Perplexity</h4>
      <div class="metric-card">
        <h5>Perplexity — уверенность модели</h5>
        <p>Мера того, насколько модель \"удивлена\" текстом. Ниже = лучше. Полезна для сравнения language models, но не говорит о качестве ответов.</p>
      </div>
      <p>Perplexity = exp(средний negative log-likelihood). Модель с perplexity 10 \"выбирает\" в среднем из 10 слов на каждом шаге. Но низкая perplexity ≠ хорошие ответы.</p>

      <h4>Accuracy (Exact Match)</h4>
      <p>Для задач с одним правильным ответом (классификация, QA, multiple choice):</p>
      <pre><code>accuracy = correct_answers / total_questions

# Multiple choice: сравниваем выбранный вариант
# Classification: сравниваем предсказанный класс
# QA: exact match или fuzzy match (F1)</code></pre>

      <h4>Почему этого недостаточно?</h4>
      <ul>
        <li><strong>Множественность правильных ответов</strong> — \"Париж\" и \"столица Франции\" — оба правильных ответа на \"Столица Франции?\", но BLEU/EM может не засчитать</li>
        <li><strong>Surface-level</strong> — BLEU не понимает смысл, только совпадение слов</li>
        <li><strong>Нет оценки качества</strong> — модель может генерировать грамматически правильный, но фактически неверный текст с высоким BLEU</li>
        <li><strong>Не подходит для open-ended</strong> — код, эссе, рассуждения невозможно оценить через n-gram overlap</li>
      </ul>

      <div class="key-concept">
        <strong>Правило:</strong> автоматические метрики (BLEU, ROUGE, perplexity) хороши как первый фильтр и для tracking трендов. Но для финальной оценки качества нужны LLM-as-Judge или human evaluation.
      </div>
    `,
    flashcards: [
      { front: "BLEU — что измеряет?", back: "Совпадение n-грамм (1-4 слова) между сгенерированным и эталонным текстом. Хорошо для перевода, плохо для open-ended генерации." },
      { front: "Perplexity", back: "Мера \"удивлённости\" модели текстом. exp(avg negative log-likelihood). Низкая perplexity ≠ хорошие ответы — это метрика языкового моделирования, не качества." },
      { front: "Почему BLEU плох для чатботов?", back: "BLEU сравнивает surface-level слова. \"Париж\" и \"столица Франции\" — одинаковый смысл, но низкий BLEU. Не оценивает фактическую корректность." }
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
      }
    ],
    sources: [
      { title: "BLEU: a Method for Automatic Evaluation of Machine Translation (Papineni, 2002)", url: "https://aclanthology.org/P02-1040/", icon: "📄" },
      { title: "ROUGE: A Package for Automatic Evaluation of Summaries (Lin, 2004)", url: "https://aclanthology.org/W04-1013/", icon: "📄" }
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

      <div class="metric-card">
        <h5>MT-Bench</h5>
        <p>80 multi-turn вопросов, оцениваемых GPT-4. Измеряет quality в диалоге: writing, reasoning, math, coding, roleplay. Более репрезентативен, чем MMLU.</p>
      </div>

      <div class="metric-card">
        <h5>Chatbot Arena (LMSYS)</h5>
        <p>Краудсорсинговые battle: пользователи голосуют за лучший ответ из двух анонимных моделей. ELO-рейтинг. Считается наиболее приближенным к реальным предпочтениям людей.</p>
      </div>

      <h4>Data Contamination</h4>
      <p>Главная проблема бенчмарков: данные из бенчмарков попадают в training data. Модель \"запоминает\" ответы вместо того, чтобы решать задачи.</p>

      <div class="key-concept">
        <strong>Decontamination:</strong> перед оценкой проверять, не было ли данных бенчмарка в training set. EleutherAI lm-eval-harness делает это автоматически: n-gram overlap между бенчмарком и training corpus > 10% = загрязнено.
      </div>

      <h4>Как читать leaderboards</h4>
      <ul>
        <li><strong>Разные модели, разные условия</strong> — temperature, max tokens, system prompt — всё влияет на результат</li>
        <li><strong>Cherry-picking</strong> — компании публикуют только выгодные бенчмарки</li>
        <li><strong>Self-reported ≠ independent</strong> — независимые тесты (LMSYS, Open LLM Leaderboard) надёжнее</li>
        <li><strong>Разрыв в 1-2% несущественен</strong> — в пределах статистической погрешности</li>
      </ul>

      <h4>Практический совет</h4>
      <p>Используйте бенчмарки как <strong>первый фильтр</strong> при выборе модели. Если модель показывает 60% на MMLU, а ваша задача требует reasoning — она не подойдёт. Но финальное решение принимайте на основе evaluation своих данных.</p>
    `,
    flashcards: [
      { front: "MMLU", back: "57 предметов, 15K multiple-choice. Измеряет breadth знаний. GPT-4: 87%. Ограничение: data contamination — вопросы попадают в training data." },
      { front: "pass@k (HumanEval)", back: "Вероятность, что хотя бы один из k сгенерированных вариантов кода пройдёт все тесты. pass@1 = greedy, pass@10 = берём 10 попыток." },
      { front: "Chatbot Arena (LMSYS)", back: "Краудсорсинговые blind battles: пользователи голосуют за лучший из двух анонимных ответов. ELO-рейтинг. Ближе всего к реальным предпочтениям." }
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
        explanation: "Разница в 2% на MMLU может быть статистически незначимой.更重要的是: MMLU измеряет общие знания, не качество для вашей конкретной задачи."
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
      }
    ],
    sources: [
      { title: "Measuring Massive Multitask Language Understanding (Hendrycks, 2021)", url: "https://arxiv.org/abs/2009.03300", icon: "📄" },
      { title: "Chatbot Arena (LMSYS)", url: "https://chat.lmsys.org/", icon: "🔗" },
      { title: "Open LLM Leaderboard (HuggingFace)", url: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard", icon: "🔗" }
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

      <pre><code>// Типичный LLM-as-Judge промпт
System: You are an expert evaluator. Rate the response
on a scale of 1-5 for each criterion:
- Correctness: Is the answer factually accurate?
- Helpfulness: Does it address the user's need?
- Clarity: Is it well-structured and easy to understand?

User: Question: {question}
Model response: {response}

Provide scores and brief justification in JSON format.</code></pre>

      <h4>Два режима оценки</h4>
      <ul>
        <li><strong>Pointwise (score)</strong> — judge даёт оценку одному ответу по шкале. Проще, но нестабильно (оценки \"прыгают\")</li>
        <li><strong>Pairwise (comparison)</strong> — judge сравнивает два ответа и выбирает лучший. Более надёжно, используется в Chatbot Arena</li>
      </ul>

      <div class="key-concept">
        <strong>Pairwise > Pointwise:</strong> людям и LLM проще сказать \"A лучше B\", чем поставить абсолютную оценку. Pairwise даёт более стабильные и воспроизводимые результаты.
      </div>

      <h4>Bias в LLM-as-Judge</h4>
      <ul>
        <li><strong>Position bias</strong> — склонность выбирать первый (или последний) вариант в pairwise. <em>Решение:</em> показывать ответы в обоих порядках и усреднять</li>
        <li><strong>Verbosity bias</strong> — более длинные ответы получают лучшие оценки, даже если они не лучше. <em>Решение:</em> включить в промпт \"do not reward length\"</li>
        <li><strong>Self-preference bias</strong> — GPT-4 оценивает ответы в стиле GPT-4 выше. <em>Решение:</em> использовать judge-модель, отличную от оцениваемых</li>
        <li><strong>Authority bias</strong> — модель \"увереннее\" звучит → оценка выше. <em>Решение:</em> просить проверять факты, а не стиль</li>
      </ul>

      <h4>Калибровка</h4>
      <p>Перед использованием LLM-as-Judge в продакшне:</p>
      <ul>
        <li>Подготовьте 50-100 пар (вопрос, ответ, human rating)</li>
        <li>Запустите judge и посчитайте согласие с человеком (Cohen's kappa, Kendall's tau)</li>
        <li>Если согласие < 0.6 — переработайте промпт judge или добавьте few-shot примеры</li>
        <li>Периодически re-калибруйте на свежих данных</li>
      </ul>

      <h4>Структурированный output</h4>
      <p>Всегда просите judge возвращать <code>structured JSON</code>, а не свободный текст. Это позволяет автоматически агрегировать результаты, строить дашборды и обнаруживать аномалии.</p>
    `,
    flashcards: [
      { front: "LLM-as-Judge", back: "Использование мощной LLM (GPT-4, Claude) для оценки ответов другой модели. Золотая середина между неточными автоматическими метриками и дорогой human evaluation." },
      { front: "Pairwise vs Pointwise", back: "Pointwise = оценка одному ответу (score 1-5). Pairwise = сравнение двух ответов (A лучше B). Pairwise стабильнее и воспроизводимее." },
      { front: "Position bias в LLM-as-Judge", back: "Склонность выбирать первый/последний вариант в pairwise сравнении. Решение: показывать ответы в обоих порядках (swap) и усреднять результаты." }
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
      }
    ],
    sources: [
      { title: "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)", url: "https://arxiv.org/abs/2306.05685", icon: "📄" },
      { title: "Large Language Models are not Robust Multiple Choice Selectors (Zheng et al., 2023)", url: "https://arxiv.org/abs/2309.03882", icon: "📄" }
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
        <li><strong>Критерии оценки</strong> — для каждого примера определите, что считать \"правильным\"</li>
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

      <h4>A/B Evaluation</h4>
      <p>Сравнение двух версий системы на одних и тех же данных:</p>
      <ul>
        <li>Версия A (baseline) и версия B (candidate) получают одинаковые inputs</li>
        <li>LLM-as-Judge оценивает оба ответа в pairwise режиме</li>
        <li>Результат: win rate B против A, разбивка по категориям</li>
        <li>Решение о deploy: B должна выигрывать статистически значимо (p < 0.05)</li>
      </ul>

      <h4>Метрики для pipeline</h4>
      <ul>
        <li><strong>Pass rate</strong> — % примеров, где ответ прошёл пороговую оценку</li>
        <li><strong>Win rate</strong> — % примеров, где новая версия лучше baseline</li>
        <li><strong>Average score</strong> — средняя оценка по шкале</li>
        <li><strong>Regression rate</strong> — % примеров, где стало хуже (самая важная метрика)</li>
      </ul>
    `,
    flashcards: [
      { front: "Golden Dataset", back: "Набор пар (input, expected output), собранный из реальных запросов с эталонными ответами от экспертов. Фундамент evaluation pipeline." },
      { front: "Regression Testing", back: "При каждом изменении (промпт, модель, config) прогонять golden dataset. Если метрики хуже baseline → блокировать deploy. Защита от деградации качества." },
      { front: "Regression rate", back: "% примеров, где новая версия хуже baseline. Самая важная метрика в evaluation pipeline — показывает, что именно сломалось." }
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
      }
    ],
    sources: [
      { title: "LLM Evaluation in Practice (Anthropic)", url: "https://docs.anthropic.com/en/docs/test-and-evaluate", icon: "🔗" },
      { title: "Evaluation Best Practices (OpenAI Cookbook)", url: "https://cookbook.openai.com/articles/evaluation", icon: "🔗" }
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
      </ul>
      <p>Если IAA < 0.6 — guidelines неясны, аннотаторы нуждаются в тренировке или шкала слишком размыта.</p>

      <h4>Практические советы</h4>
      <ul>
        <li><strong>2-3 аннотатора на пример</strong> — для надёжности и расчёта IAA</li>
        <li><strong>Blind evaluation</strong> — аннотатор не должен знать, какая модель дала ответ</li>
        <li><strong>Batch по 20-50 примеров</strong> — больше → fatigue, качество оценок падает</li>
        <li><strong>Overlap 20%</strong> — для расчёта IAA часть примеров оценивают все аннотаторы</li>
        <li><strong>Инструменты:</strong> Label Studio, Scale AI, Surge AI, Argilla</li>
      </ul>
    `,
    flashcards: [
      { front: "Когда нужна human eval?", back: "Новая задача (нет данных для judge), калибровка LLM-as-Judge, субъективное качество (стиль, юмор), safety (red teaming), финальный sign-off перед деплоем." },
      { front: "Inter-Annotator Agreement", back: "Мера согласия между аннотаторами. Cohen's Kappa для 2 человек, Fleiss' для 3+. < 0.6 = guidelines неясны. 0.8+ = excellent." },
      { front: "Annotation Guidelines", back: "Чёткие инструкции для аннотаторов: шкала с определениями + конкретные калибровочные примеры для каждого уровня. Без них оценки разойдутся." }
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
      }
    ],
    sources: [
      { title: "Label Studio (Open Source Annotation Tool)", url: "https://labelstud.io/", icon: "🔗" },
      { title: "Measuring Agreement (Cohen's Kappa Explained)", url: "https://en.wikipedia.org/wiki/Cohen%27s_kappa", icon: "📄" }
    ]
  },
  {
    id: 7,
    title: "Инструменты для Evaluation",
    goal: "Освоить практический инструментарий: от open-source фреймворков до production-платформ.",
    objectives: [
      "Запускать lm-eval-harness для бенчмарков",
      "Настраивать RAGAS для RAG evaluation",
      "Интегрировать evaluation в CI/CD"
    ],
    content: `
      <h4>lm-eval-harness (EleutherAI)</h4>
      <div class="metric-card">
        <h5>lm-eval — стандартизированные бенчмарки</h5>
        <p>60+ встроенных задач (MMLU, HellaSwag, ARC, GSM8K). Поддержка HuggingFace, OpenAI, vLLM. Автоматический decontamination check.</p>
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

      <h4>RAGAS (RAG Assessment)</h4>
      <div class="metric-card">
        <h5>RAGAS — evaluation для RAG-систем</h5>
        <p>Специализированные метрики для RAG: faithfulness (верность контексту), answer relevancy, context precision, context recall.</p>
      </div>
      <pre><code># RAGAS evaluation
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)

results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy,
             context_precision, context_recall]
)</code></pre>

      <h4>DeepEval</h4>
      <div class="metric-card">
        <h5>DeepEval — pytest для LLM</h5>
        <p>Unit-testing подход: описываете тесты как pytest-функции. 14+ встроенных метрик. Интеграция с CI/CD.</p>
      </div>
      <pre><code># test_chatbot.py
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

def test_answer_relevancy():
    metric = AnswerRelevancyMetric(threshold=0.7)
    test_case = LLMTestCase(
        input="What is the capital of France?",
        actual_output=chatbot.generate("What is the capital of France?")
    )
    assert_test(test_case, [metric])</code></pre>

      <h4>LangSmith (LangChain)</h4>
      <div class="metric-card">
        <h5>LangSmith — production observability + eval</h5>
        <p>Trace каждого вызова, dataset management, A/B experiments, custom evaluators. Платный, но мощный.</p>
      </div>

      <h4>Интеграция в CI/CD</h4>
      <pre><code># .github/workflows/eval.yml
name: LLM Evaluation
on: [push]
jobs:
  eval:
    steps:
      - name: Run evaluation
        run: python run_eval.py --golden dataset.json

      - name: Check regression
        run: |
          python check_regression.py \\
            --current results.json \\
            --baseline baseline.json \\
            --threshold 0.05</code></pre>

      <div class="key-concept">
        <strong>Рекомендуемый стек:</strong> lm-eval (бенчмарки) + RAGAS (RAG eval) + DeepEval (unit tests) + LangSmith/Langfuse (observability). Выбор зависит от задачи и бюджета.
      </div>
    `,
    flashcards: [
      { front: "lm-eval-harness", back: "EleutherAI фреймворк: 60+ бенчмарков (MMLU, GSM8K, HumanEval), поддержка HF/OpenAI/vLLM, автоматический decontamination check. Стандарт для academic evaluation." },
      { front: "RAGAS метрики", back: "Faithfulness (верность контексту), answer relevancy (релевантность ответа), context precision (точность retrieval), context recall (полнота retrieval). Специально для RAG." },
      { front: "DeepEval", back: "\"pytest для LLM\" — описываете тесты как pytest-функции, 14+ метрик, интеграция в CI/CD. Хорошо для regression testing в production." }
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
      }
    ],
    sources: [
      { title: "EleutherAI lm-eval-harness", url: "https://github.com/EleutherAI/lm-evaluation-harness", icon: "🔗" },
      { title: "RAGAS — Evaluation for RAG", url: "https://github.com/explodinggradients/ragas", icon: "🔗" },
      { title: "DeepEval — The Open-Source LLM Evaluation Framework", url: "https://github.com/confident-ai/deepeval", icon: "🔗" },
      { title: "LangSmith Documentation", url: "https://docs.smith.langchain.com/", icon: "🔗" }
    ]
  }
];

// Final Review Questions
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
      <span class="nav-icon">${state.completed.has(i) ? "\\u2713" : i + 1}</span>
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
  $("#lesson-badge").textContent = "\\u0423\\u0440\\u043e\\u043a " + (index + 1);
  $("#lesson-title").textContent = lesson.title;
  $("#objectives-list").innerHTML = lesson.objectives.map(o => "<li>" + o + "</li>").join("");
  $("#content-section").innerHTML = "<h3>\\ud83d\\udcd6 \\u041c\\u0430\\u0442\\u0435\\u0440\\u0438\\u0430\\u043b</h3>" + lesson.content;

  buildFlashcards(lesson.flashcards);
  buildQuiz(lesson.quiz, lesson.id);
  buildSources(lesson.sources);

  $("#btn-prev").style.visibility = index === 0 ? "hidden" : "visible";
  $("#btn-next").textContent = index === courseData.length - 1 ? "\\u0417\\u0430\\u0432\\u0435\\u0440\\u0448\\u0438\\u0442\\u044c \\u2192" : "\\u0414\\u0430\\u043b\\u0435\\u0435 \\u2192";

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
      (answered !== undefined ? (answered === q.correct ? "\\u2705 \\u041f\\u0440\\u0430\\u0432\\u0438\\u043b\\u044c\\u043d\\u043e! " : "\\u274c \\u041d\\u0435\\u0432\\u0435\\u0440\\u043d\\u043e. ") + q.explanation : "") +
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
  feedback.textContent = (selectedIdx === correctIdx ? "\\u2705 \\u041f\\u0440\\u0430\\u0432\\u0438\\u043b\\u044c\\u043d\\u043e! " : "\\u274c \\u041d\\u0435\\u0432\\u0435\\u0440\\u043d\\u043e. ") + explanation;
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
      feedback.textContent = (selectedIdx === correctIdx ? "\\u2705 " : "\\u274c ") + finalQuiz[fkey].explanation;
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
    $("#review-message").textContent = "\\ud83c\\udf89 \\u041e\\u0442\\u043b\\u0438\\u0447\\u043d\\u043e! \\u0412\\u044b \\u0445\\u043e\\u0440\\u043e\\u0448\\u043e \\u0440\\u0430\\u0437\\u0431\\u0438\\u0440\\u0430\\u0435\\u0442\\u0435\\u0441\\u044c \\u0432 LLM evaluation. \\u041f\\u043e\\u0440\\u0430 \\u0441\\u0442\\u0440\\u043e\\u0438\\u0442\\u044c pipeline!";
  } else if (pct >= 50) {
    $("#review-message").textContent = "\\ud83d\\udc4d \\u0425\\u043e\\u0440\\u043e\\u0448\\u0430\\u044f \\u0431\\u0430\\u0437\\u0430. \\u041f\\u0435\\u0440\\u0435\\u0441\\u043c\\u043e\\u0442\\u0440\\u0438\\u0442\\u0435 \\u0443\\u0440\\u043e\\u043a\\u0438, \\u0433\\u0434\\u0435 \\u0431\\u044b\\u043b\\u0438 \\u043e\\u0448\\u0438\\u0431\\u043a\\u0438.";
  } else {
    $("#review-message").textContent = "\\ud83d\\udcda \\u0421\\u0442\\u043e\\u0438\\u0442 \\u043f\\u0440\\u043e\\u0439\\u0442\\u0438 \\u043a\\u0443\\u0440\\u0441 \\u0435\\u0449\\u0451 \\u0440\\u0430\\u0437, \\u0443\\u0434\\u0435\\u043b\\u0438\\u0432 \\u0432\\u043d\\u0438\\u043c\\u0430\\u043d\\u0438\\u0435 \\u043a\\u0430\\u0436\\u0434\\u043e\\u043c\\u0443 \\u0443\\u0440\\u043e\\u043a\\u0443.";
  }
}

function updateProgress() {
  const pct = Math.round(state.completed.size / courseData.length * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-text").textContent = state.completed.size + " / " + courseData.length + " \\u0443\\u0440\\u043e\\u043a\\u043e\\u0432";
  $("#btn-review").disabled = state.completed.size < courseData.length;
}

document.addEventListener("DOMContentLoaded", init);
