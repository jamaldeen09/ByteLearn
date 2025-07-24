"use client"

import { FiUsers, FiBook, FiSearch, FiHeart } from 'react-icons/fi';


const EnrollmentsSkeleton = () => {

  return (
    <div className="col-span-16 p-6 space-y-6 bg-gray-50 overflow-y-auto h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="relative flex items-center space-x-2 w-full md:w-auto">
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="relative flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch className="opacity-0" />
            </div>
            <div className="pl-10 pr-4 py-2 border rounded-md text-sm w-full md:w-64 h-10 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-full animate-pulse">
                {item === 1 && <FiBook className="opacity-0" />}
                {item === 2 && <FiUsers className="opacity-0" />}
                {item === 3 && <FiHeart className="opacity-0" />}
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Course', 'Student', 'Enrolled On', 'Progress', 'Likes'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse">
                      <div className="bg-gray-300 h-2 rounded-full w-1/2"></div>
                    </div>
                    <div className="h-3 w-8 bg-gray-200 rounded animate-pulse mt-1"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <FiHeart className="text-gray-200" />
                      <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentsSkeleton;