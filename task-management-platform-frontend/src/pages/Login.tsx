import { useState } from "react";
import "./Login.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/auth-api";
import { setCredentials } from "../store/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      dispatch(setCredentials({ token: data.token, user: data.user }));
      window.location.href = "/";
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        <div className="card-header">
          <h1 className="title">Login to Your Account</h1>
          <p className="description">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-content">
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
              <div className="label-row">
                <label htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p className="signup-text">
              Don't have an account?{" "}
              <a href="/register" className="signup-link">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
