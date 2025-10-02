-- Function to populate purchases
CREATE OR REPLACE FUNCTION populate_purchases()
RETURNS void AS $$
DECLARE
    player_record RECORD;
    game_record RECORD;
    purchase_count INTEGER;
    payment_method_choice payment_methods;
BEGIN
    -- Clear existing data
    DELETE FROM purchases;

    -- Create purchases (each player buys 2-5 random games)
    FOR player_record IN SELECT id FROM players LOOP
        purchase_count := (random() * 3 + 2)::int;

        FOR i IN 1..purchase_count LOOP
            SELECT id INTO game_record FROM games ORDER BY random() LIMIT 1;

            payment_method_choice := CASE (random() * 3)::int
                WHEN 0 THEN 'CreditCard'
                WHEN 1 THEN 'PayPal'
                WHEN 2 THEN 'Crypto'
                WHEN 3 THEN 'BankTransfer'
            END;

            INSERT INTO purchases (player_id, game_id, purchase_date, amount, payment_method) VALUES
            (
                player_record.id,
                game_record.id,
                now() - (random() * 365)::int * interval '1 day',
                (SELECT price FROM games WHERE id = game_record.id),
                payment_method_choice
            );
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated purchases';
END;
$$ LANGUAGE plpgsql;
