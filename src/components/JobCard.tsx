
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Calendar, Users, Briefcase, Eye, Send } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  showDetails?: boolean;
}

export default function JobCard({ job, onApply, showDetails = false }: JobCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if job should be hidden (inactive, expired, or full)
  const isExpired = job.application_deadline && new Date(job.application_deadline) < new Date();
  const isFull = job.max_applicants && job.current_applicants && job.current_applicants >= job.max_applicants;
  const isInactive = !job.is_active || isExpired || isFull;

  // Don't render inactive jobs
  if (isInactive) {
    return null;
  }

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (onApply) {
      onApply(job.id);
    } else {
      navigate(`/jobs/${job.id}/apply`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm border rounded-xl overflow-hidden group hover:scale-[1.02] w-full max-w-md mx-auto">
      {/* Company/Store Image at Top */}
      <div className="w-full h-40 overflow-hidden relative bg-gradient-to-r from-muted to-secondary">
        {job.image ? (
          <img
            src={job.image}
            alt={`รูปภาพงาน ${job.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <div className="text-center text-muted-foreground">
              <Briefcase className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <CardHeader className="flex-none pb-3 relative">
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md text-xs">
            ✅ เปิดรับสมัคร
          </Badge>
        </div>
        
        <div className="flex-1 mt-4">
          <CardTitle className="text-lg font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {job.title}
          </CardTitle>
          <div className="flex items-center text-muted-foreground bg-secondary px-3 py-2 rounded-lg">
            <Briefcase className="w-4 h-4 mr-2 text-primary" />
            <p className="text-sm font-semibold">{job.company_name}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <div className="space-y-3">
          <div className="flex items-center text-sm bg-secondary/50 p-3 rounded-lg">
            <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <div className="line-clamp-1">
              {job.district && (
                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-full text-xs mr-2">
                  อำเภอ{job.district}
                </span>
              )}
              <span className="text-foreground font-medium">{job.location}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm bg-green-50 p-3 rounded-lg border border-green-200">
            <DollarSign className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
            <span className="font-bold text-green-800">
              💰 {job.salary_per_hour ? `${job.salary_per_hour} บาท/ชั่วโมง` : job.salary}
            </span>
          </div>
          
          <div className="flex items-center text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Clock className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
            <span className="font-semibold text-blue-800">🕐 {job.working_hours}</span>
          </div>
        </div>
        
        {!showDetails && (
          <div className="bg-muted/50 p-3 rounded-lg mt-3">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              📝 {job.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-none pt-4 border-t bg-secondary/30">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 h-10 hover:bg-secondary/50 font-semibold transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            ดูรายละเอียด
          </Button>
          
          <Button
            size="sm"
            onClick={handleApply}
            className="flex-1 h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={user?.role === 'employer'}
          >
            <Send className="w-4 h-4 mr-2" />
            {user?.role === 'employer' ? 'ไม่สามารถสมัครได้' : 'สมัครงาน'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
