import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        padding: "15px",
        background: "#222",
        color: "white",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link to="/" style={{ color: "white" }}>
        Home
      </Link>

      <Link to="/booking" style={{ color: "white" }}>
        Booking
      </Link>

      <Link to="/login" style={{ color: "white" }}>
        Login
      </Link>

      <Link to="/register" style={{ color: "white" }}>
        Register
      </Link>

      <Link to="/admin/users" style={{ color: "white" }}>
        Admin
      </Link>

      <Link to="/update-profile" style={{ color: "white" }}>
        Profile
      </Link>

      <Link to="/logout" style={{ color: "white" }}>
        Logout
      </Link>
    </div>
  );
}

export default Navbar;