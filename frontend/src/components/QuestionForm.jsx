import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("https://pollingsystem-tcy7.onrender.com");

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      text: question,
      options: options.filter((option) => option.trim()),
      correctOption,
    };
    socket.emit("submitQuestion", questionData);
    setQuestion("");
    setOptions([]);
    setCorrectOption("");
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleQuestionSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">Question</label>
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-[#1E293B]">Options</label>
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              correctOption === option ? "bg-[#FEF3C7]" : ""
            }`}
          >
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
            />
            <input
              type="radio"
              id={`correct-${index}`}
              name="correctOption"
              value={option}
              checked={correctOption === option}
              onChange={(e) => setCorrectOption(e.target.value)}
            />
            <label htmlFor={`correct-${index}`} className="text-sm text-[#1E293B]">Correct</label>
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="bg-[#FDE68A] hover:bg-[#FCD34D] text-black px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Add Option
        </button>
      </div>

      <button
        type="submit"
        className="bg-[#FDE68A] hover:bg-[#FCD34D] text-black px-6 py-3 rounded-lg font-medium transition"
      >
        Ask Question
      </button>
    </form>
  );
};

export default QuestionForm;
