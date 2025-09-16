
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company_name: string;
  } | null;
}

export default function JobApplicationModal({ isOpen, onClose, job }: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availableStartDate, setAvailableStartDate] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [address, setAddress] = useState('');
  const [availability, setAvailability] = useState('');
  const [hasExperience, setHasExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !job) return;

    setIsSubmitting(true);
    
    try {
      // Get or create applicant details
      let { data: applicant, error: applicantError } = await supabase
        .from('applicants')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no applicant record exists, create one from profile data
      if (!applicant) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const nameParts = profile?.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || 'ชื่อ';
        const lastName = nameParts.slice(1).join(' ') || 'นามสกุล';

        const { data: newApplicant, error: createError } = await supabase
          .from('applicants')
          .insert({
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: profile?.email || user.email,
            phone: profile?.phone || phone || '',
            address: profile?.address || address || ''
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating applicant:', createError);
          throw new Error('ไม่สามารถสร้างข้อมูลผู้สมัครได้');
        }

        applicant = newApplicant;
      }

      // Submit application
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: job.id,
          applicant_id: user.id,
          applicant_name: `${applicant.first_name} ${applicant.last_name}`,
          applicant_email: applicant.email,
          job_title: job.title,
          company_name: job.company_name,
          cover_letter: coverLetter,
          education_level: education,
          experience_years: parseInt(workExperience) || 0,
          skills: skills ? skills.split(',').map(s => s.trim()) : [],
          phone: phone || applicant.phone,
          address: address || applicant.address,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "สมัครงานสำเร็จ",
        description: "ใบสมัครของคุณได้ถูกส่งไปยังนายจ้างแล้ว",
      });

      // รีเซ็ตฟอร์ม
      setCoverLetter('');
      setExpectedSalary('');
      setAvailableStartDate('');
      setWorkExperience('');
      setEducation('');
      setSkills('');
      setPhone('');
      setEmergencyContact('');
      setPortfolioUrl('');
      setAddress('');
      setAvailability('');
      setHasExperience('');
      onClose();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถส่งใบสมัครได้",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สมัครงาน: {job?.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ข้อมูลงาน */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">ข้อมูลงานที่สมัคร</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">บริษัท</Label>
                <Input
                  id="company"
                  value={job?.company_name || ''}
                  disabled
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="position">ตำแหน่ง</Label>
                <Input
                  id="position"
                  value={job?.title || ''}
                  disabled
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลการศึกษาและประสบการณ์ */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">ข้อมูลการศึกษาและประสบการณ์</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">ระดับการศึกษา</Label>
                <Input
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="เช่น ปริญญาตรี, ปริญญาโท"
                  required
                />
              </div>
              <div>
                <Label htmlFor="workExperience">ประสบการณ์การทำงาน (ปี)</Label>
                <Input
                  id="workExperience"
                  type="number"
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="skills">ทักษะและความสามารถ *</Label>
              <Textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="เช่น Excel, การสื่อสาร, ภาษาอังกฤษ, การใช้โซเชียลมีเดีย, การขาย ฯลฯ"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedSalary">ค่าแรงที่คาดหวัง (ต่อชั่วโมง)</Label>
                <Input
                  id="expectedSalary"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="เช่น 150 บาท/ชั่วโมง"
                />
              </div>
              <div>
                <Label htmlFor="availableStartDate">วันที่สามารถเริ่มงาน *</Label>
                <Input
                  id="availableStartDate"
                  type="date"
                  value={availableStartDate}
                  onChange={(e) => setAvailableStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">เบอร์โทรติดต่อ *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">ผู้ติดต่อฉุกเฉิน</Label>
                <Input
                  id="emergencyContact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="ชื่อและเบอร์โทรผู้ติดต่อฉุกเฉิน"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">ที่อยู่ปัจจุบัน *</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="เช่น 123/45 ซอยรามคำแหง 12 แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availability">ความพร้อมในการทำงาน *</Label>
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="เช่น จันทร์-ศุกร์ 9:00-17:00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="hasExperience">ประสบการณ์ที่เกี่ยวข้อง *</Label>
                <Input
                  id="hasExperience"
                  value={hasExperience}
                  onChange={(e) => setHasExperience(e.target.value)}
                  placeholder="เช่น เคยทำงานพาร์ทไทม์ที่ร้านอาหาร 2 ปี"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="portfolioUrl">Portfolio/ผลงาน (URL)</Label>
              <Input
                id="portfolioUrl"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://... (เว็บไซต์, Facebook, Instagram หรือลิงก์ผลงาน)"
                type="url"
              />
            </div>
          </div>

          {/* จดหมายสมัครงาน */}
          <div>
            <Label htmlFor="coverLetter">จดหมายสมัครงาน *</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="เขียนจดหมายสมัครงานของคุณ... บอกเล่าเหตุผลที่สนใจงานนี้ และสิ่งที่คุณสามารถมอบให้กับบริษัทได้"
              rows={6}
              required
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 h-12"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  ส่งใบสมัคร
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
