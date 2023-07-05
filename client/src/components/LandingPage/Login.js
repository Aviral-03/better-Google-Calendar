import { useState } from "react";
import React from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function resetLogin() {
        setUsername("");
        setPassword("");
    }

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                // alert("Successfully logged in");
                window.location.href = "/home";
            }
            else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.log(error);
        }
        // resetLogin();
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}