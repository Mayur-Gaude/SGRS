import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/auth.api";
import Button from "../../components/common/Button";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user_id, email, phone } = location.state;

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [verified, setVerified] = useState({
    email: false,
    phone: false,
  });

  // 🔥 Verify Email OTP
  const handleVerifyEmail = async () => {
    try {
      await verifyOtp({
        user_id,
        otp_code: emailOtp,
        otp_type: "EMAIL_VERIFICATION",
      });

      setVerified((prev) => ({ ...prev, email: true }));
      alert("Email verified");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔥 Verify Phone OTP
  const handleVerifyPhone = async () => {
    try {
      await verifyOtp({
        user_id,
        otp_code: phoneOtp,
        otp_type: "PHONE_VERIFICATION",
      });

      setVerified((prev) => ({ ...prev, phone: true }));
      alert("Phone verified");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔁 Resend OTP
  const handleResend = async (type) => {
    try {
      await resendOtp({
        user_id,
        otp_type: type,
      });

      alert("OTP resent");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ✅ Continue after both verified
  const handleContinue = () => {
    if (verified.email && verified.phone) {
      navigate("/");
    } else {
      alert("Verify both OTPs first");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Verify OTP</h1>
          <p className="text-center text-blue-600 text-sm">
            Complete both verifications to activate your account
          </p>
        </div>

        {/* EMAIL OTP */}
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <p className="text-sm font-medium text-blue-800">Email: {email}</p>

          <input
            type="text"
            placeholder="Enter Email OTP"
            className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 placeholder:text-blue-400 outline-none mt-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e) => setEmailOtp(e.target.value)}
          />

          <button
            className="w-full mt-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleVerifyEmail}
            disabled={verified.email}
          >
            {verified.email ? "Verified" : "Verify Email"}
          </button>

          <button
            className="text-sm mt-2 text-blue-700 hover:text-blue-800 underline font-medium"
            onClick={() => handleResend("EMAIL_VERIFICATION")}
          >
            Resend Email OTP
          </button>
        </div>

        {/* PHONE OTP */}
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <p className="text-sm font-medium text-blue-800">Phone: {phone}</p>

          <input
            type="text"
            placeholder="Enter Phone OTP"
            className="w-full rounded-lg border border-blue-200 px-4 py-3 text-blue-900 placeholder:text-blue-400 outline-none mt-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(e) => setPhoneOtp(e.target.value)}
          />

          <button
            className="w-full mt-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleVerifyPhone}
            disabled={verified.phone}
          >
            {verified.phone ? "Verified" : "Verify Phone"}
          </button>

          <button
            className="text-sm mt-2 text-blue-700 hover:text-blue-800 underline font-medium"
            onClick={() => handleResend("PHONE_VERIFICATION")}
          >
            Resend Phone OTP
          </button>
        </div>

        <Button text="Continue" onClick={handleContinue} />

        <div className="mt-6 pt-6 border-t border-blue-100">
          <p className="text-center text-xs text-blue-500">
            © 2024 Smart Grievance System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;