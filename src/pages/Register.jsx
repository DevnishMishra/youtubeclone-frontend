import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { registerUser } from "../utils/api";
import { useAuth } from "../utils/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST /api/auth/register — backend returns { token, user }
      const res = await registerUser(form);
      // Auto-login so user sees their name in header immediately
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
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
          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-gray-400 text-sm mt-1">Sign up for YouTubeClone</p>
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
            type="text"
            name="username"
            placeholder="Username"
            required
            minLength={3}
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm
                       focus:outline-none focus:border-blue-500 transition-colors"
          />
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm
                       focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm
                       hover:bg-blue-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
