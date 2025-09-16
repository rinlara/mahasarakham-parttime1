import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import JobCard from '@/components/JobCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Coffee, 
  Store, 
  GraduationCap, 
  Car, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
  Heart
} from 'lucide-react';

export default function Index() {
  const { jobs, companies } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Fetch fresh job data for homepage
  const { data: freshJobs } = useQuery({
    queryKey: ['homepage-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: recentApplications } = useQuery({
    queryKey: ['recent-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      if (error) throw error;
      return data?.length || 0;
    }
  });

  const displayJobs = freshJobs || jobs.filter(job => job.is_active && job.is_approved);
  const featuredJobs = displayJobs.slice(0, 6);
  
  const stats = {
    totalJobs: displayJobs.length,
    totalCompanies: companies.filter(company => company.isApproved).length,
    newJobsThisWeek: displayJobs.filter(job => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(job.created_at) > weekAgo;
    }).length,
    activeApplicants: 1250 + (recentApplications || 0)
  };

  const districts = [
    'ทุกอำเภอ', 'เมืองมหาสารคาม', 'แกดำ', 'โกสุมพิสัย', 'กันทรวิชัย', 'เชียงยืน', 
    'บรบือ', 'นาเชือก', 'พยัคฆภูมิพิสัย', 'วาปีปทุม', 'นาดูน', 'ยางสีสุราช', 'กุดรัง', 'ชื่นชม'
  ];

  const jobCategories = [
    { name: 'ร้านอาหาร', icon: Coffee, count: displayJobs.filter(job => job.title.includes('อาหาร') || job.description.includes('อาหาร')).length || 45, color: 'bg-orange-100 text-orange-700' },
    { name: 'ร้านค้า', icon: Store, count: displayJobs.filter(job => job.title.includes('ร้าน') || job.title.includes('ขาย')).length || 32, color: 'bg-blue-100 text-blue-700' },
    { name: 'การศึกษา', icon: GraduationCap, count: displayJobs.filter(job => job.title.includes('สอน') || job.title.includes('ติว')).length || 18, color: 'bg-green-100 text-green-700' },
    { name: 'ขนส่ง', icon: Car, count: displayJobs.filter(job => job.title.includes('ขนส่ง') || job.title.includes('จัดส่ง') || job.title.includes('ส่งของ')).length || 25, color: 'bg-purple-100 text-purple-700' }
  ];

  const handleQuickSearch = () => {
    let query = '';
    if (quickSearch.trim()) {
      query += `search=${encodeURIComponent(quickSearch)}`;
    }
    if (selectedDistrict && selectedDistrict !== 'ทุกอำเภอ') {
      query += query ? '&' : '';
      query += `district=${encodeURIComponent(selectedDistrict)}`;
    }
    navigate(`/jobs${query ? '?' + query : ''}`);
  };

  const testimonials = [
    {
      name: "นางสาวพิมพ์ชนก",
      role: "นักศึกษามหาวิทยาลัย",
      content: "หางานพาร์ทไทม์ได้ง่ายมาก เพียงไม่กี่คลิกก็สามารถสมัครงานได้เลย",
      rating: 5
    },
    {
      name: "คุณสมชาย",
      role: "เจ้าของร้านอาหาร",
      content: "ได้พนักงานที่ดีและมีคุณภาพผ่านระบบนี้ ช่วยประหยัดเวลาในการคัดเลือกมาก",
      rating: 5
    },
    {
      name: "นางสาวอรทัย",
      role: "พนักงานพาร์ทไทม์",
      content: "ระบบใช้งานง่าย ข้อมูลครบถ้วน และได้งานที่ใช่ตรงตามที่ต้องการ",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-muted/20 to-background">
      {/* Header removed - now handled by AppLayout */}
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary-muted)_0%,_transparent_70%)]"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img 
                  src="/logo2.png" 
                  alt="Part-Time Mahasarakham Logo"
                  className="w-40 h-40 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
             <h1 className="text-6xl md:text-7xl font-black text-foreground mb-8 animate-fade-in leading-tight">
               <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">หางานพาร์ทไทม์</span>
               <br />
               <span className="text-3xl md:text-4xl font-semibold text-muted-foreground">ระบบจัดหางานออนไลน์มหาสารคาม</span>
             </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              เชื่อมโยงผู้ประกอบการและผู้หางานด้วยเทคโนโลยีที่ทันสมัย<br />
              <span className="text-primary font-semibold">ระบบจัดหางานที่เชื่อถือได้</span> พร้อมโอกาสทำงานที่หลากหลาย
            </p>
            
            {/* Quick Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-primary/20 hover:shadow-3xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="ค้นหางานที่ต้องการ... เช่น พนักงานร้านอาหาร, ติวเตอร์"
                      value={quickSearch}
                      onChange={(e) => setQuickSearch(e.target.value)}
                      className="h-14 text-lg border-2 border-primary/20 focus:border-primary"
                      onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                    />
                  </div>
                  <div className="md:w-48">
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full h-14 px-4 border-2 border-primary/20 rounded-md focus:border-primary text-lg bg-white"
                    >
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleQuickSearch}
                    className="h-14 px-8 bg-gradient-to-r from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90 font-semibold text-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    ค้นหา
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90 text-lg px-10 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/jobs')}
              >
                <Search className="w-6 h-6 mr-3" />
                เริ่มหางานเลย
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-4 h-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(user ? '/employer/dashboard' : '/register')}
              >
                <Briefcase className="w-6 h-6 mr-3" />
                ลงประกาศรับสมัครงาน
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-sky-100 via-blue-50 to-sky-50 border-2 border-sky-200 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 mb-12">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-sky-700 mb-2 drop-shadow">
                🚀 พื้นที่โฆษณา/โปรโมทงานของคุณ!
              </h3>
              <p className="text-lg md:text-xl text-sky-800 mb-4">
                ให้ธุรกิจของคุณเป็นที่รู้จักในกลุ่มผู้หางานและนักศึกษา<br />
                <span className="font-bold text-blue-600">ลงโฆษณา/โปรโมทงาน</span> กับเราในราคาพิเศษ
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
                onClick={() => navigate('/ads-contact')}
              >
                ติดต่อโฆษณา
              </Button>
            </div>
            <div className="flex-1 flex justify-center mt-8 md:mt-0">
              <img
                src="/ads_banner_blue.svg"
                alt="โฆษณา โปรโมทงาน"
                className="w-72 h-44 object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              หมวดหมู่<span className="text-primary">งานยอดนิยม</span>
            </h2>
            <p className="text-xl text-muted-foreground">เลือกประเภทงานที่เหมาะกับคุณ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {jobCategories.map((category, index) => (
              <Card 
                key={category.name}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{category.name}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                    {category.count} ตำแหน่ง
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-card via-background to-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ข้อมูล<span className="text-primary">สถิติ</span>
            </h2>
            <p className="text-xl text-muted-foreground">ตัวเลขที่พิสูจน์ความน่าเชื่อถือของเรา</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-background">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Briefcase className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  {stats.totalJobs}+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-muted-foreground">ตำแหน่งงานที่เปิดรับสมัคร</p>
                <p className="text-sm text-muted-foreground/70 mt-2">งานคุณภาพจากนายจ้างที่ผ่านการตรวจสอบ</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-background">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  {stats.totalCompanies}+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-muted-foreground">บริษัทและร้านค้าพาร์ทเนอร์</p>
                <p className="text-sm text-muted-foreground/70 mt-2">องค์กรชั้นนำที่ไว้วางใจในบริการของเรา</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-background">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <TrendingUp className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  {stats.newJobsThisWeek}+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-muted-foreground">งานใหม่ในสัปดาห์นี้</p>
                <p className="text-sm text-muted-foreground/70 mt-2">อัปเดตโอกาสใหม่ๆ ทุกวัน</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-card to-background">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Award className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  {stats.activeApplicants}+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-muted-foreground">ผู้สมัครงานใช้งานระบบ</p>
                <p className="text-sm text-muted-foreground/70 mt-2">ชุมชนผู้หางานที่กำลังเติบโต</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              วิธีการ<span className="text-primary">ใช้งาน</span>
            </h2>
            <p className="text-xl text-muted-foreground">เริ่มต้นหางานหรือลงประกาศในไม่กี่ขั้นตอน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-black text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">สมัครสมาชิก</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                ลงทะเบียนเพื่อเข้าใช้งานระบบ เลือกประเภทผู้ใช้งาน ผู้หางานหรือผู้ประกอบการ
              </p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-black text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">ค้นหางาน / ลงประกาศ</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                ค้นหาและสมัครงานที่ใช่ หรือลงประกาศรับสมัครพนักงานตามความต้องการ
              </p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-black text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">เริ่มทำงาน</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                เริ่มต้นการทำงานเมื่อได้รับการติดต่อจากนายจ้าง หรือติดต่อผู้สมัครงาน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              งานพาร์ทไทม์<span className="text-primary">แนะนำ</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              ตำแหน่งงานยอดนิยมที่เปิดรับสมัครในขณะนี้
            </p>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-xl font-medium">ยังไม่มีงานที่เปิดรับสมัครในขณะนี้</p>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/jobs')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-10 py-4 h-auto text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              ดูงานทั้งหมด
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-muted/50 via-background to-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              เสียง<span className="text-primary">ผู้ใช้งาน</span>
            </h2>
            <p className="text-xl text-muted-foreground">ความคิดเห็นจากผู้ใช้งานจริง</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary via-accent-foreground to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent-foreground/95"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto text-primary-foreground">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Heart className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              พร้อมเริ่มต้นการทำงานแล้วหรือยัง?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 font-medium leading-relaxed">
              เข้าร่วมกับเราวันนี้ และค้นพบโอกาสทำงานใหม่ๆ<br />
              <span className="font-bold">ในจังหวัดมหาสารคาม</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-4 h-auto font-bold shadow-2xl hover:shadow-primary-foreground/25 transition-all duration-300 transform hover:scale-105 rounded-xl group"
                onClick={() => navigate('/register')}
              >
                <CheckCircle className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                สมัครสมาชิกฟรี
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-4 h-auto border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group"
                onClick={() => navigate('/jobs')}
              >
                เริ่มหางาน
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>ใช้งานฟรี 100%</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>ไม่มีค่าธรรมเนียมซ่อน</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>ปลอดภัยและเชื่อถือได้</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-card py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-black text-lg bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">งานพาร์ทไทม์มหาสารคาม</h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ระบบจัดหางานพาร์ทไทม์ที่เชื่อมโยงผู้ประกอบการและผู้หางานในจังหวัดมหาสารคาม ด้วยเทคโนโลยีที่ทันสมัย
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-card">สำหรับผู้หางาน</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary transition-colors font-medium">ค้นหางาน</Link></li>
                <li><Link to="/companies" className="hover:text-primary transition-colors font-medium">บริษัท/ร้านค้า</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors font-medium">สมัครสมาชิก</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-card">สำหรับผู้ประกอบการ</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/register" className="hover:text-primary transition-colors font-medium">ลงทะเบียนธุรกิจ</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors font-medium">ลงประกาศงาน</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors font-medium">จัดการใบสมัคร</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg text-card">ติดต่อเรา</h4>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium">อำเภอเมือง จังหวัดมหาสารคาม</p>
                <p className="font-medium">โทร: 043-123-456</p>
                <p className="font-medium">อีเมล: info@jobsmsk.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground/20 mt-12 pt-8 text-center text-muted-foreground">
            <p className="font-medium">&copy; 2024 งานพาร์ทไทม์มหาสารคาม. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
