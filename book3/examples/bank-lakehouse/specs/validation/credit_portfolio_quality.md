# Проверочные факты: mart_credit_portfolio_quality

## Автоматические факты

- `dbt build --profiles-dir .` завершается с кодом 0.
- `stage`, `loan_count` и `principal_rub` проходят `not_null`.
- `assert_credit_portfolio_non_negative` возвращает 0 строк.

## Ручные факты

- Ревьюер подтверждает, что `stage` трактуется как поле источника.
- Ревьюер подтверждает, что боевая методология кредита не выводилась из SQL.
