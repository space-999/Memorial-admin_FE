
import { AdminAccountResponseDto } from '@/types/admin';

export const GRADE_NAMES = {
  0: 'VIEWER',
  1: 'EDITOR', 
  2: 'MANAGER',
  3: 'SUPER_ADMIN'
} as const;

export const canManageAdmins = (user: AdminAccountResponseDto | null): boolean => {
  return user ? user.adminGrade >= 2 : false;
};

export const canViewLogs = (user: AdminAccountResponseDto | null): boolean => {
  return user ? user.adminGrade >= 2 : false;
};

export const canViewAdminStats = (user: AdminAccountResponseDto | null): boolean => {
  return user ? user.adminGrade >= 2 : false;
};

export const getGradeName = (grade: number): string => {
  return GRADE_NAMES[grade as keyof typeof GRADE_NAMES] || 'UNKNOWN';
};
