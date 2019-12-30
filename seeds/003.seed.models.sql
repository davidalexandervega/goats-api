TRUNCATE app_user, band, venue, event, band_event RESTART IDENTITY CASCADE;

INSERT INTO app_user
  (username, email, password_digest)
VALUES
  ('killer', 'killeraliens@outlook.com', '$2a$10$woR.meJcG0nFVI/kmuSgiurGz.LnwJx0VrCYVtLWaPF1rs5lRJF66'),
  ('aliens', 'alexandrabrinncampbell@gmail.com', '$2a$10$HgAo1uMvj3GpfuTAPgXQ1evGCKOkYRTnn1WgfPkhgF0qCUiNw2E4G')
  ;

INSERT INTO band
  (band_name, city_id, description, creator_id)
VALUES
  ('Mortuous', 1840021570, 'Death metal', 1),
  ('Cult Of Fire', 1203744823, 'Black metal', 1),
  ('Mercyful Fate', 1208763942,'Mercyful Fate is a Danish heavy metal band from Copenhagen, formed in 1981 by vocalist King Diamond and guitarist Hank Shermann. Influenced by progressive rock and hard rock, and with lyrics dealing with Satan and the occult, Mercyful Fate were part of the first wave of black metal in the early to mid-1980s.', 1)
  ;

INSERT INTO venue
  (venue_name, city_id, street_address, postal_code, image_url, creator_id)
VALUES
  ('Yucca Tap Room', 1840021942, '29 W Southern Ave', '85282', 'https://668517.smushcdn.com/1017521/wp-content/uploads/2019/04/YUCCA-web-logo.png?lossy=1&strip=1&webp=1', 1),
  ('Palo Verde Lounge', 1840021942, '1015 W Broadway Rd', '85282', 'https://s3-media0.fl.yelpcdn.com/bphoto/IouiSfd-WnQaJ33MF5Bv-w/o.jpg', 1),
  ('Little Devil Bar', 1528992666, 'Stationsstraat 27', '5038 EA', 'https://scontent.fphx1-1.fna.fbcdn.net/v/t1.0-9/81026218_1247646112100575_5140321622695084032_o.jpg?_nc_cat=111&_nc_ohc=TtpO74PJEsoAQlMlVylFYeuYT8en9Db7bTAjholtYS8sM4LltSPDNZ91g&_nc_ht=scontent.fphx1-1.fna&oh=9a2252aa38605661115050b4b3ed305f&oe=5EA17A92', 1)
  ;
