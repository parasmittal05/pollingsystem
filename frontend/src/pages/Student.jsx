import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import PollResults from "../components/PollResults";
import Chat from "../components/Chat";
import { FaClock } from 'react-icons/fa';

const socket = io("https://pollingsystem-tcy7.onrender.com");

const Student = () => {
    const [name, setName] = useState("");
    const [storedName, setStoredName] = useState("");
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [pollResults, setPollResults] = useState({});
    const [timer, setTimer] = useState(60);
    const [showResults, setShowResults] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [answered, setAnswered] = useState(false);
    const timerRef = useRef(null);
  
    useEffect(() => {
      const sessionName = sessionStorage.getItem("studentName");
      if (sessionName) {
        setStoredName(sessionName);
        socket.emit("setName", sessionName);
      }
  
      socket.on("question", (data) => {
        setQuestion(data);
        setTimer(60);
        setShowResults(false);
        setCorrectAnswer("");
        setAnswered(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              if (!answered) {
                socket.emit("submitAnswer", selectedOption);
                setAnswered(true);
              }
              setShowResults(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
  
      socket.on("pollResults", (results) => {
        setPollResults(results);
      });
  
      socket.on("correctAnswer", (answer) => {
        setCorrectAnswer(answer);
      });
  
      socket.on("kicked", () => {
        sessionStorage.removeItem("studentName");
        setStoredName("");
      });
  
      return () => {
        socket.off();
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [answered, selectedOption]);
  
    const handleNameSubmit = (e) => {
      e.preventDefault();
      sessionStorage.setItem("studentName", name);
      setStoredName(name);
      socket.emit("setName", name);
    };
  
    const handleAnswerSubmit = (e) => {
      e.preventDefault();
      socket.emit("submitAnswer", selectedOption);
      setShowResults(true);
      setAnswered(true);
    };
  
    const handleWaitForNextQuestion = () => {
      setQuestion(null);
      setShowResults(false);
      setSelectedOption("");
      setPollResults({});
      setCorrectAnswer("");
      setAnswered(false);
    };

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {!storedName ? (
              <>
                <div className="flex justify-center mb-8">
                  <span className="px-4 py-1 bg-[#7765DA] text-white rounded-full text-sm">
                    Interview Poll
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#373737] mb-2">
                    Let's Get Started
                  </h1>
                  <p className="text-[#6E6E6E] text-sm px-4">
                    If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates
                  </p>
                </div>

                <div>
                  <form onSubmit={handleNameSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-[#373737]">
                        Enter your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Rahul Bajaj"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7765DA] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#7765DA] text-white py-3 px-4 rounded-lg hover:bg-[#6655CA] transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              </>
            ) : question ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-[#373737]">Question 1</h2>
                  <div className="flex items-center gap-2 text-[#7765DA]">
                    <FaClock className="w-4 h-4" />
                    <span className="font-medium">{formatTime(timer)}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#373737] text-white p-4">
                    <p className="font-medium">{question.text}</p>
                  </div>

                  <form onSubmit={handleAnswerSubmit} className="p-4">
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                            selectedOption === option
                              ? 'bg-[#7765DA] text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                            selectedOption === option
                              ? 'bg-white text-[#7765DA]'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            type="radio"
                            id={`option-${index}`}
                            name="option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="hidden"
                          />
                          <span className="flex-grow">{option}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={!selectedOption || answered}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                          !selectedOption || answered
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#7765DA] hover:bg-[#6655CA] text-white'
                        }`}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>

                {showResults && (
                  <div className="mt-8 space-y-6">
                    <PollResults pollResults={pollResults} />
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-[#373737] mb-4">
                        Correct Answer: {correctAnswer}
                      </h3>
                      <button
                        onClick={handleWaitForNextQuestion}
                        className="w-full bg-[#7765DA] hover:bg-[#6655CA] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        Wait for Next Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h2 className="text-xl font-semibold text-[#373737] mb-2">
                  Waiting for the next question...
                </h2>
              </div>
            )}
          </div>
        </div>
        {storedName && <Chat user={storedName || "Student"} />}
      </div>
    );
  };
  
export default Student;

