
-- เพิ่มคอลัมน์ salary_per_hour ในตาราง jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_per_hour DECIMAL(10,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS max_applicants INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS current_applicants INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS project_details TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_duration TEXT;

-- สร้าง Storage Buckets สำหรับเก็บไฟล์
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile-images', 'profile-images', true),
  ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- สร้าง Storage Policies สำหรับ profile-images
CREATE POLICY "Allow public access to profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated users to upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- สร้าง Storage Policies สำหรับ resumes
CREATE POLICY "Allow public access to resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Allow authenticated users to upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own resumes" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own resumes" ON storage.objects
  FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- สร้างตาราง advertisements
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position TEXT DEFAULT 'banner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- เพิ่ม RLS policy สำหรับ advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertisements" ON advertisements
  FOR SELECT USING (is_active = true);

-- เพิ่มข้อมูลโฆษณาตัวอย่าง
INSERT INTO advertisements (title, description, image_url, link_url, position) VALUES
('งานพาร์ทไทม์ที่น่าสนใจ', 'ค้นหางานพาร์ทไทม์ที่เหมาะกับคุณ', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop', '#', 'banner'),
('รายได้เสริมจากบ้าน', 'งานออนไลน์ที่สามารถทำจากบ้าน', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop', '#', 'sidebar'),
('เรียนรู้ทักษะใหม่', 'พัฒนาทักษะเพื่อเพิ่มโอกาสในการทำงาน', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop', '#', 'footer');

-- อัปเดตข้อมูลตัวอย่างในตาราง jobs ให้มี salary_per_hour
UPDATE jobs SET salary_per_hour = 150 WHERE id = (SELECT id FROM jobs LIMIT 1);
