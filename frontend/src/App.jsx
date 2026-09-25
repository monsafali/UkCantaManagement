import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./Pages/Login";

import StampForm from "./Pages/StampForm";
import SearchStamp from "./Pages/SearchStamp";
import DateReport from "./Pages/DateReport";

import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";


import UserLayout from "./components/UserLayout";
function App() {
  return (

    <>
      <Routes>
        {/* =========================
            PUBLIC
        ========================== */}

        <Route path="/login" element={<Login />} />

        {/* =========================
            USER ROUTES
        ========================== */}

     <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
  <Route element={<UserLayout />}>
    <Route path="/user" element={<UserDashboard />} />

    <Route path="/" element={<StampForm />} />

    <Route path="/search" element={<SearchStamp />} />

    <Route path="/report" element={<DateReport />} />
  </Route>
</Route>

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
