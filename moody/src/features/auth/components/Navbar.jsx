import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav style={{ marginBottom: "20px" }}>
      
      {currentPath !== "/" && (
        <Link to="/" style={{ marginRight: "15px" }}>
          Home
        </Link>
      )}

      {currentPath !== "/login" && (
        <Link to="/login" style={{ marginRight: "15px" }}>
          Login
        </Link>
      )}

      {currentPath !== "/register" && (
        <Link to="/register">
          Register
        </Link>
      )}

    </nav>
  );
}

export default Navbar;