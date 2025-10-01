import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../components/AuthContext";
import { MessageCircle, X, Send } from "lucide-react";

let socket; // global socket instance

export default function SupportWidget() {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_code ?? user?.staff_code;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // --- Initialize socket ---
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });
    }

    // Listen for new incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, []);

  // --- Handle login/logout (room join/leave + clear messages) ---
  useEffect(() => {
    if (!userId) {
      // user logged out → clear messages + leave room
      setMessages([]);
      if (socket) socket.emit("leave_room", userId);
      return;
    }

    // new user logged in → clear messages + join their room
    setMessages([]);
    if (socket) socket.emit("join_room", userId);

    // fetch chat history for this user
    fetch(`http://localhost:5000/api/chat/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [userId]);

  // --- Send message ---
  const sendMessage = async () => {
    if (!input.trim() || !userId) return;

    const msg = { user_code: userId, sender: "user", message: input };

    try {
      await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      setInput(""); // clear input only
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex flex-col z-40 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Admin Support</h3>
                <p className="text-xs text-blue-100">
                  We typically reply in minutes
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">
                  Send a message to start the conversation
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[75%]">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        m.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="text-sm break-words">{m.message}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 px-1 ${
                        m.sender === "user"
                          ? "text-right text-gray-500"
                          : "text-left text-gray-500"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
