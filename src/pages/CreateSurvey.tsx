import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  Type,
  List,
  CheckSquare,
  Star,
  Calendar,
  AlignLeft,
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  type: 'TEXT' | 'TEXTAREA' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'RATING' | 'DATE';
  options?: string[];
  required: boolean;
}

export const CreateSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const questionTypes = [
    { value: 'TEXT', label: 'Short Text', icon: Type },
    { value: 'TEXTAREA', label: 'Long Text', icon: AlignLeft },
    { value: 'SINGLE_CHOICE', label: 'Single Choice', icon: List },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: CheckSquare },
    { value: 'RATING', label: 'Rating Scale', icon: Star },
    { value: 'DATE', label: 'Date', icon: Calendar },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: '',
      type: 'TEXT',
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const options = question.options || [];
      updateQuestion(questionId, {
        options: [...options, '']
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          questions: questions.map((q, index) => ({
            title: q.title,
            type: q.type,
            options: q.options,
            required: q.required,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        navigate('/surveys');
      } else {
        throw new Error('Failed to create survey');
      }
    } catch (error) {
      console.error('Failed to create survey:', error);
      alert('Failed to create survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/surveys')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Survey</h1>
            <p className="text-gray-600 mt-1">Design your training needs assessment</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !formData.title || questions.length === 0}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {loading ? 'Creating...' : 'Create Survey'}
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Survey Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter survey title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter survey description"
              />
            </div>
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
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={question.title}
                      onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter question title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { 
                        type: e.target.value as Question['type'],
                        options: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(e.target.value) ? [''] : undefined
                      })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Options for choice questions */}
                {(question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add Option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="p-2 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${question.id}`}
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
                    Required question
                  </label>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added yet</h3>
                <p className="text-gray-500 mb-4">
                  Start building your survey by adding your first question.
                </p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Question
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
};