import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, Building, User, Bell, LogOut, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mainItems = [
  { title: 'หน้าหลัก', url: '/', icon: Home },
  { title: 'ตำแหน่งงาน', url: '/jobs', icon: Briefcase },
  { title: 'บริษัท/ร้านค้า', url: '/companies', icon: Building },
];

const userItems = [
  { title: 'แจ้งเตือน', url: '/notifications', icon: Bell },
  { title: 'โปรไฟล์', url: '/profile', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  
  const unreadCount = user ? getUnreadNotifications(user.id).length : 0;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "w-full justify-start h-12 px-3 text-sm font-medium transition-all duration-200";
    return isActive(path)
      ? `${baseClasses} bg-primary text-primary-foreground shadow-md`
      : `${baseClasses} hover:bg-primary/10 hover:text-primary text-muted-foreground`;
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'applicant':
        return '/applicant/dashboard';
      default:
        return '/';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r bg-card/95 backdrop-blur-md shadow-xl`}
      collapsible="icon"
    >
      {/* Header with Logo and Trigger */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  หางานพาร์ทไทม์
                </h1>
                <p className="text-xs text-primary font-bold">ระบบจัดหางานออนไลน์มหาสารคาม</p>
              </div>
            </div>
          )}
          <SidebarTrigger className="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary" />
        </div>
      </div>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide ${isCollapsed ? 'sr-only' : ''}`}>
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Menu (only show if logged in) */}
        {user && (
          <>
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide ${isCollapsed ? 'sr-only' : ''}`}>
                บัญชีผู้ใช้
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {/* Dashboard */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={getDashboardPath()} 
                        className={getNavClasses(getDashboardPath())}
                        title={isCollapsed ? 'แดชบอร์ด' : undefined}
                      >
                        <Briefcase className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                        {!isCollapsed && <span className="truncate">แดชบอร์ด</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                   {/* Notifications */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to="/notifications" 
                        className={getNavClasses('/notifications')}
                        title={isCollapsed ? 'แจ้งเตือน' : undefined}
                      >
                        <div className="relative flex items-center">
                          <Bell className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -left-1 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg animate-pulse font-bold text-[10px]">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {!isCollapsed && <span className="truncate">แจ้งเตือน</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Profile */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to="/profile" 
                        className={getNavClasses('/profile')}
                        title={isCollapsed ? 'โปรไฟล์' : undefined}
                      >
                        <User className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                        {!isCollapsed && <span className="truncate">โปรไฟล์</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Logout */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start h-12 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title={isCollapsed ? 'ออกจากระบบ' : undefined}
                      >
                        <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                        {!isCollapsed && <span className="truncate">ออกจากระบบ</span>}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* User Info (collapsed version) */}
            {isCollapsed && user && (
              <div className="mt-auto p-2">
                <div className="relative mx-auto">
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-xl object-cover shadow-lg border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User Info (expanded version) */}
            {!isCollapsed && user && (
              <div className="mt-auto p-4 border-t border-border">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-xl">
                  <div className="relative">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-xl object-cover shadow-lg border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                    <div className="text-xs text-primary font-medium">
                      {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                       user.role === 'employer' ? 'ผู้ประกอบการ' : 'ผู้สมัครงาน'}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      ID: {user.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Login buttons for non-authenticated users */}
        {!user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide ${isCollapsed ? 'sr-only' : ''}`}>
              บัญชีผู้ใช้
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="w-full justify-start h-12 px-3 text-sm font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      title={isCollapsed ? 'เข้าสู่ระบบ' : undefined}
                    >
                      <User className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                      {!isCollapsed && <span className="truncate">เข้าสู่ระบบ</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full justify-start h-12 px-3 text-sm font-medium bg-gradient-to-r from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90"
                      title={isCollapsed ? 'สมัครสมาชิก' : undefined}
                    >
                      <Briefcase className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                      {!isCollapsed && <span className="truncate">สมัครสมาชิก</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}