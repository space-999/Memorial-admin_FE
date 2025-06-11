import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AdminMessageSearchCondition, Pageable } from '@/types/admin';
import { SearchFilters } from '@/components/SearchFilters';
import { FlowerMessageDialog } from '@/components/FlowerMessageDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Download } from 'lucide-react';

export const FlowerMessages = () => {
  const [searchCondition, setSearchCondition] = useState<AdminMessageSearchCondition>({});
  const [pageable, setPageable] = useState<Pageable>({ page: 0, size: 20 });
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: messagesResponse, isLoading, refetch } = useQuery({
    queryKey: ['flowerMessages', searchCondition, pageable],
    queryFn: () => {
      console.log('Fetching flower messages with filters:', searchCondition);
      return apiClient.getFlowerMessages(searchCondition, pageable);
    },
  });

  console.log('Flower messages response:', messagesResponse);

  const messages = messagesResponse?.data?.content || [];
  const totalPages = messagesResponse?.data?.totalPages || 0;
  const totalElements = messagesResponse?.data?.totalElements || 0;

  const handleSearch = (filters: AdminMessageSearchCondition) => {
    console.log('Search filters applied:', filters);
    setSearchCondition(filters);
    setPageable(prev => ({ ...prev, page: 0 }));
  };

  const handleUpdate = async (messageId: number, content: string) => {
    try {
      await apiClient.updateFlowerMessage(messageId, { content });
      toast({
        title: "성공",
        description: "꽃 메시지가 수정되었습니다.",
      });
      refetch();
      setIsDialogOpen(false);
      setEditingMessage(null);
    } catch (error) {
      toast({
        title: "오류",
        description: "꽃 메시지 수정에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (messageId: number) => {
    if (confirm('정말로 이 메시지를 삭제하시겠습니까?')) {
      try {
        await apiClient.deleteFlowerMessage(messageId);
        toast({
          title: "성공",
          description: "꽃 메시지가 삭제되었습니다.",
        });
        refetch();
      } catch (error) {
        toast({
          title: "오류",
          description: "꽃 메시지 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await apiClient.downloadMessagesExcel(searchCondition);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flower-messages.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "성공",
        description: "Excel 파일이 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "Excel 다운로드에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">꽃 메시지 관리</h1>
        <Button onClick={handleDownloadExcel} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Excel 다운로드
        </Button>
      </div>

      <SearchFilters onSearch={handleSearch} />

      <Card>
        <CardHeader>
          <CardTitle>꽃 메시지 목록 (총 {totalElements}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                등록된 꽃 메시지가 없습니다.
              </div>
            ) : (
              messages.map((message: any) => (
                <div key={message.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">#{message.id}</p>
                      <p className="mt-2">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        작성일: {new Date(message.createdAt).toLocaleString('ko-KR')}
                        {message.updatedAt && (
                          <span> | 수정일: {new Date(message.updatedAt).toLocaleString('ko-KR')}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMessage(message);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                disabled={pageable.page === 0}
                onClick={() => setPageable(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                이전
              </Button>
              <span className="text-sm">
                {pageable.page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pageable.page >= totalPages - 1}
                onClick={() => setPageable(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FlowerMessageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        message={editingMessage}
        onSave={handleUpdate}
      />
    </div>
  );
};
