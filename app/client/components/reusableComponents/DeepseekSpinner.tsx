

const DeepseekSpinner = () => {
    return (
      <div className="relative inline-flex items-center justify-center">
        {/* Outer static circle */}
        <div className="w-3 h-3 rounded-full border-2 border-gray-300"></div>
        
        {/* Animated spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full border-2 border-t-white border-r-white border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
};

export default DeepseekSpinner