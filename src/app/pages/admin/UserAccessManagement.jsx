import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Edit, Trash2, Eye, X, User, Mail, Lock, Hash } from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
import AdminLayout from '@/app/components/AdminLayout';

export default function UserAccessManagement() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    registrationNo: '',
  });

  // Empty state - no users
  const users = [];

  const handleAddUser = (e) => {
    e.preventDefault();
    // Handle add user logic here
    alert(`User ${newUser.name} added successfully!`);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', password: '', registrationNo: '' });
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Access Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <motion.button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="size-5" />
            Add User
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
        </motion.div>

        {/* Users Table */}
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Registration No</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="text-gray-400">
                        <p className="text-lg font-medium mb-2">No users found</p>
                        <p className="text-sm">Click "Add User" to create a new user account</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <motion.tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.registrationNo || 'N/A'}</td>
                      <td className="py-4 px-6">{user.dateJoined}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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
                              if (window.confirm('Are you sure you want to delete this user?')) {
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

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddUser(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                  <motion.button
                    onClick={() => setShowAddUser(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="size-5 text-gray-500" />
                  </motion.button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        placeholder="user@email.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Registration Number (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        name="registrationNo"
                        value={newUser.registrationNo}
                        onChange={handleChange}
                        placeholder="e.g., 2400030952"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add User
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}