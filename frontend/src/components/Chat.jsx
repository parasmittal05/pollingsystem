import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const socket = io("https://pollingsystem-tcy7.onrender.com");

const Chat = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msg = { user, text: message };
    socket.emit("chatMessage", msg);
    setMessage("");
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 ease-in-out"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaComments className="w-5 h-5" />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Live Chat</h2>
              <FaTimes
                className="text-white cursor-pointer hover:scale-110 transition"
                onClick={toggleChat}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700">{msg.user}</span>
                  <span
                    className={`inline-block px-4 py-2 rounded-xl max-w-xs break-words ${
                      msg.user === user
                        ? "bg-orange-200 self-end text-right text-orange-800"
                        : "bg-white border self-start text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex border-t border-gray-200 bg-white"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-3 focus:outline-none rounded-bl-xl"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 px-5 text-white rounded-br-xl transition-all"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
