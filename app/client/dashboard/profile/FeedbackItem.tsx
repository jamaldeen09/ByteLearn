const FeedbackItem = ({ text, course }: { text: string, course: string }) => (
    <div className="group">
      <div className="border-l-2 border-gray-200 pl-4 py-2 group-hover:border-gray-800 transition-colors">
        <p className="text-gray-700 group-hover:text-gray-900">"{text}"</p>
        <p className="text-sm text-gray-500 mt-1">— {course}</p>
      </div>
    </div>
  );

  export default FeedbackItem