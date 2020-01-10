USE dungeonDb;
INSERT INTO characters (
    name,
    race,
    class,
    level,
    bio,
    updated_at,
    created_at
  )
VALUES
  (
    'Joe',
    'Orc',
    'Warrior',
    '1',
    'Joe is an orc',
    '2020-01-01',
    '2020-01-01'
  );
INSERT INTO campaigns (
    title,
    description,
    characters,
    updated_at,
    created_at
  )
VALUES
  (
    'Forest',
    'The forest campaign',
    'Joe, Bob, Lester',
    '2020-01-01',
    '2020-01-01'
  );