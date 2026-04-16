import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setNewPassword } from "../../api/auth.api";
import Input from "../../components/common/Input";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { reset_token } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setNewPassword({
        reset_token,
        new_password: password,
      });

      alert("Password updated successfully");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <form className="bg-white p-8 shadow-lg rounded-2xl border border-blue-100" onSubmit={handleSubmit}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Set New Password</h1>
            <p className="text-center text-blue-600 text-sm">
              Create a strong password to secure your account
            </p>
          </div>

          <div className="mb-6">
            <Input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Update Password
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

export default SetNewPassword;