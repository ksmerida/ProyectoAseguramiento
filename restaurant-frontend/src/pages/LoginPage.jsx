import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

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

  // ✅ El return debe ir DENTRO de la función
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-red-200">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 border-4 border-yellow-300 flex flex-col items-center">
        {/* Logo y título */}
        <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-2" />
        <h1 className="text-center text-3xl font-bold mb-6 font-montserrat">
          SABOR A GUATEMALA
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-red-500" size={18} />
            <input
              type="text"
              placeholder="Usuario *"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-red-500" size={18} />
            <input
              type="password"
              placeholder="Contraseña *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center transition-all duration-200"
          >
            <LogIn className="mr-2" size={18} />
            {mutation.isPending ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-brown-800 mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-700 hover:underline">
            Crear una cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
