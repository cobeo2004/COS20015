-- types.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the types for the database


CREATE TYPE countries AS ENUM ('AU', 'US', 'UK', 'JP', 'VN'); -- extend list as needed
CREATE TYPE game_genres AS ENUM ('RPG', 'FPS', 'Strategy', 'Puzzle', 'Sports');
CREATE TYPE payment_methods AS ENUM ('CreditCard', 'PayPal', 'Crypto', 'BankTransfer');
