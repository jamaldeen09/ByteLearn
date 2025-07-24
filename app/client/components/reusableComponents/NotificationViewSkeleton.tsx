const NotificationViewSkeleton = () => {
    return (
      <div className="w-full h-full">
        {/* Header Skeleton */}
        <div className="w-full flex items-center justify-between border-b py-4 px-6 animate-pulse">
          <div className="w-fit flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-gray-200"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-5 w-32 rounded bg-gray-200"></div>
              <div className="h-3 w-24 rounded bg-gray-100"></div>
            </div>
          </div>
          <div className="w-6 h-6 rounded bg-gray-200"></div>
        </div>
  
        {/* Content Skeleton */}
        <div className="w-full py-10 min-h-80 px-4 space-y-4 animate-pulse">
          {/* Letter Header */}
          <div className="border-b border-gray-200 pb-4 space-y-2">
            <div className="h-6 w-48 rounded bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-100"></div>
          </div>
  
          {/* Letter Body */}
          <div className="space-y-3">
            <div className="h-4 w-16 rounded bg-gray-100"></div>
            <div className="h-4 w-full rounded bg-gray-100"></div>
            <div className="h-4 w-5/6 rounded bg-gray-100"></div>
            <div className="h-4 w-3/4 rounded bg-gray-100"></div>
          </div>
  
          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex gap-3">
              <div className="h-10 flex-1 rounded bg-gray-200"></div>
              <div className="h-10 flex-1 rounded bg-gray-100"></div>
            </div>
          </div>
  
          {/* Letter Closing */}
          <div className="mt-8 space-y-2">
            <div className="h-4 w-24 rounded bg-gray-100"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
};

export default NotificationViewSkeleton