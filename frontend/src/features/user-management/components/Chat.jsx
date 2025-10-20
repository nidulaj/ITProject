import { useState, useEffect, useRef } from "react";
import { Search, Send, User } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ ref for auto-scrolling
  const messagesEndRef = useRef(null);

  // fetch users who have chats
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat/users-with-unread"
        );
        setUsers(res.data.map((u) => ({ ...u, unread: u.unread_count > 0 })));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // load messages for selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/user/${selectedUser.user_code}`
        );
        setMessages(res.data);
        await axios.put(
          `http://localhost:5000/api/chat/read/${selectedUser.user_code}`
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    setUsers((prev) =>
      prev.map((u) =>
        u.user_code === selectedUser.user_code ? { ...u, unread: false } : u
      )
    );
  }, [selectedUser]);

  // listen for ALL incoming messages
  useEffect(() => {
    socket.emit("join_room", "admin");

    socket.on("receive_message", (msg) => {
      if (selectedUser?.user_code === msg.user_code) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.user_code === msg.user_code ? { ...u, unread: true } : u
          )
        );
      }
    });

    return () => {
      socket.off("receive_message");
      socket.emit("leave_room", "admin");
    };
  }, [selectedUser]);

  // ✅ Auto scroll to bottom on new messages or when user changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msg = {
      user_code: selectedUser.user_code,
      sender: "admin",
      message: newMessage,
    };

    try {
      await axios.post("http://localhost:5000/api/chat/send", msg);
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  // Filter users based on search query
  const filteredUsers = users.filter((u) =>
    u.user_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Users List */}
      <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Messages
          </h2>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery ? "No users found" : "No conversations yet"}
            </div>
          ) : (
            filteredUsers.map((c) => (
              <button
                key={c.user_code}
                onClick={() => setSelectedUser(c)}
                className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                  selectedUser?.user_code === c.user_code
                    ? "bg-blue-50 dark:bg-gray-700 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">
                      {c.user_code}
                    </p>
                    {c.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click to view chat
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {selectedUser.user_code}
                  </h3>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      m.sender === "admin"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm break-words">{m.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        m.sender === "admin"
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* ✅ Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Search className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm mt-1">
              Choose a user from the list to start chatting
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
