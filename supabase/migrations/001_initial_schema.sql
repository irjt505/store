-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text default 'staff' check (role in ('owner', 'admin', 'staff', 'manager')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- STORE SETTINGS
-- ============================================
create table public.store_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CATEGORIES
-- ============================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BRANDS
-- ============================================
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TAGS
-- ============================================
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  color text default '#6366F1',
  created_at timestamptz default now()
);

-- ============================================
-- PRODUCTS
-- ============================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('physical', 'digital', 'service', 'subscription', 'bundle', 'codes', 'food', 'booking')),
  description text,
  short_description text,
  price decimal(10,2) not null default 0,
  sale_price decimal(10,2),
  cost_price decimal(10,2),
  currency text default 'SAR',
  sku text,
  mpn text,
  gtin text,
  stock integer default 0,
  low_stock_threshold integer default 5,
  track_stock boolean default true,
  weight decimal(8,2),
  length decimal(8,2),
  width decimal(8,2),
  height decimal(8,2),
  requires_shipping boolean default true,
  is_digital boolean default false,
  digital_files jsonb default '[]'::jsonb,
  download_limit integer,
  download_expiry timestamptz,
  subscription_period text,
  auto_renew boolean default false,
  booking_duration integer,
  status text default 'draft' check (status in ('published', 'draft', 'archived')),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  featured_image text,
  images jsonb default '[]'::jsonb,
  sales_count integer default 0,
  rating decimal(3,2) default 0,
  review_count integer default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  options jsonb not null default '[]'::jsonb,
  sku text,
  price decimal(10,2),
  stock integer default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- PRODUCT TAGS (junction)
-- ============================================
create table public.product_tags (
  product_id uuid references public.products(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- ============================================
-- COLLECTIONS
-- ============================================
create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.collection_products (
  collection_id uuid references public.collections(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  sort_order integer default 0,
  primary key (collection_id, product_id)
);

-- ============================================
-- CUSTOMERS
-- ============================================
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  status text default 'active' check (status in ('active', 'blocked')),
  city text,
  country text default 'SA',
  total_orders integer default 0,
  total_spent decimal(10,2) default 0,
  last_order_at timestamptz,
  tags jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CUSTOMER GROUPS
-- ============================================
create table public.customer_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  color text default '#6366F1',
  created_at timestamptz default now()
);

create table public.customer_group_members (
  customer_id uuid references public.customers(id) on delete cascade,
  group_id uuid references public.customer_groups(id) on delete cascade,
  primary key (customer_id, group_id)
);

-- ============================================
-- ORDERS
-- ============================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'returned')),
  payment_status text default 'pending' check (payment_status in ('paid', 'pending', 'failed', 'refunded')),
  payment_method text,
  payment_reference text,
  source text default 'online' check (source in ('online', 'phone', 'walk-in')),
  subtotal decimal(10,2) not null default 0,
  discount_amount decimal(10,2) default 0,
  shipping_amount decimal(10,2) default 0,
  tax_amount decimal(10,2) default 0,
  total decimal(10,2) not null default 0,
  currency text default 'SAR',
  coupon_code text,
  shipping_name text,
  shipping_address text,
  shipping_city text,
  shipping_country text default 'SA',
  shipping_postal_code text,
  shipping_phone text,
  tracking_number text,
  tracking_url text,
  notes text,
  internal_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  variant_id uuid references public.product_variants(id) on delete set null,
  variant_name text,
  quantity integer not null default 1,
  price decimal(10,2) not null,
  total decimal(10,2) not null,
  created_at timestamptz default now()
);

-- ============================================
-- ORDER STATUS HISTORY
-- ============================================
create table public.order_status_history (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ============================================
-- COUPONS
-- ============================================
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed', 'free_shipping', 'buy_x_get_y')),
  value decimal(10,2) not null,
  minimum_order decimal(10,2) default 0,
  maximum_discount decimal(10,2),
  usage_limit integer,
  usage_count integer default 0,
  per_customer_limit integer default 1,
  is_active boolean default true,
  starts_at timestamptz,
  expires_at timestamptz,
  applicable_products jsonb default '[]'::jsonb,
  applicable_categories jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ABANDONED CARTS
-- ============================================
create table public.abandoned_carts (
  id uuid default uuid_generate_v4() primary key,
  customer_email text,
  customer_name text,
  items jsonb default '[]'::jsonb,
  cart_value decimal(10,2) default 0,
  items_count integer default 0,
  recovered boolean default false,
  recovery_email_sent boolean default false,
  recovery_email_sent_at timestamptz,
  abandoned_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================
-- COUPON USAGE LOG
-- ============================================
create table public.coupon_usage (
  id uuid default uuid_generate_v4() primary key,
  coupon_id uuid references public.coupons(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  used_at timestamptz default now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  is_read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- ============================================
-- ACTIVITY LOG
-- ============================================
create table public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- ============================================
-- STAFF
-- ============================================
create table public.staff (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text not null default 'staff',
  status text default 'pending' check (status in ('active', 'inactive', 'pending')),
  permissions jsonb default '{}'::jsonb,
  last_active timestamptz,
  invited_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_products_status on public.products(status);
create index idx_products_type on public.products(type);
create index idx_products_category on public.products(category_id);
create index idx_products_brand on public.products(brand_id);
create index idx_products_sku on public.products(sku);
create index idx_products_slug on public.products(slug);
create index idx_orders_status on public.orders(status);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_created on public.orders(created_at desc);
create index idx_orders_number on public.orders(order_number);
create index idx_customers_email on public.customers(email);
create index idx_customers_phone on public.customers(phone);
create index idx_order_items_order on public.order_items(order_id);
create index idx_order_status_history_order on public.order_status_history(order_id);
create index idx_notifications_user on public.notifications(user_id);
create index idx_activity_log_user on public.activity_log(user_id);
create index idx_activity_log_entity on public.activity_log(entity_type, entity_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.staff enable row level security;

-- Allow authenticated users full access (admin panel)
create policy "Authenticated users can do everything" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.products for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.orders for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.customers for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.staff for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.categories for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.brands for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.tags for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.coupons for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.abandoned_carts for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.notifications for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.activity_log for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.customer_groups for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.collection_products for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.collections for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.product_variants for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.product_tags for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.customer_group_members for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.order_items for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.order_status_history for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.coupon_usage for all using (auth.role() = 'authenticated');
create policy "Authenticated users can do everything" on public.store_settings for all using (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles for each row execute procedure public.update_updated_at();
create trigger update_products_updated_at before update on public.products for each row execute procedure public.update_updated_at();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure public.update_updated_at();
create trigger update_customers_updated_at before update on public.customers for each row execute procedure public.update_updated_at();
create trigger update_staff_updated_at before update on public.staff for each row execute procedure public.update_updated_at();
create trigger update_coupons_updated_at before update on public.coupons for each row execute procedure public.update_updated_at();
create trigger update_categories_updated_at before update on public.categories for each row execute procedure public.update_updated_at();
create trigger update_brands_updated_at before update on public.brands for each row execute procedure public.update_updated_at();

-- Generate order number
create or replace function public.generate_order_number()
returns trigger as $$
declare
  next_num integer;
begin
  select coalesce(max(substring(order_number from 2)::integer), 0) + 1
  into next_num
  from public.orders;
  new.order_number = 'O' || lpad(next_num::text, 5, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_order_number
  before insert on public.orders
  for each row execute procedure public.generate_order_number();
