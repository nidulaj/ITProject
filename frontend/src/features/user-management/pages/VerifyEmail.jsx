import { useNavigate } from "react-router-dom";
export default function VerifyEmail() {
    const navigate  = useNavigate()
  return (
    <div>
        <h2>Email verified successfully</h2>
        <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
}