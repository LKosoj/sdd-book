# Отчёт ревьюера: дополнительные витрины

## Прочитанные спецификации

- `specs/models/mart_payment_risk_signals.md`
- `specs/models/mart_credit_portfolio_quality.md`
- `specs/models/mart_open_api_consents.md`
- `specs/models/mart_card_turnover_daily.md`
- связанные заметки о проверке в `specs/validation/`

## Изменённые модели

- `models/marts/mart_payment_risk_signals.sql`
- `models/marts/mart_credit_portfolio_quality.sql`
- `models/marts/mart_open_api_consents.sql`
- `models/marts/mart_card_turnover_daily.sql`
- `models/schema.yml`
- singular-тесты в `tests/`

## Влияние на контракт

- Витрина платёжного риска остаётся уровнем операции.
- Витрина кредитного портфеля остаётся уровнем stage.
- Витрина согласий Open API остаётся уровнем scope.
- Витрина карточного оборота остаётся уровнем дня/канала.
- Прямые PII-поля не добавлены.

## Запущенные проверки

```bash
dbt build --profiles-dir .
dbt test --profiles-dir . --select assert_payment_risk_signal_values
dbt test --profiles-dir . --select assert_credit_portfolio_non_negative
dbt test --profiles-dir . --select assert_open_api_consent_counts
dbt test --profiles-dir . --select assert_card_turnover_non_negative
```

## Замечания

- Пройдено: дополнительные витрины имеют явные спецификации моделей и заметки о проверке.
- Пройдено: значения риск-сигналов ограничены учебными категориями.
- Пройдено: агрегаты principal по кредитам неотрицательные.
- Пройдено: счётчики активных и отозванных согласий сходятся с общим счётчиком.
- Пройдено: агрегаты карточного оборота по дню/каналу неотрицательные.
- Наблюдение: боевая методология риска и кредита потребовала бы отдельные
  спецификации.

## Требуется подтверждение

В эталонном примере нет ломающего изменения. Изменения боевой методологии
потребовали бы подтверждения человеком.
