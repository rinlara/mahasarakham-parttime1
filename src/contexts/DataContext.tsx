
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Job, JobApplication, Notification } from '@/types';

interface DataContextType {
  companies: Company[];
  jobs: Job[];
  applications: JobApplication[];
  notifications: Notification[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addJob: (job: Omit<Job, 'id' | 'created_at'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addApplication: (application: Omit<JobApplication, 'id' | 'created_at'>) => void;
  updateApplication: (id: string, application: Partial<JobApplication>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotifications: (userId: string) => Notification[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'ร้านกาแฟดีๆ',
    description: 'ร้านกาแฟที่มีบรรยากาศดี อยู่ใจกลางเมืองมหาสารคาม',
    address: '123 ถนนนครสวรรค์ อำเภอเมือง จังหวัดมหาสารคาม',
    phone: '043-123-456',
    email: 'goodcoffee@example.com',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    ownerId: 'employer-1',
    isApproved: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-2',
    name: 'ร้านขายของชำ 24 ชม.',
    description: 'ร้านสะดวกซื้อเปิด 24 ชั่วโมง',
    address: '456 ถนนศิลาอาสน์ อำเภอเมือง จังหวัดมหาสารคาม',
    phone: '043-789-012',
    email: 'shop24@example.com',
    logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
    ownerId: 'employer-1',
    isApproved: true,
    createdAt: '2024-01-02T00:00:00Z'
  }
];

const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'พนักงานเสิร์ฟ',
    description: 'เสิร์ฟเครื่องดื่มและขนมให้ลูกค้า ดูแลความสะอาดของร้าน',
    requirements: 'สามารถทำงานเป็นกะได้ มีมนุษยสัมพันธ์ดี ใจเย็น',
    salary: '350 บาท/วัน',
    working_hours: '08:00 - 17:00',
    location: 'ร้านกาแฟดีๆ ถนนนครสวรรค์',
    company_id: 'company-1',
    company_name: 'ร้านกาแฟดีๆ',
    is_active: true,
    is_approved: true,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'job-2',
    title: 'พนักงานแคชเชียร์',
    description: 'คิดเงิน รับชำระเงิน ดูแลสินค้าบนชั้น',
    requirements: 'คิดเลขเร็ว ซื่อสัตย์ สามารถทำงานกะดึกได้',
    salary: '400 บาท/วัน',
    working_hours: '22:00 - 06:00',
    location: 'ร้านขายของชำ 24 ชม. ถนนศิลาอาสน์',
    company_id: 'company-2',
    company_name: 'ร้านขายของชำ 24 ชม.',
    is_active: true,
    is_approved: true,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: `company-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, companyData: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id ? { ...company, ...companyData } : company
    ));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    setJobs(prev => prev.filter(job => job.company_id !== id));
  };

  const addJob = (jobData: Omit<Job, 'id' | 'created_at'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...jobData } : job
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setApplications(prev => prev.filter(app => app.job_id !== id));
  };

  const addApplication = (applicationData: Omit<JobApplication, 'id' | 'created_at'>) => {
    const newApplication: JobApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplication = (id: string, applicationData: Partial<JobApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, ...applicationData } : app
    ));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, is_read: true } : notif
    ));
  };

  const getUnreadNotifications = (userId: string) => {
    return notifications.filter(notif => notif.user_id === userId && !notif.is_read);
  };

  return (
    <DataContext.Provider value={{
      companies,
      jobs,
      applications,
      notifications,
      addCompany,
      updateCompany,
      deleteCompany,
      addJob,
      updateJob,
      deleteJob,
      addApplication,
      updateApplication,
      addNotification,
      markNotificationAsRead,
      getUnreadNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
