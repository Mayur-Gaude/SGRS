import { useState } from "react";
import { registerUser } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      const data = res.data.data;

      // 🔥 Move to OTP screen
      navigate("/verify-otp", {
        state: {
          user_id: data.user_id,
          email: form.email,
          phone: form.phone,
        },
      });

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
              Create Account
            </h1>
            <p className="text-center text-blue-600 text-sm">
              Join the Smart Grievance System
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <Input
              type="text"
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />

            <Input
              type="email"
              placeholder="Email Address"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              type="text"
              placeholder="Phone Number"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <Input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-blue-200"></div>
            <span className="px-3 text-blue-400 text-xs font-medium">OR</span>
            <div className="flex-1 border-t border-blue-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            <p className="text-blue-700">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold underline transition">
                Sign In
              </a>
            </p>
          </div>

          {/* Footer */}
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

export default Register;