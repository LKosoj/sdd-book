# Проверочные факты: mart_card_turnover_daily

## Автоматические факты

- `dbt build --profiles-dir .` завершается с кодом 0.
- `transaction_date`, `channel`, `transaction_count` и `turnover_rub` проходят
  `not_null`.
- `assert_card_turnover_non_negative` возвращает 0 строк.

## Ручные факты

- Ревьюер подтверждает, что grain витрины — одна строка на `transaction_date`,
  `channel`.
- Ревьюер подтверждает, что детализация уровня клиента и прямые PII-поля не раскрыты.
