import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import Login from './login.jsx'

function Root() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check sessionStorage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Show loading while checking sessionStorage
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // if no user, render login
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // after login, render App
  return <App user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
