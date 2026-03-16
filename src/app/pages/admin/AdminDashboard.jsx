import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { FolderOpen, Users, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { getUrlSafeName, getUrlSafeEmail } = useAuth();
  
  // Get dynamic URL parts
  const adminName = getUrlSafeName();
  const adminEmail = getUrlSafeEmail();
  const baseUrl = `/Zyndex/Admin/${adminName}/${adminEmail}`;
  
  const stats = [
    {
      title: 'Total Resources',
      value: '0',
      icon: FolderOpen,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      link: `${baseUrl}/Resource-Management`,
    },
    {
      title: 'Total Users',
      value: '0',
      icon: Users,
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      link: `${baseUrl}/User-Access`,
    },
    {
      title: 'Feedback Count',
      value: '0',
      icon: MessageSquare,
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-100',
      link: `${baseUrl}/Feedback-Review`,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 min-h-screen">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Activity className="size-4" />
            Admin Panel
          </motion.div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's an overview of your platform.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                onClick={() => navigate(stat.link)}
                className="group relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 ${stat.bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`size-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                    >
                      <Icon className="size-8 text-white" />
                    </motion.div>
                    
                    <motion.div
                      className="size-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <TrendingUp className="size-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    </motion.div>
                  </div>
                  
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-lg p-8 overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-10" />
          
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Action</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">User</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring' }}
                      >
                        <div className="size-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                          <Activity className="size-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No recent activity to display</p>
                      </motion.div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}