import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setAuth } from "../redux/authReducer";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login(e) {
        e.preventDefault();
        const details = {
            username: username,
            password: password
        };
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
            if (response.status !== 200) {
                // Display error message for invalid credentials
                message.error("Invalid credentials");
            } else {
                const userInfoResponse = await fetch(`http://localhost:8000/accounts/userinfo/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access}`
                    }
                });
                const userInfoData = await userInfoResponse.json();
                if (userInfoData.admin) {
                    dispatch(setAuth({ auth: true, token: data.access, objectId: "admin", userId: userInfoData.id }));
                }
                else if (userInfoData.shelter) {
                    dispatch(setAuth({ auth: true, token: data.access, objectId: "shelter", userId: userInfoData.id }));
                } else {
                    dispatch(setAuth({ auth: true, token: data.access, objectId: "seeker", userId: userInfoData.id }));
                }

                if (userInfoData.admin) {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <Form>
                <Form.Item>
                    <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required/>
                </Form.Item>
                <Form.Item>
                    <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={login}>
                        Login
                    </Button>
                </Form.Item>
                {/* Link to the registration page */}
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </Form>
        </div>
    );
}
