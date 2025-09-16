import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import AdvertisementBanner from '@/components/AdvertisementBanner';

export default function Profile() {
  const { user, isLoading, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profile_image: user?.profile_image || '',
    birthday: user?.birthday || '',
    gender: user?.gender || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profile_image: formData.profile_image,
        birthday: formData.birthday,
        gender: formData.gender
      })
      .eq('id', user?.id);

    if (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดทโปรไฟล์ได้",
        variant: "destructive"
      });
    } else {
      toast({
        title: "อัปเดทสำเร็จ",
        description: "โปรไฟล์ของคุณถูกอัปเดทแล้ว"
      });
      setIsEditing(false);
      updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profile_image: formData.profile_image,
        birthday: formData.birthday,
        gender: formData.gender
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, profile_image: url }));
  };

  const handleResumeUpload = (url: string) => {
    setFormData(prev => ({ ...prev, resume_url: url }));
  };

  if (isLoading) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-blue-50/30 to-sky-50/20">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-sky-50/20">
    
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">โปรไฟล์ของฉัน</h1>
            <p className="text-muted-foreground text-lg">จัดการข้อมูลส่วนตัวและอัปเดทโปรไฟล์ของคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
                  <CardTitle className="text-xl">ข้อมูลส่วนตัว</CardTitle>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      if (isEditing) {
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          profile_image: user?.profile_image || '',
                          birthday: user?.birthday || '',
                          gender: user?.gender || ''
                        });
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    {isEditing ? 'ยกเลิก' : 'แก้ไข'}
                  </Button>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center space-y-6 mb-8">
                      <Avatar className="w-32 h-32 border-4 border-purple-200 shadow-lg">
                        <AvatarImage src={formData.profile_image} alt="Profile" />
                        <AvatarFallback className="text-3xl bg-purple-100 text-purple-700">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {isEditing && (
                        <div className="w-full max-w-md">
                          <FileUpload
                            bucket="profile-images"
                            accept="image/*"
                            label="อัปโหลดรูปโปรไฟล์"
                            currentFile={formData.profile_image}
                            onUploadSuccess={handleProfileImageUpload}
                            maxSize={2}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">ชื่อ-นามสกุล</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className={`mt-2 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-foreground font-medium">อีเมล</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="bg-muted mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">ไม่สามารถแก้ไขอีเมลได้</p>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-foreground font-medium">เบอร์โทรศัพท์</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className={`mt-2 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role" className="text-foreground font-medium">ประเภทผู้ใช้</Label>
                        <Input
                          id="role"
                          value={
                            user.role === 'admin' ? 'ผู้ดูแลระบบ' :
                            user.role === 'employer' ? 'ผู้ประกอบการ' : 'ผู้สมัครงาน'
                          }
                          disabled
                          className="bg-muted mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-foreground font-medium">ที่อยู่</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className={`mt-2 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        rows={3}
                      />
                    </div>

                    {/* New Fields for Birthday and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="birthday" className="text-foreground font-medium">วันเกิด</Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={(e) => handleInputChange('birthday', e.target.value)}
                          disabled={!isEditing}
                          className={`mt-2 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-foreground font-medium">เพศ</Label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          disabled={!isEditing}
                          className={`mt-2 w-full rounded border px-3 py-2 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                        >
                          <option value="">เลือกเพศ</option>
                          <option value="male">ชาย</option>
                          <option value="female">หญิง</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                      </div>
                    </div>

                    {/* Resume Upload for Applicants */}
                    {user.role === 'applicant' && isEditing && (
                      <div>
                        <FileUpload
                          bucket="resumes"
                          accept=".pdf,.doc,.docx"
                          label="อัปโหลดเรซูเม่"
                          currentFile={formData.resume_url}
                          onUploadSuccess={handleResumeUpload}
                          maxSize={10}
                        />
                      </div>
                    )}

                    {isEditing && (
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg">
                        บันทึกการเปลี่ยนแปลง
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

              {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
                  <CardTitle className="text-lg">ข้อมูลบัญชี</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">รหัสผู้ใช้:</span>
                      <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                        {user.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">วันที่สมัครสมาชิก:</span>
                      <span className="font-medium text-foreground">
                        {new Date(user.created_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">อัปเดตล่าสุด:</span>
                      <span className="font-medium text-foreground">
                        {new Date(user.updated_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">สถานะบัญชี:</span>
                      <span className="font-medium text-green-600">ใช้งานได้</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// สามารถเพิ่มฟังก์ชันนี้ใน Profile.tsx หรือไฟล์ util ที่ต้องการ
async function updateProfileExample() {
  const userId = "831df852-49eb-4db4-9378-02d8d015c46f";

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: "พงศ์ปณต ไทยชัยภูมิ",
      phone: "0624754600",
      address: "52/2 บ.คอนสาร ต.วังแสง อ.แกดำ จ.มหาสารคาม"
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
  } else {
    console.log("Updated profile:", data);
  }
}
