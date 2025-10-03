import api from "./axios";

export const login = async (username, password) => {
  // FastAPI suele exponer /auth/token que responde form data; si tu implementacion es JSON, ajusta.
  // Aquí asumimos JSON {username, password}
  const { data } = await api.post("/auth/token", { username, password });
  return data;
};

export const me = async () => {
  const { data } = await api.get("/auth/me"); // opcional, si expones endpoint /auth/me
  return data;
};
