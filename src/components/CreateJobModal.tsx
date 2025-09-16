
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    working_hours: '',
    location: 'มหาสารคาม',
    district: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const districts = [
    'เมืองมหาสารคาม', 'แกดำ', 'โกสุมพิสัย', 'กันทรวิชัย', 'เชียงยืน', 'บรบือ',
    'นาเชือก', 'พยัคฆภูมิพิสัย', 'วาปีปทุม', 'นาดูน', 'ยางสีสุราช', 'กุดรัง', 'ชื่นชม'
  ];

  // Fetch user's company data
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['user-company', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบก่อน",
        variant: "destructive",
      });
      return;
    }

    if (!company) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาสร้างข้อมูลบริษัทก่อนประกาศงาน",
        variant: "destructive",
      });
      return;
    }

    if (!company.is_approved) {
      toast({
        title: "ไม่สามารถประกาศงานได้",
        description: "บริษัทของคุณยังไม่ได้รับการอนุมัติ กรุณารอการอนุมัติจากผู้ดูแลระบบ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          company_id: company.id,
          company_name: company.name,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          salary: formData.salary,
          working_hours: formData.working_hours,
          location: formData.location,
          district: formData.district,
          is_approved: false, // Jobs need approval by default
          is_active: true
        });

      if (error) {
        throw error;
      }

      toast({
        title: "ประกาศงานสำเร็จ",
        description: "งานของคุณได้ถูกส่งเพื่อรอการอนุมัติแล้ว",
      });

      setFormData({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        working_hours: '',
        location: 'มหาสารคาม',
        district: ''
      });
      
      onJobCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถประกาศงานได้",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (companyLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">กำลังตรวจสอบข้อมูลบริษัท...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!company) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ไม่พบข้อมูลบริษัท</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-4">
              คุณต้องสร้างข้อมูลบริษัทก่อนจึงจะสามารถประกาศงานได้
            </p>
            <Button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700"
            >
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!company.is_approved) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รอการอนุมัติบริษัท</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-4">
              บริษัท "{company.name}" ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ<br/>
              กรุณารอการอนุมัติก่อนประกาศงาน
            </p>
            <Button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700"
            >
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-card/95 border-0 shadow-xl">
        <DialogHeader className="pb-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            ประกาศหางาน - {company.name}
          </DialogTitle>
          <p className="text-muted-foreground mt-2">กรอกข้อมูลตำแหน่งงานที่ต้องการประกาศ</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          {/* Job Information */}
          <div className="bg-accent/30 border border-accent rounded-lg p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">ข้อมูลตำแหน่งงาน</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  ชื่อตำแหน่งงาน *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="เช่น พนักงานขายพาร์ทไทม์"
                  className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium text-foreground">
                  เงินเดือน *
                </Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="เช่น 15,000-20,000 บาท/เดือน"
                  className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="working_hours" className="text-sm font-medium text-foreground">
                  เวลาทำงาน *
                </Label>
                <Input
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => handleInputChange('working_hours', e.target.value)}
                  placeholder="เช่น จันทร์-ศุกร์ 09:00-18:00"
                  className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-medium text-foreground">
                  อำเภอ *
                </Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger className="bg-background/70 border-border hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="เลือกอำเภอ" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        อำเภอ{district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground">
                สถานที่ทำงาน *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="เช่น ใกล้มหาวิทยาลัยมหาสารคาม"
                className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-muted/30 border border-muted rounded-lg p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">รายละเอียดงาน</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                รายละเอียดงาน *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="อธิบายลักษณะงานและความรับผิดชอบ"
                rows={3}
                className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium text-foreground">
                คุณสมบัติผู้สมัคร *
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="เช่น อายุ 18-35 ปี มีประสบการณ์ขาย"
                rows={3}
                className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border-border hover:bg-secondary/50 transition-colors"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.district}
              className="px-8 py-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังประกาศ...</span>
                </div>
              ) : (
                'ประกาศงาน'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
