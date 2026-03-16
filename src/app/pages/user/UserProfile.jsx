import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Download, Settings, Save, Heart, Edit, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import UserLayout from '@/app/components/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useAuth } from '@/app/context/AuthContext';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User Name',
    email: user?.email || 'user@email.com',
    bio: user?.bio || '',
  });

  // Update profileData when user from AuthContext changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'User Name',
        email: user.email || 'user@email.com',
        bio: user.bio || '',
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
      name: user?.name || 'User Name',
      email: user?.email || 'user@email.com',
      bio: user?.bio || '',
    });
  };

  // Empty download and favourites history
  const downloads = [];
  const favourites = [];

  return (
    <UserLayout>
      <div className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Profile</h1>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
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
                <p className="text-sm text-gray-500 mb-4">{profileData.email}</p>
                <div className="text-xs text-gray-500">
                  <p>Member since</p>
                  <p className="font-medium">January 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-md">
                <Tabs defaultValue="downloads" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-t-xl px-6">
                    <TabsTrigger value="downloads" className="gap-2">
                      <Download className="size-4" />
                      My Downloads
                    </TabsTrigger>
                    <TabsTrigger value="favourites" className="gap-2">
                      <Heart className="size-4" />
                      My Favourites
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings className="size-4" />
                      Account Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Favourites Tab */}
                  <TabsContent value="favourites" className="p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">My Favourites</h2>
                      
                      {favourites.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <Heart className="size-16 mx-auto mb-4 text-orange-200" />
                          <p className="text-lg font-medium mb-2">No favourites yet</p>
                          <p className="text-sm">Resources you mark as favourite will appear here</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="border-b border-gray-200">
                              <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Resource</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Added</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {favourites.map((favourite, index) => (
                                <motion.tr
                                  key={index}
                                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <td className="py-3 px-4">{favourite.title}</td>
                                  <td className="py-3 px-4">{favourite.category}</td>
                                  <td className="py-3 px-4">{favourite.date}</td>
                                  <td className="py-3 px-4">
                                    <motion.button
                                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                      whileHover={{ x: 5 }}
                                    >
                                      View →
                                    </motion.button>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  {/* Downloads Tab */}
                  <TabsContent value="downloads" className="p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Download History</h2>
                      
                      {downloads.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <Download className="size-16 mx-auto mb-4 text-orange-200" />
                          <p className="text-lg font-medium mb-2">No downloads yet</p>
                          <p className="text-sm">Your download history will appear here</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="border-b border-gray-200">
                              <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Resource</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Downloaded</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {downloads.map((download, index) => (
                                <motion.tr
                                  key={index}
                                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <td className="py-3 px-4">{download.title}</td>
                                  <td className="py-3 px-4">{download.category}</td>
                                  <td className="py-3 px-4">{download.date}</td>
                                  <td className="py-3 px-4">
                                    <motion.button
                                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                      whileHover={{ x: 5 }}
                                    >
                                      Download Again
                                    </motion.button>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                        {!isEditing ? (
                          <motion.button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Edit className="size-4" />
                            Edit Profile
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <X className="size-4" />
                            Cancel
                          </motion.button>
                        )}
                      </div>
                      
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
                              placeholder="your@email.com"
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

                        {isEditing && (
                          <motion.button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Save className="size-4" />
                            Save Changes
                          </motion.button>
                        )}
                      </form>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}