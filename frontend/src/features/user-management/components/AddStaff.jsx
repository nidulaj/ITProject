


export default function AddStaff(){
    return(
        <section className="w-1/2 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 text-center">
          Add New Staff User
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <input
            onChange={handleChange}
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <input
            onChange={handleChange}
            type="text"
            name="email"
            placeholder="Email"
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <input
            onChange={handleChange}
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <select name="role" id="">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <button
            type="submit"
            className="w-3/4 mx-auto block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Role
          </button>
        </form>
      </section>
    );
}