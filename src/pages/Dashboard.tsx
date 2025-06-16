
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/admin';
import { apiClient } from '@/lib/api';
import { Users, FileText, Book, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFlowerMessages: 0,
    totalLeafMessages: 0,
    totalAdmins: 0,
    todayLogins: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = {
          totalFlowerMessages: 0,
          totalLeafMessages: 0,
          totalAdmins: 0,
          todayLogins: 0,
        };

        // 각 API 호출을 개별적으로 처리하여 일부 실패해도 다른 데이터는 가져올 수 있도록 함
        try {
          const flowerMessages = await apiClient.getFlowerMessages();
          if (flowerMessages?.success && flowerMessages.data) {
            statsData.totalFlowerMessages = flowerMessages.data.totalElements || 0;
          }
        } catch (error) {
          console.error('Failed to fetch flower messages:', error);
        }

        try {
          const leafMessages = await apiClient.getLeafMessages();
          if (leafMessages?.success && leafMessages.data) {
            statsData.totalLeafMessages = leafMessages.data.totalElements || 0;
          }
        } catch (error) {
          console.error('Failed to fetch leaf messages:', error);
        }

        try {
          const adminAccounts = await apiClient.getAdminAccounts();
          if (adminAccounts?.success && adminAccounts.data) {
            statsData.totalAdmins = Array.isArray(adminAccounts.data) ? adminAccounts.data.length : 0;
          }
        } catch (error) {
          console.error('Failed to fetch admin accounts:', error);
        }

        try {
          const loginLogs = await apiClient.getLoginLogs();
          if (loginLogs?.success && loginLogs.data?.content) {
            const today = new Date().toDateString();
            statsData.todayLogins = loginLogs.data.content.filter((log: any) => 
              new Date(log.loginTime).toDateString() === today
            ).length;
          }
        } catch (error) {
          console.error('Failed to fetch login logs:', error);
        }

        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast({
          title: '일부 데이터 로드 실패',
          description: '권한이 없는 데이터가 있을 수 있습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

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
                to="/admin/flower-messages" 
                className="text-sm text-primary hover:underline"
              >
                → 꽃 메시지 관리
              </Link>
              <Link 
                to="/admin/leaf-messages" 
                className="text-sm text-primary hover:underline"
              >
                → 나뭇잎 메시지 관리
              </Link>
              <Link 
                to="/admin/admin-accounts" 
                className="text-sm text-primary hover:underline"
              >
                → 관리자 계정 관리
              </Link>
              <Link 
                to="/admin/logs" 
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
