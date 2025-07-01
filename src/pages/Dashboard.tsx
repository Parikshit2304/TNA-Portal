import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
}

interface RecentActivity {
  id: string;
  user: { firstName: string; lastName: string };
  survey: { title: string };
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const departmentData = [
    { name: 'Engineering', value: 35, color: '#3B82F6' },
    { name: 'Marketing', value: 25, color: '#8B5CF6' },
    { name: 'Sales', value: 20, color: '#14B8A6' },
    { name: 'HR', value: 15, color: '#F59E0B' },
    { name: 'Finance', value: 5, color: '#EF4444' },
  ];

  const trainingData = [
    { month: 'Jan', completed: 45 },
    { month: 'Feb', completed: 52 },
    { month: 'Mar', completed: 48 },
    { month: 'Apr', completed: 61 },
    { month: 'May', completed: 55 },
    { month: 'Jun', completed: 67 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to explore your training opportunities today?
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              to="/create-survey"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Survey</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            change: '+12%',
          },
          {
            title: 'Active Surveys',
            value: stats.activeSurveys,
            icon: FileText,
            color: 'from-indigo-500 to-indigo-600',
            change: '+8%',
          },
          {
            title: 'Total Responses',
            value: stats.totalResponses,
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600',
            change: '+23%',
          },
          {
            title: 'Completion Rate',
            value: '87%',
            icon: Activity,
            color: 'from-teal-500 to-teal-600',
            change: '+5%',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Completion Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Training Completion Trends</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Last 6 months
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="completed" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Distribution by Department</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              All users
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {departmentData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link
              to="/surveys"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {activity.user.firstName.charAt(0)}{activity.user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.user.firstName} {activity.user.lastName}
                      </span>{' '}
                      completed survey "{activity.survey.title}"
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { title: 'View All Surveys', href: '/surveys', icon: FileText, color: 'text-blue-600' },
              { title: 'Create New Survey', href: '/create-survey', icon: Plus, color: 'text-indigo-600' },
              { title: 'View Reports', href: '/reports', icon: TrendingUp, color: 'text-purple-600' },
              { title: 'Manage Profile', href: '/profile', icon: Users, color: 'text-teal-600' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};