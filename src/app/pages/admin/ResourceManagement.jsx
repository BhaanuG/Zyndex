import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Edit, Trash2, Filter, Eye } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';

export default function ResourceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Empty state - no resources
  const resources = [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize your educational resources</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <motion.button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="size-5" />
            <span className="text-sm font-medium">Filter</span>
          </motion.button>
        </motion.div>

        {/* Filter Dropdown */}
        {filterOpen && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Categories</option>
                  <option>Science</option>
                  <option>Mathematics</option>
                  <option>Literature</option>
                  <option>History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Types</option>
                  <option>PDF</option>
                  <option>Video</option>
                  <option>Presentation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resources Table */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Title</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date Added</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16">
                      <div className="text-gray-400">
                        <p className="text-lg font-medium mb-2">No resources found</p>
                        <p className="text-sm">Upload your first resource to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  resources.map((resource, index) => (
                    <motion.tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6">{resource.title}</td>
                      <td className="py-4 px-6">{resource.category}</td>
                      <td className="py-4 px-6">{resource.type}</td>
                      <td className="py-4 px-6">{resource.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View"
                          >
                            <Eye className="size-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit"
                          >
                            <Edit className="size-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this resource?')) {
                                // Handle delete
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}