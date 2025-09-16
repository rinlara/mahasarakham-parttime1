import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from '@/components/FileUpload';

interface CreateCompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateCompanyForm({ open, onOpenChange, onSuccess }: CreateCompanyFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    district: ''
  });

  console.log('CreateCompanyForm - Current user:', user);
  console.log('CreateCompanyForm - Form open:', open);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('No user found for company creation');
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาเข้าสู่ระบบก่อนสร้างร้าน",
        variant: "destructive"
      });
      return;
    }

    console.log('Creating company for user:', user.id);
    console.log('Form data:', formData);

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          logo: formData.logo,
          district: formData.district,
          owner_id: user.id
        }])
        .select();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      console.log('Company created successfully:', data);

      toast({
        title: "สร้างร้านสำเร็จ",
        description: "ร้านของคุณถูกสร้างแล้ว รอการอนุมัติจากผู้ดูแลระบบ"
      });

      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        logo: '',
        district: ''
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถสร้างร้านได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (url: string) => {
    console.log('Logo uploaded:', url);
    setFormData(prev => ({ ...prev, logo: url }));
  };

  // Show loading or error state if user is not available
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>เพิ่มร้านใหม่</DialogTitle>
            {/* เพิ่ม Description ได้ถ้าต้องการ */}
            {/* <DialogDescription>รายละเอียด...</DialogDescription> */}
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>เพิ่มร้านใหม่</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">ชื่อร้าน *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="กรุณาใส่ชื่อร้าน"
              />
            </div>

            <div>
              <Label htmlFor="email">อีเมลร้าน *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="example@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                placeholder="08x-xxx-xxxx"
              />
            </div>

            <div>
              <Label htmlFor="district">เขต *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                required
                placeholder="กรุณาใส่เขต"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">รายละเอียดร้าน *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
              placeholder="บอกเล่าเกี่ยวกับร้านของคุณ..."
            />
          </div>

          <div>
            <Label htmlFor="address">ที่อยู่ร้าน *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
              required
              placeholder="ที่อยู่ของร้าน..."
            />
          </div>

          <FileUpload
            bucket="company-logos"
            accept="image/*"
            label="โลโก้ร้าน"
            currentFile={formData.logo}
            onUploadSuccess={handleLogoUpload}
            maxSize={2}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างร้าน'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
