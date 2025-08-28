import React from "react"
import axios from "axios"
export default function Verify2FA(){
    const [code, setCode] = React.useState()

    const handleVerify = async () => {
        const res = await axios.post("http://localhost:5000/api/auth/verify-2fa", {code})
    }
    return(
        <div>
            <h2>Verify 2FA</h2>
            <form onSubmit={handleVerify}>
                <label htmlFor="verificationCode">Enter 2FA Code:</label>
                <input type="text" id="verificationCode" name="verificationCode" required onChange={(e) => setCode(Number(e.target.value))} />
                <button type="submit">Verify</button>
            </form>
        </div>
    )
}