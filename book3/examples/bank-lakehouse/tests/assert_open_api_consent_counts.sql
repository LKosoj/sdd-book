select *
from {{ ref('mart_open_api_consents') }}
where consent_count != active_consent_count + revoked_consent_count

