ALTER TABLE app_user
  DROP COLUMN IF EXISTS listing_state;

ALTER TABLE band
  DROP COLUMN IF EXISTS listing_state;

ALTER TABLE venue
  DROP COLUMN IF EXISTS listing_state;

ALTER TABLE event
  DROP COLUMN IF EXISTS listing_state;


DROP TYPE IF EXISTS listing_state;
