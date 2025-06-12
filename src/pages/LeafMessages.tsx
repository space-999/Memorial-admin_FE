
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { AdminMessageSearchCondition } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download } from 'lucide-react';
import { SearchFilters } from '@/components/SearchFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export const LeafMessages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const { toast } = useToast();

  // 검색 필터 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: messagesData, isLoading, error, refetch } = useQuery({
    queryKey: ['leafMessages', searchKeyword, startDate, endDate, currentPage],
    queryFn: () => {
      console.log('Fetching leaf messages with filters:', {
        searchKeyword,
        startDate,
        endDate,
        page: currentPage
      });
      
      const condition: AdminMessageSearchCondition = {
        messageType: 'LEAF',
        searchKeyword: searchKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      
      const pageable = { page: currentPage, size: pageSize };
      return apiClient.getLeafMessages(condition, pageable);
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

  const handleDelete = async (messageId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await apiClient.deleteLeafMessage(messageId);
      if (response && response.success) {
        toast({
          title: '삭제 완료',
          description: '나뭇잎 메시지가 삭제되었습니다.',
        });
        refetch();
      } else {
        throw new Error('삭제에 실패했습니다.');
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
        messageType: 'LEAF',
        searchKeyword: searchKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      const blob = await apiClient.downloadMessagesExcel(condition);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leaf_messages_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: '다운로드 완료',
        description: '나뭇잎 메시지 목록이 엑셀 파일로 다운로드되었습니다.',
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
        나뭇잎 메시지를 불러오는데 실패했습니다.
      </div>
    );
  }

  // API 명세서에 따라 ApiResponse<PageResponse<...>> 구조로 수정
  const messages = messagesData?.data?.content || [];
  const totalPages = messagesData?.data?.totalPages || 0;
  const totalElements = messagesData?.data?.totalElements || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">나뭇잎 메시지 관리</h1>
          <p className="text-muted-foreground">추모의 정원에 등록된 나뭇잎 메시지를 관리합니다.</p>
        </div>
        <Button onClick={handleDownloadExcel}>
          <Download className="mr-2 h-4 w-4" />
          엑셀 다운로드
        </Button>
      </div>

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
          <CardTitle>나뭇잎 메시지 목록</CardTitle>
          <CardDescription>
            총 {totalElements}개의 메시지가 등록되어 있습니다.
          </CardDescription>
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
                      <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                      <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={message.deleteFlag === 'N' ? 'default' : 'secondary'}>
                          {message.deleteFlag === 'N' ? '표시' : '삭제됨'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                          disabled={message.deleteFlag === 'Y'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
    </div>
  );
};
