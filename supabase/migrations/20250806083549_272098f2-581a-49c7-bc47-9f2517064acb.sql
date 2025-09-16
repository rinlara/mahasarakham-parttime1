-- แก้ไขปัญหา search_path ในฟังก์ชัน
CREATE OR REPLACE FUNCTION public.notify_application_submitted()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- แก้ไขฟังก์ชันอื่นๆ
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'applicant')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_with_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;