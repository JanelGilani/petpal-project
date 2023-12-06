import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useEffect, useState } from "react";
import { Button, Table } from 'antd';
import { Link } from "react-router-dom";
import '../styles/ShelterList.css';

export default function ShelterList() {
    const auth = useSelector((state) => state.auth);
    const [shelterList, setShelterList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (!auth.authenticated) {
                    // Redirect or handle unauthenticated state here
                    return;
                }

                const res = await fetch(`http://localhost:8000/accounts/all_shelters/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    }
                });
                const data = await res.json();
                setShelterList(data.results);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [auth]);

    if (!auth.authenticated) {
        return <Error error={401} />;
    }

    const columns = [
        {
            title: 'Shelter Name',
            dataIndex: 'shelter_name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Email',
            dataIndex: ["user", "email"],
            key: 'email',
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Link to={`/shelters/${record.user.id}/${record.user.username}`}>
                    <Button type="primary">View</Button>
                </Link>
            )
        }
    ];

    console.log(shelterList);
    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    <Table columns={columns} dataSource={shelterList} />
                </div>
            </div>
            <Footer />
        </div>
    );
}
