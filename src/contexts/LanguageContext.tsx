import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Record<string, string>;
}

// Default translations dictionary
// We'll keep the translations for common UI elements here
// Page-specific translations can be imported from their respective files
export const translations = {
  en: {
    // Dashboard Layout translations
    dashboard: 'Dashboard',
    users: 'User Management',
    transactions: 'Transactions',
    logs: 'Transaction Logs',
    logout: 'Logout',
    english: 'English',
    arabic: 'Arabic',
    
    // Dashboard page translations
    dashboardTitle: 'Dashboard',
    totalUsers: 'Total Users',
    totalTransactions: 'Total Transactions',
    totalCredit: 'Total Credit',
    totalDebit: 'Total Debit',
    weeklySummary: 'Weekly Transaction Summary',
    quickStats: 'Quick Stats',
    balanceSystem: 'Balance in System',
    transactionsToday: 'Transactions Today',
    activeCards: 'Active Cards',
    systemUptime: 'System Uptime',
    recentTransactions: 'Recent Transactions',
    
    // Users page translations
    userManagement: 'User Management',
    addUser: 'Add User',
    search: 'Search',
    id: 'ID',
    name: 'Name',
    matricNumber: 'Matric Number',
    cardNumber: 'Card Number',
    balance: 'Balance',
    actions: 'Actions',
    
    // Transactions page translations
    transactionsTitle: 'Transactions',
    credit: 'Credit',
    debit: 'Debit',
    type: 'Type',
    amount: 'Amount',
    date: 'Date',
    
    // Transaction Logs page translations
    transactionLogs: 'Transaction Logs',
    user: 'User',
    timestamp: 'Timestamp',

    // Common UI elements
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
  },
  ar: {
    // Dashboard Layout translations
    dashboard: 'لوحة التحكم',
    users: 'إدارة المستخدمين',
    transactions: 'المعاملات',
    logs: 'سجلات المعاملات',
    logout: 'تسجيل الخروج',
    english: 'English',
    arabic: 'العربية',
    
    // Dashboard page translations
    dashboardTitle: 'لوحة التحكم',
    totalUsers: 'إجمالي المستخدمين',
    totalTransactions: 'إجمالي المعاملات',
    totalCredit: 'إجمالي الإيداعات',
    totalDebit: 'إجمالي السحوبات',
    weeklySummary: 'ملخص المعاملات الأسبوعي',
    quickStats: 'إحصائيات سريعة',
    balanceSystem: 'الرصيد في النظام',
    transactionsToday: 'معاملات اليوم',
    activeCards: 'البطاقات النشطة',
    systemUptime: 'وقت تشغيل النظام',
    recentTransactions: 'المعاملات الأخيرة',
    
    // Users page translations
    userManagement: 'إدارة المستخدمين',
    addUser: 'إضافة مستخدم',
    search: 'بحث',
    id: 'معرف',
    name: 'الاسم',
    matricNumber: 'رقم القيد',
    cardNumber: 'رقم البطاقة',
    balance: 'الرصيد',
    actions: 'الإجراءات',
    
    // Transactions page translations
    transactionsTitle: 'المعاملات',
    credit: 'إيداع',
    debit: 'سحب',
    type: 'النوع',
    amount: 'المبلغ',
    date: 'التاريخ',
    
    // Transaction Logs page translations
    transactionLogs: 'سجلات المعاملات',
    user: 'المستخدم',
    timestamp: 'الوقت',

    // Common UI elements
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    return savedLanguage || 'en';
  });

  // Get translations for current language
  const t = translations[language];

  // Update localStorage when language changes but don't change document direction
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    // Remove the RTL direction setting to keep layout consistent
    document.documentElement.lang = language;
  }, [language]);

  // Set language with validation
  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === 'en' || newLanguage === 'ar') {
      setLanguageState(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
