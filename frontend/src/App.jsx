import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";

import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* USER */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["User"]}
            />
          }
        >
          <Route
            path="/"
            element={<UserDashboard />}
          />
        </Route>

        {/* ADMIN */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Admin"]}
            />
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
