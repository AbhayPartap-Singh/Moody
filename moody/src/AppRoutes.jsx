import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import FaceExpression from "./features/auth/components/FaceExpression";
import Protected from "./features/auth/components/Protected";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h1>Moody</h1>
                <FaceExpression />
              </div>
            </Protected>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;