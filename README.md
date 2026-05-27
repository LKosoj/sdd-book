# Разработка по спецификациям с Qwen Code CLI

Сборник учебных материалов по разработке по спецификациям (SDD) и смежным навыкам работы с LLM на русском языке: два учебника и четыре интерактивных мини-курса.

Опирается на публичную документацию Qwen Code, GitHub Spec Kit, AWS Kiro, материалы по агентной памяти и открытые публикации по SDD. Лицензия: текст — CC BY-SA 4.0, код — MIT (см. [LICENSE](LICENSE)).

Истории изменений по томам: базовый — [CHANGELOG.md](CHANGELOG.md), прикладной — [book2/CHANGELOG.md](book2/CHANGELOG.md).

## Учебники

- **[book/](book/README.md) — базовый том.** Полный SDD-цикл на учебном проекте AgentClinic: конституция, спецификация фичи, план, проверка фактами, реализация, ревью, перепланирование, хуки, навыки, безопасность и память агента на SQLite. 22 части, 3 приложения, глоссарий и заметка для преподавателя. Версия v1.0, проверено 2026-05-15.
- **[book2/](book2/README.md) — прикладной том.** Перенос SDD-цикла в production-сценарии: восстановление спецификаций из legacy, дуэли Верификатор/Имплементор, мутационное тестирование спецификаций, Spec CI, многоагентный трибунал, ярусные бюджеты, метрики Гудхарта, шлюз готовности и откат. Рассчитан на читателей, уже прошедших базовый том. Версия v1.0, проверено 2026-05-20.

## Курсы

Интерактивные мини-курсы на HTML/JS — открываются в браузере как локальная страница (`index.html`). У каждого курса свой прогресс-бар, flashcards и итоговый тест.

- **[ai-agents-course/](ai-agents-course/index.html) — AI Agents: Архитектура и Оркестрация.** 12 уроков о проектировании, построении и масштабировании AI-агентов: от single-agent систем до сложных multi-agent оркестраций, канонические паттерны Anthropic, reasoning-модели, экономика и устаревшие подходы.
- **[prompt-course/](prompt-course/index.html) — Prompt Engineering: продвинутые техники.** 14 уроков об анатомии промпта, chain-of-thought, prompt caching, reasoning-моделях, context engineering, кириллице и токенах, защите от prompt injection, evaluation и A/B-тестах.
- **[rag-course/](rag-course/index.html) — RAG: от прототипа до продакшена.** 15 уроков о построении production-ready RAG-системы: Contextual Retrieval, late chunking, long-context vs RAG, метаданные, multimodal RAG (ColPali/ColQwen2), экономика и latency.
- **[text2sql-course/](text2sql-course/index.html) — Text-2-SQL: от вопроса к запросу.** 15 уроков о Text-2-SQL: schema linking, semantic layer (dbt MetricFlow, Snowflake Cortex Analyst), multi-candidate + selector (CHASE-SQL), tool-use exploration, LLM-as-judge, Vanna AI, safety, evaluation на Spider 2.0 / BIRD-CRITIC.
- **[llm-eval-course/](llm-eval-course/index.html) — LLM Evaluation: как оценивать языковые модели.** 7 уроков о систематической оценке LLM: классические метрики (BLEU/ROUGE), бенчмарки (MMLU, HumanEval, MT-Bench, Chatbot Arena), LLM-as-Judge, evaluation pipeline, human evaluation и практический инструментарий (lm-eval-harness, RAGAS, DeepEval, LangSmith).

## С чего начать

- Если только знакомитесь с SDD — начните с [базового тома](book/README.md), части 1–5.
- Если уже работаете по SDD и нужны production-практики — переходите к [прикладному тому](book2/README.md).
- Если интересует один из смежных навыков (агенты, промпты, RAG, Text-2-SQL, evaluation) — открывайте соответствующий курс независимо от учебников.
