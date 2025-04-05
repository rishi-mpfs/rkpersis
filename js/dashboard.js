// Redirect if not logged in
if (!Auth.isAuthenticated()) {
    window.location.href = "/login.html";
  }
  
  // Simple route loader
  function loadRoute(route) {
    const container = document.getElementById("route-container");
  
    fetch(`/views/${route}.html`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((html) => {
        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = "<h2>404 - Page Not Found</h2>";
      });
  }
  
  // Listen to hash changes (e.g., #home, #profile)
  window.addEventListener("hashchange", () => {
    const route = window.location.hash.substring(1) || "home";
    loadRoute(route);
  });
  
  // Load default route
  window.addEventListener("DOMContentLoaded", () => {
    const route = window.location.hash.substring(1) || "home";
    loadRoute(route);
  });
  