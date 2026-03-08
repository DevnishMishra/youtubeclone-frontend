import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterButtons from "../components/FilterButtons";
import VideoCard from "../components/VideoCard";
import { getAllVideos, searchVideos, getVideosByCategory } from "../utils/api";

const CATEGORIES = [
  "All",
  "Trending",
  "Music",
  "Gaming",
  "Programming",
  "News",
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch videos on mount and whenever filter changes
  useEffect(() => {
    fetchVideos(activeFilter, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const fetchVideos = async (cat, query) => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (query) {
        res = await searchVideos(query); // GET /api/videos/search/:query
      } else if (cat !== "All" && cat !== "Trending") {
        res = await getVideosByCategory(cat); // GET /api/videos/category/:cat
      } else {
        res = await getAllVideos(); // GET /api/videos
      }
      setVideos(res.data);
    } catch {
      setError(
        "Could not load videos. Make sure the backend is running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Called from Header search form
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveFilter("All");
    fetchVideos("All", query);
  };

  // Called from FilterButtons and Sidebar
  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setSearchQuery("");
    fetchVideos(cat, "");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header — search bar inside, username shown after login */}
      <Header
        toggleSidebar={() => setSidebarOpen((o) => !o)}
        onSearch={handleSearch}
      />

      {/* Sidebar — toggleable via hamburger */}
      <Sidebar
        isOpen={sidebarOpen}
        activeCat={activeFilter}
        onCategorySelect={handleFilter}
      />

      {/* Main content — offset by sidebar width on md+ screens */}
      <main className="md:ml-60 p-4 pt-5 transition-all duration-300">
        {/* Active search banner */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm text-gray-500">
              Results for{" "}
              <span className="font-semibold text-black">"{searchQuery}"</span>
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchVideos(activeFilter, "");
              }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Filter pills */}
        <FilterButtons
          categories={CATEGORIES}
          active={activeFilter}
          setActive={handleFilter}
        />

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-video mb-3" />
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ── Error state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">📡</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => fetchVideos(activeFilter, searchQuery)}
              className="bg-red-600 text-white px-5 py-2 rounded-full text-sm
                         hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : videos.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-gray-400 text-lg">No videos found</p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchVideos("All", "");
                }}
                className="mt-3 text-sm text-red-500 hover:underline"
              >
                Back to all videos
              </button>
            )}
          </div>
        ) : (
          /* ── Video grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id || video.videoId} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
