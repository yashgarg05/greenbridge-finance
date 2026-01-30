-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  company_name text,
  role text default 'user',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profile Policies
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on profiles for update using (auth.uid() = id);

-- LISTINGS TABLE
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text,
  price numeric not null, -- stored in cents or base unit, handled by app logic
  price_per_unit numeric,
  image_url text,
  verified boolean default false,
  owner_id uuid references auth.users(id),
  sdgs text[], -- array of SDG IDs
  type text, -- 'solar', 'wind', etc.
  vintage text, -- year
  available_credits numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.listings enable row level security;
create policy "Listings are viewable by everyone" on listings for select using (true);
create policy "Users can insert their own listings" on listings for insert with check (auth.uid() = owner_id);
create policy "Owners can update listings" on listings for update using (auth.uid() = owner_id);

-- INVESTMENTS TABLE
create table public.investments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  listing_id uuid references listings(id) not null,
  amount_invested numeric not null,
  credits_purchased numeric not null,
  status text default 'completed', -- pending, completed
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.investments enable row level security;
create policy "Users can view own investments" on investments for select using (auth.uid() = user_id);
create policy "Users can insert own investments" on investments for insert with check (auth.uid() = user_id);
