
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import JobApplicationModal from '@/components/JobApplicationModal';
import { User, Briefcase, FileText, Clock, MapPin, Phone, Mail, Calendar, Edit, Star, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<{id: string, title: string, company_name: string} | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // ดึงข้อมูล applicant profile
  const { data: applicantProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['applicant-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching applicant profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applicant-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('applicant_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
    retry: 1
  });

  const { data: availableJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['available-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
      return data || [];
    },
    retry: 1
  });

  // Show loading while fetching critical data
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    applications: applications?.length || 0,
    pending: applications?.filter(app => app.status === 'pending').length || 0,
    approved: applications?.filter(app => app.status === 'approved').length || 0,
    rejected: applications?.filter(app => app.status === 'rejected').length || 0
  };

  const handleApplyToJob = (job: any) => {
    setSelectedJob({
      id: job.id,
      title: job.title,
      company_name: job.company_name
    });
    setIsApplicationModalOpen(true);
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                แดชบอร์ดผู้สมัครงาน
              </h1>
              <p className="text-gray-600">ค้นหาและสมัครงานที่ใช่สำหรับคุณ</p>
            </div>
          </div>
        </div>
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={applicantProfile?.profile_image_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                  {applicantProfile?.first_name?.charAt(0) || user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {applicantProfile ? `${applicantProfile.first_name} ${applicantProfile.last_name}` : user?.name || 'ผู้สมัครงาน'}
                </h1>
                <p className="text-gray-600 mb-3">
                  {applicantProfile?.education_level || 'กำลังมองหาโอกาสการทำงานใหม่'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {applicantProfile?.email || user?.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {applicantProfile?.phone || 'ไม่ระบุ'}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {applicantProfile?.address || 'ไม่ระบุ'}
                  </div>
                </div>
                {applicantProfile?.experience_years && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ประสบการณ์ {applicantProfile.experience_years} ปี
                    </Badge>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleEditProfile}
              >
                <Edit className="w-4 h-4 mr-2" />
                แก้ไขโปรไฟล์
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">ใบสมัครทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats.applications}</p>
                  <p className="text-blue-100 text-xs mt-1">งานที่สมัคร</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                  <FileText className="h-8 w-8 text-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">รอการตอบรับ</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                  <p className="text-yellow-100 text-xs mt-1">รอพิจารณา</p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-yellow-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">ได้รับการอนุมัติ</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                  <p className="text-green-100 text-xs mt-1">งานที่ผ่าน</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                  <Briefcase className="h-8 w-8 text-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">ไม่ได้รับการคัดเลือก</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                  <p className="text-red-100 text-xs mt-1">งานที่ไม่ผ่าน</p>
                </div>
                <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
                  <User className="h-8 w-8 text-red-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-blue-100 shadow-sm">
            <TabsTrigger value="applications" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              ใบสมัครของฉัน
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              งานที่เปิดรับสมัคร
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card className="border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-800">
                  <FileText className="w-5 h-5 mr-2" />
                  ใบสมัครของฉัน ({applications?.length || 0} ใบสมัคร)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {applicationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">กำลังโหลดใบสมัคร...</p>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">ตำแหน่งงาน</TableHead>
                          <TableHead className="font-semibold">บริษัท</TableHead>
                          <TableHead className="font-semibold">สถานะ</TableHead>
                          <TableHead className="font-semibold">วันที่สมัคร</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id} className="hover:bg-blue-50">
                            <TableCell className="font-medium">{application.job_title}</TableCell>
                            <TableCell>{application.company_name}</TableCell>
                            <TableCell>
                              <Badge variant={
                                application.status === 'approved' ? 'default' :
                                application.status === 'rejected' ? 'destructive' : 'secondary'
                              }>
                                {application.status === 'approved' ? 'อนุมัติ' :
                                 application.status === 'rejected' ? 'ปฏิเสธ' : 'รอการตอบรับ'}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(application.created_at).toLocaleDateString('th-TH')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">ยังไม่มีใบสมัครงาน</p>
                    <p className="text-gray-400 text-sm">เริ่มต้นโดยการสมัครงานในตำแหน่งที่คุณสนใจ</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="border-blue-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-blue-800">
                  <Briefcase className="w-5 h-5 mr-2" />
                  งานที่เปิดรับสมัคร ({availableJobs?.length || 0} ตำแหน่ง)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {jobsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">กำลังโหลดงาน...</p>
                  </div>
                ) : availableJobs && availableJobs.length > 0 ? (
                  <div className="grid gap-4">
                    {availableJobs.map((job) => (
                      <div key={job.id} className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                          <Badge variant="outline" className="text-green-700 border-green-200">
                            {job.salary}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{job.company_name}</p>
                        <p className="text-sm text-gray-500 mb-3">{job.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            onClick={() => handleApplyToJob(job)}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            สมัครงาน
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">ไม่มีงานที่เปิดรับสมัคร</p>
                    <p className="text-gray-400 text-sm">โปรดติดตามในภายหลัง</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
      />
    </div>
  );
}
