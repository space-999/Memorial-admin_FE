
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
  onSave: (data: Partial<AdminAccount>) => Promise<void>;
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
    username: '',
    name: '',
    email: '',
    role: 'ADMIN',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        username: account.username,
        name: account.name,
        email: account.email,
        role: account.role,
        password: '',
      });
    } else {
      setFormData({
        username: '',
        name: '',
        email: '',
        role: 'ADMIN',
        password: '',
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
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={!isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">역할</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">관리자</SelectItem>
                <SelectItem value="SUPER_ADMIN">최고관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isCreating && (
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={isCreating}
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
