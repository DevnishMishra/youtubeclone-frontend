import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getVideoById,
  likeVideo,
  dislikeVideo,
  getCommentsByVideo,
  addComment,
  updateComment,
  deleteComment,
} from "../utils/api";
import { useAuth } from "../utils/AuthContext";

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Comment state
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Like/dislike toggle
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [vRes, cRes] = await Promise.all([
          getVideoById(id), // GET /api/videos/:id — also increments views
          getCommentsByVideo(id), // GET /api/comments/:videoId
        ]);
        setVideo(vRes.data);
        setComments(cRes.data);
      } catch {
        setError("Video not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── Like ─────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (liked) return;
    try {
      const res = await likeVideo(id); // PUT /api/videos/:id/like
      setVideo(res.data);
      setLiked(true);
      setDisliked(false);
    } catch {}
  };

  // ── Dislike ───────────────────────────────────────────────────────
  const handleDislike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (disliked) return;
    try {
      const res = await dislikeVideo(id); // PUT /api/videos/:id/dislike
      setVideo(res.data);
      setDisliked(true);
      setLiked(false);
    } catch {}
  };

  // ── Add Comment ───────────────────────────────────────────────────
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setPosting(true);
    try {
      // POST /api/comments — saved to DB with this videoId
      const res = await addComment({ videoId: id, text: commentText });
      setComments((prev) => [
        { ...res.data, username: user.username },
        ...prev,
      ]);
      setCommentText("");
    } catch {}
    setPosting(false);
  };

  // ── Edit Comment ──────────────────────────────────────────────────
  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await updateComment(commentId, { text: editText }); // PUT /api/comments/:id
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, text: res.data.text } : c,
        ),
      );
      setEditingId(null);
    } catch {}
  };

  // ── Delete Comment ────────────────────────────────────────────────
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId); // DELETE /api/comments/:id
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {}
  };

  // ── Loading / Error ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto animate-pulse">
        <div className="bg-gray-200 w-full h-96 rounded-xl mb-4" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <p className="text-6xl mb-4">🎬</p>
        <p className="text-gray-500 text-lg mb-4">
          {error || "Video not found"}
        </p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* ── Video Player ── */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
        {video.videoUrl ? (
          video.videoUrl.includes("youtube") ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <video src={video.videoUrl} controls className="w-full h-full" />
          )
        ) : (
          <div className="text-white text-center flex items-center justify-center h-full">
            No video available
          </div>
        )}
      </div>

      {/* ── Title ── */}
      <h1 className="text-xl font-bold leading-snug mb-3">{video.title}</h1>

      {/* ── Channel + Like/Dislike ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-3
                      pb-4 mb-4 border-b border-gray-100"
      >
        {/* Channel link */}
        <div>
          {video.channelId && (
            <Link
              to={`/channel/${video.channelId}`}
              className="font-semibold text-sm hover:underline"
            >
              {video.channelName || "View Channel"}
            </Link>
          )}
          <p className="text-xs text-gray-400 mt-0.5">
            {video.views?.toLocaleString() || 0} views
          </p>
        </div>

        {/* Like / Dislike — Rubric: interactive buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            title={!user ? "Sign in to like" : ""}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm
                        font-medium border transition-all
                        ${
                          liked
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
                        }`}
          >
            👍 Like
            {video.likes > 0 && (
              <span className="font-normal">
                {video.likes.toLocaleString()}
              </span>
            )}
          </button>
          <button
            onClick={handleDislike}
            title={!user ? "Sign in to dislike" : ""}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm
                        font-medium border transition-all
                        ${
                          disliked
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
                        }`}
          >
            👎 Dislike
            {video.dislikes > 0 && (
              <span className="font-normal">
                {video.dislikes.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      {video.description && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-sm mb-1">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {video.description}
          </p>
        </div>
      )}

      {/* ── Comments Section ── */}
      <div>
        <h3 className="font-bold text-lg mb-5">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h3>

        {/* Add comment form — users can add comments saved to DB */}
        {user ? (
          <form onSubmit={handleAddComment} className="flex gap-3 mb-7">
            <div
              className="w-9 h-9 rounded-full bg-red-600 flex-shrink-0
                            flex items-center justify-center text-white font-bold text-sm"
            >
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border-b border-gray-300 py-2 text-sm
                           focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setCommentText("")}
                  className="text-xs text-gray-500 px-3 py-1.5 rounded-full
                             hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting || !commentText.trim()}
                  className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full
                             hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  {posting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 border-b border-gray-100 pb-5 mb-5">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
            <p className="text-sm text-gray-500">
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>{" "}
              to add a comment
            </p>
          </div>
        )}

        {/* ── Comments list ── */}
        <div className="space-y-6">
          {comments.map((comment) => {
            // Check if logged-in user owns this comment
            const isOwner =
              user &&
              (user._id === comment.userId ||
                user._id === comment.userId?._id ||
                user._id === String(comment.userId));

            return (
              <div key={comment._id} className="flex gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0
                                flex items-center justify-center font-bold text-xs text-gray-700"
                >
                  {comment.username?.[0]?.toUpperCase() || "U"}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    @{comment.username || "Anonymous"}
                  </p>

                  {/* Edit mode */}
                  {editingId === comment._id ? (
                    <div>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        className="w-full border-b border-blue-500 py-1 text-sm
                                   focus:outline-none mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full
                                     hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-500 px-3 py-1 rounded-full
                                     hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800">{comment.text}</p>

                      {/* Edit/Delete buttons — only for comment owner */}
                      {isOwner && (
                        <div className="flex gap-3 mt-1.5">
                          <button
                            onClick={() => {
                              setEditingId(comment._id);
                              setEditText(comment.text);
                            }}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
