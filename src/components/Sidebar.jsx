import {
  FaHome,
  FaFire,
  FaMusic,
  FaGamepad,
  FaCode,
  FaNewspaper,
  FaHistory,
  FaClock,
  FaThumbsUp,
} from "react-icons/fa";

const NAV_ITEMS = [
  { label: "Home", icon: <FaHome />, cat: "All" },
  { label: "Trending", icon: <FaFire />, cat: "Trending" },
  { label: "Music", icon: <FaMusic />, cat: "Music" },
  { label: "Gaming", icon: <FaGamepad />, cat: "Gaming" },
  { label: "Programming", icon: <FaCode />, cat: "Programming" },
  { label: "News", icon: <FaNewspaper />, cat: "News" },
];

const LIB_ITEMS = [
  { label: "History", icon: <FaHistory /> },
  { label: "Watch Later", icon: <FaClock /> },
  { label: "Liked Videos", icon: <FaThumbsUp /> },
];

export default function Sidebar({ isOpen, activeCat, onCategorySelect }) {
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => onCategorySelect && onCategorySelect(activeCat)}
        />
      )}

      <aside
        className={`
          bg-white w-60 p-3 fixed top-14 left-0 h-[calc(100vh-56px)]
          border-r border-gray-100 overflow-y-auto z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Navigation categories */}
        <nav className="mb-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => onCategorySelect && onCategorySelect(item.cat)}
              className={`
                flex items-center gap-4 w-full px-3 py-2 rounded-xl mb-0.5
                text-sm text-left transition-colors
                ${
                  activeCat === item.cat
                    ? "bg-gray-100 font-semibold text-black"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 my-3" />

        {/* Library section */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">
          Library
        </p>
        {LIB_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 w-full px-3 py-2 rounded-xl mb-0.5
                       text-sm text-gray-500 hover:bg-gray-50 hover:text-black
                       transition-colors text-left"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>
    </>
  );
}
