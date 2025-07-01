import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Eye,
  Edit,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  startDate?: string;
  endDate?: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  _count: {
    responses: number;
    questions: number;
  };
}

export const SurveyList: React.FC = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/surveys', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (survey.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || survey.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Edit className="h-4 w-4 text-gray-500" />;
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'COMPLETED':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'ARCHIVED':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Training Surveys</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor training needs assessment surveys
          </p>
        </div>
        <Link
          to="/create-survey"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Survey
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{filteredSurveys.length}</span>
            <span className="ml-1">surveys found</span>
          </div>
        </div>
      </motion.div>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey, index) => (
          <motion.div
            key={survey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(survey.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                    {survey.status}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {survey.title}
              </h3>
              
              {survey.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {survey.description}
                </p>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{survey._count.responses} responses</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">
                    By {survey.createdBy.firstName} {survey.createdBy.lastName}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {survey._count.questions} questions
                </div>
                <Link
                  to={`/surveys/${survey.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSurveys.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No surveys found' : 'No surveys yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' ? 
              'Try adjusting your search or filter criteria.' : 
              'Get started by creating your first training needs assessment survey.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Link
              to="/create-survey"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Survey
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};