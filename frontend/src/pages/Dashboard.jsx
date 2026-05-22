import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { api, getErrorMessage } from "../api/client.js";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/posts/mine");
      setPosts(res.data.payload);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load dashboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const togglePublished = async (post) => {
    try {
      const res = await api.patch(`/posts/${post._id}/publish`, { isPublished: !post.isPublished });
      setPosts(posts.map((item) => (item._id === post._id ? res.data.payload : item)));
      toast.success("Post status updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status"));
    }
  };

  const deletePost = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;

    try {
      await api.delete(`/posts/${post._id}`);
      setPosts(posts.filter((item) => item._id !== post._id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete post"));
    }
  };

  if (loading) return <div className="notice">Loading dashboard...</div>;

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Author Workspace</p>
          <h1>Dashboard</h1>
        </div>
        <Link className="primary-button" to="/posts/new">New Post</Link>
      </div>

      {error && <div className="alert">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">No posts yet. Create your first article.</div>
      ) : (
        <div className="table-list">
          {posts.map((post) => (
            <div className="table-row" key={post._id}>
              <div>
                <span className={post.isPublished ? "status live" : "status draft"}>
                  {post.isPublished ? "Published" : "Hidden"}
                </span>
                <h2>{post.title}</h2>
                <p>{post.category}</p>
              </div>

              <div className="row-actions">
                <Link to={`/posts/${post._id}`}>View</Link>
                <Link to={`/posts/${post._id}/edit`}>Edit</Link>
                <button onClick={() => togglePublished(post)}>{post.isPublished ? "Hide" : "Publish"}</button>
                <button className="danger" onClick={() => deletePost(post)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
