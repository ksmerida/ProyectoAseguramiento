import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const mut = useMutation(({ username, password }) => login(username, password), {
    onSuccess: (data) => {
      // espera { access_token: "...", token_type: "bearer" } o ajuste según tu backend
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        // opcional: guardar info mínima del usuario si la API la devuelve
        // localStorage.setItem("user", JSON.stringify(data.user || { username }));
        setUser({ username });
        navigate("/"); // ir al dashboard
      } else {
        setErr("Respuesta inválida del servidor");
      }
    },
    onError: (error) => {
      setErr(error?.response?.data?.detail || "Credenciales inválidas");
    },
  });

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    mut.mutate({ username, password });
  };

  return (
    <div style={{ display: "grid", placeItems: "center", height: "80vh" }}>
      <form onSubmit={submit} style={{ padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
        <h2>Iniciar sesión</h2>
        {err && <div style={{ color: "red" }}>{err}</div>}
        <div>
          <input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
