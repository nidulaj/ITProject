import React from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      console.log(res.data.message);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };

  return (
    <div>
  <h2>Register</h2>
  <form className="register-form" onSubmit={handleSubmit}>
    <div>
      <label htmlFor="firstName">First Name:</label><br />
      <input
        type="text"
        id="firstName"
        name="firstName"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="lastName">Last Name:</label><br />
      <input
        type="text"
        id="lastName"
        name="lastName"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="email">Email:</label><br />
      <input
        type="email"
        id="email"
        name="email"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="phone">Phone:</label><br />
      <input
        type="text"
        id="phone"
        name="phone"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="address">Address:</label><br />
      <input
        type="text"
        id="address"
        name="address"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="password">Password:</label><br />
      <input
        type="password"
        id="password"
        name="password"
        required
        onChange={handleChange}
      />
    </div>

    <div>
      <button type="submit">Register</button>
    </div>

    <div>
      <Link to="/login">Login</Link>
    </div>
  </form>
</div>

  );
}
