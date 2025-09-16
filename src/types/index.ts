
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employer' | 'applicant';
  profileImage?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Employer {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  tax_id?: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  logo_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Applicant {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth?: string;
  education_level?: string;
  skills?: string[];
  experience_years: number;
  resume_url?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  ownerId: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salary: string;
  salary_per_hour?: number;
  working_hours: string;
  location: string;
  district?: string;
  company_id: string;
  company_name: string;
  is_active: boolean;
  is_approved: boolean;
  image?: string;
  application_deadline?: string;
  max_applicants?: number;
  current_applicants?: number;
  contact_person?: string;
  organization_name?: string;
  project_details?: string;
  work_duration?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  applicant_name: string;
  applicant_email: string;
  cover_letter: string;
  resume?: string;
  status: 'pending' | 'approved' | 'rejected';
  job_title: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  position: 'banner' | 'sidebar' | 'footer';
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  report_type: 'job_statistics' | 'application_statistics' | 'user_statistics';
  data: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}
