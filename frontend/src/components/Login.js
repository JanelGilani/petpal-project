import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setAuth } from "../redux/authReducer";
import { Form, Input } from "antd";

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
                alert(data.detail);
            } else {
                const userInfoResponse = await fetch(`http://localhost:8000/accounts/userinfo/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access}`
                    }
                });
                const userInfoData = await userInfoResponse.json();
                if (userInfoData.shelter) {
                    dispatch(setAuth({ auth: true, token: data.access, objectId: "shelter" }));
                } else {
                    dispatch(setAuth({ auth: true, token: data.access, objectId: "seeker" }));
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <Form>
                <Form.Item>
                    <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <button onClick={login}>Login</button>
                </Form.Item>
            </Form>
        </div>
    );
}
