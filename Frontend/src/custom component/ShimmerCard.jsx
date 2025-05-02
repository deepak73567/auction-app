const ShimmerCard = () => {
    return (
      <div className="bg-white p-4 rounded-2xl shadow animate-pulse space-y-4">
        <div className="h-48 bg-gray-300 rounded-xl w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  };
  
  export default ShimmerCard;
  