import React from "react";

const PollResults = ({ pollResults }) => {
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4 text-[#1E293B]">Poll Results</h2>

      {totalVotes > 0 ? (
        <div className="space-y-4">
          {Object.entries(pollResults).map(([option, votes], index) => {
            const percentage = (votes / totalVotes) * 100;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#1E293B]">{option}</span>
                  <span className="text-[#6B7280]">
                    {votes} vote{votes !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 transition-all duration-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[#6B7280]">No results yet.</p>
      )}
    </div>
  );
};

export default PollResults;
