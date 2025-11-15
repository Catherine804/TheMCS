/*import { useState } from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App.jsx';
import Login from './login.jsx';

function Root() {
  // Pretend the user is already logged in
  const [user, setUser] = useState({ name: "Test User" });

  // This will now always render App and never show Login
  return <App user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);


*/

import { useState } from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import Login from './login.jsx'

function Root() {
  const [user, setUser] = useState(null); //no user yet -> show login
  const [loading, setLoading] = useState(true);
  
  // if no user, render login
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // after login, render App
  return <App user={user} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
