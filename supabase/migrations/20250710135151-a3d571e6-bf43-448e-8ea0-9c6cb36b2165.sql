
-- เพิ่มฟิลด์ใหม่ในตาราง jobs
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS max_applicants INTEGER DEFAULT 0;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS current_applicants INTEGER DEFAULT 0;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS salary_per_hour DECIMAL(10,2);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS project_details TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS work_duration TEXT;

-- เพิ่มข้อมูลตัวอย่างงานที่มีรูปภาพและข้อมูลครบ
INSERT INTO public.jobs (
  company_id, 
  company_name, 
  title, 
  description, 
  requirements, 
  salary, 
  salary_per_hour,
  working_hours, 
  location, 
  image,
  application_deadline,
  max_applicants,
  contact_person,
  organization_name,
  project_details,
  work_duration,
  is_approved, 
  is_active
) VALUES 
(
  (SELECT id FROM public.employers LIMIT 1),
  'ร้านกาแฟสีเขียว',
  'พนักงานเสิร์ฟกาแฟ',
  'รับสมัครพนักงานเสิร์ฟกาแฟ งานพาร์ทไทม์ เวลาทำงานยืดหยุ่น เหมาะสำหรับนักเรียน นักศึกษา ที่ต้องการรายได้เสริม',
  'อายุ 16-25 ปี สามารถสื่อสารภาษาไทยได้ดี มีความรับผิดชอบ ชอบงานบริการ',
  '120 บาท/ชั่วโมง',
  120.00,
  'จันทร์-ศุกร์ 16:00-21:00, เสาร์-อาทิตย์ 08:00-18:00',
  'ใกล้มหาวิทยาลัยมหาสารคาม',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
  CURRENT_DATE + INTERVAL '15 days',
  5,
  'คุณสมหญิง ใจดี',
  'กลุ่มร้านกาแฟนักศึกษา',
  'โครงการร้านกาแฟเพื่อนักศึกษา ภายใต้การดูแลของคณะเทคโนโลยีสารสนเทศ',
  '3 เดือน (ต่อสัญญาได้)',
  true,
  true
),
(
  (SELECT id FROM public.employers LIMIT 1),
  'ร้านขนมหวานโฮมเมด',
  'ผู้ช่วยทำขนม',
  'รับสมัครผู้ช่วยทำขนมหวาน งานพาร์ทไทม์ เรียนรู้การทำขนมหวานไทยและขนมตะวันตก',
  'อายุ 18-30 ปี สนใจในการทำขนม อดทน มีความรับผิดชอบ',
  '100 บาท/ชั่วโมง',
  100.00,
  'จันทร์-ศุกร์ 14:00-18:00',
  'ตลาดเมืองมหาสารคาม',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
  CURRENT_DATE + INTERVAL '10 days',
  3,
  'คุณนารี หวานใจ',
  'ธุรกิจขนมหวานครอบครัว',
  'โครงการสนับสนุนธุรกิจขนมหวานท้องถิ่น',
  '6 เดือน',
  true,
  true
),
(
  (SELECT id FROM public.employers LIMIT 1),
  'ร้านหนังสือและเครื่องเขียน',
  'พนักงานขาย',
  'รับสมัครพนักงานขายหนังสือและเครื่องเขียน งานพาร์ทไทม์ เหมาะกับคนที่ชอบหนังสือ',
  'อายุ 18-28 ปี ชอบการอ่าน มีความรู้ด้านหนังสือ สามารถแนะนำสินค้าได้',
  '110 บาท/ชั่วโมง',
  110.00,
  'จันทร์-ศุกร์ 17:00-20:00, เสาร์-อาทิตย์ 09:00-17:00',
  'ศูนย์การค้าเมืองมหาสารคาม',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
  CURRENT_DATE + INTERVAL '7 days',
  4,
  'คุณวิชาญ รักหนังสือ',
  'ร้านหนังสือคุณภาพ',
  'โครงการส่งเสริมการอ่านในชุมชน',
  '4 เดือน (ต่อสัญญาได้)',
  true,
  true
);

-- เพิ่มฟังก์ชันตรวจสอบสถานะงาน
CREATE OR REPLACE FUNCTION public.update_job_status()
RETURNS trigger AS $$
BEGIN
  -- ตรวจสอบว่าหมดเขตสมัครหรือไม่
  IF NEW.application_deadline IS NOT NULL AND NEW.application_deadline < CURRENT_DATE THEN
    NEW.is_active = false;
  END IF;
  
  -- ตรวจสอบว่าผู้สมัครเต็มหรือไม่
  IF NEW.max_applicants > 0 AND NEW.current_applicants >= NEW.max_applicants THEN
    NEW.is_active = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger สำหรับอัพเดตสถานะงาน
CREATE TRIGGER update_job_status_trigger
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_job_status();

-- ฟังก์ชันอัพเดตจำนวนผู้สมัคร
CREATE OR REPLACE FUNCTION public.update_applicant_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs 
    SET current_applicants = current_applicants + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs 
    SET current_applicants = current_applicants - 1
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger สำหรับอัพเดตจำนวนผู้สมัคร
CREATE TRIGGER update_applicant_count_trigger
  AFTER INSERT OR DELETE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_applicant_count();

-- เพิ่มฟิลด์ logo ในตาราง profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- เพิ่มตาราง reports สำหรับรายงานผล
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL, -- 'job_statistics', 'application_statistics', 'user_statistics'
  data JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS สำหรับ reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reports" ON public.reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- เพิ่มข้อมูลโฆษณาตัวอย่าง
CREATE TABLE IF NOT EXISTS public.advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position TEXT DEFAULT 'banner', -- 'banner', 'sidebar', 'footer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- เพิ่มโฆษณาตัวอย่าง
INSERT INTO public.advertisements (title, description, image_url, link_url, position) VALUES
('ยินดีต้อนรับสู่ระบบหางานพาร์ทไทม์', 'ค้นหางานพาร์ทไทม์ที่เหมาะกับคุณ ได้เงินเสริมระหว่างเรียน', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=200&fit=crop', '#', 'banner'),
('สร้างรายได้ระหว่างเรียน', 'งานพาร์ทไทม์หลากหลาย เวลาทำงานยืดหยุ่น เหมาะกับนักเรียน นักศึกษา', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', '#', 'sidebar'),
('ผู้ประกอบการ - ประกาศหางานฟรี!', 'ลงประกาศหาพนักงานพาร์ทไทม์ง่ายๆ ไม่มีค่าธรรมเนียม', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', '#', 'sidebar');

-- RLS สำหรับ advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertisements" ON public.advertisements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage advertisements" ON public.advertisements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
