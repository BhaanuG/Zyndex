import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import UserLayout from '@/app/components/UserLayout';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Subject data based on category
  const subjectsByCategory = {
    science: ['Physics', 'Chemistry', 'Biology', 'Astronomy'],
    mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    literature: ['Poetry', 'Fiction', 'Drama', 'Non-Fiction'],
    history: ['Ancient History', 'Modern History', 'World History', 'Cultural History'],
  };

  const subjects = category ? subjectsByCategory[category] || [] : [];
  const resources = [];
  const results = []; // Define results for non-category search

  return (
    <UserLayout>
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} - Subjects` : 'Search Resources'}
            </h1>
            
            <div className="flex gap-4">
              <motion.button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SlidersHorizontal className="size-5" />
                <span className="font-medium">Filters</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {filterOpen && (
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">Filter Results</h3>
              <div className="grid grid-cols-3 gap-4">
                {category && subjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject.toLowerCase()}>{subject}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>All Types</option>
                    <option>PDF</option>
                    <option>Article</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Most Recent</option>
                    <option>Most Popular</option>
                    <option>Title A-Z</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results - Show resources for category */}
          {category ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSubject === 'all' 
                    ? `All ${category.charAt(0).toUpperCase() + category.slice(1)} Resources` 
                    : `${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Resources`}
                </h2>
                {subjects.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedSubject('all')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedSubject === 'all'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {subjects.map((subject, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSubject(subject.toLowerCase())}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedSubject === subject.toLowerCase()
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {resources.length === 0 ? (
                <motion.div
                  className="bg-white rounded-xl shadow-md p-16 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-gray-400">
                    <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No resources available</p>
                    <p className="text-sm">
                      {selectedSubject === 'all' 
                        ? `Resources for ${category} will appear here once uploaded`
                        : `Resources for ${selectedSubject} will appear here once uploaded`}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{resource.subject}</span>
                          <span>•</span>
                          <span>{resource.type}</span>
                          <span>•</span>
                          <span>{resource.date}</span>
                        </div>
                        <motion.button
                          className="text-orange-600 font-medium hover:text-orange-700"
                          whileHover={{ x: 5 }}
                        >
                          View →
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl shadow-md p-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-gray-400">
                <Search className="size-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
                  <p className="text-gray-600 mb-4">{result.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{result.category}</span>
                      <span>•</span>
                      <span>{result.type}</span>
                      <span>•</span>
                      <span>{result.date}</span>
                    </div>
                    <motion.button
                      className="text-orange-600 font-medium hover:text-orange-700"
                      whileHover={{ x: 5 }}
                    >
                      View →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}