import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react"; // 👈 iconos modernos

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
    onError: () => {
      alert("Usuario o contraseña incorrectos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(
          135deg,
          #D32F2F 0%,
          #F57C00 20%,
          #FBC02D 40%,
          #388E3C 60%,
          #F57C00 80%,
          #D32F2F 100%
        )`,
        backgroundSize: "400% 400%",
        animation: "woven 10s ease infinite",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-96 text-center border-t-4 border-red-600"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-red-600">
          Sabor a Guatemala
        </h1>
        <p className="text-gray-600 mb-8 text-sm">Bienvenido, inicia sesión</p>

        {/* Campo Usuario */}
        <div className="relative mb-5">
          <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
                       transition-all duration-200 text-gray-800"
            required
          />
        </div>

        {/* Campo Contraseña */}
        <div className="relative mb-8">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
                       transition-all duration-200 text-gray-800"
            required
          />
        </div>

        {/* Botón Ingresar */}
       <button
  type="submit"
  disabled={mutation.isPending}
  className="
    w-full 
    bg-red-600 
    hover:bg-red-700 
    text-white 
    py-3 
    rounded-lg 
    font-semibold 
    text-lg 
    shadow-md 
    transition-all 
    duration-300 
    transform 
    hover:scale-105 
    active:scale-95 
    focus:outline-none 
    focus:ring-4 
    focus:ring-red-300
  "
>
  {mutation.isPending ? "Ingresando..." : "Ingresar"}
</button>

      </form>

      {/* Animación del fondo */}
      <style>{`
        @keyframes woven {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
