import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyChannel, createChannel, createVideo } from "../utils/api";
import { useAuth } from "../utils/AuthContext";

export default function CreateChannel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loadingChannel, setLoadingChannel] = useState(true);

  // Channel creation form
  const [channelForm, setChannelForm] = useState({
    channelName: "",
    description: "",
  });
  const [creatingCh, setCreatingCh] = useState(false);
  const [chError, setChError] = useState("");

  // Video upload form
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "Programming",
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [videoSuccess, setVideoSuccess] = useState("");

  // Redirect to login if not signed in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Check if user already has a channel
    (async () => {
      try {
        const res = await getMyChannel(); // GET /api/channels/mine
        setChannel(res.data);
      } catch {
        setChannel(null);
      } finally {
        setLoadingChannel(false);
      }
    })();
  }, [user, navigate]);

  // ── Create channel ─────────────────────────────────────────────────
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setCreatingCh(true);
    setChError("");
    try {
      const res = await createChannel(channelForm); // POST /api/channels
      setChannel(res.data);
    } catch (err) {
      setChError(err.response?.data?.error || "Failed to create channel.");
    } finally {
      setCreatingCh(false);
    }
  };

  // ── Upload video ───────────────────────────────────────────────────
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploadingVideo(true);
    setVideoError("");
    setVideoSuccess("");
    try {
      await createVideo({ ...videoForm, channelId: channel._id }); // POST /api/videos
      setVideoSuccess("Video uploaded successfully!");
      setVideoForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        category: "Programming",
      });
    } catch (err) {
      setVideoError(err.response?.data?.error || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
    }
  };

  if (!user) return null;

  if (loadingChannel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="text-sm text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-2xl font-bold mb-6">My Channel</h1>

        {/* ── Create Channel form (shown if user has no channel yet) ── */}
        {!channel ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold mb-1">Create Your Channel</h2>
            <p className="text-gray-400 text-sm mb-5">
              You need a channel before you can upload videos.
            </p>

            {chError && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-3 py-2
                              rounded-lg text-sm mb-4"
              >
                {chError}
              </div>
            )}

            <form
              onSubmit={handleCreateChannel}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Channel Name *
                </label>
                <input
                  type="text"
                  required
                  value={channelForm.channelName}
                  onChange={(e) =>
                    setChannelForm((f) => ({
                      ...f,
                      channelName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Code with John"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                             focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Description
                </label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) =>
                    setChannelForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="What is your channel about?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                             focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={creatingCh}
                className="bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm
                           hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {creatingCh ? "Creating..." : "Create Channel"}
              </button>
            </form>
          </div>
        ) : (
          /* ── Channel exists: show upload form + channel link ── */
          <>
            {/* Channel card */}
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6
                            flex items-center gap-4"
            >
              <div
                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center
                              text-white font-bold text-xl flex-shrink-0"
              >
                {channel.channelName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base">{channel.channelName}</p>
                {channel.description && (
                  <p className="text-gray-400 text-sm truncate">
                    {channel.description}
                  </p>
                )}
              </div>
              <Link
                to={`/channel/${channel._id}`}
                className="text-sm text-blue-600 hover:underline flex-shrink-0"
              >
                View Channel →
              </Link>
            </div>

            {/* Upload video form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold mb-5">Upload a Video</h2>

              {videoError && (
                <div
                  className="bg-red-50 border border-red-200 text-red-600 px-3 py-2
                                rounded-lg text-sm mb-4"
                >
                  {videoError}
                </div>
              )}
              {videoSuccess && (
                <div
                  className="bg-green-50 border border-green-200 text-green-600 px-3 py-2
                                rounded-lg text-sm mb-4"
                >
                  ✅ {videoSuccess}
                </div>
              )}

              <form
                onSubmit={handleUploadVideo}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Video title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Video description"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoForm.videoUrl}
                    onChange={(e) =>
                      setVideoForm((f) => ({ ...f, videoUrl: e.target.value }))
                    }
                    placeholder="https://example.com/video.mp4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={videoForm.thumbnailUrl}
                    onChange={(e) =>
                      setVideoForm((f) => ({
                        ...f,
                        thumbnailUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Category
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) =>
                      setVideoForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {[
                      "Music",
                      "Gaming",
                      "Programming",
                      "News",
                      "Trending",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={uploadingVideo}
                  className="bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm
                             hover:bg-blue-700 disabled:opacity-50 transition-colors mt-1"
                >
                  {uploadingVideo ? "Uploading..." : "Upload Video"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
