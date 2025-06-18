import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';

const Home = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <div className="flex justify-center mb-6">
          <span className="px-6 py-2 bg-[#FFF0D9] text-[#D97706] rounded-full text-base font-semibold shadow-sm">
            Interview Poll
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
            Welcome to the Live Polling System
          </h1>
          <p className="text-[#64748B] text-sm md:text-base">
            Select your role to get started with real-time polling.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {["student", "teacher"].map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`cursor-pointer p-6 border-2 rounded-xl transition-all duration-200 ${
                selectedRole === role
                  ? "border-[#14B8A6] bg-[#E0FDF4]"
                  : "border-gray-200 hover:border-[#14B8A6]"
              }`}
            >
              <h2 className="text-lg font-semibold text-[#1E293B] mb-2">
                I'm a {role.charAt(0).toUpperCase() + role.slice(1)}
              </h2>
              <p className="text-[#64748B] text-sm">
                {role === "student"
                  ? "Join polls and engage in real-time question answering."
                  : "Create polls and manage student interactions live."}
              </p>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            disabled={!selectedRole}
            onClick={handleContinue}
            className={`px-10 py-3 rounded-full text-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm ${
              selectedRole
                ? "bg-[#FED7AA] text-[#B45309] hover:bg-[#FEC89A]"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            Continue
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
