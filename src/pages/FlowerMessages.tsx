
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SearchFilters } from '@/components/SearchFilters';
import { FlowerMessageDialog } from '@/components/FlowerMessageDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AdminMessageSearchCondition } from '@/types/admin';

export const FlowerMessages = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);

  const { data: messagesData, isLoading, error, refetch } = useQuery({
    queryKey: ['flowerMessages', searchKeyword, startDate, endDate, currentPage],
    queryFn: () => {
      console.log('Fetching flower messages with filters:', {
        searchKeyword,
        startDate,
        endDate,
        page: currentPage
      });
      
      const condition: AdminMessageSearchCondition = {
        searchKeyword: searchKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      
      const pageable = { page: currentPage, size: pageSize };
      return apiClient.getFlowerMessages(condition, pageable);
    },
  });

  const handleSearch = () => {
    console.log('Search triggered with filters:', {
      searchKeyword,
      startDate,
      endDate
    });
    setCurrentPage(0);
    refetch();
  };

  const handleReset = () => {
    console.log('Reset filters');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
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
      await apiClient.updateFlowerMessage(selectedMessage.id, { content: data.content });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const messages = messagesData?.data?.data?.content || [];
  const totalPages = messagesData?.data?.data?.totalPages || 0;
  const totalElements = messagesData?.data?.data?.totalElements || 0;
  
  if (messages.length === 0 && totalElements === 0) {
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
        onSearch={handleSearch}
        onReset={handleReset}
        showDeleteFlag={false}
      />

      <Card>
        <CardHeader>
          <CardTitle>꽃 메시지 목록 (총 {totalElements}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : (
            <>
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
                  {messages.map((message: any) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.id}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {message.content}
                      </TableCell>
                      <TableCell>
                        {new Date(message.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
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
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                          className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                        const pageNum = startPage + i;
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                          className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <FlowerMessageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        message={selectedMessage}
        mode={dialogMode}
        onSave={handleSaveMessage}
      />
    </div>
  );
};
