import React from "react";

const PollHistory = ({ pollHistory }) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-6">View Poll History</h1>

      <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4">
        {pollHistory.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E6E]">
            No past polls available.
          </div>
        ) : (
          pollHistory.map((poll, questionIndex) => {
            const totalVotes = Object.values(poll.options || {}).reduce(
              (a, b) => a + b,
              0
            );
            return (
              <div key={questionIndex} className="space-y-4">
                <h2 className="text-lg font-semibold text-[#1E293B]">
                  Question {questionIndex + 1}
                </h2>

                <div className="bg-white rounded-xl overflow-hidden shadow border border-gray-100">
                  <div className="bg-[#1E293B] text-white p-4">
                    <p className="font-medium">{poll.question || "Untitled Question"}</p>
                  </div>

                  <div className="p-4 space-y-4">
                    {Object.entries(poll.options || {}).map(([option, votes], index) => {
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xs">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-[#1E293B]">{option}</span>
                            </div>
                            <span className="text-[#6B7280]">{Math.round(percentage)}%</span>
                          </div>

                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#F97316] transition-all duration-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PollHistory;
