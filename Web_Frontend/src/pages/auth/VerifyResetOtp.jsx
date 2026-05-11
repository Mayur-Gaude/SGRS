import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyResetOtp } from "../../api/auth.api";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { user_id } = location.state;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyResetOtp({
        user_id,
        otp_code: otp,
      });

      const data = res.data.data;

      navigate("/set-new-password", {
        state: {
          reset_token: data.reset_token,
        },
      });

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100" onSubmit={handleVerify}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Verify OTP</h1>
            <p className="text-center text-blue-600 text-sm">
              Enter the OTP sent to your registered email
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 placeholder:text-blue-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Verify OTP
          </button>

          <div className="mt-6 pt-6 border-t border-blue-100">
            <p className="text-center text-xs text-blue-500">
              © 2024 Smart Grievance System. All rights reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyResetOtp;