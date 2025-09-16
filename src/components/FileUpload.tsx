
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, FileText, Image } from 'lucide-react';

interface FileUploadProps {
  bucket: string;
  accept: string;
  label: string;
  currentFile?: string;
  onUploadSuccess: (url: string) => void;
  maxSize?: number; // in MB
}

export default function FileUpload({ 
  bucket, 
  accept, 
  label, 
  currentFile, 
  onUploadSuccess,
  maxSize = 5 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: `ขนาดไฟล์ต้องไม่เกิน ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUploadSuccess(data.publicUrl);
      setFile(null);

      toast({
        title: "อัปโหลดสำเร็จ",
        description: "ไฟล์ถูกอัปโหลดเรียบร้อยแล้ว"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดไฟล์ได้",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    onUploadSuccess('');
  };

  const isImage = accept.includes('image');

  return (
    <div className="space-y-4">
      <Label className="text-primary font-medium">{label}</Label>
      
      {currentFile && !file && (
        <div className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            {isImage ? (
              <Image className="w-5 h-5 text-primary" />
            ) : (
              <FileText className="w-5 h-5 text-primary" />
            )}
            <span className="text-sm text-primary">ไฟล์ปัจจุบัน</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(currentFile, '_blank')}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            ดูไฟล์
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeFile}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="border-border focus:border-primary"
        />
        
        {file && (
          <div className="flex items-center space-x-3">
            <div className="flex-1 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm text-primary font-medium">
                ไฟล์ที่เลือก: {file.name}
              </div>
              <div className="text-xs text-primary/70">
                ขนาด: {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button
              type="button"
              onClick={uploadFile}
              disabled={uploading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span className="ml-2">
                {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
