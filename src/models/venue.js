
// CREATE TABLE venue(
//   id SERIAL PRIMARY KEY,
//   creator_id SERIAL REFERENCES app_user(id) ON DELETE SET NULL,
//   venue_name TEXT,
//   is_private BOOLEAN DEFAULT FALSE,
//   image_url TEXT,
//   street_address TEXT,
//   postal_code TEXT,
//   city_id INT REFERENCES city(id) ON DELETE NO ACTION,
//   created TIMESTAMP DEFAULT now(),
//   modified TIMESTAMP DEFAULT now()
// );

// ALTER TABLE venue
// ADD CONSTRAINT venue_name_city_id UNIQUE
//   (venue_name, city_id);

// ALTER TABLE event
// ADD COLUMN listing_state listing_state DEFAULT 'Public';


function Venue({ Venue_name, city_id, creator_id }) {
  this.creator_id = creator_id;
  this.venue_name = venue_name;
  this.city_id = city_id;
}

module.exports = {
  Venue
};
