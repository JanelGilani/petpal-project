import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Error.css';
import { Result, Button } from 'antd';
import { Modal } from 'antd';
import { useState } from "react";
import Login from "./Login";

export default function ErrorPage({ error }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const goBack = () => {
        navigate(-1);
    }

    if (error === "login" || error === 403) {
        return (
            <div className="error-container">
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" onClick={showModal}>Login</Button>}
                />
                <Modal
                    title="Login"
                    visible={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {/* Render the Login component */}
                    <Login />
                </Modal>
            </div>

        );
    }

    return (
        <div className="error-container">
            <p className="error-message">ERROR</p>
            <p className="request-message">Bad Request {error}. Seems like you are lost.</p>
            <Button type="primary" onClick={goBack}>Go Back</Button>
        </div>
    );
}
