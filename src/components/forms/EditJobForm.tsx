import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from '@/components/FileUpload';
import { Job } from '@/types';

interface EditJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  job: Job | null;
}

export default function EditJobForm({ open, onOpenChange, onSuccess, job }: EditJobFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    working_hours: '',
    location: '',
    district: '',
    image: ''
  });

  const districts = [
    'เมืองมหาสารคาม', 'แกดำ', 'โกสุมพิสัย', 'กันทรวิชัย', 'เชียงยืน', 'บรบือ',
    'นาเชือก', 'พยัคฆภูมิพิสัย', 'วาปีปทุม', 'นาดูน', 'ยางสีสุราช', 'กุดรัง', 'ชื่นชม'
  ];

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        salary: job.salary || '',
        working_hours: job.working_hours || '',
        location: job.location || '',
        district: job.district || '',
        image: job.image || ''
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          salary: formData.salary,
          working_hours: formData.working_hours,
          location: formData.location,
          district: formData.district,
          image: formData.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);

      if (error) throw error;

      toast({
        title: "แก้ไขงานสำเร็จ",
        description: "ข้อมูลตำแหน่งงานได้รับการอัปเดตแล้ว"
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขตำแหน่งงานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-card/95 border-0 shadow-xl">
        <DialogHeader className="pb-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            แก้ไขงาน: {job.title}
          </DialogTitle>
          <p className="text-muted-foreground mt-2">แก้ไขข้อมูลตำแหน่งงานของคุณ</p>
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
                  placeholder="เช่น 15,000-20,000 บาท"
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
                  placeholder="เช่น 8:00-17:00"
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
                placeholder="อธิบายลักษณะงาน หน้าที่ความรับผิดชอบ และสิ่งที่ผู้สมัครจะได้ทำ"
                rows={4}
                className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium text-foreground">
                คุณสมบัติที่ต้องการ *
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="เช่น อายุ 18-35 ปี, การศึกษา, ประสบการณ์, ทักษะที่ต้องการ"
                rows={3}
                className="bg-background/70 border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-secondary/30 border border-secondary rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">รูปภาพประกอบ</h3>
            </div>
            
            <FileUpload
              bucket="job-images"
              accept="image/*"
              label="รูปภาพงาน (ไม่บังคับ)"
              currentFile={formData.image}
              onUploadSuccess={handleImageUpload}
              maxSize={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-6 py-2 border-border hover:bg-secondary/50 transition-colors"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.district}
              className="px-8 py-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังบันทึก...</span>
                </div>
              ) : (
                'บันทึกการเปลี่ยนแปลง'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}