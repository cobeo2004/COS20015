-- extensions.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the extensions for the database, since these are the only extensions that are needed for the project
-- Therefore, it is not worth mentioning them in the full.sql file

SELECT restart_database();
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

