CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE listing_state AS ENUM (
  'Draft',
  'Private',
  'Public',
  'Flagged',
  'Banned',
  'Archived'
);

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  token TEXT,
  image_url TEXT,
  email TEXT,
  fullname TEXT,
  username TEXT UNIQUE,
  password_digest TEXT,
  admin BOOL DEFAULT false,
  country_name TEXT,
  region_name TEXT,
  city_name TEXT,
  user_state listing_state DEFAULT 'Public',
  created TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TYPE flyer_type AS ENUM (
  'Show',
  'Fest',
  'Tour'
);

CREATE TABLE flyer (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  creator_id uuid REFERENCES app_user(id) ON DELETE SET NULL,
  image_url TEXT,
  flyer_type flyer_type NOT NULL,
  headline TEXT,
  bands TEXT,
  details TEXT,
  publish_comment TEXT,
  listing_state listing_state DEFAULT 'Public',
  created TIMESTAMPTZ DEFAULT now(),
  modified TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
  flyer_id uuid REFERENCES flyer(id) ON DELETE SET NULL,
  event_date DATE,
  venue_name TEXT,
  country_name TEXT,
  region_name TEXT,
  city_name TEXT
);
