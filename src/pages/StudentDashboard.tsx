
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Calendar } from 'lucide-react';

// Student dashboard specific translations
const studentDashboardTranslations = {
  en: {
    studentDashboardTitle: 'Student Dashboard',
    welcome: 'Welcome, Student',
    currentBalance: 'Current Balance',
    transactionHistory: 'Transaction History',
    upcomingPayments: 'Upcoming Payments',
    viewAll: 'View All',
    noTransactions: 'No recent transactions',
    noPayments: 'No upcoming payments',
  },
  ar: {
    studentDashboardTitle: 'لوحة تحكم الطالب',
    welcome: 'مرحبًا، طالب',
    currentBalance: 'الرصيد الحالي',
    transactionHistory: 'سجل المعاملات',
    upcomingPayments: 'المدفوعات القادمة',
    viewAll: 'عرض الكل',
    noTransactions: 'لا توجد معاملات حديثة',
    noPayments: 'لا توجد مدفوعات قادمة',
  }
};

const StudentDashboard = () => {
  const { language, t: globalT } = useLanguage();
  const t = { ...globalT, ...studentDashboardTranslations[language] };

  // Get student info from localStorage (in a real app, this would come from API/backend)
  const getStudentInfo = () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        return JSON.parse(currentUser);
      }
      return { name: 'Student', balance: 500 };
    } catch (error) {
      return { name: 'Student', balance: 500 };
    }
  };

  const studentInfo = getStudentInfo();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">{t.studentDashboardTitle}</h2>
          <div className="text-lg text-muted-foreground">{t.welcome}</div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.currentBalance}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${studentInfo.balance || 500}</div>
            </CardContent>
          </Card>
          
          {/* Transaction History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.transactionHistory}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t.noTransactions}</p>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.upcomingPayments}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t.noPayments}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
