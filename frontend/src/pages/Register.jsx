import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { getErrorMessage } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });
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
      const user = await register(form);
      toast.success("Account created");
      navigate(user.role === "AUTHOR" ? "/dashboard" : "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Account creation failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={onSubmit}>
        <h1>Create Account</h1>
        <p className="heading-copy">Join the community as a reader or author and start sharing your ideas.</p>
        {error && <div className="alert">{error}</div>}

        <div className="two-col">
          <label>
            First Name
            <input name="firstName" value={form.firstName} onChange={updateField} required minLength="2" />
          </label>

          <label>
            Last Name
            <input name="lastName" value={form.lastName} onChange={updateField} />
          </label>
        </div>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} required minLength="8" />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={updateField}>
            <option value="USER">User</option>
            <option value="AUTHOR">Author</option>
          </select>
        </label>

        <button disabled={submitting}>{submitting ? "Creating..." : "Create Account"}</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
