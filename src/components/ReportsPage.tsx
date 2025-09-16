
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, Briefcase, TrendingUp, Calendar, 
  FileText, Download, RefreshCw 
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // ดึงข้อมูลสถิติการสมัครงาน
  const { data: applicationStats } = useQuery({
    queryKey: ['application-stats', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs!inner(company_name, title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // ดึงข้อมูลสถิติงาน
  const { data: jobStats } = useQuery({
    queryKey: ['job-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // ดึงข้อมูลผู้ใช้
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, created_at');
      
      if (error) throw error;
      return profiles || [];
    }
  });

  // คำนวณสถิติ
  const totalApplications = applicationStats?.length || 0;
  const totalJobs = jobStats?.length || 0;
  const activeJobs = jobStats?.filter(job => job.is_active).length || 0;
  const totalUsers = userStats?.length || 0;
  const employers = userStats?.filter(user => user.role === 'employer').length || 0;
  const applicants = userStats?.filter(user => user.role === 'applicant').length || 0;

  // ข้อมูลสำหรับกราฟ
  const applicationStatusData = [
    { name: 'รอดำเนินการ', value: applicationStats?.filter(app => app.status === 'pending').length || 0, color: '#fbbf24' },
    { name: 'อนุมัติ', value: applicationStats?.filter(app => app.status === 'approved').length || 0, color: '#10b981' },
    { name: 'ปฏิเสธ', value: applicationStats?.filter(app => app.status === 'rejected').length || 0, color: '#ef4444' },
  ];

  const jobsByCompany = jobStats?.reduce((acc, job) => {
    const company = job.company_name;
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const companyJobData = Object.entries(jobsByCompany || {}).map(([company, count]) => ({
    company,
    jobs: count
  })).slice(0, 5);

  const monthlyApplications = applicationStats?.reduce((acc, app) => {
    const month = new Date(app.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyApplications || {}).map(([month, count]) => ({
    month,
    applications: count
  }));

  const generateReport = async (type: string) => {
    const reportData = {
      type,
      generated_at: new Date().toISOString(),
      total_applications: totalApplications,
      total_jobs: totalJobs,
      active_jobs: activeJobs,
      total_users: totalUsers,
      employers,
      applicants,
      application_status: applicationStatusData,
      jobs_by_company: companyJobData,
      monthly_applications: monthlyData
    };

    // สร้างและดาวน์โหลดไฟล์ PDF/Excel (จำลอง)
    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `รายงาน_${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">รายงานและสถิติ</h1>
          <p className="text-gray-600 mt-1">ภาพรวมการดำเนินงานของระบบ</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรช
          </Button>
          <Button
            onClick={() => generateReport('comprehensive')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลดรายงาน
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">ผู้ใช้ทั้งหมด</p>
                <p className="text-3xl font-bold text-blue-800">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">งานที่เปิดรับ</p>
                <p className="text-3xl font-bold text-green-800">{activeJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">ใบสมัครงาน</p>
                <p className="text-3xl font-bold text-yellow-800">{totalApplications}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">ผู้ประกอบการ</p>
                <p className="text-3xl font-bold text-purple-800">{employers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>สถานะใบสมัครงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jobs by Company Chart */}
        <Card>
          <CardHeader>
            <CardTitle>งานตามบริษัท (5 อันดับแรก)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyJobData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Applications Trend */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้มการสมัครงานรายเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>ใบสมัครงานล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ผู้สมัคร</th>
                  <th className="px-6 py-3">ตำแหน่ง</th>
                  <th className="px-6 py-3">บริษัท</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3">วันที่สมัคร</th>
                </tr>
              </thead>
              <tbody>
                {applicationStats?.slice(0, 10).map((app) => (
                  <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{app.applicant_name}</td>
                    <td className="px-6 py-4">{app.job_title}</td>
                    <td className="px-6 py-4">{app.company_name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        app.status === 'approved' ? 'default' :
                        app.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {app.status === 'approved' ? 'อนุมัติ' :
                         app.status === 'rejected' ? 'ปฏิเสธ' : 'รอดำเนินการ'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.created_at).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
