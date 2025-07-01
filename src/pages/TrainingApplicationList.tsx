import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  Users,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TrainingApplication {
  id: string;
  applicationType: 'TRAINING_REQUEST' | 'WORKSHOP_PROPOSAL';
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  budget?: number;
  submittedAt: string;
  user: {
    firstName: string;
    lastName: string;
    department: string;
  };
}

export const TrainingApplicationList: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<TrainingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/training/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/training/applications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setApplications(applications.filter(app => app.id !== id));
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = application.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || application.applicationType.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Training Applications</h1>
          <p className="mt-2 text-gray-600">
            Manage your training requests and workshop proposals
          </p>
        </div>
        <Link
          to="/apply-training"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Application
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="training_request">Training Request</option>
            <option value="workshop_proposal">Workshop Proposal</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">{filteredApplications.length}</span>
            <span className="ml-1">applications found</span>
          </div>
        </div>
      </motion.div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {application.applicationType === 'TRAINING_REQUEST' ? (
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Users className="h-6 w-6 text-purple-600" />
                  )}
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                      {application.priority}
                    </span>
                  </div>
                </div>
                
                {application.status === 'PENDING' && user?.id === application.user.firstName && (
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {application.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {application.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{application.category}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Submitted {new Date(application.submittedAt).toLocaleDateString()}</span>
                </div>

                {application.budget && (
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>${application.budget.toLocaleString()}</span>
                  </div>
                )}

                {user?.role !== 'EMPLOYEE' && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">
                      By {application.user.firstName} {application.user.lastName}
                    </span>
                    {application.user.department && (
                      <span className="ml-2 text-gray-400">• {application.user.department}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(application.status)}
                  <span className="text-xs text-gray-500">
                    {application.applicationType === 'TRAINING_REQUEST' ? 'Training Request' : 'Workshop Proposal'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/training-applications/${application.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  
                  {application.status === 'PENDING' && user?.id === application.user.firstName && (
                    <>
                      <button className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(application.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 'No applications found' : 'No applications yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 
              'Try adjusting your search or filter criteria.' : 
              'Get started by submitting your first training application.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
            <Link
              to="/apply-training"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit Your First Application
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};