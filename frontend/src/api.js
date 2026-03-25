const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchHealth() {
  return getJson("/api/health");
}

export async function fetchProfile() {
  return getJson("/api/profile");
}

export async function fetchProjects() {
  return getJson("/api/projects");
}

export { API_URL };
