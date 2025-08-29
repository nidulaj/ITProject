import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../components/AuthContext";
export default function Verify2FA() {
  const [code, setCode] =  useState();
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(60)
  
  useEffect(() => {
    if (timeLeft === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timerId)
  }, [timeLeft])

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-2fa",
        { code },
        { withCredentials: true }
      );
      setIsLoggedIn(true);
      console.log("verification done");
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-2fa", {}, { withCredentials: true });
      console.log("Resend 2FA code");
      setTimeLeft(60);
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
      <h2>Verify 2FA</h2>
      <form onSubmit={handleVerify}>
        <label htmlFor="verificationCode">Enter 2FA Code:</label>
        <input
          type="text"
          id="verificationCode"
          name="verificationCode"
          required
          onChange={(e) => setCode(Number(e.target.value))}
        />
        <button type="submit">Verify</button>
        <div>
      <p>Resend code again in : {timeLeft}s</p>
    </div>
        <button onClick={handleResend} disabled={timeLeft > 0}>Resend Verification Code</button>
      </form>
    </div>
  );
}
