-- types.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the types for the database


CREATE TYPE IF NOT EXISTS countries AS ENUM ('AU', 'US', 'UK', 'JP', 'VN'); -- extend list as needed
CREATE TYPE IF NOT EXISTS game_genres AS ENUM ('RPG', 'FPS', 'Strategy', 'Puzzle', 'Sports');
CREATE TYPE IF NOT EXISTS payment_methods AS ENUM ('CreditCard', 'PayPal', 'Crypto', 'BankTransfer');
