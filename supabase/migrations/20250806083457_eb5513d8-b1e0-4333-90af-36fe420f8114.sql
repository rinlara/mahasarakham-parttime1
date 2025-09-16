-- สร้างฟังก์ชันสำหรับการแจ้งเตือนอัตโนมัติ
CREATE OR REPLACE FUNCTION public.notify_application_submitted()
RETURNS TRIGGER AS $$
BEGIN
  -- แจ้งเตือนผู้สมัคร
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.applicant_id,
    'ส่งใบสมัครงานสำเร็จ',
    'คุณได้ส่งใบสมัครสำหรับตำแหน่ง "' || NEW.job_title || '" ที่บริษัท ' || NEW.company_name || ' เรียบร้อยแล้ว',
    'success'
  );
  
  -- แจ้งเตือนนายจ้าง (หาเจ้าของบริษัทจาก jobs และ companies)
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    c.owner_id,
    'มีใบสมัครงานใหม่',
    'มีผู้สมัครใหม่สำหรับตำแหน่ง "' || NEW.job_title || '" จาก ' || NEW.applicant_name,
    'info'
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  WHERE j.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger สำหรับการแจ้งเตือนเมื่อมีการสมัครงาน
DROP TRIGGER IF EXISTS trigger_notify_application_submitted ON job_applications;
CREATE TRIGGER trigger_notify_application_submitted
  AFTER INSERT ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_submitted();

-- เพิ่มฟิลด์ education_level ในตาราง job_applications
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- อัปเดต RLS policies สำหรับ notifications ให้ดีขึ้น
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- เพิ่ม policy สำหรับการสร้าง notification (สำหรับระบบ)
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" 
ON notifications FOR INSERT 
WITH CHECK (true);