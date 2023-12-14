import React from "react";
import { useSelector } from "react-redux";
import Logo from "../img/logo_large.png";
import "../styles/admin-page.css";
import { useEffect, useState } from "react";
import { Table, Tag, Space, Button } from 'antd';

export default function AdminPage() {
    const auth = useSelector(state => state.auth);
    const [reportedList, setReportedList] = useState([]);
    const adminId = auth.userId;

    useEffect(() => {
        async function getReportedPets() {
            try {
                const response = await fetch(`http://localhost:8000/accounts/admin/${adminId}/reported_users/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    }
                });
                const data = await response.json();
                setReportedList(data);
            } catch (err) {
                console.log(err);
            }
        }
        getReportedPets();
    }, []);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Reporter",
            children: [
                {
                    title: "ID",
                    dataIndex: ["reporter", "id"],
                    key: ["reporter", "id"]
                },
                {
                    title: "Username",
                    dataIndex: ["reporter", "username"],
                    key: ["reporter", "username"]
                },
                {
                    title: "Email",
                    dataIndex: ["reporter", "email"],
                    key: "reporter.email",
                },
            ],
        },
        {
            title: "Reported",
            children: [
                {
                    title: "ID",
                    dataIndex: ["reported", "id"],
                    key: ["reported", "id"],
                },
                {
                    title: "Username",
                    dataIndex: ["reported", "username"],
                    key: ["reported", "username"],
                },
                {
                    title: "Email",
                    dataIndex: ["reported", "email"],
                    key: ["reported", "email"],
                },
            ],
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" danger onClick={() => handleDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    async function handleDelete(record) {
        const deleted_id = record.reported.id;
        const username = record.reported.username;
        try {
            const response = await fetch(`http://localhost:8000/accounts/admin/${adminId}/reported_users/${deleted_id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(`User ${username} has been deleted!`);
                window.location.reload();
            } else {
                alert(data.detail);
            }
        } catch (err) {
            console.log(err);
        }
    }



    if (!auth.authenticated) {
        window.location.href = "/login";
    }
    if (auth.objectId !== "admin") {
        window.location.href = "/";
    }
    return (
        <div className="admin-page">
            <div className="admin-nav">
                <div className="logo-container">
                    <img src={Logo} alt="PetPal Logo" className="logo" />
                </div>
                <h1 className="admin-header">Admin Page</h1>
                <div className="admin-nav-right" style={{width: "auto"}}>
                    <Button type="primary" danger href="/logout">
                        Logout
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={reportedList}
                bordered
                size="middle"
                scroll={{
                    x: 1500,
                }}
            />
        </div>
    )
}