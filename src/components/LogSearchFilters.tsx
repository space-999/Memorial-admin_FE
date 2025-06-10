
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface LogSearchFiltersProps {
  adminId: string;
  onAdminIdChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  ipAddress: string;
  onIpAddressChange: (value: string) => void;
  actType?: string;
  onActTypeChange?: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  showActType?: boolean;
}

export const LogSearchFilters: React.FC<LogSearchFiltersProps> = ({
  adminId,
  onAdminIdChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  ipAddress,
  onIpAddressChange,
  actType,
  onActTypeChange,
  onSearch,
  onReset,
  showActType = false,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">로그 검색 필터</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminId">관리자 ID</Label>
            <Input
              id="adminId"
              value={adminId}
              onChange={(e) => onAdminIdChange(e.target.value)}
              placeholder="관리자 ID 검색..."
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
          
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP 주소</Label>
            <Input
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => onIpAddressChange(e.target.value)}
              placeholder="IP 주소 검색..."
            />
          </div>
          
          {showActType && onActTypeChange && (
            <div className="space-y-2">
              <Label htmlFor="actType">활동 타입</Label>
              <Input
                id="actType"
                value={actType}
                onChange={(e) => onActTypeChange(e.target.value)}
                placeholder="활동 타입 검색..."
              />
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
