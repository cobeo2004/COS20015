-- 000_rpc_restart_database.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to restart the database
CREATE OR REPLACE FUNCTION restart_database()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Restarting database...';
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO public;
    RETURN;
    RAISE NOTICE 'Database restarted successfully!';
END;
$$ LANGUAGE plpgsql;

