export default function Chat() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Chat</h2>
      <div className="h-48 border rounded-lg p-3 overflow-y-auto dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <p><strong>Admin:</strong> Hello, how can I help?</p>
        <p><strong>Customer:</strong> I need help with my order.</p>
      </div>
      <div className="flex mt-3 space-x-2">
        <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700" />
        <button className="bg-blue-600 text-white px-4 rounded-lg">Send</button>
      </div>
    </section>
  );
}
