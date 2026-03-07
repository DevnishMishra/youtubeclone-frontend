import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
          />
          <button className="bg-red-600 text-white py-2 rounded hover:bg-red-700">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
