import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import {
  Bell,
  User,
  LogOut,
  Briefcase,
  Building,
  Home,
  Menu,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const navigate = useNavigate();

  const unreadCount = user ? getUnreadNotifications(user.id).length : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "applicant":
        return "/applicant/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary/95 via-card/90 to-accent-foreground/80 backdrop-blur-xl shadow-lg border-b border-border/30">
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-all duration-300 overflow-hidden bg-white/10">
                <img
                  src="/logo2.png"
                  alt="โลโก้หางานพาร์ทไทม์มหาสารคาม"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-foreground rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                หางานพาร์ทไทม์
              </h1>
              <p className="text-xs text-muted-foreground font-semibold">
                ระบบจัดหางานออนไลน์มหาสารคาม
              </p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-all md:hidden"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 sm:w-96 p-6 bg-gradient-to-br from-primary/95 via-card/90 to-muted/60 backdrop-blur-xl shadow-2xl border-r border-border/30 flex flex-col"
              >
                {/* ✅ User Profile (Mobile) */}
                {user ? (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-foreground rounded-lg flex items-center justify-center overflow-hidden">
                      {user?.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={user.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {user?.name || "ผู้ใช้งาน"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.role === "admin"
                          ? "ผู้ดูแลระบบ"
                          : user?.role === "employer"
                          ? "ผู้ประกอบการ"
                          : user?.role === "applicant"
                          ? "ผู้สมัครงาน"
                          : "ไม่ทราบบทบาท"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">
                      ยินดีต้อนรับสู่ระบบ
                    </p>
                  </div>
                )}

                {/* ✅ เมนูมือถือ */}
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                  >
                    <Home className="w-5 h-5" />
                    <span>หน้าหลัก</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>ตำแหน่งงาน</span>
                  </Link>
                  <Link
                    to="/companies"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                  >
                    <Building className="w-5 h-5" />
                    <span>บริษัท/ร้านค้า</span>
                  </Link>
                  <Link
                    to="/guide"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>คู่มือการใช้งาน</span>
                  </Link>
                  {user && (
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-base text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>แดชบอร์ด</span>
                    </Link>
                  )}
                </nav>

                {/* ✅ ปุ่มเข้าสู่ระบบ / ออกจากระบบ */}
                <div className="mt-auto flex flex-col gap-2">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      ออกจากระบบ
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate("/login")}
                        variant="outline"
                        className="w-full"
                      >
                        เข้าสู่ระบบ
                      </Button>
                      <Button
                        onClick={() => navigate("/register")}
                        className="w-full bg-gradient-to-r from-primary to-accent-foreground text-white"
                      >
                        สมัครสมาชิก
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/5 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>หน้าหลัก</span>
              </Link>
              <Link
                to="/jobs"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/5 font-medium"
              >
                <Briefcase className="w-4 h-4" />
                <span>ตำแหน่งงาน</span>
              </Link>
              <Link
                to="/companies"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/5 font-medium"
              >
                <Building className="w-4 h-4" />
                <span>บริษัท/ร้านค้า</span>
              </Link>
              <Link
                to="/guide"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-primary/5 font-medium"
              >
                <BookOpen className="w-4 h-4" />
                <span>คู่มือการใช้งาน</span>
              </Link>
            </nav>

            {/* Notification + Profile (Desktop) */}
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-primary/10 hover:text-primary p-2.5 rounded-lg transition-all hidden md:flex"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center shadow font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-primary/10 hover:text-primary p-2.5 rounded-lg transition-all"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent-foreground rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden">
                        {user?.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.name || "Profile"}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="hidden md:block text-left min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">
                          {user?.name || "ผู้ใช้งาน"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user?.role === "admin"
                            ? "ผู้ดูแลระบบ"
                            : user?.role === "employer"
                            ? "ผู้ประกอบการ"
                            : user?.role === "applicant"
                            ? "ผู้สมัครงาน"
                            : "ไม่ทราบบทบาท"}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card/95 backdrop-blur-md border-border shadow-xl rounded-lg p-2"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardPath())}
                      className="rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                    >
                      <Briefcase className="w-4 h-4 mr-3" />
                      <span>แดชบอร์ด</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      <span>โปรไฟล์ของฉัน</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive rounded-lg cursor-pointer hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span>ออกจากระบบ</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  เข้าสู่ระบบ
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-primary to-accent-foreground hover:from-primary/90 hover:to-accent-foreground/90 text-primary-foreground font-semibold px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  สมัครสมาชิก
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
