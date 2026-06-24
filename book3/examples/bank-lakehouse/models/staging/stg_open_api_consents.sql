select
  consent_id,
  customer_id,
  scope,
  cast(granted_at as date) as granted_at,
  try_cast(nullif(cast(revoked_at as varchar), '') as date) as revoked_at
from read_csv_auto('raw/open_api_consents.csv', header = true)
