
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { LoginLog, ActivityLog } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const Logs: React.FC = () => {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loginLoading, setLoginLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoginLogs();
    fetchActivityLogs();
  }, []);

  const fetchLoginLogs = async () => {
    try {
      setLoginLoading(true);
      const data = await apiClient.getLoginLogs() as LoginLog[];
      setLoginLogs(Array.isArray(data) ? data : []);
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
      const data = await apiClient.getActivityLogs() as ActivityLog[];
      setActivityLogs(Array.isArray(data) ? data : []);
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
          <Card>
            <CardHeader>
              <CardTitle>로그인 기록</CardTitle>
              <CardDescription>
                관리자 로그인 기록을 확인할 수 있습니다.
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
                      <TableHead>ID</TableHead>
                      <TableHead>관리자명</TableHead>
                      <TableHead>로그인 시간</TableHead>
                      <TableHead>IP 주소</TableHead>
                      <TableHead>브라우저</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginLogs.map((log) => (
                      <TableRow key={log.logId}>
                        <TableCell>{log.logId}</TableCell>
                        <TableCell>{log.adminName}</TableCell>
                        <TableCell>
                          {new Date(log.loginTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.userAgent}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>활동 로그</CardTitle>
              <CardDescription>
                관리자의 시스템 활동 내역을 확인할 수 있습니다.
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
                      <TableHead>ID</TableHead>
                      <TableHead>관리자명</TableHead>
                      <TableHead>작업</TableHead>
                      <TableHead>세부사항</TableHead>
                      <TableHead>시간</TableHead>
                      <TableHead>IP 주소</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.logId}>
                        <TableCell>{log.logId}</TableCell>
                        <TableCell>{log.adminName}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.details}
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
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
