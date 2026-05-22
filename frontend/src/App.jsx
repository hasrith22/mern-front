import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostEditor from "./pages/PostEditor.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["AUTHOR", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute roles={["AUTHOR", "ADMIN"]}>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute roles={["AUTHOR", "ADMIN"]}>
                <PostEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
