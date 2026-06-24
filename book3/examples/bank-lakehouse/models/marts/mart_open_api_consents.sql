select
  scope,
  count(*) as consent_count,
  sum(case when revoked_at is null then 1 else 0 end) as active_consent_count,
  sum(case when revoked_at is not null then 1 else 0 end) as revoked_consent_count,
  min(granted_at) as first_granted_at,
  max(granted_at) as last_granted_at
from {{ ref('stg_open_api_consents') }}
group by 1
