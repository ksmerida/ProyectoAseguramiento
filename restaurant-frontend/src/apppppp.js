// src/App.js
import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./utils/authProvider";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (getToken()) {
      setIsLogged(true);
    }
  }, []);

  return (
    <div>
      {isLogged ? (
        <Dashboard onLogout={() => setIsLogged(false)} />
      ) : (
        <LoginPage onLogin={() => setIsLogged(true)} />
      )}
    </div>
  );
}

export default App;
