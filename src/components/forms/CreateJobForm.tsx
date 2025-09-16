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
import FileUpload from '@/components/FileUpload';

interface CreateJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateJobForm({ open, onOpenChange, onSuccess }: CreateJobFormProps) {
  const { user } = useAuth();
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
    company_id: '',
    image: ''
  });

  const districts = [
    'เมืองมหาสารคาม', 'แกดำ', 'โกสุมพิสัย', 'กันทรวิชัย', 'เชียงยืน', 'บรบือ',
    'นาเชือก', 'พยัคฆภูมิพิสัย', 'วาปีปทุม', 'นาดูน', 'ยางสีสุราช', 'กุดรัง', 'ชื่นชม'
  ];

  const { data: companies } = useQuery({
    queryKey: ['user-companies', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user?.id)
        .eq('is_approved', true);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const selectedCompany = companies?.find(c => c.id === formData.company_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.company_id) return;

    const selectedCompany = companies?.find(c => c.id === formData.company_id);
    if (!selectedCompany) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([{
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          salary: formData.salary,
          location: formData.location,
          district: formData.district,
          company_id: formData.company_id,
          company_name: selectedCompany.name,
          image: formData.image
        }]);

      if (error) throw error;

      toast({
        title: "สร้างงานสำเร็จ",
        description: "ตำแหน่งงานถูกสร้างแล้ว รอการอนุมัติจากผู้ดูแลระบบ"
      });

      setFormData({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        working_hours: '',
        location: '',
        district: '',
        company_id: '',
        image: ''
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างตำแหน่งงานได้",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-200 shadow-2xl">
        <DialogHeader className="pb-8 border-b border-gradient-to-r from-purple-200 to-pink-200">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent text-center">
            ✨ เพิ่มงานใหม่ ✨
          </DialogTitle>
          <p className="text-gray-600 mt-3 text-center text-lg">กรอกข้อมูลตำแหน่งงานที่ต้องการประกาศ พร้อมรายละเอียดที่สวยงาม</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          {/* Company Selection */}
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border border-purple-300 rounded-xl p-8 space-y-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-md"></div>
              <h3 className="text-xl font-bold text-purple-800">🏪 ข้อมูลร้าน/บริษัท</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="company" className="text-sm font-semibold text-purple-700 mb-2 block">
                  เลือกร้าน *
                </Label>
                <Select value={formData.company_id} onValueChange={(value) => handleInputChange('company_id', value)}>
                  <SelectTrigger className="w-full bg-white/80 border-purple-300 hover:border-purple-500 focus:border-purple-600 transition-all duration-200 rounded-lg shadow-sm h-12">
                    <SelectValue placeholder="🔍 เลือกร้านที่ต้องการลงงาน" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 rounded-lg shadow-xl">
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id} className="hover:bg-purple-50 focus:bg-purple-100">
                        <div className="flex items-center space-x-3">
                          {company.logo && (
                            <img src={company.logo} alt={company.name} className="w-6 h-6 rounded-full object-cover" />
                          )}
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!companies || companies.length === 0) && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                    <p className="text-sm text-red-700 font-medium flex items-center">
                      <span className="mr-2">⚠️</span>
                      คุณต้องมีร้านที่ได้รับการอนุมัติแล้วก่อนจึงจะสร้างงานได้
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Company Display */}
              {selectedCompany && (
                <div className="bg-white/70 border border-purple-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-purple-700 mb-3">ร้านที่เลือก:</h4>
                  <div className="flex items-center space-x-3">
                    {selectedCompany.logo && (
                      <img 
                        src={selectedCompany.logo} 
                        alt={selectedCompany.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-purple-200"
                      />
                    )}
                    <div>
                      <p className="font-bold text-purple-800">{selectedCompany.name}</p>
                      <p className="text-sm text-gray-600">{selectedCompany.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border border-blue-300 rounded-xl p-8 space-y-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md"></div>
              <h3 className="text-xl font-bold text-blue-800">💼 ข้อมูลตำแหน่งงาน</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-blue-700 flex items-center">
                  <span className="mr-2">📝</span>ชื่อตำแหน่งงาน *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="เช่น พนักงานขายพาร์ทไทม์"
                  className="bg-white/80 border-blue-300 hover:border-blue-500 focus:border-blue-600 transition-all duration-200 rounded-lg shadow-sm h-12"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="salary" className="text-sm font-semibold text-green-700 flex items-center">
                  <span className="mr-2">💰</span>ค่าจ้างต่อชั่วโมง *
                </Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="เช่น 15,000-20,000 บาท"
                  className="bg-white/80 border-green-300 hover:border-green-500 focus:border-green-600 transition-all duration-200 rounded-lg shadow-sm h-12"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="working_hours" className="text-sm font-semibold text-orange-700 flex items-center">
                  <span className="mr-2">🕐</span>เวลาทำงาน *
                </Label>
                <Input
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => handleInputChange('working_hours', e.target.value)}
                  placeholder="เช่น 8:00-17:00"
                  className="bg-white/80 border-orange-300 hover:border-orange-500 focus:border-orange-600 transition-all duration-200 rounded-lg shadow-sm h-12"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="district" className="text-sm font-semibold text-purple-700 flex items-center">
                  <span className="mr-2">📍</span>อำเภอ *
                </Label>
                <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                  <SelectTrigger className="bg-white/80 border-purple-300 hover:border-purple-500 focus:border-purple-600 transition-all duration-200 rounded-lg shadow-sm h-12">
                    <SelectValue placeholder="🔍 เลือกอำเภอ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 rounded-lg shadow-xl">
                    {districts.map((district) => (
                      <SelectItem key={district} value={district} className="hover:bg-purple-50 focus:bg-purple-100">
                        <span className="font-medium">อำเภอ{district}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-sm font-semibold text-red-700 flex items-center">
                <span className="mr-2">🏢</span>สถานที่ทำงาน *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="เช่น ใกล้มหาวิทยาลัยมหาสารคาม"
                className="bg-white/80 border-red-300 hover:border-red-500 focus:border-red-600 transition-all duration-200 rounded-lg shadow-sm h-12"
                required
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 border border-green-300 rounded-xl p-8 space-y-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-full shadow-md"></div>
              <h3 className="text-xl font-bold text-green-800">📋 รายละเอียดงาน</h3>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-green-700 flex items-center">
                <span className="mr-2">📄</span>รายละเอียดงาน *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="อธิบายลักษณะงาน หน้าที่ความรับผิดชอบ และสิ่งที่ผู้สมัครจะได้ทำ"
                rows={4}
                className="bg-white/80 border-green-300 hover:border-green-500 focus:border-green-600 transition-all duration-200 resize-none rounded-lg shadow-sm"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="requirements" className="text-sm font-semibold text-teal-700 flex items-center">
                <span className="mr-2">✅</span>คุณสมบัติที่ต้องการ *
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="เช่น อายุ 18-35 ปี, การศึกษา, ประสบการณ์, ทักษะที่ต้องการ"
                rows={3}
                className="bg-white/80 border-teal-300 hover:border-teal-500 focus:border-teal-600 transition-all duration-200 resize-none rounded-lg shadow-sm"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-red-100 border border-pink-300 rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full shadow-md"></div>
              <h3 className="text-xl font-bold text-pink-800">🖼️ รูปภาพประกอบ</h3>
            </div>
            
            <div className="bg-white/70 rounded-lg p-6 border border-pink-200 shadow-sm">
              <FileUpload
                bucket="job-images"
                accept="image/*"
                label="📸 รูปภาพงาน (ไม่บังคับ)"
                currentFile={formData.image}
                onUploadSuccess={handleImageUpload}
                maxSize={3}
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                อัพโหลดรูปภาพที่สวยงามเพื่อดึงดูดผู้สมัครงาน
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 pt-8 border-t-2 border-gradient-to-r from-purple-200 via-pink-200 to-purple-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-8 py-3 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-200 rounded-xl text-gray-700 font-semibold shadow-md hover:shadow-lg"
            >
              ❌ ยกเลิก
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.company_id || !formData.district}
              className="px-12 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>🔄 กำลังสร้าง...</span>
                </div>
              ) : (
                '✨ สร้างงานสวยๆ ✨'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}