
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminAccount } from '@/types/admin';

interface AdminAccountDialogProps {
  account: AdminAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  isCreating: boolean;
}

export const AdminAccountDialog: React.FC<AdminAccountDialogProps> = ({
  account,
  open,
  onOpenChange,
  onSave,
  isCreating,
}) => {
  const [formData, setFormData] = useState({
    adminId: '',
    adminNickName: '',
    adminGrade: 0,
    adminPhone: '',
    adminPwd: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        adminId: account.adminId,
        adminNickName: account.adminNickName,
        adminGrade: account.adminGrade,
        adminPhone: account.adminPhone || '',
        adminPwd: '',
      });
    } else {
      setFormData({
        adminId: '',
        adminNickName: '',
        adminGrade: 0,
        adminPhone: '',
        adminPwd: '',
      });
    }
  }, [account, isCreating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const getGradeName = (grade: number): string => {
    switch (grade) {
      case 0: return 'VIEWER';
      case 1: return 'EDITOR';
      case 2: return 'MANAGER';
      case 3: return 'SUPER_ADMIN';
      default: return 'UNKNOWN';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? '관리자 계정 생성' : '관리자 계정 수정'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminId">아이디</Label>
            <Input
              id="adminId"
              value={formData.adminId}
              onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
              required
              disabled={!isCreating}
              minLength={4}
              maxLength={20}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminNickName">닉네임</Label>
            <Input
              id="adminNickName"
              value={formData.adminNickName}
              onChange={(e) => setFormData({ ...formData, adminNickName: e.target.value })}
              required
              maxLength={16}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPhone">연락처</Label>
            <Input
              id="adminPhone"
              value={formData.adminPhone}
              onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
              placeholder="010-0000-0000"
              maxLength={20}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminGrade">등급</Label>
            <Select
              value={formData.adminGrade.toString()}
              onValueChange={(value) => setFormData({ ...formData, adminGrade: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">VIEWER (0)</SelectItem>
                <SelectItem value="1">EDITOR (1)</SelectItem>
                <SelectItem value="2">MANAGER (2)</SelectItem>
                <SelectItem value="3">SUPER_ADMIN (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isCreating && (
            <div className="space-y-2">
              <Label htmlFor="adminPwd">비밀번호</Label>
              <Input
                id="adminPwd"
                type="password"
                value={formData.adminPwd}
                onChange={(e) => setFormData({ ...formData, adminPwd: e.target.value })}
                required={isCreating}
                placeholder="영문+숫자 8-50자"
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,50}$"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : isCreating ? '생성' : '수정'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
