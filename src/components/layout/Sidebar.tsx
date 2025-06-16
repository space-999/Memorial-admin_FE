
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Book,
  Settings,
  LogOut,
  FileText,
  User,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { canManageAdmins, canViewLogs, getGradeName } from '@/utils/permissions';

const allNavigation = [
  { name: '대시보드', href: '/admin/dashboard', icon: Home, requiresGrade: 0 },
  { name: '꽃 메시지', href: '/admin/flower-messages', icon: Book, requiresGrade: 0 },
  { name: '나뭇잎 메시지', href: '/admin/leaf-messages', icon: FileText, requiresGrade: 0 },
  { name: '관리자 계정', href: '/admin/admin-accounts', icon: Users, requiresGrade: 2 },
  { name: '로그 관리', href: '/admin/logs', icon: Settings, requiresGrade: 2 },
  { name: '마이페이지', href: '/admin/my-profile', icon: User, requiresGrade: 0 },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      logout();
      toast({
        title: '로그아웃 완료',
        description: '성공적으로 로그아웃되었습니다.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // 에러가 있어도 로컬 상태는 정리
    }
  };

  // 사용자 권한에 따라 네비게이션 필터링
  const navigation = allNavigation.filter(item => {
    if (!user) return false;
    return user.adminGrade >= item.requiresGrade;
  });

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-primary">추모의 정원 관리자</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t p-4">
        <div className="mb-3 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{user?.adminNickName}</p>
          <p className="text-xs text-muted-foreground">
            {user ? getGradeName(user.adminGrade) : ''}
          </p>
          {user?.adminPhone && (
            <p className="text-xs text-muted-foreground">{user.adminPhone}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};
