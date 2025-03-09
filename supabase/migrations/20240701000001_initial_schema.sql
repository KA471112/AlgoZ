-- Create tables for AlgoZ Trading Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  client_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client ID counter table
CREATE TABLE IF NOT EXISTS client_id_counter (
  id INTEGER PRIMARY KEY,
  next_id INTEGER NOT NULL
);

-- Initialize counter with 1
INSERT INTO client_id_counter (id, next_id) VALUES (1, 2) ON CONFLICT (id) DO NOTHING;

-- Create Z Coins balance table
CREATE TABLE IF NOT EXISTS z_coins_balance (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Z Coins transaction history table
CREATE TABLE IF NOT EXISTS z_coins_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API connections table
CREATE TABLE IF NOT EXISTS api_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  broker TEXT NOT NULL,
  app_name TEXT NOT NULL,
  api_key TEXT,
  secret_key TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  api_id UUID REFERENCES api_connections(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to generate next client ID
CREATE OR REPLACE FUNCTION get_next_client_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_id INTEGER;
  client_id TEXT;
BEGIN
  -- Get and update the next ID atomically
  UPDATE client_id_counter
  SET next_id = next_id + 1
  WHERE id = 1
  RETURNING next_id INTO next_id;
  
  -- Format the client ID with leading zeros
  client_id := LPAD(next_id::TEXT, 2, '0');
  
  RETURN client_id;
END;
$$;

-- Create RLS policies

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE z_coins_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE z_coins_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create policies for z_coins_balance
DROP POLICY IF EXISTS "Users can view their own balance" ON z_coins_balance;
CREATE POLICY "Users can view their own balance"
  ON z_coins_balance FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all balances" ON z_coins_balance;
CREATE POLICY "Admins can view all balances"
  ON z_coins_balance FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

DROP POLICY IF EXISTS "Admins can update balances" ON z_coins_balance;
CREATE POLICY "Admins can update balances"
  ON z_coins_balance FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create policies for z_coins_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON z_coins_transactions;
CREATE POLICY "Users can view their own transactions"
  ON z_coins_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON z_coins_transactions;
CREATE POLICY "Admins can view all transactions"
  ON z_coins_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

DROP POLICY IF EXISTS "Admins can insert transactions" ON z_coins_transactions;
CREATE POLICY "Admins can insert transactions"
  ON z_coins_transactions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create policies for api_connections
DROP POLICY IF EXISTS "Users can view their own API connections" ON api_connections;
CREATE POLICY "Users can view their own API connections"
  ON api_connections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own API connections" ON api_connections;
CREATE POLICY "Users can insert their own API connections"
  ON api_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own API connections" ON api_connections;
CREATE POLICY "Users can update their own API connections"
  ON api_connections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own API connections" ON api_connections;
CREATE POLICY "Users can delete their own API connections"
  ON api_connections FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all API connections" ON api_connections;
CREATE POLICY "Admins can view all API connections"
  ON api_connections FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create policies for subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Create policies for webhooks
DROP POLICY IF EXISTS "Users can view their own webhooks" ON webhooks;
CREATE POLICY "Users can view their own webhooks"
  ON webhooks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own webhooks" ON webhooks;
CREATE POLICY "Users can insert their own webhooks"
  ON webhooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all webhooks" ON webhooks;
CREATE POLICY "Admins can view all webhooks"
  ON webhooks FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE z_coins_balance;
ALTER PUBLICATION supabase_realtime ADD TABLE z_coins_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE api_connections;
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE webhooks;