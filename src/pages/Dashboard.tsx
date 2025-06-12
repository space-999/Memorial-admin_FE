
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/admin';
import { apiClient } from '@/lib/api';
import { Users, FileText, Book, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFlowerMessages: 0,
    totalLeafMessages: 0,
    totalAdmins: 0,
    todayLogins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 각 API에서 데이터를 가져와서 통계 계산
        const [flowerMessages, leafMessages, adminAccounts, loginLogs] = await Promise.all([
          apiClient.getFlowerMessages(),
          apiClient.getLeafMessages(),
          apiClient.getAdminAccounts(),
          apiClient.getLoginLogs(),
        ]);

        const today = new Date().toDateString();
        const todayLogins = Array.isArray(loginLogs?.data?.content) 
          ? loginLogs.data.content.filter((log: any) => new Date(log.loginTime).toDateString() === today).length 
          : 0;

        setStats({
          // 꽃 메시지는 ApiResponse.data.totalElements 사용
          totalFlowerMessages: flowerMessages?.data?.totalElements || 0,
          totalLeafMessages: leafMessages?.data?.content?.length || 0,
          totalAdmins: Array.isArray(adminAccounts?.data) ? adminAccounts.data.length : 0,
          todayLogins,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: '꽃 메시지',
      value: stats.totalFlowerMessages,
      description: '총 등록된 꽃 메시지 수',
      icon: Book,
      color: 'text-pink-600',
    },
    {
      title: '나뭇잎 메시지',
      value: stats.totalLeafMessages,
      description: '총 등록된 나뭇잎 메시지 수',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: '관리자 계정',
      value: stats.totalAdmins,
      description: '총 관리자 계정 수',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: '오늘 로그인',
      value: stats.todayLogins,
      description: '오늘 로그인한 관리자 수',
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">추모의 정원 관리자 현황을 확인하세요.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>시스템 현황</CardTitle>
            <CardDescription>
              추모의 정원 시스템의 전반적인 상태를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">서버 상태</span>
                <span className="text-sm text-green-600 font-medium">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">데이터베이스</span>
                <span className="text-sm text-green-600 font-medium">연결됨</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">마지막 백업</span>
                <span className="text-sm text-muted-foreground">2시간 전</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>
              자주 사용하는 관리 기능에 빠르게 접근하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link 
                to="/flower-messages" 
                className="text-sm text-primary hover:underline"
              >
                → 꽃 메시지 관리
              </Link>
              <Link 
                to="/leaf-messages" 
                className="text-sm text-primary hover:underline"
              >
                → 나뭇잎 메시지 관리
              </Link>
              <Link 
                to="/admin-accounts" 
                className="text-sm text-primary hover:underline"
              >
                → 관리자 계정 관리
              </Link>
              <Link 
                to="/logs" 
                className="text-sm text-primary hover:underline"
              >
                → 시스템 로그 확인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
