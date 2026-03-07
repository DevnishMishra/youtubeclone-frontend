import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterButtons from "../components/FilterButtons";
import VideoCard from "../components/VideoCard";

const sampleVideos = [
  {
    videoId: "video01",
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://example.com/thumbnails/react30min.png",
    channelName: "Code with John",
    views: 15200,
  },
  {
    videoId: "video02",
    title: "Node.js Crash Course",
    thumbnailUrl: "https://example.com/thumbnails/nodecrash.png",
    channelName: "Code with Jane",
    views: 9800,
  },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "Trending",
    "Music",
    "Gaming",
    "Programming",
    "News",
  ];

  return (
    <div>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="ml-0 md:ml-64 p-4">
        <FilterButtons
          categories={categories}
          active={activeFilter}
          setActive={setActiveFilter}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}
