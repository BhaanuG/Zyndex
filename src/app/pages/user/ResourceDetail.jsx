import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Calendar, Tag, Star, Send } from 'lucide-react';
import { useParams } from 'react-router';
import UserLayout from '@/app/components/UserLayout';

export default function ResourceDetail() {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Placeholder data - would fetch from backend in real app
  const resource = null;

  const handleDownload = () => {
    // Mock download functionality
    alert('Download started!');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Mock feedback submission
    alert('Thank you for your feedback!');
    setRating(0);
    setFeedback('');
  };

  return (
    <UserLayout>
      <div className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {!resource ? (
            <motion.div
              className="bg-white rounded-xl shadow-md p-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-gray-400">
                <FileText className="size-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Resource not found</p>
                <p className="text-sm">The resource you're looking for doesn't exist</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Resource Header */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Tag className="size-4" />
                        <span>{resource.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4" />
                        <span>{resource.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{resource.date}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="size-5" />
                    Download
                  </motion.button>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700">{resource.description}</p>
                </div>
              </motion.div>

              {/* Feedback Section */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave Feedback</h2>
                
                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rate this resource
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            className={`size-8 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your feedback (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts about this resource..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="size-4" />
                    Submit Feedback
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}