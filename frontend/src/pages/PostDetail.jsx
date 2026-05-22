import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router";
import { api, getErrorMessage } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";

function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.payload);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load post"));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const addComment = async (event) => {
    event.preventDefault();

    try {
      const res = await api.post(`/posts/${id}/comments`, { body: comment });
      setPost(res.data.payload);
      setComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add comment"));
    }
  };

  const canEdit = user?.role === "ADMIN" || post?.author?._id === user?._id;

  if (loading) return <div className="notice">Loading post...</div>;
  if (error) return <div className="alert">{error}</div>;
  if (!post) return null;

  return (
    <article className="article-page">
      <div className="article-head">
        <span className="category">{post.category}</span>
        <h1>{post.title}</h1>
        <p>
          By {post.author?.firstName} {post.author?.lastName} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {canEdit && <Link className="primary-button" to={`/posts/${post._id}/edit`}>Edit Post</Link>}
      </div>

      {post.coverImageUrl && <img className="cover-image" src={post.coverImageUrl} alt="" />}

      <div className="article-body">{post.content}</div>

      <section className="comments">
        <h2>Comments</h2>

        <form className="comment-form" onSubmit={addComment}>
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment"
            required
            maxLength="500"
          />
          <button>Add</button>
        </form>

        {post.comments.length === 0 ? (
          <p className="muted">No comments yet.</p>
        ) : (
          <div className="comment-list">
            {post.comments.map((item) => (
              <div className="comment" key={item._id}>
                <strong>{item.user?.firstName || "User"}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}

export default PostDetail;
