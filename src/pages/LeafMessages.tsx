
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { AdminLeafMessageResponseDto, AdminMessageSearchConditionDto } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download } from 'lucide-react';
import { SearchFilters } from '@/components/SearchFilters';

export const LeafMessages: React.FC = () => {
  const [messages, setMessages] = useState<AdminLeafMessageResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 검색 필터 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching leaf messages with filters:', {
        searchKeyword,
        startDate,
        endDate
      });
      
      const condition: AdminMessageSearchConditionDto = {
        messageType: 'LEAF',
        searchKeyword: searchKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      
      const pageable = { page: 0, size: 100 };
      const response = await apiClient.getLeafMessages(condition, pageable);
      console.log('Leaf messages response:', response);
      
      if (response && response.success && response.data && response.data.content) {
        setMessages(response.data.content);
      } else {
        console.log('No content in response or invalid response structure');
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to fetch leaf messages:', error);
      toast({
        title: '오류',
        description: '나뭇잎 메시지를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Search triggered with filters:', {
      searchKeyword,
      startDate,
      endDate
    });
    fetchMessages();
  };

  const handleReset = () => {
    console.log('Reset filters');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    // 초기화 후 다시 검색
    setTimeout(() => {
      fetchMessages();
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
        fetchMessages();
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
      const condition: AdminMessageSearchConditionDto = {
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
            총 {messages.length}개의 메시지가 등록되어 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
