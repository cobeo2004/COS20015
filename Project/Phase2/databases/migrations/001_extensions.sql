-- extensions.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the extensions for the database, since these are the only extensions that are needed for the project
-- Therefore, it is not worth mentioning them in the full.sql file

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_stat_kcache";
CREATE EXTENSION IF NOT EXISTS "pg_stat_bgwriter";
CREATE EXTENSION IF NOT EXISTS "pg_stat_activity";
CREATE EXTENSION IF NOT EXISTS "pg_stat_replication";
CREATE EXTENSION IF NOT EXISTS "pg_stat_wal";
