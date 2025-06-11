
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
import { AdminPasswordUpdateRequest } from '@/types/admin';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
  newPassword: z.string().min(6, '새 비밀번호는 최소 6자 이상이어야 합니다.'),
  confirmNewPassword: z.string().min(1, '새 비밀번호 확인을 입력해주세요.'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "새 비밀번호가 일치하지 않습니다.",
  path: ["confirmNewPassword"],
});

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AdminPasswordUpdateRequest) => void;
  isLoading?: boolean;
}

export const PasswordDialog: React.FC<PasswordDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}) => {
  const form = useForm<AdminPasswordUpdateRequest>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [open, form]);

  const handleSubmit = (data: AdminPasswordUpdateRequest) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="현재 비밀번호를 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="새 비밀번호를 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="새 비밀번호를 다시 입력하세요" />
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
                {isLoading ? '변경 중...' : '변경'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
