
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, MapPin, Users, Building, User, FileText, AlertTriangle } from 'lucide-react';
import { Job } from '@/types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (job: Job) => void;
  canApply?: boolean;
  isLoggedIn?: boolean;
}

export default function JobDetailModal({ job, isOpen, onClose, onApply, canApply = true, isLoggedIn = false }: JobDetailModalProps) {
  if (!job) return null;

  const isExpired = job.application_deadline && new Date(job.application_deadline) < new Date();
  const isFull = job.max_applicants && job.current_applicants && Number(job.current_applicants) >= Number(job.max_applicants);
  const canApplyNow = canApply && job.is_active && !isExpired && !isFull;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800">
            {job.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Image */}
          {job.image && (
            <div className="w-full h-64 overflow-hidden rounded-lg">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={job.is_active && !isExpired && !isFull ? "default" : "secondary"}>
              {job.is_active && !isExpired && !isFull ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
            </Badge>
            {isExpired && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                หมดเขตสมัคร
              </Badge>
            )}
            {isFull && (
              <Badge variant="destructive">
                <Users className="w-3 h-3 mr-1" />
                ครบจำนวนแล้ว
              </Badge>
            )}
          </div>

          {/* Company Info */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800">{job.company_name}</h3>
                  {job.organization_name && (
                    <p className="text-sm text-purple-600">สังกัด: {job.organization_name}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-600">ค่าจ้าง</p>
                    <p className="text-lg font-bold">
                      {job.salary_per_hour ? `${job.salary_per_hour} บาท/ชั่วโมง` : job.salary}
                    </p>
                    {job.salary !== `${job.salary_per_hour} บาท/ชั่วโมง` && job.salary_per_hour && (
                      <p className="text-sm text-gray-600">({job.salary})</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-600">เวลาทำงาน</p>
                    <p>{job.working_hours}</p>
                    {job.work_duration && (
                      <p className="text-sm text-gray-600">ระยะเวลา: {job.work_duration}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-600">สถานที่ทำงาน</p>
                    <p>{job.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-600">จำนวนรับสมัคร</p>
                    <p>
                      {job.current_applicants || 0} / {job.max_applicants || 'ไม่จำกัด'} คน
                    </p>
                    {job.max_applicants && job.current_applicants && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(Number(job.current_applicants) / Number(job.max_applicants)) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Deadline */}
          {job.application_deadline && (
            <Card className={isExpired ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className={`w-5 h-5 ${isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`font-semibold ${isExpired ? 'text-red-800' : 'text-yellow-800'}`}>
                      {isExpired ? 'หมดเขตรับสมัครแล้ว' : 'หมดเขตสมัคร'}
                    </p>
                    <p className={isExpired ? 'text-red-700' : 'text-yellow-700'}>
                      {format(new Date(job.application_deadline), 'dd MMMM yyyy', { locale: th })}
                    </p>
                    {!isExpired && (
                      <p className="text-sm text-gray-600 mt-1">
                        เหลือเวลา: {Math.ceil((new Date(job.application_deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} วัน
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Person */}
          {job.contact_person && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-800">ผู้ติดต่อ</p>
                    <p>{job.contact_person}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                รายละเอียดงาน
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">คุณสมบัติที่ต้องการ</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </CardContent>
          </Card>

          {/* Project Details */}
          {job.project_details && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-3">รายละเอียดโครงการ</h3>
                <p className="text-blue-700 leading-relaxed whitespace-pre-wrap">
                  {job.project_details}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              ปิด
            </Button>
            {canApplyNow && onApply && isLoggedIn && (
              <Button 
                onClick={() => onApply(job)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                สมัครงาน
              </Button>
            )}
            {!isLoggedIn && job.is_active && !isExpired && !isFull && (
              <Button 
                onClick={() => onApply && onApply(job)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                เข้าสู่ระบบเพื่อสมัครงาน
              </Button>
            )}
            {!canApplyNow && (isExpired || isFull) && (
              <Button disabled className="bg-gray-400">
                {isExpired ? 'หมดเขตสมัครแล้ว' : 'ครบจำนวนแล้ว'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
