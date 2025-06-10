
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AdminLoginResponse } from '@/types/admin';

export const Login: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [adminPwd, setAdminPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login({ adminId, adminPwd });
      
      if (response.success && response.data) {
        // API 응답 데이터를 기존 AuthContext와 호환되도록 변환
        const userData = {
          adminIndex: 0, // API 응답에 없으므로 임시값
          username: response.data.adminId,
          name: response.data.adminNickName,
          email: '', // API 응답에 없으므로 빈값
          role: response.data.adminGrade.toString(),
          createdAt: '',
          lastLoginAt: response.data.lastLoginTime,
        };
        
        login(userData);
        toast({
          title: '로그인 성공',
          description: '관리자 페이지에 오신 것을 환영합니다.',
        });
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: '로그인 실패',
        description: '아이디 또는 비밀번호를 확인해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">추모의 정원</CardTitle>
          <CardDescription>관리자 로그인</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminId">아이디</Label>
              <Input
                id="adminId"
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPwd">비밀번호</Label>
              <Input
                id="adminPwd"
                type="password"
                value={adminPwd}
                onChange={(e) => setAdminPwd(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
