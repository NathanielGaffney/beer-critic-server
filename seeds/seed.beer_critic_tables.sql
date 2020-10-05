BEGIN;

TRUNCATE
    items,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('beerguy', 'ilovebeer'),
    ('porter123', 'thiccness');

INSERT INTO items (name, rating, price, type, medium, description, favorite, user_id)
VALUES
    ('Guinness', 4, 4.50, 'Stout', 'Draft', 'Good dark beer, made in Ireland.', 'true', 2),
    ('Sweetwater 420', 5, 4.00, 'IPA', 'Bottle', 'Fruity hoppy, bitter yet refreshing, this IPA is a great summer beer.', 'true', 1),
    ('Dos Equis Amber', 4, 5.00, 'Amber Ale', 'Draft', 'This amber ale is best on draft at a mexican restaurant with chips and queso.', 'false', 1),
    ('Highland Oatmeal Porter', 4, 5.00, 'Porter', 'Draft', 'A thick and bready porter, with chocolatey notes.', 'false', 2);

COMMIT;