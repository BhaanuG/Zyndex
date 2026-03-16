import { motion } from 'motion/react';
import { Star, Trash2, Eye } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';

export default function FeedbackReview() {
  // Empty state - no feedback
  const feedbacks = [];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          >
            <Star
              className={`size-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900">Feedback Review</h1>
          <p className="text-gray-600 mt-1">Review and manage user feedback</p>
        </motion.div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl shadow-md p-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-gray-400">
                <p className="text-lg font-medium mb-2">No feedback yet</p>
                <p className="text-sm">User feedback will appear here</p>
              </div>
            </motion.div>
          ) : (
            feedbacks.map((feedback, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {feedback.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{feedback.userName}</p>
                        <p className="text-sm text-gray-500">{feedback.date}</p>
                      </div>
                    </div>
                    <div className="mb-3">{renderStars(feedback.rating)}</div>
                    <p className="text-gray-700 mb-3">{feedback.comment}</p>
                    <p className="text-sm text-gray-500">
                      Resource: <span className="font-medium">{feedback.resourceTitle}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="size-4" />
                    </motion.button>
                    <motion.button
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="size-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}