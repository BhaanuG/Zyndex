import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Settings, Save, Heart, Edit, X } from 'lucide-react';
import UserLayout from '@/app/components/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useAuth } from '@/app/context/AuthContext';
import userService from '@/services/api/userService';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [profileData, setProfileData] = useState({ name: '', email: '', bio: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const response = await userService.getFavorites();
        setFavourites(response.resources || []);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }

    loadFavorites();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      alert(error.message || 'Failed to update profile.');
    }
  };

  return (
    <UserLayout>
      <div className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Profile</h1>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="size-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-4">
                {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{profileData.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{profileData.email}</p>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl shadow-md">
              <Tabs defaultValue="favourites" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-t-xl px-6">
                  <TabsTrigger value="favourites" className="gap-2"><Heart className="size-4" />My Favourites</TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2"><Settings className="size-4" />Account Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="favourites" className="p-6">
                  {favourites.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Heart className="size-16 mx-auto mb-4 text-orange-200" />
                      <p className="text-lg font-medium mb-2">No favourites yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favourites.map((favourite) => (
                        <div key={favourite.id} className="border border-gray-200 rounded-lg p-4">
                          <p className="font-semibold text-gray-900">{favourite.title}</p>
                          <p className="text-sm text-gray-500">{favourite.category} | Author of Resource: {favourite.subject}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium"><Edit className="size-4" />Edit Profile</button>
                    ) : (
                      <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"><X className="size-4" />Cancel</button>
                    )}
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="text" name="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} disabled={!isEditing} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50" /></div>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /><input type="email" name="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} disabled={!isEditing} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50" /></div>
                    <textarea name="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} disabled={!isEditing} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none disabled:bg-gray-50" />
                    {isEditing && <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium"><Save className="size-4" />Save Changes</button>}
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
