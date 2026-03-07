import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-50">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          <FaBars size={24} />
        </button>
        <Link to="/" className="text-2xl font-bold text-red-600">
          YouTubeClone
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search"
        className="border rounded-l px-4 py-1 w-1/3"
      />

      <Link
        to="/login"
        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
      >
        Sign In
      </Link>
    </header>
  );
}
