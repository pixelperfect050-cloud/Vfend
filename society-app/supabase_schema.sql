-- ============================================
-- SocietySync: Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (linked to auth.users)
-- ============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  resident_type text DEFAULT 'none' CHECK (resident_type IN ('owner', 'tenant', 'none')),
  society_id uuid,
  flat_id uuid,
  avatar text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. SOCIETIES
-- ============================================
CREATE TABLE societies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  invite_code text UNIQUE,
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  maintenance_amount numeric DEFAULT 0,
  late_fee_per_day numeric DEFAULT 0,
  late_fee_after_days integer DEFAULT 15,
  billing_day integer DEFAULT 1 CHECK (billing_day >= 1 AND billing_day <= 28),
  created_by uuid REFERENCES profiles(id),
  logo text DEFAULT '',
  contact_number text DEFAULT '',
  upi_id text DEFAULT '',
  total_blocks integer DEFAULT 0,
  total_flats integer DEFAULT 0,
  google_sheet_id text DEFAULT '',
  google_sheet_url text DEFAULT '',
  google_folder_url text DEFAULT '',
  sheet_created_at timestamptz,
  sheet_enabled boolean DEFAULT false,
  last_synced_at timestamptz,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  subscription_plan text DEFAULT 'none' CHECK (subscription_plan IN ('fixed', 'per_flat', 'none')),
  subscription_expiry timestamptz,
  trial_expiry timestamptz,
  trial_activated boolean DEFAULT true,
  razorpay_payment_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key for profiles.society_id after societies exists
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_society FOREIGN KEY (society_id) REFERENCES societies(id);

-- ============================================
-- 3. BLOCKS
-- ============================================
CREATE TABLE blocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  total_floors integer NOT NULL CHECK (total_floors >= 1),
  flats_per_floor integer NOT NULL CHECK (flats_per_floor >= 1),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. FLATS
-- ============================================
CREATE TABLE flats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number text NOT NULL,
  block_id uuid NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  floor integer NOT NULL,
  owner_name text DEFAULT 'Vacant',
  owner_phone text DEFAULT '',
  owner_email text DEFAULT '',
  tenant_name text DEFAULT '',
  tenant_phone text DEFAULT '',
  area numeric DEFAULT 0,
  type text DEFAULT '2BHK' CHECK (type IN ('1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Penthouse', 'Other')),
  is_occupied boolean DEFAULT true,
  user_id uuid REFERENCES profiles(id),
  current_month_status text DEFAULT 'pending' CHECK (current_month_status IN ('paid', 'pending', 'partial')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key for profiles.flat_id after flats exists
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_flat FOREIGN KEY (flat_id) REFERENCES flats(id);

-- ============================================
-- 5. PAYMENTS
-- ============================================
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flat_id uuid NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  paid_amount numeric DEFAULT 0,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'partial')),
  paid_date timestamptz,
  due_date timestamptz,
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'online')),
  transaction_id text DEFAULT '',
  late_fee numeric DEFAULT 0,
  notes text DEFAULT '',
  receipt_number text,
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 6. PAYMENT REQUESTS
-- ============================================
CREATE TABLE payment_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flat_id uuid NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES profiles(id),
  payment_id uuid REFERENCES payments(id),
  amount numeric NOT NULL CHECK (amount >= 1),
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'online')),
  transaction_id text DEFAULT '',
  screenshot_url text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected', 'correction_needed')),
  admin_notes text DEFAULT '',
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. EXPENSES
-- ============================================
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('electricity', 'lift', 'security', 'cleaning', 'plumbing', 'gardening', 'repairs', 'water', 'misc')),
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  date timestamptz DEFAULT now(),
  block_id uuid REFERENCES blocks(id),
  vendor text DEFAULT '',
  receipt text DEFAULT '',
  added_by uuid NOT NULL REFERENCES profiles(id),
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 8. FUNDS
-- ============================================
CREATE TABLE funds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'other' CHECK (category IN ('emergency', 'festival', 'repair', 'water_tank', 'renovation', 'security', 'special', 'other')),
  amount_per_flat numeric NOT NULL CHECK (amount_per_flat >= 1),
  total_target numeric DEFAULT 0,
  total_collected numeric DEFAULT 0,
  due_date timestamptz NOT NULL,
  applicable_to text DEFAULT 'all' CHECK (applicable_to IN ('all', 'specific_blocks')),
  applicable_blocks uuid[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 9. FUND PAYMENTS
-- ============================================
CREATE TABLE fund_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  flat_id uuid NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 1),
  paid_amount numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'pending_verification', 'paid', 'partial', 'rejected')),
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'online')),
  transaction_id text DEFAULT '',
  screenshot_url text DEFAULT '',
  notes text DEFAULT '',
  submitted_by uuid REFERENCES profiles(id),
  recorded_by uuid REFERENCES profiles(id),
  paid_date timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 10. NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general' CHECK (type IN ('payment_reminder', 'expense_update', 'announcement', 'maintenance', 'general', 'success', 'info', 'payment_submitted', 'payment_approved', 'payment_rejected', 'fund_created', 'fund_reminder')),
  target_users uuid[] DEFAULT '{}',
  target_all boolean DEFAULT false,
  read_by uuid[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 11. REMINDERS
-- ============================================
CREATE TABLE reminders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  flat_id uuid NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL CHECK (type IN ('payment', 'meeting', 'event', 'custom')),
  title text NOT NULL,
  message text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  sent_date timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  channel text DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms')),
  metadata jsonb DEFAULT '{}',
  retry_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 12. ACTIVITY LOGS
-- ============================================
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id uuid NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES profiles(id),
  admin_name text NOT NULL,
  admin_email text DEFAULT '',
  action_type text NOT NULL,
  description text NOT NULL,
  target_type text DEFAULT 'other' CHECK (target_type IN ('payment', 'expense', 'fund', 'member', 'admin', 'society', 'block', 'flat', 'other')),
  target_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 13. DEMO LEADS
-- ============================================
CREATE TABLE demo_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  mobile text NOT NULL,
  society_name text DEFAULT '',
  number_of_flats integer DEFAULT 0,
  city text DEFAULT '',
  preferred_demo_time text DEFAULT '',
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'converted', 'lost')),
  notes text DEFAULT '',
  source text DEFAULT 'ai_chat' CHECK (source IN ('ai_chat', 'website', 'referral', 'other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_society ON profiles(society_id);
CREATE INDEX idx_blocks_society ON blocks(society_id);
CREATE INDEX idx_flats_society ON flats(society_id);
CREATE INDEX idx_flats_block ON flats(block_id);
CREATE INDEX idx_payments_society ON payments(society_id);
CREATE INDEX idx_payments_flat ON payments(flat_id);
CREATE INDEX idx_payments_month_year ON payments(month, year);
CREATE INDEX idx_payment_requests_society ON payment_requests(society_id);
CREATE INDEX idx_expenses_society ON expenses(society_id);
CREATE INDEX idx_funds_society ON funds(society_id);
CREATE INDEX idx_fund_payments_society ON fund_payments(society_id);
CREATE INDEX idx_fund_payments_fund ON fund_payments(fund_id);
CREATE INDEX idx_notifications_society ON notifications(society_id);
CREATE INDEX idx_activity_logs_society ON activity_logs(society_id, created_at DESC);
CREATE INDEX idx_activity_logs_admin ON activity_logs(admin_id, created_at DESC);
CREATE INDEX idx_reminders_status ON reminders(status, scheduled_date);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_societies_updated BEFORE UPDATE ON societies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blocks_updated BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_flats_updated BEFORE UPDATE ON flats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payment_requests_updated BEFORE UPDATE ON payment_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_funds_updated BEFORE UPDATE ON funds FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_fund_payments_updated BEFORE UPDATE ON fund_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_notifications_updated BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reminders_updated BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- PROFILES: users can read own profile + same society members
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read society members" ON profiles FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- SOCIETIES: members can read their society, admins can update
CREATE POLICY "Members can read own society" ON societies FOR SELECT USING (id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins can insert societies" ON societies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update own society" ON societies FOR UPDATE USING (id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- BLOCKS: society members can read, admins can write
CREATE POLICY "Members read blocks" ON blocks FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write blocks" ON blocks FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FLATS: society members can read, admins can write
CREATE POLICY "Members read flats" ON flats FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write flats" ON flats FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PAYMENTS: society members read, admins write
CREATE POLICY "Members read payments" ON payments FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write payments" ON payments FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- PAYMENT REQUESTS: members can submit, admins can manage
CREATE POLICY "Members read own requests" ON payment_requests FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Members submit requests" ON payment_requests FOR INSERT WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "Admins manage requests" ON payment_requests FOR UPDATE USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- EXPENSES: society members can read, admins can write
CREATE POLICY "Members read expenses" ON expenses FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write expenses" ON expenses FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FUNDS: society members can read, admins can write
CREATE POLICY "Members read funds" ON funds FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write funds" ON funds FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- FUND PAYMENTS: society members can read + submit, admins manage
CREATE POLICY "Members read fund payments" ON fund_payments FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Members submit fund payments" ON fund_payments FOR INSERT WITH CHECK (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins manage fund payments" ON fund_payments FOR UPDATE USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- NOTIFICATIONS: society members can read
CREATE POLICY "Members read notifications" ON notifications FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write notifications" ON notifications FOR INSERT WITH CHECK (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Members update read status" ON notifications FOR UPDATE USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));

-- REMINDERS: society scope
CREATE POLICY "Members read reminders" ON reminders FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admins write reminders" ON reminders FOR ALL USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ACTIVITY LOGS: admins can read their society logs
CREATE POLICY "Admins read logs" ON activity_logs FOR SELECT USING (society_id IN (SELECT society_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "System insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- DEMO LEADS: open insert (for public landing page), admin read
CREATE POLICY "Public insert leads" ON demo_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read leads" ON demo_leads FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin update leads" ON demo_leads FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('society-logos', 'society-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Storage policies
CREATE POLICY "Auth users upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Society members read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone read logos" ON storage.objects FOR SELECT USING (bucket_id = 'society-logos');
CREATE POLICY "Admins upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'society-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users read receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts' AND auth.role() = 'authenticated');

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE fund_payments;
ALTER PUBLICATION supabase_realtime ADD TABLE flats;
