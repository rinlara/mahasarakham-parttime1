
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff } from 'lucide-react';

export default function Notifications() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleMarkAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทสถานะการอ่านได้",
        variant: "destructive"
      });
    } else {
      refetch();
    }
  };

  const handleMarkAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user?.id)
      .eq('is_read', false);

    if (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทสถานะการอ่านได้",
        variant: "destructive"
      });
    } else {
      toast({
        title: "อัพเดทสำเร็จ",
        description: "อ่านการแจ้งเตือนทั้งหมดแล้ว"
      });
      refetch();
    }
  };

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

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">การแจ้งเตือน</h1>
            <p className="text-gray-600">
              การแจ้งเตือนทั้งหมด {notifications?.length || 0} รายการ
              {unreadCount > 0 && (
                <span className="ml-2">
                  ({unreadCount} รายการยังไม่อ่าน)
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              อ่านทั้งหมด
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card key={notification.id} className={`transition-all ${
              !notification.is_read ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {notification.is_read ? (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-purple-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={
                          notification.type === 'success' ? 'default' :
                          notification.type === 'warning' ? 'secondary' :
                          notification.type === 'error' ? 'destructive' : 'outline'
                        }>
                          {notification.type === 'success' ? 'สำเร็จ' :
                           notification.type === 'warning' ? 'คำเตือน' :
                           notification.type === 'error' ? 'ข้อผิดพลาด' : 'ข้อมูล'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString('th-TH')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.is_read && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      ทำเครื่องหมายว่าอ่านแล้ว
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!notifications || notifications.length === 0) && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">ยังไม่มีการแจ้งเตือน</p>
          </div>
        )}
      </div>
    </div>
  );
}
