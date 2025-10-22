import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../components/AuthContext";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(AuthContext);

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        { token: idToken }
      );

      const { role, user: loggedInUser } = res.data;
      setUser(loggedInUser);
      console.log("Logged in user:", loggedInUser);

      if (res.data.is_2FA_enabled) {
        navigate("/verify2FA", {
          state: { role: res.data.role, type: res.data.type },
        });
      } else {
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err?.response.data ?? err);
    }
  };

  const handleError = () => {
    console.log("Google login failed or cancelled");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
}
