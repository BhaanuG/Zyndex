import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Save, Shield, Edit, X } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'lmno1432@gmail.com',
    bio: user?.bio || '',
    role: 'Administrator',
  });

  // Update profileData when user from AuthContext changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Admin User',
        email: user.email || 'lmno1432@gmail.com',
        bio: user.bio || '',
        role: 'Administrator',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Update the profile in AuthContext
    updateProfile(profileData);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values from AuthContext
    setProfileData({
      name: user?.name || 'Admin User',
      email: user?.email || 'lmno1432@gmail.com',
      bio: user?.bio || '',
      role: 'Administrator',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Profile</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="size-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-4">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{profileData.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{profileData.email}</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium mb-4">
                <Shield className="size-3" />
                {profileData.role}
              </div>
              <div className="text-xs text-gray-500">
                <p>Member since</p>
                <p className="font-medium">January 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg transition-all ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      placeholder="admin@email.com"
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg transition-all ${
                        isEditing 
                          ? 'focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      name="role"
                      value={profileData.role}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none transition-all ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white'
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="flex justify-end">
                  {isEditing ? (
                    <>
                      <motion.button
                        type="button"
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mr-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancel}
                      >
                        <X className="size-4" />
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save className="size-4" />
                        Save Changes
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      type="button"
                      className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="size-4" />
                      Edit Profile
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}