import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Limpiar campos al montar
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
    onError: () => {
      setErrorMessage("Usuario o contraseña incorrectos");
      setUsername("");
      setPassword("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validación básica
    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Por favor ingrese todos los campos");
      return;
    }

    mutation.mutate({ username, password });
  };

  return (
    <div className="relative w-full h-screen bg-white">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 border-4 border-yellow-300 flex flex-col items-center">
        {/* Logo y título */}
        <img src="restaurant-presentation.jpg" alt="Logo" className="w-24 h-24 mb-2" />
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
              autoComplete="off"
              className="w-full pl-10 pr-3 py-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-red-500" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center transition-all duration-200"
          >
            <LogIn className="mr-2" size={18} />
            {mutation.isLoading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-yellow-900 mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-700 hover:underline">
            Crear una cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
