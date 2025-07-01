import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Target,
  FileText,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface FormData {
  applicationType: 'TRAINING_REQUEST' | 'WORKSHOP_PROPOSAL';
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  justification: string;
  expectedOutcome: string;
  preferredDates: string[];
  duration: string;
  budget: string;
  participants: string;
  location: string;
  provider: string;
}

export const TrainingApplication: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    applicationType: 'TRAINING_REQUEST',
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    justification: '',
    expectedOutcome: '',
    preferredDates: [''],
    duration: '',
    budget: '',
    participants: '',
    location: '',
    provider: '',
  });

  const categories = [
    'Leadership & Management',
    'Technical Skills',
    'Communication',
    'Project Management',
    'Digital Literacy',
    'Sales & Marketing',
    'Finance & Accounting',
    'Human Resources',
    'Health & Safety',
    'Compliance & Regulations',
    'Customer Service',
    'Other',
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'URGENT', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...formData.preferredDates];
    newDates[index] = value;
    setFormData(prev => ({ ...prev, preferredDates: newDates }));
  };

  const addDateField = () => {
    setFormData(prev => ({
      ...prev,
      preferredDates: [...prev.preferredDates, '']
    }));
  };

  const removeDateField = (index: number) => {
    if (formData.preferredDates.length > 1) {
      const newDates = formData.preferredDates.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, preferredDates: newDates }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/training/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          preferredDates: formData.preferredDates.filter(date => date.trim() !== ''),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/training-applications');
        }, 2000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Your training application has been successfully submitted and is now under review.
          You will be notified of any updates via email.
        </p>
        <button
          onClick={() => navigate('/training-applications')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View My Applications
        </button>
      </div>
    );
  }

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
            onClick={() => navigate('/training-applications')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apply for Training</h1>
            <p className="text-gray-600 mt-1">Submit your training request or workshop proposal</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Application Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.applicationType === 'TRAINING_REQUEST' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="applicationType"
                value="TRAINING_REQUEST"
                checked={formData.applicationType === 'TRAINING_REQUEST'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Training Request</div>
                  <div className="text-sm text-gray-500">Request to attend external training</div>
                </div>
              </div>
            </label>

            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.applicationType === 'WORKSHOP_PROPOSAL' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="applicationType"
                value="WORKSHOP_PROPOSAL"
                checked={formData.applicationType === 'WORKSHOP_PROPOSAL'}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Workshop Proposal</div>
                  <div className="text-sm text-gray-500">Propose to conduct internal workshop</div>
                </div>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.applicationType === 'TRAINING_REQUEST' ? 'e.g., Advanced Project Management Certification' : 'e.g., Introduction to Agile Methodologies Workshop'}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a detailed description of the training or workshop..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Justification & Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Justification & Expected Outcomes</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
                Business Justification *
              </label>
              <textarea
                id="justification"
                name="justification"
                required
                rows={4}
                value={formData.justification}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why this training is necessary and how it aligns with business objectives..."
              />
            </div>

            <div>
              <label htmlFor="expectedOutcome" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Outcomes *
              </label>
              <textarea
                id="expectedOutcome"
                name="expectedOutcome"
                required
                rows={4}
                value={formData.expectedOutcome}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the expected learning outcomes and how they will be applied..."
              />
            </div>
          </div>
        </motion.div>

        {/* Schedule & Logistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule & Logistics</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Dates
              </label>
              {formData.preferredDates.map((date, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.preferredDates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDateField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDateField}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add another date option
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2 days, 1 week, 3 hours"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Online, Conference Room A, External venue"
                  />
                </div>
              </div>
            </div>

            {formData.applicationType === 'WORKSHOP_PROPOSAL' && (
              <div>
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Number of Participants
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="participants"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 15"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Budget & Provider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget & Provider Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Budget
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                Training Provider
              </label>
              <input
                type="text"
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Coursera, LinkedIn Learning, Internal trainer"
              />
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                All training applications require manager approval. Applications with budget over $1,000 
                also require HR approval. You will receive email notifications about the status of your application.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate('/training-applications')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};