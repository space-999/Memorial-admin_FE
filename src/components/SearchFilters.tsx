
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  messageType?: 'FLOWER' | 'LEAF' | '';
  onMessageTypeChange?: (value: string) => void;
  deleteFlag?: 'Y' | 'N' | '';
  onDeleteFlagChange?: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  showMessageType?: boolean;
  showDeleteFlag?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchKeyword,
  onSearchKeywordChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  messageType,
  onMessageTypeChange,
  deleteFlag,
  onDeleteFlagChange,
  onSearch,
  onReset,
  showMessageType = false,
  showDeleteFlag = true,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">검색 필터</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="searchKeyword">검색어</Label>
            <Input
              id="searchKeyword"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              placeholder="내용 검색..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">시작일</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">종료일</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          
          {showMessageType && onMessageTypeChange && (
            <div className="space-y-2">
              <Label>메시지 타입</Label>
              <Select value={messageType} onValueChange={onMessageTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="FLOWER">꽃 메시지</SelectItem>
                  <SelectItem value="LEAF">나뭇잎 메시지</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {showDeleteFlag && onDeleteFlagChange && (
            <div className="space-y-2">
              <Label>상태</Label>
              <Select value={deleteFlag} onValueChange={onDeleteFlagChange}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">전체</SelectItem>
                  <SelectItem value="N">표시</SelectItem>
                  <SelectItem value="Y">삭제됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button onClick={onSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            검색
          </Button>
          <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
