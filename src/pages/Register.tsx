
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านให้ตรงกัน",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "รหัสผ่านสั้นเกินไป",
        description: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        variant: "destructive",
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: "กรุณาเลือกประเภทผู้ใช้",
        description: "กรุณาระบุว่าคุณเป็นผู้ประกอบการหรือผู้สมัครงาน",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "กรุณากรอกชื่อ-นามสกุล",
        description: "ชื่อ-นามสกุลเป็นข้อมูลจำเป็น",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting registration form with data:', { 
        ...formData, 
        password: '[HIDDEN]' 
      });

      const result = await register({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });

      if (!result.error) {
        toast({
          title: "สมัครสมาชิกสำเร็จ",
          description: "ยินดีต้อนรับเข้าสู่ระบบ! กำลังนำคุณไปยังหน้าหลัก",
        });
        
        // Wait a moment then navigate
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        console.error('Registration error:', result.error);
        
        let errorMessage = "ไม่สามารถสมัครสมาชิกได้";
        
        if (result.error.message?.includes('User already registered')) {
          errorMessage = "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น";
        } else if (result.error.message?.includes('Password should be at least 6 characters')) {
          errorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
        } else if (result.error.message?.includes('Invalid email')) {
          errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
        } else if (result.error.message?.includes('signup is disabled')) {
          errorMessage = "ระบบปิดการสมัครสมาชิกชั่วคราว";
        }
        
        toast({
          title: "สมัครสมาชิกไม่สำเร็จ",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration catch error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสมัครสมาชิกได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-purple-800">งานพาร์ทไทม์มหาสารคาม</h1>
              <p className="text-sm text-purple-600">ระบบจัดหางานออนไลน์</p>
            </div>
          </Link>
        </div>

        <Card className="shadow-lg border-purple-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              สมัครสมาชิก
            </CardTitle>
            <p className="text-gray-600">สร้างบัญชีใหม่เพื่อเริ่มใช้งานระบบ</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  required
                  className="border-purple-200 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  required
                  className="border-purple-200 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="กรอกเบอร์โทรศัพท์"
                  className="border-purple-200 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="role">ประเภทผู้ใช้ *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="เลือกประเภทผู้ใช้" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applicant">ผู้สมัครงาน</SelectItem>
                    <SelectItem value="employer">ผู้ประกอบการ/นายจ้าง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">รหัสผ่าน *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    required
                    className="border-purple-200 focus:border-purple-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    required
                    className="border-purple-200 focus:border-purple-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="address">ที่อยู่</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="กรอกที่อยู่ของคุณ"
                  className="border-purple-200 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{" "}
                <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
