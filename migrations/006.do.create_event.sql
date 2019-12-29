CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  creator_id SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
  venue_id SERIAL REFERENCES venue(id) ON DELETE SET NULL,
  image_url TEXT,
  event_times TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created TIMESTAMP DEFAULT now(),
  modified TIMESTAMP DEFAULT now()
);
