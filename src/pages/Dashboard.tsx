
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Users, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for initial render
const mockStats = {
  totalUsers: 156,
  totalTransactions: 1289,
  totalCredit: 52450,
  totalDebit: 38967,
};

// TODO: Fetch chart data from database in the future
const mockChartData = [
  { name: 'Mon', credit: 4000, debit: 2400 },
  { name: 'Tue', credit: 3000, debit: 1398 },
  { name: 'Wed', credit: 2000, debit: 9800 },
  { name: 'Thu', credit: 2780, debit: 3908 },
  { name: 'Fri', credit: 1890, debit: 4800 },
  { name: 'Sat', credit: 2390, debit: 3800 },
  { name: 'Sun', credit: 3490, debit: 4300 },
];

// TODO: Fetch transaction data from database in the future
const mockRecentTransactions = [
  { id: 1, userName: 'John Doe', matricNumber: 'MAT123456', cardNumber: '0xAB12CD34', type: 'credit', amount: 500, timestamp: '2023-07-20 14:30:45' },
  { id: 2, userName: 'Jane Smith', matricNumber: 'MAT654321', cardNumber: '0x12AB34CD', type: 'debit', amount: 150, timestamp: '2023-07-20 15:15:22' },
  { id: 3, userName: 'Mike Johnson', matricNumber: 'MAT789012', cardNumber: '0x56EF78GH', type: 'credit', amount: 1000, timestamp: '2023-07-20 16:05:11' },
  { id: 4, userName: 'Sarah Williams', matricNumber: 'MAT345678', cardNumber: '0x90IJ12KL', type: 'debit', amount: 75, timestamp: '2023-07-20 16:45:30' },
];

const DashboardCard = ({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color: string;
}) => (
  <Card className="card-dashboard flex flex-col">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-full ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    
    {trend && (
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <ArrowUpRight size={16} className="text-green-500" />
        ) : (
          <ArrowDownRight size={16} className="text-red-500" />
        )}
        <span className={`text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? '12% increase' : '5% decrease'} since last month
        </span>
      </div>
    )}
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChartData);
  const [recentTransactions, setRecentTransactions] = useState(mockRecentTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call to fetch dashboard data
        setStats(mockStats);
        setChartData(mockChartData);
        setRecentTransactions(mockRecentTransactions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Updated to use SYP instead of Naira
  const formatCurrency = (value: number) => {
    return `SYP ${value.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-nfc-blue">{t.dashboardTitle}</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-dashboard animate-pulse h-32">
              <div className="h-full bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title={t.totalUsers} 
              value={stats.totalUsers} 
              icon={Users} 
              trend="up"
              color="bg-blue-500" 
            />
            <DashboardCard 
              title={t.totalTransactions} 
              value={stats.totalTransactions} 
              icon={CreditCard} 
              trend="up" 
              color="bg-purple-500"
            />
            <DashboardCard 
              title={t.totalCredit} 
              value={formatCurrency(stats.totalCredit)} 
              icon={ArrowUpRight} 
              trend="up" 
              color="bg-green-500"
            />
            <DashboardCard 
              title={t.totalDebit} 
              value={formatCurrency(stats.totalDebit)} 
              icon={ArrowDownRight} 
              trend="down" 
              color="bg-red-500"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="card-dashboard lg:col-span-2">
              <h2 className="section-title">{t.weeklySummary}</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`SYP ${value}`, 'Amount']} />
                    <Bar dataKey="credit" fill="#38a169" name={t.credit} />
                    <Bar dataKey="debit" fill="#e53e3e" name={t.debit} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="card-dashboard">
              <h2 className="section-title">{t.quickStats}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{t.balanceSystem}</p>
                  <p className="text-xl font-semibold">{formatCurrency(stats.totalCredit - stats.totalDebit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.transactionsToday}</p>
                  <p className="text-xl font-semibold">57</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.activeCards}</p>
                  <p className="text-xl font-semibold">142</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.systemUptime}</p>
                  <p className="text-xl font-semibold">99.9%</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="card-dashboard">
            <h2 className="section-title">{t.recentTransactions}</h2>
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
                    <th>{t.timestamp}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>#{transaction.id}</td>
                      <td>{transaction.userName}</td>
                      <td>{transaction.matricNumber}</td>
                      <td>{transaction.cardNumber}</td>
                      <td>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>{transaction.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
