import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {

  //     if (form.password !== form.confirmPassword) {
  //       alert("Passwords do not match");
  //       return;
  //     }
      
  //     // const res = await registerUser(form);
  //     const { confirmPassword, ...payload } = form;
  //     const res = await registerUser(payload);
  //     const data = res.data.data;

  //     // 🔥 Move to OTP screen
  //     navigate("/verify-otp", {
  //       state: {
  //         user_id: data.user_id,
  //         email: form.email,
  //         phone: form.phone,
  //       },
  //     });

  //   } catch (err) {
  //     alert(err.response?.data?.message || "Registration failed");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.full_name.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.password.trim() ||
    !form.confirmPassword.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const { confirmPassword, ...payload } = form;

    const res = await registerUser(payload);

    const data = res.data.data;

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
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />

            <Input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                className="pr-10"
                autoComplete="new-password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                className="pr-10"
                autoComplete="new-password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
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
              {/* <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold underline transition">
                Sign In
              </a> */}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold underline transition">
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-blue-100">
            <p className="text-center text-xs text-blue-500">
              © 2026 Smart Grievance System. All rights reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;