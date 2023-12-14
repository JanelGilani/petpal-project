import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../styles/shelter-details.css';
import '../styles/landing-page.css';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPaw, FaHeart, FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { Button, Input, Form } from 'antd';

export default function ShelterDetails() {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const url = location.pathname;
    const shelterId = url.split("/")[2];
    const shelter_user_id = url.split("/")[4];
    const [shelter, setShelter] = useState([]);
    const [comments, setComments] = useState([]);
    const { TextArea } = Input;

    useEffect(() => {
        async function getShelter() {
            try {
                // Pass the auth token as a header
                const res = await fetch(`http://localhost:8000/accounts/shelters/profile/${shelterId}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (res.status !== 200) {
                    alert(data.detail);
                } else {
                    setShelter(data);

                    const commentsResponse = await fetch(`http://localhost:8000/comments/shelters/${shelter_user_id}/comments/`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    const commentsData = await commentsResponse.json();
                    if (commentsResponse.status !== 200) {
                        alert(commentsData.detail);
                    } else {
                        getUserName(commentsData.results);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
        getShelter();
    }, [auth.authenticated]);

    async function getUserName(comments) {
        const commentsList = [];
        for (let i = 0; i < comments.length; i++) {
            const userResponse = await fetch(`http://localhost:8000/accounts/userinfo/${comments[i].user}/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token}`,
                    "Content-Type": "application/json"
                }
            });

            const userData = await userResponse.json();
            if (userResponse.status !== 200) {
                alert(userData.detail);
            } else {
                commentsList.push({ user: userData.username, text: comments[i].text, userId: comments[i].user });
            }
        }
        setComments(commentsList);
    }

    if (!auth.authenticated) {
        return <Error error="401" />
    } else if (auth.objectId === "shelter") {
        return <Error error="403" />
    }

    async function handleReport(reportUserId) {
        try {
            // Report the user
            const res = await fetch(`http://localhost:8000/accounts/report/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${auth.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reporter_id: auth.userId,
                    reported_id: reportUserId
                })
            });
            const data = await res.json();
            if (res.status !== 201) {
                alert(data.detail);
            } else {
                alert("User has been reported!");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                {/* <div className="center-image">
          <img
            src="../../images/64caae3acd560.image.jpg"
            alt="Avatar"
            style={{ borderRadius: "50%", maxWidth: "100%", height: "300px" }}
          />
        </div> */}
            </div>
            <div className="container mt-4">
                <p className="name">{shelter.shelter_name}</p>
            </div>

            <div className="container mt-4">
                <div className="column">
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px", marginTop: "50px" }}>Contact Information</p>
                        <p>Email: {shelter.user?.email}</p>
                        <p>Phone: {shelter.phone}</p>
                        <p>Website: {shelter.website}</p>
                        <p style={{ marginBottom: "50px" }}>Hours: {shelter.hours}</p>
                    </div>
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>Location</p>
                        <p style={{ fontSize: "25px"}}>{shelter.location}</p>
                        <p style={{ marginBottom: "50px" }}>Come visit us!</p>
                    </div>
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>Mission Statement</p>
                        {
                            <p>{shelter.mission_statement}</p>
                        }
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                {/* Create a comment box */}
                <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>Leave a Review</p>
                <Form
                    name="comment"
                    className="comment-form"
                    onFinish={async (values) => {
                        try {
                            const res = await fetch(`http://localhost:8000/comments/shelters/${shelterId}/comments/`, {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${auth.token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    text: values.comment,
                                    user: auth.objectId
                                })
                            });
                            const data = await res.json();
                            if (res.status !== 201) {
                                alert(data.detail);
                            } else {
                                window.location.reload();
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }}
                >
                    <Form.Item
                        name="comment"
                        rules={[{ required: true, message: 'Please input your comment!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Comment
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="container mt-4">
                <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "50px", marginBottom: "10px" }}>Reviews</p>
                <div className="row">
                    {comments.map((comment, index) => (
                        <div className="card" style={{ width: "100%", marginBottom: "20px" }} key={comment.userId}>
                            <div className="card-body">
                                <h5 className="card-title">{comment.user}</h5>
                                <p className="card-text">{comment.text}</p>
                                {
                                    auth.userId !== comment.userId &&
                                        <Button type="dashed" danger onClick={() => handleReport(comment.userId)}>Report User</Button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
