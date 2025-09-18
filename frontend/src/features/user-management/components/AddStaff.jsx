import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetchStaff";
import { useNavigate } from "react-router-dom";
export default function AddStaff(){
    const navigate = useNavigate();
    const [userRoles, setUserRoles] = useState([]);
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
      });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({
        method: "post",
        url: "http://localhost:5000/api/staff/auth/register",
        data: userData,
      });
      console.log("Staff added successfully:", res.data);
      navigate("/dashboard/admin/staff");
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

   useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: "http://localhost:5000/api/user-roles/getAllRoles",
        });
        setUserRoles(res.data);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };

    fetchUserRoles();
  }, []);

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
          <select name="role" onChange={handleChange}  className="w-3/4 mx-auto block px-3 py-2 border rounded-lg dark:bg-gray-700">
            <option value="">Select Role</option>
            {userRoles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
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