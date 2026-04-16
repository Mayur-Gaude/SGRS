import { useState, useContext } from "react";
import { loginUser } from "../../api/auth.api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);
      const data = res.data.data;

      // 🔥 Admin → 2FA
      if (data.requires_2fa) {
        navigate("/verify-2fa", { state: data });
        return;
      }

      // ✅ Normal login
      login(data);
      if(data.user.role === "USER"){
        navigate("/user/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-blue-600 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <Input
              type="email"
              placeholder="Email Address"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-blue-200"></div>
            <span className="px-3 text-blue-400 text-xs font-medium">OR</span>
            <div className="flex-1 border-t border-blue-200"></div>
          </div>

          {/* Links */}
          <div className="space-y-3 text-sm">
            <Link
              to="/register"
              className="flex justify-center text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Don't have an account? <span className="ml-1 underline">Create one</span>
            </Link>

            <Link
              to="/forgot-password"
              className="flex justify-center text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Forgot your password?
            </Link>
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

export default Login;