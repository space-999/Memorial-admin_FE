
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { AdminAccountResponseDto } from '@/types/admin';

export const Login: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [adminPwd, setAdminPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminId || !adminPwd) {
      toast({
        title: '입력 오류',
        description: '아이디와 비밀번호를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.login({ adminId, adminPwd });
      
      if (response.success && response.data) {
        const userData: AdminAccountResponseDto = {
          adminIndex: 0, // API에서 제공되지 않으므로 임시값
          adminId: response.data.adminId,
          adminNickName: response.data.adminNickName,
          adminGrade: response.data.adminGrade,
          adminPhone: undefined,
          accountNonLocked: true,
          lastLoginTime: response.data.lastLoginTime,
          loginFailCnt: '0',
          adminCreateTime: new Date().toISOString(),
          adminPwdChgTime: undefined
        };

        login(userData);
        toast({
          title: '로그인 성공',
          description: `환영합니다, ${response.data.adminNickName}님!`,
        });
        navigate('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">관리자 로그인</CardTitle>
          <CardDescription className="text-center">
            추모의 정원 관리자 시스템에 로그인하세요
          </CardDescription>
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
                placeholder="관리자 아이디를 입력하세요"
                disabled={loading}
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
                disabled={loading}
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
