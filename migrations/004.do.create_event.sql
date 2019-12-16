CREATE TABLE event (
  id INT PRIMARY KEY,
  fb_place_id INT,
  fb_cover_photo_id INT,
  event_times TEXT,
  event_name TEXT,
  description TEXT,
  updated_time TIMESTAMP
)
