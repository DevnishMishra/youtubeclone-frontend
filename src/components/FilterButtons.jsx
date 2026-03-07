export default function FilterButtons({ categories, active, setActive }) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto p-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-4 py-1 rounded ${
            active === cat ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
