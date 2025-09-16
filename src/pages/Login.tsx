
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, ArrowLeft, Shield, User, Briefcase } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User already logged in, redirecting...');
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกอีเมลและรหัสผ่าน",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log('Submitting login form...');

    try {
      const { error } = await login(email, password);
      
      if (error) {
        console.error('Login failed:', error);
        
        let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        let errorTitle = "ไม่สามารถเข้าสู่ระบบได้";
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง";
          errorTitle = "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง";
        } else if (error.message === 'Email not confirmed') {
          errorMessage = "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ";
          errorTitle = "ยังไม่ได้ยืนยันอีเมล";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่";
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login successful');
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับเข้าสู่ระบบ",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (userType: 'admin' | 'employer' | 'applicant') => {
    setLoading(true);
    console.log(`Logging in as test ${userType}...`);

    // Create mock session for test users
    const mockUsers = {
      admin: {
        id: 'admin-user-id-12345678-1234-5678-9012-123456789012',
        name: 'ผู้ดูแลระบบ',
        email: 'admin@example.com',
        role: 'admin',
        phone: '0123456789',
        address: 'ระบบจัดการ'
      },
      employer: {
        id: 'test-employer-id-11111111-2222-3333-4444-555555555555',
        name: 'นายจ้างทดสอบ',
        email: 'employer@test.com',
        role: 'employer',
        phone: '0111222333',
        address: 'บริษัททดสอบ'
      },
      applicant: {
        id: 'test-applicant-id-99999999-8888-7777-6666-555555555555',
        name: 'ผู้สมัครทดสอบ',
        email: 'applicant@test.com',
        role: 'applicant',
        phone: '0999888777',
        address: 'ที่อยู่ทดสอบ'
      }
    };

    try {
      const mockUser = mockUsers[userType];
      
      // Set user data in localStorage to simulate login
      localStorage.setItem('testUser', JSON.stringify(mockUser));
      
      // Trigger auth context update by dispatching custom event
      window.dispatchEvent(new Event('testUserLogin'));
      
      toast({
        title: `เข้าสู่ระบบ${userType === 'admin' ? 'แอดมิน' : userType === 'employer' ? 'นายจ้าง' : 'ผู้สมัครงาน'}สำเร็จ`,
        description: "กำลังนำไปยังหน้าแดชบอร์ด...",
      });

      // Redirect immediately
      navigate('/dashboard');

    } catch (error) {
      console.error(`Test ${userType} login error:`, error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถเข้าสู่ระบบ${userType}ได้`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication state
  if (isLoading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-primary-muted via-white to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
          <p className="mt-1 text-sm text-muted-foreground/70">หากใช้เวลานานเกินไป กรุณารีโหลดหน้าเว็บ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-muted via-background to-primary-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </Link>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              เข้าสู่ระบบ
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              เข้าสู่ระบบเพื่อใช้งานแพลตฟอร์มหางานพาร์ทไทม์
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="กรุณาใส่อีเมลของคุณ"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรุณาใส่รหัสผ่านของคุณ"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90 text-white shadow-lg"
                disabled={loading}
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">หรือเข้าสู่ระบบทดสอบ</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 text-primary font-semibold"
                onClick={() => handleTestLogin('admin')}
                disabled={loading}
              >
                <Shield className="w-4 h-4 mr-2" />
                เข้าสู่ระบบแอดมิน (ทดสอบ)
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 text-primary font-semibold"
                onClick={() => handleTestLogin('employer')}
                disabled={loading}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                เข้าสู่ระบบนายจ้าง (ทดสอบ)
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 text-primary font-semibold"
                onClick={() => handleTestLogin('applicant')}
                disabled={loading}
              >
                <User className="w-4 h-4 mr-2" />
                เข้าสู่ระบบผู้สมัครงาน (ทดสอบ)
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ยังไม่มีบัญชี?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/80 hover:underline"
                >
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
