import { useState, useEffect } from "react";
import React from "react";
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Login from "./Login";
// import {useNavigate} from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    // const navigate = useNavigate();

    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'User registered',
        });
    };

    function resetRegistration() {
        setUsername("");
        setPassword("");
    }

    async function handleRegistration(e) {
        // e.preventDefault();
        console.log("Registering");
        const details = {
            username: "newUser1",
            email: "newUser1@example.com",
            password: "newUserPassword",
            seeker_name: "newUser1",
            location: "newUser",
        }
        try {
            const response = await fetch('http://localhost:8000/accounts/petseekers/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(details)
            });
            const data = await response.json();
            console.log(data);
            if (data.error) {
                error(data.error);
            } else {
                success();
                resetRegistration();
                // navigate("/login", { state: { userType: "seeker" } });
            }
        } catch (err) {
            console.log(err);
            error("Something went wrong");
        }
    }
    
    return (
        <Button onClick={() => handleRegistration()}>Button</Button>
    )
}