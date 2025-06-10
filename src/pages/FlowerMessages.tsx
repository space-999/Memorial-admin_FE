
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { FlowerMessage, AdminMessageSearchCondition } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Download } from 'lucide-react';
import { FlowerMessageDialog } from '@/components/FlowerMessageDialog';

export const FlowerMessages: React.FC = () => {
  const [messages, setMessages] = useState<FlowerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<FlowerMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const condition: AdminMessageSearchCondition = {
        messageType: 'FLOWER',
        deleteFlag: 'N'
      };
      const response = await apiClient.getFlowerMessages(condition);
      setMessages(response.content || []);
    } catch (error) {
      console.error('Failed to fetch flower messages:', error);
      toast({
        title: '오류',
        description: '꽃 메시지를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (message: FlowerMessage) => {
    setEditingMessage(message);
    setDialogOpen(true);
  };

  const handleDelete = async (messageId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await apiClient.deleteFlowerMessage(messageId);
      if (response.success) {
        toast({
          title: '삭제 완료',
          description: '꽃 메시지가 삭제되었습니다.',
        });
        fetchMessages();
      } else {
        throw new Error(response.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast({
        title: '삭제 실패',
        description: '메시지 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const condition: AdminMessageSearchCondition = {
        messageType: 'FLOWER'
      };
      const blob = await apiClient.downloadMessagesExcel(condition);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flower_messages_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: '다운로드 완료',
        description: '꽃 메시지 목록이 엑셀 파일로 다운로드되었습니다.',
      });
    } catch (error) {
      console.error('Failed to download excel:', error);
      toast({
        title: '다운로드 실패',
        description: '엑셀 다운로드에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (messageData: { content: string }) => {
    try {
      if (editingMessage) {
        const response = await apiClient.updateFlowerMessage(editingMessage.id, messageData);
        if (response.success) {
          toast({
            title: '수정 완료',
            description: '꽃 메시지가 수정되었습니다.',
          });
          setDialogOpen(false);
          setEditingMessage(null);
          fetchMessages();
        } else {
          throw new Error(response.message || '수정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Failed to save message:', error);
      toast({
        title: '저장 실패',
        description: '메시지 저장에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">꽃 메시지 관리</h1>
          <Button disabled>
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
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
          <h1 className="text-3xl font-bold">꽃 메시지 관리</h1>
          <p className="text-muted-foreground">추모의 정원에 등록된 꽃 메시지를 관리합니다.</p>
        </div>
        <Button onClick={handleDownloadExcel}>
          <Download className="mr-2 h-4 w-4" />
          엑셀 다운로드
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>꽃 메시지 목록</CardTitle>
          <CardDescription>
            총 {messages.length}개의 메시지가 등록되어 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>내용</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                  <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={message.deleteFlag === 'N' ? 'default' : 'secondary'}>
                      {message.deleteFlag === 'N' ? '표시' : '삭제됨'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(message)}
                        disabled={message.deleteFlag === 'Y'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        disabled={message.deleteFlag === 'Y'}
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

      <FlowerMessageDialog
        message={editingMessage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
};
