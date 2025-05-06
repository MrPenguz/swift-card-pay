
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionLog {
  id: number;
  userName: string;
  matricNumber: string;
  cardNumber: string;
  type: 'credit' | 'debit';
  amount: number;
  previousBalance: number;
  currentBalance: number;
  timestamp: string;
}

// TODO: Replace this mock data with actual database fetching when DB is implemented
// Mock data - will only be used if localStorage is empty
const mockLogs: TransactionLog[] = [
  { 
    id: 1, 
    userName: 'John Doe', 
    matricNumber: 'MAT123456', 
    cardNumber: '0xAB12CD34', 
    type: 'credit', 
    amount: 500, 
    previousBalance: 2000, 
    currentBalance: 2500, 
    timestamp: '2023-07-20 14:30:45' 
  },
  { 
    id: 2, 
    userName: 'Jane Smith', 
    matricNumber: 'MAT654321', 
    cardNumber: '0x12AB34CD', 
    type: 'debit', 
    amount: 150, 
    previousBalance: 1950, 
    currentBalance: 1800, 
    timestamp: '2023-07-20 15:15:22' 
  },
  { 
    id: 3, 
    userName: 'Robert Johnson', 
    matricNumber: 'MAT789012', 
    cardNumber: '0x56EF78GH', 
    type: 'credit' as const, 
    amount: 1000, 
    previousBalance: 2200, 
    currentBalance: 3200, 
    timestamp: '2023-07-20 16:05:11' 
  },
  { 
    id: 4, 
    userName: 'Emily Davis', 
    matricNumber: 'MAT345678', 
    cardNumber: '0x90IJ12KL', 
    type: 'debit' as const, 
    amount: 75, 
    previousBalance: 1025, 
    currentBalance: 950, 
    timestamp: '2023-07-20 16:45:30' 
  },
  { 
    id: 5, 
    userName: 'Michael Brown', 
    matricNumber: 'MAT901234', 
    cardNumber: '0xMN34OP56', 
    type: 'credit' as const, 
    amount: 1500, 
    previousBalance: 2600, 
    currentBalance: 4100, 
    timestamp: '2023-07-21 09:10:15' 
  },
  { 
    id: 6, 
    userName: 'Sarah Wilson', 
    matricNumber: 'MAT567890', 
    cardNumber: '0xQR78ST90', 
    type: 'debit' as const, 
    amount: 230, 
    previousBalance: 1730, 
    currentBalance: 1500, 
    timestamp: '2023-07-21 10:25:40' 
  },
  { 
    id: 7, 
    userName: 'David Thompson', 
    matricNumber: 'MAT234567', 
    cardNumber: '0xUV12WX34', 
    type: 'credit' as const, 
    amount: 800, 
    previousBalance: 1200, 
    currentBalance: 2000, 
    timestamp: '2023-07-21 11:45:05' 
  },
  { 
    id: 8, 
    userName: 'Lisa Martinez', 
    matricNumber: 'MAT890123', 
    cardNumber: '0xYZ56AB78', 
    type: 'debit' as const, 
    amount: 450, 
    previousBalance: 2450, 
    currentBalance: 2000, 
    timestamp: '2023-07-21 13:30:20' 
  },
  { 
    id: 9, 
    userName: 'James Anderson', 
    matricNumber: 'MAT456789', 
    cardNumber: '0xCD90EF12', 
    type: 'credit' as const, 
    amount: 1200, 
    previousBalance: 800, 
    currentBalance: 2000, 
    timestamp: '2023-07-21 14:55:35' 
  },
  { 
    id: 10, 
    userName: 'Jennifer Taylor', 
    matricNumber: 'MAT012345', 
    cardNumber: '0xGH34IJ56', 
    type: 'debit' as const, 
    amount: 320, 
    previousBalance: 1820, 
    currentBalance: 1500, 
    timestamp: '2023-07-21 16:15:50' 
  },
];

const ITEMS_PER_PAGE = 5;

const TransactionLogs = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // TODO: Replace with API call to your database when implemented
    // Load transaction logs from localStorage or use mock data if not available
    const fetchLogs = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call to your database
        const storedLogs = localStorage.getItem('transactionLogs');
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        } else {
          // Initialize with mock data if localStorage is empty
          setLogs(mockLogs);
          // Save mock data to localStorage for first-time initialization
          localStorage.setItem('transactionLogs', JSON.stringify(mockLogs));
        }
      } catch (error) {
        console.error('Error fetching transaction logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, []);
  
  // Format currency to SYP format
  const formatCurrency = (value: number) => {
    return `SYP ${value.toLocaleString()}`;
  };
  
  const filteredLogs = logs.filter(log => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      log.userName.toLowerCase().includes(searchTermLower) ||
      log.matricNumber.toLowerCase().includes(searchTermLower) ||
      log.cardNumber.toLowerCase().includes(searchTermLower) ||
      log.type.includes(searchTermLower)
    );
  });
  
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-nfc-blue">{t.transactionLogs}</h1>
      
      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.searchByUser}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      
      <Card className="card-dashboard">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <h2 className="section-title">{t.transactionHistory} ({filteredLogs.length})</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.id}</th>
                    <th>{t.user}</th>
                    <th>{t.matricNumber}</th>
                    <th>{t.cardNumber}</th>
                    <th>{t.type}</th>
                    <th>{t.amount}</th>
                    <th>{t.previousBalance}</th>
                    <th>{t.currentBalance}</th>
                    <th>{t.timestamp}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <tr key={log.id}>
                        <td>#{log.id}</td>
                        <td>{log.userName}</td>
                        <td>{log.matricNumber}</td>
                        <td>{log.cardNumber}</td>
                        <td>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            log.type === 'credit' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.type === 'credit' ? t.credit : t.debit}
                          </span>
                        </td>
                        <td>{formatCurrency(log.amount)}</td>
                        <td>{formatCurrency(log.previousBalance)}</td>
                        <td>{formatCurrency(log.currentBalance)}</td>
                        <td>{log.timestamp}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-500">
                        {searchTerm ? t.noTransactionsMatch : t.noTransactionsFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default TransactionLogs;
