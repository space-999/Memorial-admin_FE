
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileDialog } from '@/components/ProfileDialog';
import { PasswordDialog } from '@/components/PasswordDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminProfileUpdateRequest, AdminPasswordUpdateRequest } from '@/types/admin';
import { User, Lock } from 'lucide-react';

export const MyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // 현재 사용자 정보 조회 (user 객체를 활용)
  const currentProfile = {
    adminNickName: user?.adminNickName || '',
    adminPhone: user?.adminPhone || '',
    adminId: user?.adminId || '',
    adminGrade: user?.adminGrade || 0,
    lastLoginTime: user?.lastLoginTime || '',
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data: AdminProfileUpdateRequest) => apiClient.updateMyProfile(data),
    onSuccess: () => {
      toast({
        title: "성공",
        description: "프로필이 수정되었습니다.",
      });
      setIsProfileDialogOpen(false);
      // 사용자 정보 다시 로드하거나 AuthContext 업데이트 필요
    },
    onError: () => {
      toast({
        title: "오류",
        description: "프로필 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: AdminPasswordUpdateRequest) => apiClient.updateMyPassword(data),
    onSuccess: () => {
      toast({
        title: "성공",
        description: "비밀번호가 변경되었습니다.",
      });
      setIsPasswordDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "오류",
        description: "비밀번호 변경에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = (data: AdminProfileUpdateRequest) => {
    updateProfileMutation.mutate(data);
  };

  const handleUpdatePassword = (data: AdminPasswordUpdateRequest) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">내 프로필</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              프로필 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">아이디</label>
              <p className="text-sm">{currentProfile.adminId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">닉네임</label>
              <p className="text-sm">{currentProfile.adminNickName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">전화번호</label>
              <p className="text-sm">{currentProfile.adminPhone || '등록되지 않음'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">권한 등급</label>
              <p className="text-sm">{currentProfile.adminGrade}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">마지막 로그인</label>
              <p className="text-sm">
                {currentProfile.lastLoginTime 
                  ? new Date(currentProfile.lastLoginTime).toLocaleString('ko-KR')
                  : '정보 없음'
                }
              </p>
            </div>
            <Button 
              onClick={() => setIsProfileDialogOpen(true)}
              className="w-full"
            >
              프로필 수정
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              보안 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              계정 보안을 위해 주기적으로 비밀번호를 변경해주세요.
            </p>
            <Button 
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outline"
              className="w-full"
            >
              비밀번호 변경
            </Button>
          </CardContent>
        </Card>
      </div>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        currentProfile={currentProfile}
        onSave={handleUpdateProfile}
        isLoading={updateProfileMutation.isPending}
      />

      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSave={handleUpdatePassword}
        isLoading={updatePasswordMutation.isPending}
      />
    </div>
  );
};
