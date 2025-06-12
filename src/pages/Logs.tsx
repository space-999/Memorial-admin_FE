
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { AdminLogSearchCondition } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { LogSearchFilters } from '@/components/LogSearchFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export const Logs: React.FC = () => {
  const { toast } = useToast();
  const [currentLoginPage, setCurrentLoginPage] = useState(0);
  const [currentActivityPage, setCurrentActivityPage] = useState(0);
  const [pageSize] = useState(20);

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

  const { data: loginLogsData, isLoading: loginLoading, refetch: refetchLoginLogs } = useQuery({
    queryKey: ['loginLogs', loginAdminId, loginStartDate, loginEndDate, loginIpAddress, currentLoginPage],
    queryFn: () => {
      const condition: AdminLogSearchCondition = {
        adminId: loginAdminId || undefined,
        startDate: loginStartDate || undefined,
        endDate: loginEndDate || undefined,
        ipAddress: loginIpAddress || undefined
      };
      const pageable = { page: currentLoginPage, size: pageSize };
      return apiClient.getLoginLogs(condition, pageable);
    },
  });

  const { data: activityLogsData, isLoading: activityLoading, refetch: refetchActivityLogs } = useQuery({
    queryKey: ['activityLogs', activityAdminId, activityStartDate, activityEndDate, activityIpAddress, actType, currentActivityPage],
    queryFn: () => {
      const condition: AdminLogSearchCondition = {
        adminId: activityAdminId || undefined,
        startDate: activityStartDate || undefined,
        endDate: activityEndDate || undefined,
        ipAddress: activityIpAddress || undefined,
        actType: actType || undefined
      };
      const pageable = { page: currentActivityPage, size: pageSize };
      return apiClient.getActivityLogs(condition, pageable);
    },
  });

  const handleLoginLogSearch = () => {
    setCurrentLoginPage(0);
    refetchLoginLogs();
  };

  const handleLoginLogReset = () => {
    setLoginAdminId('');
    setLoginStartDate('');
    setLoginEndDate('');
    setLoginIpAddress('');
    setCurrentLoginPage(0);
    setTimeout(() => {
      refetchLoginLogs();
    }, 100);
  };

  const handleActivityLogSearch = () => {
    setCurrentActivityPage(0);
    refetchActivityLogs();
  };

  const handleActivityLogReset = () => {
    setActivityAdminId('');
    setActivityStartDate('');
    setActivityEndDate('');
    setActivityIpAddress('');
    setActType('');
    setCurrentActivityPage(0);
    setTimeout(() => {
      refetchActivityLogs();
    }, 100);
  };

  const handleLoginPageChange = (page: number) => {
    setCurrentLoginPage(page);
  };

  const handleActivityPageChange = (page: number) => {
    setCurrentActivityPage(page);
  };

  const loginLogs = loginLogsData?.data?.content || [];
  const loginTotalPages = loginLogsData?.data?.totalPages || 0;
  const loginTotalElements = loginLogsData?.data?.totalElements || 0;

  const activityLogs = activityLogsData?.data?.content || [];
  const activityTotalPages = activityLogsData?.data?.totalPages || 0;
  const activityTotalElements = activityLogsData?.data?.totalElements || 0;

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
                관리자 로그인 기록을 확인할 수 있습니다. (총 {loginTotalElements}건)
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
                <>
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
                      {loginLogs.map((log: any) => (
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
                  
                  {loginTotalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleLoginPageChange(Math.max(0, currentLoginPage - 1))}
                              className={currentLoginPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, loginTotalPages) }, (_, i) => {
                            const startPage = Math.max(0, Math.min(currentLoginPage - 2, loginTotalPages - 5));
                            const pageNum = startPage + i;
                            
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  onClick={() => handleLoginPageChange(pageNum)}
                                  isActive={currentLoginPage === pageNum}
                                  className="cursor-pointer"
                                >
                                  {pageNum + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleLoginPageChange(Math.min(loginTotalPages - 1, currentLoginPage + 1))}
                              className={currentLoginPage >= loginTotalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                관리자의 시스템 활동 내역을 확인할 수 있습니다. (총 {activityTotalElements}건)
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
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>활동 인덱스</TableHead>
                          <TableHead>관리자 인덱스</TableHead>
                          <TableHead>관리자 ID</TableHead>
                          <TableHead>관리자 닉네임</TableHead>
                          <TableHead>활동 타입</TableHead>
                          <TableHead>URL</TableHead>
                          <TableHead className="min-w-[200px]">세부사항</TableHead>
                          <TableHead>시간</TableHead>
                          <TableHead>IP 주소</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.map((log: any) => (
                          <TableRow key={log.actIndex}>
                            <TableCell>{log.actIndex}</TableCell>
                            <TableCell>{log.adminIndex}</TableCell>
                            <TableCell>{log.adminId}</TableCell>
                            <TableCell>{log.adminNickName}</TableCell>
                            <TableCell>{log.actType}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="overflow-x-auto">
                                <div className="whitespace-nowrap">{log.actUrl}</div>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[200px]">
                              <div className="max-h-20 overflow-y-auto overflow-x-auto border rounded p-2 bg-muted/50">
                                <div className="whitespace-pre-wrap break-words text-sm">{log.actDetail}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(log.actTime).toLocaleString()}
                            </TableCell>
                            <TableCell>{log.actIp}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {activityTotalPages > 1 && (
                    <div className="mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handleActivityPageChange(Math.max(0, currentActivityPage - 1))}
                              className={currentActivityPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: Math.min(5, activityTotalPages) }, (_, i) => {
                            const startPage = Math.max(0, Math.min(currentActivityPage - 2, activityTotalPages - 5));
                            const pageNum = startPage + i;
                            
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  onClick={() => handleActivityPageChange(pageNum)}
                                  isActive={currentActivityPage === pageNum}
                                  className="cursor-pointer"
                                >
                                  {pageNum + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handleActivityPageChange(Math.min(activityTotalPages - 1, currentActivityPage + 1))}
                              className={currentActivityPage >= activityTotalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
