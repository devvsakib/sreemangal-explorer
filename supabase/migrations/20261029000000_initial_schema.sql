-- Sreemangal Explorer Database Schema & Security
-- Initial Migration: Schema, RLS, Indexes, and Demonstration Seed Data

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'provider');
CREATE TYPE verification_status_type AS ENUM ('verified', 'unverified', 'pending_review');
CREATE TYPE vehicle_category AS ENUM ('cng', 'chander_gari', 'electric_bike', 'bicycle', 'car', 'microbus');
CREATE TYPE booking_status_type AS ENUM (
  'new',
  'reviewing',
  'awaiting_provider',
  'quoted',
  'awaiting_customer',
  'confirmed',
  'completed',
  'cancelled',
  'rejected'
);
CREATE TYPE commission_model AS ENUM ('percentage', 'fixed');
CREATE TYPE commission_payment_status_type AS ENUM ('pending', 'collected', 'waived');

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'provider',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PLACES (DESTINATIONS)
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. 'National Park', 'Wetland', 'Tea Estate', 'Waterfall', 'Tribal Village'
  area TEXT NOT NULL, -- e.g. 'Kamalganj', 'Hail Haor', 'Sreemangal Sadar', 'Rajkandi Reserve'
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  cover_image_path TEXT,
  gallery TEXT[] DEFAULT '{}',
  visiting_information TEXT,
  access_notes TEXT,
  opening_hours TEXT,
  entry_fee_information TEXT,
  verification_status verification_status_type NOT NULL DEFAULT 'verified',
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROVIDERS
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL,
  provider_type TEXT NOT NULL, -- 'CNG Association', 'Jeep Syndicate', 'Independent Guide', 'Car Rental'
  public_contact_number TEXT,
  private_contact_details TEXT,
  verification_status verification_status_type NOT NULL DEFAULT 'verified',
  active BOOLEAN NOT NULL DEFAULT true,
  agreed_commission_type commission_model NOT NULL DEFAULT 'percentage',
  agreed_commission_value NUMERIC(10,2) DEFAULT 10.00,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  vehicle_type vehicle_category NOT NULL,
  passenger_capacity INT NOT NULL CHECK (passenger_capacity > 0),
  driver_included BOOLEAN NOT NULL DEFAULT true,
  luggage_details TEXT,
  supported_routes TEXT[] DEFAULT '{}',
  pricing_basis TEXT NOT NULL, -- 'Per Full Day (8 hrs)', 'Per Half Day', 'Per Standard Circuit'
  indicative_price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'BDT',
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  cover_image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  last_price_verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. GUIDES
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{"Bengali"}',
  specialties TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  group_size_limit INT,
  indicative_price NUMERIC(10,2),
  pricing_basis TEXT DEFAULT 'Per Half-Day / Full-Day Trail',
  verification_status verification_status_type NOT NULL DEFAULT 'verified',
  cover_image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BOOKING REQUESTS
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('transport', 'guide')),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  requested_date DATE NOT NULL,
  requested_start_time TEXT,
  group_size INT NOT NULL CHECK (group_size > 0),
  pickup_location TEXT NOT NULL,
  itinerary_details TEXT,
  requested_duration TEXT,
  customer_notes TEXT,
  status booking_status_type NOT NULL DEFAULT 'new',
  assigned_provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  quoted_amount NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'BDT',
  quote_details TEXT,
  provider_confirmed_at TIMESTAMPTZ,
  customer_accepted_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  commission_type commission_model DEFAULT 'percentage',
  agreed_commission_value NUMERIC(10,2) DEFAULT 10.00,
  commission_amount NUMERIC(10,2),
  commission_payment_status commission_payment_status_type NOT NULL DEFAULT 'pending',
  commission_collected_at TIMESTAMPTZ,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BOOKING STATUS HISTORY
CREATE TABLE IF NOT EXISTS booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_request_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
  previous_status booking_status_type NOT NULL,
  new_status booking_status_type NOT NULL,
  changed_by TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REVIEWS (Only for verified completed bookings)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_places_slug ON places(slug);
CREATE INDEX IF NOT EXISTS idx_places_published ON places(published);
CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON vehicles(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_published ON vehicles(published);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(published);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON booking_requests(public_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON booking_requests(created_at DESC);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Helpers for Admin Role Check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can view published places, vehicles, guides
CREATE POLICY "Public places view" ON places
  FOR SELECT USING (published = true);

CREATE POLICY "Admin places management" ON places
  FOR ALL USING (is_admin());

CREATE POLICY "Public vehicles view" ON vehicles
  FOR SELECT USING (published = true);

CREATE POLICY "Admin vehicles management" ON vehicles
  FOR ALL USING (is_admin());

CREATE POLICY "Public guides view" ON guides
  FOR SELECT USING (published = true);

CREATE POLICY "Admin guides management" ON guides
  FOR ALL USING (is_admin());

-- Providers table: Only admins can view private contact details & notes
CREATE POLICY "Admin providers access" ON providers
  FOR ALL USING (is_admin());

-- Bookings table: Public cannot SELECT all or UPDATE directly.
-- Insertion happens via secure server action/endpoint with rate limiting.
CREATE POLICY "Admin bookings full access" ON booking_requests
  FOR ALL USING (is_admin());

CREATE POLICY "Admin status history access" ON booking_status_history
  FOR ALL USING (is_admin());
