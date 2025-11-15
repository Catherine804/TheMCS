import { useState } from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import Login from './login.jsx'

function Root() {
  const [user, setUser] = useState(null); //no user yet -> show login

  // if no user, render login
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // after login, render App
  return <App user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
