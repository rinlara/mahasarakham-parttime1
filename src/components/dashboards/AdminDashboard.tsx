import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Building, Briefcase, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // --- Profiles (used to detect admin role) ---
  const { data: profiles, refetch: refetchProfiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      console.log('Fetching profiles as admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      console.log('Profiles data:', data);
      return data || [];
    },
    // only fetch profiles if we have a logged in user
    enabled: !!user
  });

  // determine if current user is admin
  const isAdmin = useMemo(() => {
    if (!user) return false;
    // prefer role on profiles table (if you store role there)
    const p = profiles?.find((pr: any) => pr.id === user.id);
    if (p && p.role) return p.role === 'admin';
    // fallback to user.role (if you store role on the auth user object)
    // adjust this if your project stores role somewhere else
    // @ts-ignore
    return (user.role && user.role === 'admin') || false;
  }, [user, profiles]);

  // --- Companies (admin view) ---
  const { data: companies, refetch: refetchCompanies } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      console.log('Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      console.log('Companies data:', data);
      return data || [];
    },
    enabled: !!user && isAdmin // only fetch for admin users
  });

  // --- All jobs (admin view) ---
  const { data: jobs, refetch: refetchJobs } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      console.log('Fetching jobs (admin)...');
      // if you need company name to be joined, you can change select to join companies:
      // .select('*, companies(name)')
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      console.log('Jobs data:', data);
      return data || [];
    },
    enabled: !!user && isAdmin
  });

  // --- Pending jobs only ---
  const { data: pendingJobs, refetch: refetchPendingJobs } = useQuery({
    queryKey: ['admin-pending-jobs'],
    queryFn: async () => {
      console.log('Fetching pending jobs...');
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending jobs:', error);
        throw error;
      }
      console.log('Pending jobs data:', data);
      return data || [];
    },
    enabled: !!user && isAdmin
  });

  // --- Handlers ---
  const handleApproveCompany = async (companyId: string) => {
    console.log('Approving company:', companyId);
    const { data, error } = await supabase
      .from('companies')
      .update({ is_approved: true })
      .eq('id', companyId)
      .select(); // return updated row

    if (error) {
      console.error('Error approving company:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอนุมัติร้านได้",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "อนุมัติสำเร็จ",
      description: "อนุมัติร้านเรียบร้อยแล้ว"
    });

    // refetch relevant data
    await Promise.all([refetchCompanies(), refetchPendingJobs(), refetchJobs()]);
    console.log('Company approved, updated rows:', data);
  };

  const handleApproveJob = async (jobId: string) => {
    console.log('Approving job:', jobId);
    const { data, error } = await supabase
      .from('jobs')
      .update({ is_approved: true })
      .eq('id', jobId)
      .select();

    if (error) {
      console.error('Error approving job:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอนุมัติงานได้",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "อนุมัติสำเร็จ",
      description: "อนุมัติงานเรียบร้อยแล้ว"
    });

    // refetch relevant data
    await Promise.all([refetchPendingJobs(), refetchJobs(), refetchCompanies()]);
    console.log('Job approved, updated rows:', data);
  };

  const handleMakeAdmin = async (profileId: string, profileName: string) => {
    console.log('Making user admin:', profileId);
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', profileId)
      .select();

    if (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถกำหนดเป็นผู้ดูแลระบบได้",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "กำหนดสำเร็จ",
      description: `กำหนด ${profileName} เป็นผู้ดูแลระบบเรียบร้อยแล้ว`
    });
    refetchProfiles();
  };

  // --- Stats (safe guards if queries disabled) ---
  const stats = {
    totalUsers: profiles?.length || 0,
    totalCompanies: companies?.length || 0,
    totalJobs: jobs?.length || 0,
    pendingCompanies: companies?.filter((c: any) => !c.is_approved).length || 0,
    pendingJobs: jobs?.filter((j: any) => !j.is_approved).length || 0
  };

  // If current user is not admin, show message (prevent accidental 403 queries)
  if (!!user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">แดชบอร์ดผู้ดูแลระบบ</h1>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-gray-700 mb-4">คุณยังไม่มีสิทธิ์เข้าถึงแดชบอร์ดผู้ดูแลระบบ</p>
            <p className="text-sm text-gray-500">กรุณาตรวจสอบบัญชีว่ามี role = "admin" หรือขอสิทธิ์จากแอดมินระบบ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-gray-600">ยินดีต้อนรับ, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* สมาชิกทั้งหมด */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">สมาชิกทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          {/* ร้านทั้งหมด */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">ร้านทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats.totalCompanies}</p>
                </div>
                <Building className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          {/* งานทั้งหมด */}
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">งานทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats.totalJobs}</p>
                </div>
                <Briefcase className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          {/* รออนุมัติร้าน */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">ร้านรออนุมัติ</p>
                  <p className="text-3xl font-bold">{stats.pendingCompanies}</p>
                </div>
                <Settings className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          {/* งานรออนุมัติ */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">งานรออนุมัติ</p>
                  <p className="text-3xl font-bold">{stats.pendingJobs}</p>
                </div>
                <Briefcase className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">จัดการสมาชิก</TabsTrigger>
            <TabsTrigger value="companies">จัดการร้าน</TabsTrigger>
            <TabsTrigger value="jobs">จัดการงาน</TabsTrigger>
          </TabsList>

          {/* Members */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>รายชื่อสมาชิก ({profiles?.length || 0} คน)</CardTitle>
              </CardHeader>
              <CardContent>
                {profiles && profiles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ</TableHead>
                        <TableHead>อีเมล</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>เบอร์โทร</TableHead>
                        <TableHead>วันที่สมัคร</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile: any) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              profile.role === 'admin' ? 'destructive' :
                              profile.role === 'employer' ? 'default' : 'secondary'
                            }>
                              {profile.role === 'admin' ? 'ผู้ดูแลระบบ' :
                               profile.role === 'employer' ? 'ผู้ประกอบการ' : 'ผู้สมัครงาน'}
                            </Badge>
                          </TableCell>
                          <TableCell>{profile.phone || '-'}</TableCell>
                          <TableCell>{new Date(profile.created_at).toLocaleDateString('th-TH')}</TableCell>
                          <TableCell>
                            {profile.role !== 'admin' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleMakeAdmin(profile.id, profile.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                กำหนดเป็นแอดมิน
                              </Button>
                            )}
                            {profile.role === 'admin' && (
                              <Badge variant="destructive" className="text-xs">ผู้ดูแลระบบ</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลสมาชิก</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>จัดการร้าน ({companies?.length || 0} ร้าน)</CardTitle>
              </CardHeader>
              <CardContent>
                {companies && companies.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อร้าน</TableHead>
                        <TableHead>ที่อยู่</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>วันที่สร้าง</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company: any) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.address}</TableCell>
                          <TableCell>
                            <Badge variant={company.is_approved ? 'default' : 'secondary'}>
                              {company.is_approved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(company.created_at).toLocaleDateString('th-TH')}</TableCell>
                          <TableCell>
                            {!company.is_approved && (
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveCompany(company.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                อนุมัติ
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลร้าน</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>จัดการงาน ({jobs?.length || 0} ตำแหน่ง)</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingJobs && pendingJobs.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">งานรออนุมัติ ({pendingJobs.length})</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ตำแหน่งงาน</TableHead>
                          <TableHead>ร้าน</TableHead>
                          <TableHead>ค่าแรง/ชั่วโมง</TableHead>
                          <TableHead>วันปิดรับ</TableHead>
                          <TableHead>การจัดการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingJobs.map((job: any) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company_name || job.company_id}</TableCell>
                            <TableCell className="text-green-600 font-semibold">
                              {job.salary_per_hour ? `${job.salary_per_hour} บาท/ชั่วโมง` : job.salary}
                            </TableCell>
                            <TableCell>
                              {job.application_deadline
                                ? format(new Date(job.application_deadline), 'dd MMM yyyy', { locale: th })
                                : <span className="text-gray-400">ไม่กำหนด</span>}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => handleApproveJob(job.id)} className="bg-green-600 hover:bg-green-700">
                                อนุมัติ
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">ไม่มีงานที่รออนุมัติ</div>
                )}

                {/* All jobs list */}
                {jobs && jobs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ตำแหน่งงาน</TableHead>
                        <TableHead>ร้าน</TableHead>
                        <TableHead>ค่าแรง/ชั่วโมง</TableHead>
                        <TableHead>วันเปิด-ปิดรับสมัคร</TableHead>
                        <TableHead>จำนวนรับ/สมัครแล้ว</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job: any) => {
                        const isExpired = job.application_deadline && new Date(job.application_deadline) < new Date();
                        const isFull = job.max_applicants && job.current_applicants && Number(job.current_applicants) >= Number(job.max_applicants);
                        const isInactive = !job.is_active || isExpired || isFull;

                        return (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company_name || job.company_id}</TableCell>
                            <TableCell className="text-green-600 font-semibold">
                              {job.salary_per_hour ? `${job.salary_per_hour} บาท/ชั่วโมง` : job.salary}
                            </TableCell>
                            <TableCell>
                              {job.application_deadline ? (
                                <div className="text-sm">
                                  <div>ปิดรับ: {format(new Date(job.application_deadline), 'dd MMM yyyy', { locale: th })}</div>
                                  {isExpired && <Badge variant="destructive" className="mt-1">หมดเขต</Badge>}
                                </div>
                              ) : (
                                <span className="text-gray-500">ไม่กำหนด</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{job.current_applicants || 0} / {job.max_applicants || '∞'}</div>
                                {isFull && <Badge variant="destructive" className="mt-1">เต็มแล้ว</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge variant={job.is_approved ? 'default' : 'secondary'}>
                                  {job.is_approved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                                </Badge>
                                {isInactive && (
                                  <Badge variant="destructive">
                                    {isExpired ? 'หมดเขต' : isFull ? 'เต็ม' : 'ปิด'}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {job.is_approved !== true && (
                                <Button size="sm" onClick={() => handleApproveJob(job.id)} className="bg-green-600 hover:bg-green-700">
                                  อนุมัติ
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลงาน</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
