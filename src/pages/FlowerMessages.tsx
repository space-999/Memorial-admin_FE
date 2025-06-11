
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SearchFilters } from '@/components/SearchFilters';
import { FlowerMessageDialog } from '@/components/FlowerMessageDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { AdminMessageSearchCondition } from '@/types/admin';

export const FlowerMessages = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteFlag, setDeleteFlag] = useState<'Y' | 'N' | ''>('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  const { data: messagesData, isLoading, error, refetch } = useQuery({
    queryKey: ['flowerMessages', searchKeyword, startDate, endDate, deleteFlag],
    queryFn: () => {
      console.log('Fetching flower messages with filters:', {
        searchKeyword,
        startDate,
        endDate,
        deleteFlag
      });
      
      const condition: AdminMessageSearchCondition = {
        searchKeyword: searchKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        deleteFlag: deleteFlag || undefined
      };
      
      const pageable = { page: 0, size: 100 };
      return apiClient.getFlowerMessages(condition, pageable);
    },
  });

  const handleSearch = () => {
    console.log('Search triggered with filters:', {
      searchKeyword,
      startDate,
      endDate,
      deleteFlag
    });
    refetch();
  };

  const handleReset = () => {
    console.log('Reset filters');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    setDeleteFlag('');
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditMessage = (message: any) => {
    setSelectedMessage(message);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await apiClient.deleteFlowerMessage(messageId);
      refetch();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleSaveMessage = async (data: { content: string }) => {
    if (!selectedMessage) return;
    
    try {
      await apiClient.updateFlowerMessage(selectedMessage.flowerMessageId, { content: data.content });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        메시지를 불러오는데 실패했습니다.
      </div>
    );
  }

  console.log('Flower messages response:', messagesData);

  const messages = messagesData?.data?.content || [];

  if (messages.length === 0) {
    console.log('No content in response or invalid response structure');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">꽃 메시지 관리</h1>
      
      <SearchFilters
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        deleteFlag={deleteFlag}
        onDeleteFlagChange={(value) => setDeleteFlag(value as 'Y' | 'N' | '')}
        onSearch={handleSearch}
        onReset={handleReset}
        showDeleteFlag={true}
      />

      <Card>
        <CardHeader>
          <CardTitle>꽃 메시지 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message: any) => (
                  <TableRow key={message.flowerMessageId}>
                    <TableCell>{message.flowerMessageId}</TableCell>
                    <TableCell>{message.writerName || '익명'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.flowerMessageContent}
                    </TableCell>
                    <TableCell>
                      {new Date(message.createTime).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.deleteFlag ? 'destructive' : 'default'}>
                        {message.deleteFlag ? '삭제됨' : '활성'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMessage(message)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMessage(message.flowerMessageId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FlowerMessageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        message={selectedMessage}
        onSave={handleSaveMessage}
      />
    </div>
  );
};
