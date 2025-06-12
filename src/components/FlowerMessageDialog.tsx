
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminFlowerMessageResponseDto } from '@/types/admin';

interface FlowerMessageDialogProps {
  message: AdminFlowerMessageResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'edit';
  onSave: (data: { content: string }) => Promise<void>;
}

export const FlowerMessageDialog: React.FC<FlowerMessageDialogProps> = ({
  message,
  open,
  onOpenChange,
  mode,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setContent(message.content || '');
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    setLoading(true);
    try {
      await onSave({ content });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? '꽃 메시지 보기' : '꽃 메시지 수정'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">메시지 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={50}
              placeholder="메시지 내용을 입력하세요 (최대 50자)"
              required
              readOnly={mode === 'view'}
            />
            <div className="text-xs text-muted-foreground">
              {content.length}/50자
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'view' ? '닫기' : '취소'}
            </Button>
            {mode === 'edit' && (
              <Button type="submit" disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
