import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { api, getErrorMessage } from "../api/client.js";

const initialForm = {
  title: "",
  category: "Technology",
  summary: "",
  content: "",
  coverImageUrl: "",
  isPublished: true,
};

function PostEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        const post = res.data.payload;
        setForm({
          title: post.title,
          category: post.category,
          summary: post.summary || "",
          content: post.content,
          coverImageUrl: post.coverImageUrl || "",
          isPublished: post.isPublished,
        });
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load post"));
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEdit]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const res = isEdit ? await api.put(`/posts/${id}`, form) : await api.post("/posts", form);
      toast.success(isEdit ? "Post updated" : "Post created");
      navigate(`/posts/${res.data.payload._id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Could not save post"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="notice">Loading editor...</div>;

  return (
    <section className="editor-page">
      <form className="editor-form" onSubmit={onSubmit}>
        <div className="page-heading">
          <div>
            <p className="eyebrow">Writing Desk</p>
            <h1>{isEdit ? "Edit Post" : "New Post"}</h1>
          </div>
          <button disabled={submitting}>{submitting ? "Saving..." : "Save Post"}</button>
        </div>

        {error && <div className="alert">{error}</div>}

        <label>
          Title
          <input name="title" value={form.title} onChange={updateField} required minLength="4" />
        </label>

        <div className="two-col">
          <label>
            Category
            <select name="category" value={form.category} onChange={updateField}>
              <option>Technology</option>
              <option>Programming</option>
              <option>AI</option>
              <option>Web Development</option>
              <option>Personal</option>
            </select>
          </label>

          <label>
            Cover Image URL
            <input name="coverImageUrl" value={form.coverImageUrl} onChange={updateField} />
          </label>
        </div>

        <label>
          Summary
          <textarea name="summary" value={form.summary} onChange={updateField} rows="3" maxLength="220" />
        </label>

        <label>
          Content
          <textarea name="content" value={form.content} onChange={updateField} rows="14" required minLength="20" />
        </label>

        <label className="checkbox-row">
          <input name="isPublished" type="checkbox" checked={form.isPublished} onChange={updateField} />
          Published
        </label>
      </form>
    </section>
  );
}

export default PostEditor;
