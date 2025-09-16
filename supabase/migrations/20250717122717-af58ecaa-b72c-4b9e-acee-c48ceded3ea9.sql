
-- เพิ่มข้อมูลแอดมินลงในตาราง profiles
INSERT INTO public.profiles (id, name, email, role, phone, address, created_at, updated_at)
VALUES (
  'admin-user-id-12345678-1234-5678-9012-123456789012',
  'ผู้ดูแลระบบ',
  'admin@example.com',
  'admin',
  '0123456789',
  'ระบบจัดการ',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- เพิ่มข้อมูลแอดมินอีกบัญชี
INSERT INTO public.profiles (id, name, email, role, phone, address, created_at, updated_at)
VALUES (
  'admin-user-id-87654321-4321-8765-2109-876543210987',
  'แอดมิน 2',
  'testadmin@example.com',
  'admin',
  '0987654321',
  'ระบบจัดการ',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- สร้างบัญชีผู้ทดสอบเพิ่มเติม
INSERT INTO public.profiles (id, name, email, role, phone, address, created_at, updated_at)
VALUES (
  'test-employer-id-11111111-2222-3333-4444-555555555555',
  'นายจ้างทดสอบ',
  'employer@test.com',
  'employer',
  '0111222333',
  'บริษัททดสอบ',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, name, email, role, phone, address, created_at, updated_at)
VALUES (
  'test-applicant-id-99999999-8888-7777-6666-555555555555',
  'ผู้สมัครทดสอบ',
  'applicant@test.com',
  'applicant',
  '0999888777',
  'ที่อยู่ทดสอบ',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
