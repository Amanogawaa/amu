import React from "react";

const LearningCourseCard = () => {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-2">Learning Course Title</h2>
        <p className="text-gray-600 mb-4">
          A brief description of the learning course goes here. It provides an
          overview of what to expect.
        </p>
      </div>
    </div>
  );
};

export default LearningCourseCard;
