const DashSkeleton = () => {
  return (
    <div className="flex flex-col h-screen lg:flex-row">
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-1/4 p-4 space-y-4 bg-gray-200">
        <div className="bg-gray-300 h-6 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-6 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-6 rounded-md animate-pulse"></div>
        <div className="bg-gray-300 h-6 rounded-md animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar Skeleton */}
        <div className="flex justify-between items-center p-4 bg-gray-200">
          <div className="bg-gray-300 h-6 w-24 rounded-md animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="bg-gray-300 h-6 w-12 rounded-md animate-pulse"></div>
            <div className="bg-gray-300 h-6 w-12 rounded-md animate-pulse"></div>
            <div className="bg-gray-300 h-6 w-12 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col p-4 space-y-4 flex-1">
          <div className="bg-gray-300 h-40 rounded-md animate-pulse"></div>
          <div className="bg-gray-300 h-40 rounded-md animate-pulse"></div>
          <div className="bg-gray-300 h-40 rounded-md animate-pulse"></div>
          <div className="bg-gray-300 h-40 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default DashSkeleton;
