import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Error.css';
import { Result, Button } from 'antd';

export default function ErrorPage({ error }) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); 
    }

    return (
        <div className="error-container">
            <p className="error-message">ERROR</p>
            <p className="request-message">Bad Request {error}. Seems like you are lost.</p>
            <Button type="primary" onClick={goBack}>Go Back</Button>
        </div>
    );
}
