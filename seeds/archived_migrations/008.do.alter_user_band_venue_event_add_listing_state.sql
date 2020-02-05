DROP TYPE IF EXISTS listing_state;
CREATE TYPE listing_state AS ENUM (
  'Draft',
  'Private',
  'Public',
  'Flagged',
  'Banned',
  'Archived'
);

ALTER TABLE app_user
  ADD COLUMN listing_state listing_state DEFAULT 'Public';

ALTER TABLE band
  ADD COLUMN listing_state listing_state DEFAULT 'Public';

ALTER TABLE venue
  ADD COLUMN listing_state listing_state DEFAULT 'Public';

ALTER TABLE event
  ADD COLUMN listing_state listing_state DEFAULT 'Public';
