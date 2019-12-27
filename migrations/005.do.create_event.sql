CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  creator SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
  photo_url TEXT,
  event_times TEXT,
  event_name TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created TIMESTAMP DEFAULT now(),
  modified TIMESTAMP DEFAULT now()
)


