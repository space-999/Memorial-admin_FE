
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminProfileUpdateRequest } from '@/types/admin';

const profileSchema = z.object({
  adminNickName: z.string().min(1, '닉네임을 입력해주세요.'),
  adminPhone: z.string().optional(),
});

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: {
    adminNickName: string;
    adminPhone?: string;
  };
  onSave: (data: AdminProfileUpdateRequest) => void;
  isLoading?: boolean;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onOpenChange,
  currentProfile,
  onSave,
  isLoading = false,
}) => {
  const form = useForm<AdminProfileUpdateRequest>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      adminNickName: currentProfile.adminNickName || '',
      adminPhone: currentProfile.adminPhone || '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        adminNickName: currentProfile.adminNickName || '',
        adminPhone: currentProfile.adminPhone || '',
      });
    }
  }, [open, currentProfile, form]);

  const handleSubmit = (data: AdminProfileUpdateRequest) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="adminNickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="닉네임을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="전화번호를 입력하세요 (선택사항)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
