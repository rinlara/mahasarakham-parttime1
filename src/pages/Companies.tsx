
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Companies() {
  const { user, isLoading } = useAuth();

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (companiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">กำลังโหลดข้อมูลร้าน...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ร้านค้าและผู้ประกอบการ</h1>
          <p className="text-gray-600">รายชื่อร้านค้าที่เปิดรับสมัครงานพาร์ทไทม์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {company.logo && (
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <Badge variant="default">อนุมัติแล้ว</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600 line-clamp-3">{company.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ที่อยู่:</span>
                      <p className="text-gray-600">{company.address}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">เบอร์โทร:</span>
                      <span className="text-gray-600">{company.phone}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">อีเมล:</span>
                      <span className="text-gray-600">{company.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      เปิดให้บริการตั้งแต่: {new Date(company.created_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!companies || companies.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ยังไม่มีร้านค้าที่ได้รับอนุมัติ</p>
          </div>
        )}
      </div>
    </div>
  );
}
