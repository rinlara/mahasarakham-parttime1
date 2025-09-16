
-- สร้างตารางสำหรับข้อมูลผู้ประกอบการ
CREATE TABLE public.employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  tax_id TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- สร้างตารางสำหรับข้อมูลผู้สมัครงาน
CREATE TABLE public.applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  date_of_birth DATE,
  education_level TEXT,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  resume_url TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- เปิดใช้งาน RLS สำหรับตาราง employers
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

-- สร้าง RLS policies สำหรับ employers
CREATE POLICY "Users can view their own employer profile" 
  ON public.employers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employer profile" 
  ON public.employers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile" 
  ON public.employers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- เปิดใช้งาน RLS สำหรับตาราง applicants
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- สร้าง RLS policies สำหรับ applicants
CREATE POLICY "Users can view their own applicant profile" 
  ON public.applicants 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applicant profile" 
  ON public.applicants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applicant profile" 
  ON public.applicants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- สร้าง function ใหม่สำหรับจัดการผู้ใช้ใหม่
CREATE OR REPLACE FUNCTION public.handle_new_user_with_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- อัปเดต profiles table
  INSERT INTO public.profiles (id, name, email, role, phone, address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'applicant'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  );
  
  -- ถ้าเป็น employer ให้สร้างข้อมูลใน employers table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'applicant') = 'employer' THEN
    INSERT INTO public.employers (
      user_id, 
      business_name, 
      contact_person, 
      email, 
      phone, 
      address,
      description
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'บริษัทใหม่'),
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      'ธุรกิจใหม่'
    );
  END IF;
  
  -- ถ้าเป็น applicant ให้สร้างข้อมูลใน applicants table
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'applicant') = 'applicant' THEN
    INSERT INTO public.applicants (
      user_id,
      first_name,
      last_name,
      email,
      phone,
      address
    )
    VALUES (
      NEW.id,
      COALESCE(split_part(NEW.raw_user_meta_data->>'name', ' ', 1), 'ชื่อ'),
      COALESCE(split_part(NEW.raw_user_meta_data->>'name', ' ', 2), 'นามสกุล'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'address', '')
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- ลบ trigger เก่าและสร้างใหม่
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_role();
