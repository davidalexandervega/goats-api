TRUNCATE event, band_event RESTART IDENTITY CASCADE;

INSERT INTO event
  (
    -- id,
    creator_id,
    venue_id,
    image_url,
    event_times,
    title,
    description,
    start_date,
    end_date
    -- created,
    -- modified
  )
VALUES
  (
    1,
    1,
    'https://1.bp.blogspot.com/-iF7sXspSmXk/W1oQAgNzJEI/AAAAAAAAAPA/FDnYOp28gwQcLqfHAlornSEpqEpKFwXwgCLcBGAs/s1600/Mortuous-Through_Wilderness-flyer%2528web%2529.jpg',
    'Doors at 7pm',
    'Mortuous, Fetid, Hyperdontia',
    'Catch west coast tour before they leave. Extremely Rotten Productions.',
    '2019-12-30T00:00:00.000Z',
    '2019-12-30T00:00:00.000Z'
  );
