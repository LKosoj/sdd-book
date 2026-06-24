# SDD Data. Дата-платформа банка с Qwen Code и dbt

Третий том переносит базовый SDD-цикл в Data Engineering. Сквозной проект —
вымышленный российский розничный банк `Банк Северный Мост`, который строит
локально воспроизводимый DataLakeHouse: raw-источники, staging, intermediate,
финальные витрины, контракты данных, проверочные факты и отчёты ревьюера.

Учебный стек: Qwen Code CLI, dbt-core, dbt-duckdb, DuckDB и CSV/Parquet.
Примечания для боевого контура показывают, как те же артефакты переносятся
на Iceberg, Trino, Spark, Delta Lake, Databricks или управляемый lakehouse-сервис,
но первый проход не требует внешнего кластера.

**Версия:** v1.0

Главное правило тома: данные нельзя принимать по ощущению. Каждый шаг должен
оставить артефакт: спецификацию, модель, проверку, проверочный факт, изменение
контракта, пакет доказательств или отчёт ревьюера.

## Как читать

1. Части 1–5 готовят мышление, окружение и локальный репозиторий.
2. Части 6–8 фиксируют миссию платформы, источники, Schema Manifest и первый
   дата-продукт.
3. Части 9–12 переводят источники в dbt-модели, проверочные факты и контракты.
4. Части 13–19 строят историю, silver/gold-слои, витрины и семантический слой.
5. Части 20–21 добавляют банковские ограничения, Qwen-процесс, навыки,
   субагентов, хуки и доказательства релиза.
6. Часть 22 проверяет весь цикл через практический зачёт: новая витрина от спецификации
   до ревью.

Том можно проходить самостоятельно. Части 1–5 кратко повторяют общий SDD-цикл:
сначала спецификация, затем реализация; сначала проверочные факты, затем релиз;
роли автора и ревьюера разделены; решения хранятся в репозитории, а не в чате.
Первый том даёт более широкий фундамент, но начать можно и без него.

## Части

1. [Введение: SDD для данных](part-01-introduction.md)
2. [Почему банковские данные требуют спецификаций](part-02-why-bank-data-needs-sdd.md)
3. [Обзор процесса DataLakeHouse](part-03-workflow-overview.md)
4. [Окружение: Qwen Code, dbt, DuckDB](part-04-environment.md)
5. [Первичная настройка проекта](part-05-setup.md)
6. [Конституция дата-платформы банка](part-06-platform-constitution.md)
7. [Спецификация первого дата-продукта](part-07-data-product-spec.md)
8. [Источники и Schema Manifest](part-08-source-profiling.md)
9. [Raw и Bronze-приземление](part-09-raw-bronze.md)
10. [Staging-модели dbt](part-10-staging-models.md)
11. [Проверка данных: validation.md](part-11-data-validation.md)
12. [Контракты данных: ODCS и контрактные проверки dbt](part-12-data-contracts.md)
13. [Инкременты, snapshots и история](part-13-incremental-history.md)
14. [Silver layer: клиенты, счета, карты, платежи](part-14-silver-layer.md)
15. [Gold layer: бизнес-сущности и grain](part-15-gold-layer.md)
16. [Витрина Customer 360](part-16-customer-360-mart.md)
17. [Витрина платежей и риск-сигналов](part-17-payment-risk-marts.md)
18. [Витрина кредитного портфеля](part-18-credit-portfolio-mart.md)
19. [Семантический слой, метрики и exposures](part-19-semantic-layer.md)
20. [Российский банковский контекст](part-20-russian-bank-context.md)
21. [Qwen Code-процесс для DataLakeHouse](part-21-qwen-data-workflow.md)
22. [Практический зачёт](part-22-capstone.md)

## Приложения

- [Приложение A. Доменная карта банка](appendix-a-bank-domain.md)
- [Приложение B. Локальный DataLakeHouse-стек](appendix-b-local-lakehouse-stack.md)
- [Приложение C. Чек-листы и шаблоны](appendix-c-checklists.md)
- [Приложение D. Независимый цикл ревью](appendix-d-independent-review-loop.md)
- [Приложение E. Диагностика и восстановление](appendix-e-troubleshooting.md)
- [Приложение F. Кейсбук SDD Data](appendix-f-casebook.md)
- [Приложение G. Сценарий пятидневного воркшопа](appendix-g-workshop-script.md)
- [Глоссарий](GLOSSARY.md)
- [Заметка для преподавателя](INSTRUCTOR.md)

## Запускаемый пример

Основной пример находится в [`examples/bank-lakehouse/`](examples/bank-lakehouse/).

```bash
cd book3/examples/bank-lakehouse
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
bash smoke_all.sh
```

Если dbt не установлен, `smoke_all.sh` проверит только генерацию данных и
структуру. После установки зависимостей он выполняет `dbt parse` и `dbt build`.
Полный успешный прогон должен завершиться без пропущенных тестов и ошибок.

## Основные источники

- Qwen Code: https://github.com/QwenLM/qwen-code
- Qwen Code docs: https://qwenlm.github.io/qwen-code-docs/en/index
- dbt docs: https://docs.getdbt.com/docs/introduction
- dbt incremental models: https://docs.getdbt.com/docs/build/incremental-models
- dbt model contracts: https://docs.getdbt.com/docs/mesh/govern/model-contracts
- dbt semantic models: https://docs.getdbt.com/docs/build/semantic-models
- dbt-duckdb: https://github.com/duckdb/dbt-duckdb
- ODCS v3.1.0: https://bitol-io.github.io/open-data-contract-standard/v3.1.0/
- ODPS 4.1: https://opendataproducts.org/
- Банк России API: https://cbr.ru/statistics/data-service/apidocumentation/
- Открытые API Банка России: https://www.cbr.ru/fintech/api/
- BCBS 239: https://www.bis.org/publ/bcbs239.pdf
