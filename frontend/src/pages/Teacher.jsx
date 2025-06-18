import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import QuestionForm from "../components/QuestionForm";
import PollResults from "../components/PollResults";
import Chat from "../components/Chat";
import PollHistory from "../components/PollHistory";
import { FaUserMinus } from 'react-icons/fa6';

const socket = io("https://pollingsystem-tcy7.onrender.com"); 

const Teacher = () => {
  const [students, setStudents] = useState([]);
  const [pollResults, setPollResults] = useState({});
  const [pollHistory, setPollHistory] = useState([]);  
  const [activeTab, setActiveTab] = useState("ask");  

  useEffect(() => {
    socket.on("pollResults", (results) => {
      setPollResults(results);
      setPollHistory((prevHistory) => [...prevHistory, results]);  
    });

    socket.on("students", (studentsList) => {
      setStudents([...new Set(studentsList)]);  
    });

    return () => {
      socket.off("pollResults");
      socket.off("students");
    };
  }, []);

  const handleKickStudent = (studentName) => {
    socket.emit("kickStudent", studentName);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold text-[#373737]">Teacher Portal</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("ask")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "ask"
                    ? "bg-[#7765DA] text-white"
                    : "text-[#6E6E6E] hover:bg-gray-50"
                }`}
              >
                Ask a Question
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "history"
                    ? "bg-[#7765DA] text-white"
                    : "text-[#6E6E6E] hover:bg-gray-50"
                }`}
              >
                Poll History
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex p-6">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {activeTab === "ask" ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#373737]">Create New Question</h2>
                </div>
                <QuestionForm />
              </div>

              {Object.keys(pollResults).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-[#373737] mb-6">Current Poll Results</h2>
                  <PollResults pollResults={pollResults} />
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#373737] mb-6">Current Students</h2>
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <span className="text-[#373737]">{student}</span>
                        <button
                          onClick={() => handleKickStudent(student)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${student}`}
                        >
                          <FaUserMinus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6E6E6E] text-center py-4">
                    No students have joined yet
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#373737] mb-6">Poll History</h2>
              <PollHistory pollHistory={pollHistory} />
            </div>
          )}
        </div>
      </div>
      <Chat user="Teacher" />
    </div>
  );
};

export default Teacher;

