export default function Complaints() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Complaints</h2>
      <ul className="space-y-2">
        <li className="p-3 border rounded-lg dark:border-gray-700">
          <p><strong>Customer:</strong> Jane Smith</p>
          <p><strong>Complaint:</strong> Delay in delivery</p>
          <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Resolve</button>
        </li>
      </ul>
    </section>
  );
}
