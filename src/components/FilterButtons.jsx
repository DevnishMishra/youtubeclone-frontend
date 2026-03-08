export default function FilterButtons({ categories, active, setActive }) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
            transition-all duration-200
            ${
              active === cat
                ? "bg-black text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
