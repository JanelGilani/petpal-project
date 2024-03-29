import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table, Tag, Divider } from "antd";
import { Link } from "react-router-dom";


export default function ApplicationsList() {
    const auth = useSelector((state) => state.auth);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        async function getApplications() {
            try {
                const res = await fetch(`http://localhost:8000/applications/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const data = await res.json();
                // console.log(auth.userId)
                if (auth.objectId === "shelter") {
                    const shelterApplications = data.filter(application => application.shelter_user === auth.userId);
                    setApplications(shelterApplications);
                    return;
                }
                const userApplications = data.filter(application => application.seeker_user === auth.userId);
                setApplications(userApplications);
            } catch (err) {
                console.log(err);
            }
        }

        getApplications();
    }, [auth.userId]); // Add auth.userId as a dependency

    if (!auth.authenticated) {
        return <Error error={401} />;
    }

    const columns = [
        {
            title: 'App Status',
            dataIndex: 'app_status',
            key: 'app_status',
            render: (_, { app_status }) => {
                let color = 'default'; // Default color

                if (app_status === 'pending') {
                    color = 'blue';
                } else if (app_status === 'accepted') {
                    color = 'green';
                } else if (app_status === 'denied') {
                    color = 'volcano';
                }

                return <Tag color={color}>{app_status.charAt(0).toUpperCase() + app_status.slice(1)}</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Last Update Time',
            dataIndex: 'last_update_time',
            key: 'last_update_time',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Pet ID',
            dataIndex: 'pet',
            key: 'pet',
        },
        {
            title: auth.objectId === "shelter" ? 'Seeker ID' : 'Shelter ID',
            dataIndex: auth.objectId === "shelter" ? 'seeker_user' : 'shelter_user',
            key: auth.objectId === "shelter" ? 'seeker_user' : 'shelter_user',
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <span>
                    <Link to={`/your-applications/${record.id}`}>
                        <Button type="link">View</Button>
                    </Link>

                    {
                        <Divider type="vertical" /> &&
                        auth.objectId === "shelter" && record.app_status !== "accepted" && (
                            <Button type="primary" onClick={() => updateApplicationStatus("accepted", record)}>Accept</Button>
                        )}
                    {
                        <Divider type="vertical" /> &&
                        auth.objectId === "shelter" && record.app_status !== "denied" && (
                            <Button type="link" danger onClick={() => updateApplicationStatus("denied", record)}>Reject</Button>
                        )
                    }
                </span>
            ),
        }

    ];

    async function updateApplicationStatus(status, record) {
        console.log(status);
        console.log(record);
        try {
            const res = await fetch(`http://localhost:8000/applications/${record.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
                body: JSON.stringify({
                    app_status: status,
                }),
            });
            const data = await res.json();
            console.log(data);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                <h1 className="applications-heading" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Applications
                </h1>
                <div className="row">
                    <Table columns={columns} dataSource={applications} pagination />
                </div>
            </div>
            <Footer />
        </div>
    );



}