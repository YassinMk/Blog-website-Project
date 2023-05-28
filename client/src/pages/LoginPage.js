import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUserinfo}=useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
           
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserinfo(data);
        localStorage.setItem("token", data.token);
        setRedirect(true);
      } else {
        alert("Passowrd or email Incorrect");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during login.");
    }
  };

  if (redirect) {
    return <Navigate to="/profil" />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
