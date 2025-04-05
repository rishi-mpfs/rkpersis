const Auth = (function () {
  const API_BASE_URL = "http://localhost:5000/auth";
  let user = null;
  let loading = true;

  // Load user session on script load
  async function init() {
    try {
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Session expired");
  
      const data = await res.json();
      user = data.user;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ User session loaded:", user);
  
      // ✅ Redirect to dashboard ONLY if on login page
      if (window.location.pathname === "/login.html") {
        window.location.href = "/dashboard.html";
      }
    } catch (err) {
      console.warn("❌ Auth check failed:", err.message);
      user = null;
      localStorage.removeItem("user");
  
      if (isProtectedPage()) {
        window.location.href = "/login.html";
      }
    } finally {
      loading = false;
    }
  }
  

  function isProtectedPage() {
    const protectedRoutes = ["/dashboard.html"]; // Add more if needed
    return protectedRoutes.includes(window.location.pathname);
  }

  function getUser() {
    if (user) return user;
    try {
      const fromStorage = localStorage.getItem("user");
      return fromStorage ? JSON.parse(fromStorage) : null;
    } catch {
      return null;
    }
  }

  async function login() {
    try {
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      user = data.user;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ Login successful:", user);
      window.location.href = "/dashboard.html";
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      user = null;
      localStorage.removeItem("user");
      window.location.href = "/login.html";
    }
  }

  // Auto-check session on script load
  init();

  return {
    getUser,
    login,
    logout,
    isAuthenticated: () => !!getUser(),
  };
})();

// Expose globally
window.Auth = Auth;
