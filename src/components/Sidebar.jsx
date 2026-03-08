import { Link } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-gray-100 w-64 p-4 fixed h-full top-0 left-0 transform md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-40`}
    >
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul>
        {["Home", "Trending", "Music", "Gaming", "Programming", "News"].map(
          (cat) => (
            <li key={cat} className="mb-2 hover:text-red-600">
              <Link to="/">{cat}</Link>
            </li>
          ),
        )}
      </ul>
    </aside>
  );
}
