import { useState } from "react";
import "./register.css";
import { registerUser } from "../api/auth-api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ name, email, password });
      alert("Your account has been created successfully. Please login.");
      window.location.href = "/login";
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="card">
        <div className="card-header">
          <h1 className="title">Create Your Account</h1>
          <p className="description">Enter your information to get started</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-content">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
            <p className="signup-text">
              Already have an account?{" "}
              <a href="/login" className="signup-link">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
