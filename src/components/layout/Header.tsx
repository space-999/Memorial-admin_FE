
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">관리자 대시보드</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">
          안녕하세요, {user?.adminNickName}님
        </span>
      </div>
    </header>
  );
};
