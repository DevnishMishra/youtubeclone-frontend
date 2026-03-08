import VideoCard from "../components/VideoCard";

const sampleChannelVideos = [
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
    channelName: "Code with John",
    views: 9800,
  },
];

export default function ChannelPage() {
  return (
    <div className="p-4">
      <div className="w-full h-48 bg-gray-300 flex justify-center items-center mb-4">
        <h2 className="text-2xl font-bold">Channel Banner</h2>
      </div>
      <h3 className="font-bold text-xl mb-4">Channel Videos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sampleChannelVideos.map((v) => (
          <VideoCard key={v.videoId} video={v} />
        ))}
      </div>
    </div>
  );
}
