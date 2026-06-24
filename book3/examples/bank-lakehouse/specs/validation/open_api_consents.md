# Проверочные факты: mart_open_api_consents

## Автоматические факты

- `dbt build --profiles-dir .` завершается с кодом 0.
- `scope`, `consent_count`, `active_consent_count` и
  `revoked_consent_count` проходят `not_null`.
- `assert_open_api_consent_counts` возвращает 0 строк.

## Ручные факты

- Ревьюер подтверждает, что пустой raw `revoked_at` означает активное согласие
  только потому, что это записано в спецификации модели.
- Ревьюер подтверждает, что детализация согласий до уровня клиента не раскрыта.
