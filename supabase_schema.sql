
-- Create the 'offers' table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    old_price TEXT,
    img_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the 'app_settings' table (Singleton pattern)
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    singleton_key TEXT UNIQUE NOT NULL DEFAULT 'config',
    phone_number TEXT NOT NULL DEFAULT '01000000000',
    whatsapp_number TEXT NOT NULL DEFAULT '201000000000',
    landline_number TEXT NOT NULL DEFAULT '0233300000',
    facade_title TEXT NOT NULL DEFAULT 'صيدلية د. إيمان عبد الوهاب',
    facade_subtitle TEXT NOT NULL DEFAULT 'رعاية متكاملة | استشارات طبية | توصيل سريع',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default row for app_settings
INSERT INTO public.app_settings (singleton_key)
VALUES ('config')
ON CONFLICT (singleton_key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow completely public read access to both tables
CREATE POLICY "Allow public read-only access on offers"
ON public.offers FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only access on app_settings"
ON public.app_settings FOR SELECT
USING (true);

-- Allow all for MVP (Will restrict via simple Next.js frontend passcode)
CREATE POLICY "Allow all on offers MVP"
ON public.offers FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all on app_settings MVP"
ON public.app_settings FOR ALL
USING (true)
WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR ALL 
USING (bucket_id = 'public_assets');

