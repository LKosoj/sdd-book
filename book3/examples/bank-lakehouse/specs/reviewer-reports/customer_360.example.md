# Отчёт ревьюера: mart_customer_360

## Прочитанные спецификации

- `specs/customer_360_product.odps.yaml`
- `specs/customer_360_contract.odcs.yaml`
- `specs/models/mart_customer_360.md`
- `specs/validation/customer_360.md`

## Изменённые модели

- `models/marts/mart_customer_360.sql`
- `models/schema.yml`
- связанные singular-тесты в `tests/`

## Влияние на контракт

- Гранулярность: не изменилась, одна строка на `customer_id`.
- Обязательные поля: `customer_id`, `total_balance_rub`, `risk_event_count_7d`.
- Влияние на PII: прямые PII-поля не раскрыты в mart.
- Влияние на SLA: не изменилось, обещание freshness 24 часа остаётся продуктовым
  ограничением.

## Запущенные проверки

```bash
dbt build --profiles-dir .
dbt test --profiles-dir . --select mart_customer_360
dbt test --profiles-dir . --select assert_customer_360_contract_columns
dbt test --profiles-dir . --select assert_customer_360_no_direct_pii
```

## Замечания

- Пройдено: основной customer-grain покрыт dbt-тестами.
- Пройдено: обязательные колонки контракта присутствуют.
- Пройдено: тест по списку запрещённых прямых PII возвращает 0 строк.
- Пройдено: `risk_event_count_7d` следует документированному синтетическому окну с
  `2026-06-01` по `2026-06-07`.
- Наблюдение: боевая методология риска потребовала бы отдельную спецификацию; в
  примере `risk_flag` трактуется как учебный сигнал из источника.

## Требуется подтверждение

В этом примере нет ломающего изменения контракта. Если будущее изменение
добавит в mart детализацию по продукту, счёту или согласию, подтверждение нужно
получить до изменения SQL.
