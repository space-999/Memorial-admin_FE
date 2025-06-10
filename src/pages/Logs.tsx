
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { AdminLoginHistResponseDto, AdminActHistResponseDto, AdminLogSearchConditionDto } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { LogSearchFilters } from '@/components/LogSearchFilters';

export const Logs: React.FC = () => {
  const [loginLogs, setLoginLogs] = useState<AdminLoginHistResponseDto[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActHistResponseDto[]>([]);
  const [loginLoading, setLoginLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const { toast } = useToast();

  // 로그인 로그 검색 필터
  const [loginAdminId, setLoginAdminId] = useState('');
  const [loginStartDate, setLoginStartDate] = useState('');
  const [loginEndDate, setLoginEndDate] = useState('');
  const [loginIpAddress, setLoginIpAddress] = useState('');

  // 활동 로그 검색 필터
  const [activityAdminId, setActivityAdminId] = useState('');
  const [activityStartDate, setActivityStartDate] = useState('');
  const [activityEndDate, setActivityEndDate] = useState('');
  const [activityIpAddress, setActivityIpAddress] = useState('');
  const [actType, setActType] = useState('');

  useEffect(() => {
    fetchLoginLogs();
    fetchActivityLogs();
  }, []);

  const fetchLoginLogs = async () => {
    try {
      setLoginLoading(true);
      const condition: AdminLogSearchConditionDto = {
        adminId: loginAdminId || undefined,
        startDate: loginStartDate || undefined,
        endDate: loginEndDate || undefined,
        ipAddress: loginIpAddress || undefined
      };
      const response = await apiClient.getLoginLogs(condition);
      if (response.success && response.data) {
        setLoginLogs(response.data.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch login logs:', error);
      toast({
        title: '오류',
        description: '로그인 기록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setActivityLoading(true);
      const condition: AdminLogSearchConditionDto = {
        adminId: activityAdminId || undefined,
        startDate: activityStartDate || undefined,
        endDate: activityEndDate || undefined,
        ipAddress: activityIpAddress || undefined,
        actType: actType || undefined
      };
      const response = await apiClient.getActivityLogs(condition);
      if (response.success && response.data) {
        setActivityLogs(response.data.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      toast({
        title: '오류',
        description: '활동 로그를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setActivityLoading(false);
    }
  };

  const handleLoginLogSearch = () => {
    fetchLoginLogs();
  };

  const handleLoginLogReset = () => {
    setLoginAdminId('');
    setLoginStartDate('');
    setLoginEndDate('');
    setLoginIpAddress('');
    setTimeout(() => {
      fetchLoginLogs();
    }, 100);
  };

  const handleActivityLogSearch = () => {
    fetchActivityLogs();
  };

  const handleActivityLogReset = () => {
    setActivityAdminId('');
    setActivityStartDate('');
    setActivityEndDate('');
    setActivityIpAddress('');
    setActType('');
    setTimeout(() => {
      fetchActivityLogs();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">로그 관리</h1>
        <p className="text-muted-foreground">시스템 로그인 기록과 활동 로그를 확인합니다.</p>
      </div>

      <Tabs defaultValue="login" className="space-y-4">
        <TabsList>
          <TabsTrigger value="login">로그인 기록</TabsTrigger>
          <TabsTrigger value="activity">활동 로그</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LogSearchFilters
            adminId={loginAdminId}
            onAdminIdChange={setLoginAdminId}
            startDate={loginStartDate}
            onStartDateChange={setLoginStartDate}
            endDate={loginEndDate}
            onEndDateChange={setLoginEndDate}
            ipAddress={loginIpAddress}
            onIpAddressChange={setLoginIpAddress}
            onSearch={handleLoginLogSearch}
            onReset={handleLoginLogReset}
          />

          <Card>
            <CardHeader>
              <CardTitle>로그인 기록</CardTitle>
              <CardDescription>
                관리자 로그인 기록을 확인할 수 있습니다. (총 {loginLogs.length}건)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>로그인 인덱스</TableHead>
                      <TableHead>관리자 인덱스</TableHead>
                      <TableHead>관리자 ID</TableHead>
                      <TableHead>관리자 닉네임</TableHead>
                      <TableHead>로그인 시간</TableHead>
                      <TableHead>IP 주소</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginLogs.map((log) => (
                      <TableRow key={log.loginIndex}>
                        <TableCell>{log.loginIndex}</TableCell>
                        <TableCell>{log.adminIndex}</TableCell>
                        <TableCell>{log.adminId}</TableCell>
                        <TableCell>{log.adminNickname}</TableCell>
                        <TableCell>
                          {new Date(log.loginTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.loginIp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <LogSearchFilters
            adminId={activityAdminId}
            onAdminIdChange={setActivityAdminId}
            startDate={activityStartDate}
            onStartDateChange={setActivityStartDate}
            endDate={activityEndDate}
            onEndDateChange={setActivityEndDate}
            ipAddress={activityIpAddress}
            onIpAddressChange={setActivityIpAddress}
            actType={actType}
            onActTypeChange={setActType}
            onSearch={handleActivityLogSearch}
            onReset={handleActivityLogReset}
            showActType={true}
          />

          <Card>
            <CardHeader>
              <CardTitle>활동 로그</CardTitle>
              <CardDescription>
                관리자의 시스템 활동 내역을 확인할 수 있습니다. (총 {activityLogs.length}건)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>활동 인덱스</TableHead>
                      <TableHead>관리자 인덱스</TableHead>
                      <TableHead>관리자 ID</TableHead>
                      <TableHead>관리자 닉네임</TableHead>
                      <TableHead>활동 타입</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>세부사항</TableHead>
                      <TableHead>시간</TableHead>
                      <TableHead>IP 주소</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.actIndex}>
                        <TableCell>{log.actIndex}</TableCell>
                        <TableCell>{log.adminIndex}</TableCell>
                        <TableCell>{log.adminId}</TableCell>
                        <TableCell>{log.adminNickName}</TableCell>
                        <TableCell>{log.actType}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.actUrl}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.actDetail}</TableCell>
                        <TableCell>
                          {new Date(log.actTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.actIp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
