
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Star, TrendingUp, Plus, Eye, Building2, LogOut, Camera, Edit, Settings } from 'lucide-react';
import CreateJobForm from '@/components/forms/CreateJobForm';
import EditJobForm from '@/components/forms/EditJobForm';
import JobDetailModal from '@/components/JobDetailModal';
import CreateCompanyForm from '@/components/forms/CreateCompanyForm';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);

  console.log('EmployerDashboard - User:', user);

  // Fetch company data with better error handling
  const { data: company, isLoading: companyLoading, refetch: refetchCompany } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID for company fetch');
        return null;
      }
      
      console.log('Fetching company for user:', user.id);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company:', error);
        // Don't throw error, just return null to show company creation form
        return null;
      }
      
      console.log('Company data:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry to avoid infinite loops
  });

  // Fetch employer jobs only when we have company data
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs', company?.id],
    queryFn: async () => {
      if (!company?.id) {
        console.log('No company ID for jobs fetch');
        return [];
      }
      
      console.log('Fetching jobs for company:', company.id);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
      
      console.log('Jobs data:', data);
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch job applications only when we have jobs
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['employer-applications', jobs?.map(j => j.id)],
    queryFn: async () => {
      if (!jobs || jobs.length === 0) {
        console.log('No jobs for applications fetch');
        return [];
      }
      
      const jobIds = jobs.map(job => job.id);
      console.log('Fetching applications for jobs:', jobIds);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
      
      console.log('Applications data:', data);
      return data || [];
    },
    enabled: jobs && jobs.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const updateCompanyLogo = useMutation({
    mutationFn: async (logoUrl: string) => {
      if (!company?.id) throw new Error('No company found');
      
      const { error } = await supabase
        .from('companies')
        .update({ logo: logoUrl })
        .eq('id', company.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      setIsEditingLogo(false);
      toast({
        title: "อัปเดตโลโก้สำเร็จ",
        description: "โลโก้บริษัทได้รับการอัปเดตแล้ว",
      });
    },
    onError: (error) => {
      console.error('Error updating company logo:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตโลโก้ได้",
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = (url: string) => {
    updateCompanyLogo.mutate(url);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถออกจากระบบได้",
        variant: "destructive",
      });
    }
  };

  const handleCompanyCreated = () => {
    console.log('Company created successfully, refetching data...');
    refetchCompany();
    queryClient.invalidateQueries({ queryKey: ['company'] });
    setIsCreateCompanyOpen(false);
  };

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const { error } = await supabase
        .from('job_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: "สถานะใบสมัครงานได้รับการอัปเดตแล้ว",
      });
    },
    onError: (error) => {
      console.error('Error updating application status:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (applicationId: string, status: string) => {
    updateApplicationStatus.mutate({ applicationId, status });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติ';
      case 'rejected': return 'ปฏิเสธ';
      case 'pending': return 'รอพิจารณา';
      default: return status;
    }
  };

  // Show loading for critical data only
  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">กำลังโหลดข้อมูลบริษัท...</div>
        </div>
      </div>
    );
  }

  // Show company creation form if no company exists
  if (!company && !companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with logout button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">ระบบนายจ้าง</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
          </div>

          <Card className="text-center p-8">
            <CardHeader>
              <Building2 className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <CardTitle className="text-2xl mb-2">ยินดีต้อนรับสู่ระบบนายจ้าง</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                เพื่อเริ่มใช้งานระบบ กรุณาสร้างข้อมูลบริษัทของคุณก่อน
              </p>
              <Button 
                onClick={() => setIsCreateCompanyOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                สร้างข้อมูลบริษัท
              </Button>
            </CardContent>
          </Card>
        </div>

        <CreateCompanyForm
          open={isCreateCompanyOpen}
          onOpenChange={setIsCreateCompanyOpen}
          onSuccess={handleCompanyCreated}
        />
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with company info and logout */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-6">
                {/* Company Logo */}
                <div className="relative">
                  {company?.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <Button
                    onClick={() => setIsEditingLogo(!isEditingLogo)}
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white border-purple-300 hover:bg-purple-50"
                  >
                    <Camera className="w-4 h-4 text-purple-600" />
                  </Button>
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    แดชบอร์ดนายจ้าง
                  </h1>
                  <p className="text-gray-600">
                    ยินดีต้อนรับ, {company?.name || 'ผู้ประกอบการ'}
                  </p>
                  {company && !company.is_approved && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">
                        <strong>หมายเหตุ:</strong> บริษัทของคุณยังไม่ได้รับการอนุมัติ กรุณารอการอนุมัติจากผู้ดูแลระบบก่อนประกาศงาน
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>

            {/* Logo Upload Section */}
            {isEditingLogo && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">อัปเดตโลโก้บริษัท</h3>
                <FileUpload
                  bucket="profile-images"
                  accept="image/*"
                  label="เลือกรูปภาพโลโก้"
                  currentFile={company?.logo}
                  onUploadSuccess={handleLogoUpload}
                  maxSize={2}
                />
                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={() => setIsEditingLogo(false)}
                    variant="outline"
                    size="sm"
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">งานทั้งหมด</p>
                    <p className="text-3xl font-bold text-foreground">{jobs.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">งานที่เปิดรับ</p>
                    <p className="text-3xl font-bold text-foreground">{jobs.filter(job => job.is_active).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ใบสมัครทั้งหมด</p>
                    <p className="text-3xl font-bold text-foreground">{applications.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">รอพิจารณา</p>
                    <p className="text-3xl font-bold text-foreground">{applications.filter(app => app.status === 'pending').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Jobs Section */}
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">งานของคุณ</CardTitle>
                <Button
                  onClick={() => setIsCreateJobOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                  disabled={!company?.is_approved}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มงานใหม่
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {jobsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-muted-foreground">กำลังโหลดงาน...</p>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">ยังไม่มีงานที่ประกาศ</p>
                      {company?.is_approved && (
                        <Button
                          onClick={() => setIsCreateJobOpen(true)}
                          variant="outline"
                          className="hover:bg-primary/10 hover:border-primary/50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          เพิ่มงานแรก
                        </Button>
                      )}
                    </div>
                  ) : (
                     jobs.slice(0, 5).map((job) => (
                       <div key={job.id} className="bg-gradient-to-r from-card to-card/95 border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                         <div className="flex items-center justify-between">
                           <div className="flex-1">
                             <h4 className="font-medium text-foreground mb-1">{job.title}</h4>
                             <p className="text-sm text-muted-foreground mb-2">📍 {job.location}</p>
                             {job.district && (
                               <p className="text-xs text-muted-foreground mb-3">🏛️ อำเภอ{job.district}</p>
                             )}
                             <div className="flex items-center space-x-2">
                               <Badge variant={job.is_active ? "default" : "secondary"} className="text-xs">
                                 {job.is_active ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                               </Badge>
                               <Badge variant={job.is_approved ? "default" : "secondary"} className="text-xs">
                                 {job.is_approved ? "อนุมัติแล้ว" : "รอการอนุมัติ"}
                               </Badge>
                             </div>
                           </div>
                           <div className="flex items-center space-x-2 ml-4">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setSelectedJob(job)}
                               className="hover:bg-primary/10 hover:border-primary/50 transition-colors"
                             >
                               <Eye className="w-4 h-4 mr-1" />
                               ดู
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 setSelectedJob(job);
                                 setIsEditJobOpen(true);
                               }}
                               className="hover:bg-accent hover:border-accent-foreground/50 transition-colors"
                             >
                               <Edit className="w-4 h-4 mr-1" />
                               แก้ไข
                             </Button>
                           </div>
                         </div>
                       </div>
                     ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Applications Section */}
            <Card className="bg-gradient-to-br from-card to-card/95 border-0 shadow-lg">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">ใบสมัครงานล่าสุด</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-muted-foreground">กำลังโหลดใบสมัคร...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">ยังไม่มีใบสมัครงาน</p>
                    </div>
                  ) : (
                    applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="bg-gradient-to-r from-card to-card/95 border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{application.applicant_name}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{application.job_title}</p>
                            <p className="text-xs text-muted-foreground">{application.applicant_email}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(application.status)} className="ml-2">
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                        
                        {application.status === 'pending' && (
                          <div className="flex space-x-2 mt-3 pt-3 border-t border-border/30">
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(application.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            >
                              ✓ อนุมัติ
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="text-red-600 border-red-300 hover:bg-red-50 flex-1"
                            >
                              ✗ ปฏิเสธ
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <CreateJobForm
          open={isCreateJobOpen}
          onOpenChange={setIsCreateJobOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
          }}
        />

        <EditJobForm
          open={isEditJobOpen}
          onOpenChange={setIsEditJobOpen}
          job={selectedJob}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
            setIsEditJobOpen(false);
            setSelectedJob(null);
          }}
        />

        {selectedJob && !isEditJobOpen && (
          <JobDetailModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
}
