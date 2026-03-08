import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getChannelById, updateVideo, deleteVideo } from "../utils/api";
import { useAuth } from "../utils/AuthContext";
import VideoCard from "../components/VideoCard";

export default function ChannelPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit video state
  const [editingVideo, setEditingVideo] = useState(null); // video object being edited
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getChannelById(id); // GET /api/channels/:id (populates videos)
        setChannel(res.data);
      } catch {
        setError("Channel not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Is the logged-in user the owner of this channel?
  const isOwner =
    user &&
    channel?.owner &&
    (user._id === channel.owner || user._id === String(channel.owner));

  // ── Delete video ──────────────────────────────────────────────────
  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    try {
      await deleteVideo(videoId); // DELETE /api/videos/:id
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete video.");
    }
  };

  // ── Open edit modal ────────────────────────────────────────────────
  const startEdit = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title || "",
      description: video.description || "",
      category: video.category || "",
    });
  };

  // ── Save edit ──────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await updateVideo(editingVideo._id, editForm); // PUT /api/videos/:id
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.map((v) =>
          v._id === editingVideo._id ? res.data : v,
        ),
      }));
      setEditingVideo(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update video.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 w-full" />
        <div className="p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <p className="text-5xl mb-4">📺</p>
        <p className="text-gray-500 mb-4">{error || "Channel not found"}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Channel Banner ── */}
      <div
        className="w-full h-48 bg-gradient-to-r from-red-500 via-red-600 to-red-700
                   flex items-center justify-center relative overflow-hidden"
        style={
          channel.channelBanner
            ? {
                backgroundImage: `url(${channel.channelBanner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {!channel.channelBanner && (
          <h2 className="text-white text-3xl font-bold drop-shadow-lg">
            {channel.channelName}
          </h2>
        )}
      </div>

      {/* ── Channel Info Row ── */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4 max-w-5xl mx-auto">
          {/* Channel avatar */}
          <div
            className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center
                          text-white font-bold text-3xl flex-shrink-0 border-4 border-white shadow-md -mt-10"
          >
            {channel.channelName?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{channel.channelName}</h1>
            {channel.description && (
              <p className="text-gray-500 text-sm mt-0.5">
                {channel.description}
              </p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              {channel.subscribers?.toLocaleString() || 0} subscribers
              {" · "}
              {channel.videos?.length || 0} video
              {channel.videos?.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Subscribe or (owner) Add Video button */}
          {isOwner ? (
            <Link
              to="/my-channel"
              className="px-5 py-2 bg-black text-white text-sm font-semibold
                         rounded-full hover:bg-gray-800 transition-colors"
            >
              + Add / Manage Videos
            </Link>
          ) : (
            <button
              className="px-5 py-2 bg-black text-white text-sm font-semibold
                               rounded-full hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* ── Videos Grid ── */}
      <div className="px-6 py-6 max-w-5xl mx-auto">
        <h3 className="font-bold text-lg mb-5">Videos</h3>

        {channel.videos?.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-5xl mb-4">📹</p>
            <p className="text-gray-400">No videos yet.</p>
            {isOwner && (
              <Link
                to="/my-channel"
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Upload your first video →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channel.videos.map((video) => (
              <div key={video._id} className="relative group">
                <VideoCard
                  video={{ ...video, channelName: channel.channelName }}
                />
                {/* Edit/Delete overlay — only shown to channel owner */}
                {isOwner && (
                  <div
                    className="absolute top-2 right-2 flex gap-1.5 opacity-0
                                  group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={() => startEdit(video)}
                      className="bg-white text-xs px-2 py-1 rounded-md shadow-md
                                 hover:bg-blue-50 text-blue-600 font-medium transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="bg-white text-xs px-2 py-1 rounded-md shadow-md
                                 hover:bg-red-50 text-red-500 font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Video Modal ── */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Edit Video</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Title
                </label>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                             text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                             text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2
                             text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select category</option>
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
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100
                           rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold
                           rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
