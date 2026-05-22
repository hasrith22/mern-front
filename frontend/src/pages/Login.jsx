import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import { getErrorMessage } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const user = await login(form);
      toast.success("Login successful");
      navigate(location.state?.from || (user.role === "AUTHOR" || user.role === "ADMIN" ? "/dashboard" : "/"), {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={onSubmit}>
        <h1>Login</h1>
        <p className="heading-copy">Sign in to continue reading posts and managing your articles.</p>
        {error && <div className="alert">{error}</div>}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} required />
        </label>

        <button disabled={submitting}>{submitting ? "Signing in..." : "Sign In"}</button>

        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
