
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
    createNewUser: 'Create New User',
    fullName: 'Full Name',
    password: 'Password',
    passwordNote: 'Note: By default, password will be same as matric number if left empty',
    initialBalance: 'Initial Balance (SYP)',
    validationError: 'Validation Error',
    pleaseFillAllFields: 'Please fill in all required fields',
    userCreatedSuccess: 'User created successfully',
    failedToCreateUser: 'Failed to create user',
    failedToLoadUsers: 'Failed to load users',
    noUsersFound: 'No users found',
    noUsersMatchSearch: 'No users match your search',
    users: 'Users',
    
    // Transactions page translations
    transactionsTitle: 'Transactions',
    credit: 'Credit',
    debit: 'Debit',
    type: 'Type',
    amount: 'Amount',
    date: 'Date',
    processTransaction: 'Process Transaction',
    manualTransaction: 'Manual Transaction',
    purchaseProduct: 'Purchase Product',
    selectUser: 'Select User',
    selectProduct: 'Select Product', 
    transactionType: 'Transaction Type',
    creditAddFunds: 'Credit (Add Funds)',
    debitRemoveFunds: 'Debit (Remove Funds)',
    processCredit: 'Process Credit',
    processDebit: 'Process Debit',
    amountSYP: 'Amount (SYP)',
    userDetails: 'User Details',
    currentBalance: 'Current Balance',
    transactionPreview: 'Transaction Preview',
    availableProducts: 'Available Products',
    insufficientBalance: 'Insufficient balance for debit',
    amountGreaterThanZero: 'Amount must be greater than zero',
    pleaseSelectUser: 'Please select a user',
    transactionSuccess: 'Success',
    failedToProcessTransaction: 'Failed to process transaction',
    
    // Transaction Logs page translations
    transactionLogs: 'Transaction Logs',
    user: 'User',
    timestamp: 'Timestamp',
    searchByUser: 'Search by user, matric number, card number, or transaction type...',
    transactionHistory: 'Transaction History',
    previousBalance: 'Previous Balance',
    currentBalance: 'Current Balance',
    noTransactionsFound: 'No transactions found',
    noTransactionsMatch: 'No transactions match your search',

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
    createNewUser: 'إنشاء مستخدم جديد',
    fullName: 'الاسم الكامل',
    password: 'كلمة المرور',
    passwordNote: 'ملاحظة: افتراضيًا، ستكون كلمة المرور هي نفس رقم القيد إذا تركت فارغة',
    initialBalance: 'الرصيد الأولي (ليرة سورية)',
    validationError: 'خطأ في التحقق',
    pleaseFillAllFields: 'يرجى ملء جميع الحقول المطلوبة',
    userCreatedSuccess: 'تم إنشاء المستخدم بنجاح',
    failedToCreateUser: 'فشل في إنشاء المستخدم',
    failedToLoadUsers: 'فشل في تحميل المستخدمين',
    noUsersFound: 'لم يتم العثور على مستخدمين',
    noUsersMatchSearch: 'لا يوجد مستخدمين مطابقين للبحث',
    users: 'المستخدمين',
    
    // Transactions page translations
    transactionsTitle: 'المعاملات',
    credit: 'إيداع',
    debit: 'سحب',
    type: 'النوع',
    amount: 'المبلغ',
    date: 'التاريخ',
    processTransaction: 'إجراء معاملة',
    manualTransaction: 'معاملة يدوية',
    purchaseProduct: 'شراء منتج',
    selectUser: 'اختر مستخدم',
    selectProduct: 'اختر منتج',
    transactionType: 'نوع المعاملة',
    creditAddFunds: 'إيداع (إضافة أموال)',
    debitRemoveFunds: 'سحب (إزالة أموال)',
    processCredit: 'إجراء إيداع',
    processDebit: 'إجراء سحب',
    amountSYP: 'المبلغ (ليرة سورية)',
    userDetails: 'تفاصيل المستخدم',
    currentBalance: 'الرصيد الحالي',
    transactionPreview: 'معاينة المعاملة',
    availableProducts: 'المنتجات المتاحة',
    insufficientBalance: 'رصيد غير كافٍ للسحب',
    amountGreaterThanZero: 'يجب أن يكون المبلغ أكبر من الصفر',
    pleaseSelectUser: 'الرجاء اختيار مستخدم',
    transactionSuccess: 'تمت بنجاح',
    failedToProcessTransaction: 'فشل في إجراء المعاملة',
    
    // Transaction Logs page translations
    transactionLogs: 'سجلات المعاملات',
    user: 'المستخدم',
    timestamp: 'الوقت',
    searchByUser: 'البحث عن طريق المستخدم، رقم القيد، رقم البطاقة، أو نوع المعاملة...',
    transactionHistory: 'سجل المعاملات',
    previousBalance: 'الرصيد السابق',
    currentBalance: 'الرصيد الحالي',
    noTransactionsFound: 'لم يتم العثور على معاملات',
    noTransactionsMatch: 'لا توجد معاملات مطابقة للبحث',

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
