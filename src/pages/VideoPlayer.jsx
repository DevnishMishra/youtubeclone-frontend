import { useParams } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Video Player: {id}</h2>
      <div className="w-full h-96 bg-gray-200 flex justify-center items-center">
        <p>Video Player Here</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Description</h3>
        <p>This is a sample video description.</p>
      </div>
    </div>
  );
}
