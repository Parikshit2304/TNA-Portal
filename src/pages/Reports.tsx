import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const trainingNeedsData = [
    { skill: 'Leadership', urgent: 25, important: 35, nice: 15 },
    { skill: 'Technical Skills', urgent: 40, important: 28, nice: 12 },
    { skill: 'Communication', urgent: 18, important: 42, nice: 20 },
    { skill: 'Project Management', urgent: 22, important: 30, nice: 18 },
    { skill: 'Digital Literacy', urgent: 35, important: 25, nice: 10 },
  ];

  const departmentData = [
    { name: 'Engineering', requests: 65, color: '#3B82F6' },
    { name: 'Marketing', requests: 48, color: '#8B5CF6' },
    { name: 'Sales', requests: 42, color: '#14B8A6' },
    { name: 'HR', requests: 35, color: '#F59E0B' },
    { name: 'Finance', requests: 28, color: '#EF4444' },
  ];

  const trendData = [
    { month: 'Jan', requests: 45, completed: 38 },
    { month: 'Feb', requests: 52, completed: 42 },
    { month: 'Mar', requests: 48, completed: 45 },
    { month: 'Apr', requests: 61, completed: 48 },
    { month: 'May', requests: 55, completed: 52 },
    { month: 'Jun', requests: 67, completed: 58 },
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into training needs and progress
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Report Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'needs', name: 'Training Needs', icon: Target },
            { id: 'progress', name: 'Progress', icon: TrendingUp },
            { id: 'departments', name: 'Departments', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedReport === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Requests', value: '218', change: '+12%', color: 'from-blue-500 to-blue-600' },
          { title: 'Completed', value: '183', change: '+8%', color: 'from-green-500 to-green-600' },
          { title: 'In Progress', value: '35', change: '+23%', color: 'from-yellow-500 to-yellow-600' },
          { title: 'Satisfaction', value: '4.8', change: '+0.2', color: 'from-purple-500 to-purple-600' },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <p className="text-sm text-green-600 mt-1">{metric.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Needs by Priority */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Training Needs by Priority</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="h-4 w-4 mr-1" />
              By skill area
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trainingNeedsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="skill" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="urgent" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="important" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
              <Bar dataKey="nice" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <span className="text-sm text-gray-600">Urgent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Important</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span className="text-sm text-gray-600">Nice-to-have</span>
            </div>
          </div>
        </motion.div>

        {/* Department Requests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Requests by Department</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              Last 6 months
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="requests"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </motion.div>
      </div>

      {/* Training Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Training Request Trends</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            6 month trend
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
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
            <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <span className="text-sm text-gray-600">Training Requests</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </motion.div>

      {/* Detailed Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900 mb-2">High Demand Areas</h4>
              <p className="text-blue-700 text-sm">
                Technical skills and digital literacy show the highest urgent training requests. 
                Consider prioritizing these areas for immediate attention.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-900 mb-2">Success Story</h4>
              <p className="text-green-700 text-sm">
                Communication training programs have shown 95% completion rate with 
                excellent feedback scores averaging 4.8/5.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-yellow-900 mb-2">Resource Allocation</h4>
              <p className="text-yellow-700 text-sm">
                Engineering department accounts for 30% of all training requests. 
                Consider dedicated resources for technical skill development.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-900 mb-2">Trending Skills</h4>
              <p className="text-purple-700 text-sm">
                Leadership and project management requests have increased by 40% 
                this quarter, indicating growing management responsibilities.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};