const API_URL = "https://proyectoaseguramiento-production.up.railway.app/";

export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Login fallido");
  }

  return await res.json(); // devuelve { access_token, refresh_token, token_type }
}
