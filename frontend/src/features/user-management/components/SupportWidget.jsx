import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../components/AuthContext";

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

    const msg = { user_code: userId, sender: "customer", message: input };

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
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-xl border rounded-lg flex flex-col">
          <div className="p-2 bg-blue-600 text-white font-bold">Support</div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 my-1 rounded max-w-[70%] ${
                  m.sender === "customer"
                    ? "bg-blue-200 ml-auto"
                    : "bg-gray-200 mr-auto"
                }`}
              >
                {m.message}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
