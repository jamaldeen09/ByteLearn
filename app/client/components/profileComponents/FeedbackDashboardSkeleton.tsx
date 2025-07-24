const FeedbackDashboardSkeleton = () => {
    return (
      <div className="col-span-16 p-6 space-y-8 bg-gray-50 overflow-y-auto h-screen">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="w-48 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
  
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-200 rounded-full animate-pulse">
                  <div className="w-5 h-5"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Visualization Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="h-6 w-48 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
              <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading chart...</div>
              </div>
            </div>
          ))}
          {/* Extra skeleton for the 4th chart (would be col-span-2) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
            <div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
  
        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 grid grid-cols-5 gap-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default FeedbackDashboardSkeleton