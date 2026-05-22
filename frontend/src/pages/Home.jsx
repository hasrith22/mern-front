import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api, getErrorMessage } from "../api/client.js";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/posts");
        setPosts(res.data.payload);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load posts"));
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div className="notice">Loading posts...</div>;

  return (
    <section>
      <div className="hero-section">
        <div>
          <p className="eyebrow">Welcome to a friendlier feed</p>
          <h1>Discover stories made just for you</h1>
          <p className="hero-text">Browse posts from authors, explore ideas, and jump into a welcoming writing community.</p>
        </div>
        <Link className="secondary-button" to="/register">
          Join the community
        </Link>
      </div>

      <div className="page-heading">
        <div>
          <h1>Latest Blog Posts</h1>
        </div>
        <p className="heading-copy">Read articles, discuss ideas, and publish your own work as an author.</p>
      </div>

      {error && <div className="alert">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">No posts yet. Register as an author and create the first one.</div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <article className="post-card" key={post._id}>
              <div>
                <span className="category">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.summary || post.content.slice(0, 150)}</p>
              </div>

              <div className="card-footer">
                <span>
                  By {post.author?.firstName} {post.author?.lastName}
                </span>
                <Link to={`/posts/${post._id}`}>Read</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
