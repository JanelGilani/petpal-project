import React from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/authReducer";
import { useLocation } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    async function login(e) {
        e.preventDefault();
        console.log("Logging in");
        const details = {
            username: "shelter1",
            password: "shelter1"
        }
        try {
            const response = await fetch('http://localhost:8000/accounts/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });
            const data = await response.json();
            console.log(data);
            if (data.error) {
                console.log(data.error);
            } else {
                console.log("Logged in");
                dispatch(setAuth({auth: true, token: data.access, objectId: "seeker"}));
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={login}>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}