import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be 8+ characters with 1 uppercase, 1 number, and 1 special character.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0f9ff 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span style={{ fontSize: "28px" }}>🌿</span>
          <span style={{ fontSize: "26px", fontWeight: "700", color: "#111827" }}>SkillSync</span>
        </div>
        <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
          Join the sustainable skill-sharing community
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#111827" }}>
          Welcome Back
        </h2>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          background: "#f3f4f6",
          borderRadius: "50px",
          padding: "4px",
          marginBottom: "24px"
        }}>
          <Link to="/login" style={{
            flex: 1,
            textAlign: "center",
            padding: "8px",
            borderRadius: "50px",
            fontSize: "14px",
            color: "#6b7280",
            textDecoration: "none"
          }}>
            Login
          </Link>
          <div style={{
            flex: 1,
            textAlign: "center",
            padding: "8px",
            borderRadius: "50px",
            background: "white",
            fontWeight: "600",
            fontSize: "14px",
            color: "#111827",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
          }}>
            Sign Up
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name}
              onChange={handleChange} required placeholder="Enter your full name" style={inputStyle} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="Enter your email" style={inputStyle} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="Create a password" style={inputStyle} />
            <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
              8+ characters, 1 uppercase, 1 number, 1 special character
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Location</label>
            <input type="text" name="location" value={formData.location}
              onChange={handleChange} placeholder="City, State/Country" style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#86efac" : "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
            By signing up, you agree to prioritize sustainable skill exchanges
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;