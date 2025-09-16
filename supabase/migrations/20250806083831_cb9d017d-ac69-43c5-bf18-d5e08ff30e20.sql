-- เพิ่มข้อมูลตัวอย่างสำหรับทดสอบระบบ (ใช้ UUID ที่ถูกต้อง)
-- สร้างข้อมูลผู้สมัครทดสอบ
INSERT INTO public.applicants (
  user_id, first_name, last_name, email, phone, address, 
  education_level, experience_years, skills
) VALUES (
  'test-applicant-id-99999999-8888-7777-6666-555555555555'::uuid,
  'สมชาย',
  'ใจดี',
  'applicant@test.com',
  '0999888777',
  '123 ถนนทดสอบ กรุงเทพฯ 10100',
  'ปริญญาตรี',
  2,
  ARRAY['Microsoft Office', 'การสื่อสาร', 'ภาษาอังกฤษ', 'การขาย']
) ON CONFLICT (user_id) DO UPDATE SET
  education_level = EXCLUDED.education_level,
  experience_years = EXCLUDED.experience_years,
  skills = EXCLUDED.skills;

-- สร้างข้อมูลนายจ้างทดสอบ
INSERT INTO public.employers (
  user_id, business_name, contact_person, email, phone, address, description
) VALUES (
  'test-employer-id-11111111-2222-3333-4444-555555555555'::uuid,
  'บริษัท ABC จำกัด',
  'คุณสมหญิง ใจดี',
  'employer@test.com',
  '0111222333',
  '456 ถนนธุรกิจ กรุงเทพฯ 10200',
  'บริษัทให้บริการด้านเทคโนโลยี'
) ON CONFLICT (user_id) DO UPDATE SET
  description = EXCLUDED.description;

-- สร้างบริษัทตัวอย่าง
INSERT INTO public.companies (
  owner_id, name, description, address, phone, email, is_approved
) VALUES (
  'test-employer-id-11111111-2222-3333-4444-555555555555'::uuid,
  'บริษัท ABC จำกัด',
  'บริษัทให้บริการด้านเทคโนโลยีและการพัฒนาซอฟต์แวร์',
  '456 ถนนธุรกิจ กรุงเทพฯ 10200',
  '0111222333',
  'contact@abc-company.com',
  true
) ON CONFLICT (owner_id) DO UPDATE SET
  is_approved = EXCLUDED.is_approved;

-- เพิ่มการแจ้งเตือนตัวอย่าง
INSERT INTO public.notifications (
  user_id, title, message, type, is_read
) VALUES 
(
  'test-applicant-id-99999999-8888-7777-6666-555555555555'::uuid,
  'ยินดีต้อนรับสู่ระบบ',
  'ยินดีต้อนรับเข้าสู่ระบบหางาน! คุณสามารถเริ่มค้นหาและสมัครงานได้ทันที',
  'success',
  false
),
(
  'test-employer-id-11111111-2222-3333-4444-555555555555'::uuid,
  'ยินดีต้อนรับนายจ้าง',
  'ยินดีต้อนรับเข้าสู่ระบบจัดการงาน! คุณสามารถเริ่มโพสต์งานและรับสมัครพนักงานได้',
  'info',
  false
),
(
  'admin-user-id-12345678-1234-5678-9012-123456789012'::uuid,
  'ระบบพร้อมใช้งาน',
  'ระบบการจัดการงานพาร์ทไทม์พร้อมใช้งานแล้ว คุณสามารถเริ่มจัดการผู้ใช้และงานต่างๆ ได้',
  'success',
  false
);