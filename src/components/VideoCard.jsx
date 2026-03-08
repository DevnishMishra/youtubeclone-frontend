import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <div
      className="p-2 hover:scale-105 transform transition duration-300 cursor-pointer
     hover:scale-105 transform transition duration-300 "
    >
      <Link to={`/video/${video.videoId}`}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="mt-2 font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.channelName}</p>
        <p className="text-sm text-gray-500">{video.views} views</p>
      </Link>
    </div>
  );
}
