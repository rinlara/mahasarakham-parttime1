
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import JobDetailModal from '@/components/JobDetailModal';
import JobApplicationModal from '@/components/JobApplicationModal';
import AdvertisementBanner from '@/components/AdvertisementBanner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Users, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // รายชื่ออำเภอในจังหวัดมหาสารคาม
  const districts = [
    'ทั้งหมด',
  
  'เมืองมหาสารคาม',
  'แกดำ',
  'โกสุมพิสัย',
  'กันทรวิชัย',
  'เชียงยืน',
  'บรบือ',
  'นาเชือก',
  'พยัคฆภูมิพิสัย',
  'วาปีปทุม',
  'นาดูน',
  'ยางสีสุราช',
  'กุดรัง',
  'ชื่นชม'
];

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === '' || selectedDistrict === 'ทั้งหมด' || 
                           job.location.toLowerCase().includes(selectedDistrict.toLowerCase());
    
    // Use optional chaining and provide defaults since these fields might not exist yet
    const applicationDeadline = (job as any).application_deadline;
    const maxApplicants = (job as any).max_applicants;
    const currentApplicants = (job as any).current_applicants;
    
    const isExpired = applicationDeadline && new Date(applicationDeadline) < new Date();
    const isFull = maxApplicants && currentApplicants && currentApplicants >= maxApplicants;
    
    return matchesSearch && matchesDistrict && job.is_active && !isExpired && !isFull;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'salary_high':
        const bSalary = (b as any).salary_per_hour || 0;
        const aSalary = (a as any).salary_per_hour || 0;
        return bSalary - aSalary;
      case 'salary_low':
        const aSalaryLow = (a as any).salary_per_hour || 0;
        const bSalaryLow = (b as any).salary_per_hour || 0;
        return aSalaryLow - bSalaryLow;
      case 'deadline':
        const aDeadline = (a as any).application_deadline || '';
        const bDeadline = (b as any).application_deadline || '';
        return new Date(aDeadline).getTime() - new Date(bDeadline).getTime();
      default:
        return 0;
    }
  }) || [];

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleApplyClick = (job: Job) => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อสมัครงาน",
        variant: "destructive"
      });
      return;
    }

    if (user.role === 'employer') {
      toast({
        title: "ไม่สามารถสมัครงานได้",
        description: "ผู้ประกอบการไม่สามารถสมัครงานได้",
        variant: "destructive"
      });
      return;
    }

    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationModal(false);
    setShowJobDetail(false);
    toast({
      title: "สมัครงานสำเร็จ",
      description: "ใบสมัครของคุณได้ถูกส่งเรียบร้อยแล้ว"
    });
  };

  if (isLoading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/20">
     
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/20">
    
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">ตำแหน่งงาน</h1>
          <p className="text-muted-foreground text-lg">ค้นหางานที่เหมาะกับคุณ</p>
        </div>

        {/* Simple Search */}
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ค้นหาตำแหน่งงาน หรือสถานที่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('');
                setSortBy('newest');
              }}
              variant="outline"
              className="text-sm"
            >
              รีเซ็ต
            </Button>
          </div>
        </div>

        {/* Jobs Grid - Simplified */}
        <div className="mb-6">
          <p className="text-muted-foreground text-lg">
            พบ <span className="font-semibold text-primary">{filteredJobs.length}</span> ตำแหน่งงาน
            {searchTerm && (
              <span className="text-muted-foreground text-sm ml-2">
                คำค้นหา: "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>
        
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job as Job}
                onApply={() => handleApplyClick(job as Job)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบงานที่ค้นหา</h3>
            <p className="text-muted-foreground mb-4">
              ลองเปลี่ยนคำค้นหาเพื่อดูงานอื่นๆ
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('');
                setSortBy('newest');
              }}
            >
              รีเซ็ตการค้นหา
            </Button>
          </div>
        )}

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        isOpen={showJobDetail}
        onClose={() => setShowJobDetail(false)}
        onApply={handleApplyClick}
        canApply={user?.role === 'applicant'}
        isLoggedIn={!!user}
      />

      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJob}
      />
      </div>
    </div>
  );
}
