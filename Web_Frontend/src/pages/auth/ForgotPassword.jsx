import { useState } from "react";
import { forgotPassword } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({ email });
      const data = res.data.data;

      navigate("/verify-reset-otp", {
        state: {
          user_id: data.user_id,
          email,
        },
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100" onSubmit={handleSubmit}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Reset Password</h1>
            <p className="text-center text-blue-600 text-sm">
              Enter your email to receive a verification OTP
            </p>
          </div>

          <div className="mb-6">
            <Input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Send OTP
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-blue-200"></div>
            <span className="px-3 text-blue-400 text-xs font-medium">OR</span>
            <div className="flex-1 border-t border-blue-200"></div>
          </div>

          <p className="text-sm text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium underline transition">
              Back to Login
            </Link>
          </p>

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

export default ForgotPassword;