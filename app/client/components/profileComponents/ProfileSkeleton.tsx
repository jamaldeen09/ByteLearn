

export const ProfileSkeleton = () => {
  return (
    <div className="col-span-16 p-6 space-y-6 bg-gray-50 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
          </div>

          {/* Profile Info Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-7 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            
            {/* Stats Pills Skeleton */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
              <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
              <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 h-24">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-100"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-3">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-12 w-full bg-gray-100 rounded-lg"></div>
        ))}
      </div>

      {/* Teaching Milestones Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2 pl-4 border-l-2 border-gray-100 py-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton