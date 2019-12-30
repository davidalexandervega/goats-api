// CREATE TABLE event(
//   id SERIAL PRIMARY KEY,
//   creator_id SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
//   venue_id SERIAL REFERENCES venue(id) ON DELETE SET NULL,
//   image_url TEXT,
//   event_times TEXT,
//   title TEXT NOT NULL,
//   description TEXT,
//   start_date DATE,
//   end_date DATE,
//   created TIMESTAMP DEFAULT now(),
//   modified TIMESTAMP DEFAULT now()
// );

// ALTER TABLE event
// ADD COLUMN listing_state listing_state DEFAULT 'Public';

// base template
function Event({ title, image_url }) {
  this.title = title;
  this.image_url = image_url;
}

// standard use
function EventCustom({title, image_url, creator_id}) {
  this.creator_id = creator_id;
  this.title = title;
  this.image_url = image_url;
}

module.exports = {
  Event, EventCustom
};
