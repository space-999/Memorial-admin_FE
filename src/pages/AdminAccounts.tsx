
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { AdminAccount } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, RotateCcw, Unlock } from 'lucide-react';
import { AdminAccountDialog } from '@/components/AdminAccountDialog';

const getGradeName = (grade: number): string => {
  switch (grade) {
    case 0: return 'VIEWER';
    case 1: return 'EDITOR';
    case 2: return 'MANAGER';
    case 3: return 'SUPER_ADMIN';
    default: return 'UNKNOWN';
  }
};

export const AdminAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin accounts:', error);
      toast({
        title: '오류',
        description: '관리자 계정을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setIsCreating(true);
    setDialogOpen(true);
  };

  const handleEdit = (account: AdminAccount) => {
    setEditingAccount(account);
    setIsCreating(false);
    setDialogOpen(true);
  };

  const handleDelete = async (adminIndex: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await apiClient.deleteAdminAccount(adminIndex);
      if (response.success) {
        toast({
          title: '삭제 완료',
          description: '관리자 계정이 삭제되었습니다.',
        });
        fetchAccounts();
      } else {
        throw new Error(response.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast({
        title: '삭제 실패',
        description: '계정 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (adminIndex: number) => {
    if (!confirm('정말 비밀번호를 초기화하시겠습니까?')) return;

    try {
      const response = await apiClient.resetAdminPassword(adminIndex);
      if (response.success) {
        toast({
          title: '초기화 완료',
          description: `비밀번호가 초기화되었습니다. 임시 비밀번호: ${response.data}`,
        });
      } else {
        throw new Error(response.message || '초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast({
        title: '초기화 실패',
        description: '비밀번호 초기화에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleUnlock = async (adminIndex: number) => {
    if (!confirm('정말 계정 잠금을 해제하시겠습니까?')) return;

    try {
      const response = await apiClient.unlockAdminAccount(adminIndex);
      if (response.success) {
        toast({
          title: '잠금 해제 완료',
          description: '계정 잠금이 해제되었습니다.',
        });
        fetchAccounts();
      } else {
        throw new Error(response.message || '잠금 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to unlock account:', error);
      toast({
        title: '잠금 해제 실패',
        description: '계정 잠금 해제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (accountData: any) => {
    try {
      if (isCreating) {
        const response = await apiClient.createAdminAccount(accountData);
        if (response.success) {
          toast({
            title: '생성 완료',
            description: '관리자 계정이 생성되었습니다.',
          });
        } else {
          throw new Error(response.message || '생성에 실패했습니다.');
        }
      } else if (editingAccount) {
        const response = await apiClient.updateAdminAccount(editingAccount.adminIndex, accountData);
        if (response.success) {
          toast({
            title: '수정 완료',
            description: '관리자 계정이 수정되었습니다.',
          });
        } else {
          throw new Error(response.message || '수정에 실패했습니다.');
        }
      }
      setDialogOpen(false);
      setEditingAccount(null);
      setIsCreating(false);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to save account:', error);
      toast({
        title: '저장 실패',
        description: '계정 저장에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">관리자 계정 관리</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            계정 추가
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">관리자 계정 관리</h1>
          <p className="text-muted-foreground">시스템 관리자 계정을 관리합니다.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          계정 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>관리자 계정 목록</CardTitle>
          <CardDescription>
            총 {accounts.length}개의 관리자 계정이 등록되어 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>인덱스</TableHead>
                <TableHead>아이디</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead>등급</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>계정상태</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.adminIndex}>
                  <TableCell>{account.adminIndex}</TableCell>
                  <TableCell>{account.adminId}</TableCell>
                  <TableCell>{account.adminNickName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getGradeName(account.adminGrade)}</Badge>
                  </TableCell>
                  <TableCell>{account.adminPhone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={account.accountNonLocked ? 'default' : 'destructive'}>
                      {account.accountNonLocked ? '활성' : '잠김'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(account.adminCreateTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {account.lastLoginTime 
                      ? new Date(account.lastLoginTime).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!account.accountNonLocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlock(account.adminIndex)}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(account.adminIndex)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(account.adminIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdminAccountDialog
        account={editingAccount}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        isCreating={isCreating}
      />
    </div>
  );
};
