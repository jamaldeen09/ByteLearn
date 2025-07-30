

const QuizLoader = (): React.ReactElement => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 col-span-16 centered-flex">
            <div className="w-full max-w-4xl mx-auto">
                {/* Quiz Header Skeleton */}
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="mb-8">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gray-300 rounded-full animate-pulse"
                            style={{ width: "50%" }}
                        ></div>
                    </div>
                </div>

                {/* Question Card Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6 md:p-8">
                        {/* Question Text Skeleton */}
                        <div className="space-y-4 mb-6">
                            <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>

                        {/* Options Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-gray-100 rounded-lg animate-pulse"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="h-12 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-12 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default QuizLoader;