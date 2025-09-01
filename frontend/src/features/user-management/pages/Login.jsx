import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/AuthContext";
import { useNavigate , Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton"

export default function Login() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    console.log(credentials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials, { withCredentials: true }
      );

      if(res.data.is_2FA_enabled){
        navigate("/verify2FA");
        console.log(res.data.message);
      }else{
        navigate("/dashboard");
        setIsLoggedIn(true);
        console.log(res.data.message);
      }
      
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
  <h2>Login</h2>
  <form onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
      <GoogleLoginButton />
    </div>
    
    <div>
      <Link to="/register">Register</Link>
    </div>
  </form>
</div>

  );
}
