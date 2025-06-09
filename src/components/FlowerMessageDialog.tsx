
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FlowerMessage } from '@/types/admin';

interface FlowerMessageDialogProps {
  message: FlowerMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<FlowerMessage>) => Promise<void>;
}

export const FlowerMessageDialog: React.FC<FlowerMessageDialogProps> = ({
  message,
  open,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    authorName: '',
    isVisible: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setFormData({
        content: message.content,
        authorName: message.authorName,
        isVisible: message.isVisible,
      });
    }
  }, [message]);

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
          <DialogTitle>꽃 메시지 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">작성자명</Label>
            <Input
              id="authorName"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">메시지 내용</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isVisible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
            />
            <Label htmlFor="isVisible">메시지 표시</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
