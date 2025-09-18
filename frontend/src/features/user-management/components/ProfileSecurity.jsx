export default function ProfileSecurity() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Profile & Security</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
        <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
        <input type="password" placeholder="New Password" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Update Profile</button>
      </form>
    </section>
  );
}
