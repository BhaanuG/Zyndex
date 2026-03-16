import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload as UploadIcon, File, CheckCircle, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';

export default function UploadResource() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subject: '',
    resourceType: '',
    description: '',
    file: null,
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 6; // Updated to 6 steps

  // Subject data based on category
  const subjectsByCategory = {
    science: ['Physics', 'Chemistry', 'Biology', 'Astronomy'],
    mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    literature: ['Poetry', 'Fiction', 'Drama', 'Non-Fiction'],
    history: ['Ancient History', 'Modern History', 'World History', 'Cultural History'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock upload - in real app would send to backend
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setCurrentStep(1);
      setFormData({
        title: '',
        category: '',
        subject: '',
        resourceType: '',
        description: '',
        file: null,
      });
    }, 15000); // Changed to 15 seconds to match the animation duration
  };

  const handleKeyDown = (e) => {
    // Prevent Enter key from triggering next step
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() !== '';
      case 2:
        return formData.category !== '';
      case 3:
        return formData.subject !== '';
      case 4:
        return formData.resourceType !== '';
      case 5:
        return formData.description.trim() !== '';
      case 6:
        return formData.file !== null;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter a descriptive title for your resource"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-lg"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Choose a clear, descriptive title that helps users understand the content
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Category
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'science', label: 'Science' },
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'literature', label: 'Literature' },
                  { value: 'history', label: 'History' },
                ].map((cat) => (
                  <motion.button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.category === cat.value
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Subject
              </label>
              <div className="grid grid-cols-2 gap-4">
                {subjectsByCategory[formData.category]?.map((subject) => (
                  <motion.button
                    key={subject}
                    type="button"
                    onClick={() => setFormData({ ...formData, subject })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.subject === subject
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{subject}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'pdf', label: 'PDF Document', description: 'Portable Document Format' },
                  { value: 'article', label: 'Article', description: 'Written content or blog post' },
                ].map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, resourceType: type.value })}
                    className={`p-6 border-2 rounded-lg transition-all text-left ${
                      formData.resourceType === type.value
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium mb-1">{type.label}</div>
                    <div className="text-sm opacity-75">{type.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the resource content..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                onKeyDown={handleKeyDown}
              />
              <p className="mt-2 text-sm text-gray-500">
                Include key topics, learning objectives, and any prerequisites
              </p>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadIcon className="size-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-3">
                  Drag and drop your file here, or
                </p>
                <label className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept={formData.resourceType === 'pdf' ? '.pdf' : '*'}
                  />
                </label>
                {formData.file && (
                  <motion.div
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <File className="size-5 text-orange-600" />
                    <span className="font-medium">{formData.file.name}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload Resource</h1>
          <p className="text-gray-600 mb-8">Step {currentStep} of {totalSteps}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 6 ? 'flex-1' : ''}`}
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step <= currentStep
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Title</span>
            <span>Category</span>
            <span>Subject</span>
            <span>Type</span>
            <span>Description</span>
            <span>Upload</span>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
          >
            <ArrowLeft className="size-5" />
            Previous
          </motion.button>

          {currentStep < totalSteps ? (
            <motion.button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              Next
              <ArrowRight className="size-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              <UploadIcon className="size-5" />
              Upload Resource
            </motion.button>
          )}
        </div>

        {/* Success Message with Book Animation */}
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-4 text-center relative overflow-hidden"
                initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50" />
                
                {/* Animated Book Icon */}
                <motion.div
                  className="relative mx-auto mb-6"
                  initial={{ rotateY: 0 }}
                  animate={{ 
                    rotateY: [0, 180, 360, 540, 720],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 15,
                    times: [0, 0.25, 0.5, 0.75, 1],
                    ease: "easeInOut"
                  }}
                >
                  <div className="size-28 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <BookOpen className="size-16 text-white" />
                  </div>
                </motion.div>

                {/* Success Icon */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
                </motion.div>

                {/* Success Message */}
                <motion.h2
                  className="text-3xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Upload Successful!
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your resource has been uploaded successfully
                </motion.p>

                {/* File Name Display */}
                {formData.file && (
                  <motion.div
                    className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <File className="size-6 text-orange-600 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <p className="text-sm text-gray-500 font-medium">File Name:</p>
                        <p className="text-base font-bold text-orange-700 break-all">{formData.file.name}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resource Details */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex justify-between">
                    <span className="text-gray-500">Title:</span>
                    <span className="font-semibold text-gray-900">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-semibold text-gray-900 capitalize">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subject:</span>
                    <span className="font-semibold text-gray-900">{formData.subject}</span>
                  </div>
                </motion.div>

                {/* Animated Confetti Dots */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute size-2 bg-orange-500 rounded-full"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{
                      x: Math.cos(i * Math.PI / 4) * 150,
                      y: Math.sin(i * Math.PI / 4) * 150,
                      opacity: 0,
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.8,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '30%'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}