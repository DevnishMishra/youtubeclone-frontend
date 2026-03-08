import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { loginUser } from "../utils/api";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST /api/auth/login
      const res = await loginUser(form);
      // Save token + user → username appears in header
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 justify-center mb-3"
          >
            <FaYoutube size={32} className="text-red-600" />
            <span className="text-xl font-bold">YouTubeClone</span>
          </Link>
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-gray-400 text-sm mt-1">
            to continue to YouTubeClone
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-600 px-3 py-2
                          rounded-lg text-sm mb-4"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm
                       focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2.5 pr-16 rounded-lg text-sm
                         w-full focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs
                         text-blue-500 hover:text-blue-700 font-medium"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm
                       hover:bg-blue-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
