CREATE TABLE band_event (
  band_id INT REFERENCES band(id) ON DELETE CASCADE,
  event_id INT REFERENCES event(id) ON DELETE CASCADE,
  PRIMARY KEY (band_id, event_id)
);
