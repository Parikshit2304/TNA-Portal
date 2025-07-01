import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Edit,
  Share,
  Download,
  BarChart3,
} from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  questions: Question[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface Question {
  id: string;
  title: string;
  type: string;
  options?: string;
  required: boolean;
  order: number;
}

export const SurveyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (id) {
      fetchSurvey();
      fetchResponses();
    }
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSurvey(data);
      }
    } catch (error) {
      console.error('Failed to fetch survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/surveys/${id}/responses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      }
    } catch (error) {
      console.error('Failed to fetch responses:', error);
    }
  };

  const getQuestionTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      TEXT: 'Short Text',
      TEXTAREA: 'Long Text',
      SINGLE_CHOICE: 'Single Choice',
      MULTIPLE_CHOICE: 'Multiple Choice',
      RATING: 'Rating Scale',
      DATE: 'Date',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Survey not found</h2>
        <Link
          to="/surveys"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to surveys
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link
            to="/surveys"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
            <p className="text-gray-600 mt-1">Survey Details & Analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Share className="h-4 w-4 mr-2" />
            Share
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Survey Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900">{survey.status}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">
                {new Date(survey.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Questions</h3>
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{survey.questions.length}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Responses</h3>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{responses.length}</span>
            </div>
          </div>
        </div>

        {survey.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900">{survey.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Created by</h3>
          <p className="text-gray-900">
            {survey.createdBy.firstName} {survey.createdBy.lastName}
          </p>
        </div>
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Survey Questions</h2>
          <span className="text-sm text-gray-500">
            {survey.questions.length} questions
          </span>
        </div>

        <div className="space-y-4">
          {survey.questions
            .sort((a, b) => a.order - b.order)
            .map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-gray-900">{question.title}</h3>
                      {question.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>
                    
                    <div className="ml-9">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {getQuestionTypeDisplay(question.type)}
                      </span>
                      
                      {question.options && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Options:</p>
                          <div className="space-y-1">
                            {JSON.parse(question.options).map((option: string, optionIndex: number) => (
                              <div key={optionIndex} className="text-sm text-gray-700 ml-4">
                                • {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Response Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Response Analytics</h2>
          <Link
            to="/reports"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            View Full Report
          </Link>
        </div>

        {responses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
              <div className="text-sm text-blue-600">Total Responses</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((responses.length / 100) * 100)}%
              </div>
              <div className="text-sm text-green-600">Completion Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(responses.length / Math.max(1, Math.ceil((Date.now() - new Date(survey.createdAt).getTime()) / (1000 * 60 * 60 * 24))))}
              </div>
              <div className="text-sm text-purple-600">Avg. Daily Responses</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No responses yet</p>
            <p className="text-sm">Responses will appear here once users start submitting the survey.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};