import { useState, useEffect } from "react";
import React from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function resetRegistration() {
        setUsername("");
        setPassword("");
    }

    useEffect(() => {
        showUsers();
    }, []);

    async function showUsers() {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            const data = await response.json();
            // console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRegistration(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/register", {
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
                alert("User registered");
            }
            else {
                alert("User already exists");
            }
        } catch (error) {
            console.log(error);
        }
        resetRegistration();
    }
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegistration}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}