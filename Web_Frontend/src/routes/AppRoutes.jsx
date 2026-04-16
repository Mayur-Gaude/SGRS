import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Verify2FA from "../pages/auth/Verify2FA";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetOtp from "../pages/auth/VerifyResetOtp";
import SetNewPassword from "../pages/auth/SetNewPassword";
import Dashboard from "../pages/superAdmin/Dashboard";
import Departments from "../pages/superAdmin/Departments";
import CreateDepartment from "../pages/superAdmin/CreateDeparment";
import Categories from "../pages/superAdmin/Categories";
import CreateCategory from "../pages/superAdmin/CreateCategory";
import Areas from "../pages/superAdmin/Areas";
import CreateArea from "../pages/superAdmin/CreateArea";
import CreateAdmin from "../pages/superAdmin/createAdmin";
import Admins from "../pages/superAdmin/Admins";
import EditAdminAreas from "../pages/superAdmin/EditAdminAreas";
import CreateComplaint from "../pages/User/CreateComplaint";
import Complaints from "../pages/User/Complaints";
import AssignedComplaints from "../pages/DepartmentAdmin/AssignedComplaints";
import ComplaintDetails from "../pages/DepartmentAdmin/ComplaintDetails";
import UserDashboard from "../pages/User/Dashboard";
import DeptAdminDashboard from "../pages/DepartmentAdmin/Dashboard";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Login />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />

        {/* Password Reset */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Department  */}
        <Route path="/super-admin/dashboard" element={<Dashboard />} />
        <Route path="/super-admin/departments" element={<Departments />} />
        <Route
          path="/super-admin/create-department/:id?"
          element={<CreateDepartment />}
        />
        

        {/* Category  */}
        <Route path="/super-admin/categories" element={<Categories />} />
        <Route
          path="/super-admin/create-category/:id?"
          element={<CreateCategory />}
        />


      {/* Area  */}
      <Route path="/super-admin/areas" element={<Areas />} />
      <Route
        path="/super-admin/create-area/:id?"
        element={<CreateArea />}
      />


      {/* Admins  */}
      <Route path="/super-admin/admins" element={<Admins />} />
      <Route path="/super-admin/create-admin" element={<CreateAdmin />} />
      <Route
        path="/super-admin/admins/:id/edit-areas"
        element={<EditAdminAreas />}
      />
      <Route
        path="/super-admin/create-admin/:id?"
        element={<CreateAdmin />}
      />

    <Route path="/user/dashboard" element={<UserDashboard />} />
    <Route path="/user/create-complaint" element={<CreateComplaint />} />
    <Route path="/user/complaints" element={<Complaints />} />

      <Route path="/dept-admin/dashboard" element={<DeptAdminDashboard/>} />
      <Route path="/dept-admin/complaints" element={<AssignedComplaints />} />
      <Route path="/dept-admin/complaints/:id" element={<ComplaintDetails />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;