import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/home";

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
                <Home/>
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