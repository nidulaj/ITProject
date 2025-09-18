export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Logout</button>
    </header>
  );
}
