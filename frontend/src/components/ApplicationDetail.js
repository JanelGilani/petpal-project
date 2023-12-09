import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Button, Form, Input } from 'antd';


export default function ApplicationDetail() {
    const auth = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname;
    const applicationId = url.split("/")[2];
    const [applicationDetails, setApplicationDetails] = useState([]);
    const [comments, setComments] = useState([]);
    const { TextArea } = Input;

    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    }
    useEffect(() => {
        async function getApplicationData() {
            try {
                const res = await fetch(`http://localhost:8000/applications/${applicationId}/detail/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}`,
                    }
                });
                const data = await res.json();
                if (res.status !== 200) {
                    error(data.detail);
                } else {
                    setApplicationDetails(data);

                    const commentsResponse = await fetch(`http://localhost:8000/comments/applications/${applicationId}/comments/`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    const commentsData = await commentsResponse.json();
                    if (commentsResponse.status !== 200) {
                        error(commentsData.detail);
                    } else {
                        getUserName(commentsData.results);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        getApplicationData();
    }, [auth.token, applicationId]);


    async function getUserName(comments) {
        const commentList = [];
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
                commentList.push({
                    id: comments[i].id,
                    user: userData.username,
                    comment: comments[i].text,
                    date: comments[i].created_at,
                });
            }
        }
        // Sort comments by date (newest first)
        commentList.sort((a, b) => new Date(a.date) - new Date(b.date));
        setComments(commentList);
    }


    if (!auth.authenticated) {
        return <Error error={401} />;
    }

    return (
        <div className="content">
            <Navbar />
            {
                applicationDetails &&
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-lg-7">
                            <form className="adoption-form">
                                <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Adoption Application</p>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" className="form-control" id="name" name="name" required disabled value={applicationDetails.name} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" className="form-control" id="email" name="email" required disabled value={applicationDetails.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Home Address</label>
                                    <input type="text" className="form-control" id="address" name="address" required disabled value={applicationDetails.address} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pettype" value>Pet Type</label>
                                    <input type="text" className="form-control" id="pettype" name="pettype" disabled value={applicationDetails.pettype} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Pet Age</label>
                                    <input type="number" className="form-control" id="age" name="age" required disabled value={applicationDetails.petage} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="own">Have you owned pets before? If so, what happened to them?</label>
                                    <textarea className="form-control" rows={4} id="own" placeholder="Enter Your answer here" required disabled value={applicationDetails.ownedbefore}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="plan">How do you plan to provide for your new pet's exercise and mental stimulation needs?</label>
                                    <textarea className="form-control" rows={4} id="plan" placeholder="Enter Your answer here" required disabled value={applicationDetails.plantoprovide}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reason">Reason for adoption</label>
                                    <textarea className="form-control" rows={4} id="reason" placeholder="Enter Your reason here" required disabled value={applicationDetails.reason}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ename">Emergency contact</label>
                                    <input type="text" className="form-control" id="ename" name="ename" required disabled maxLength="12" value={applicationDetails.emergencycontact} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="eemail">Emergency contact email address</label>
                                    <input type="email" className="form-control" id="eemail" name="eemail" required disabled value={applicationDetails.emergencyemail} />
                                </div>
                                <div className="form-group">
                                    <input type="checkbox" id="agreement" name="agreement" value="Bike" disabled checked />
                                    <label htmlFor="agreement"> I acknowledge and agree to the shelter or rescue organization's adoption policies, including spaying/neutering, return policies, and commitment to providing proper care and love.</label><br />
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-4">
                            <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Chats</p>
                            <div className="container mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <div className="row">
                                    {comments.map((comment, index) => (
                                        <div className="card" style={{ width: "100%", marginBottom: "20px" }} key={comment.userId}>
                                            <div className="card-body">
                                                <p className="card-text">{comment.user}: {comment.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Form
                                name="comment"
                                className="comment-form"
                                onFinish={async (values) => {
                                    try {
                                        const res = await fetch(`http://localhost:8000/comments/applications/${applicationId}/comments/`, {
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
                                    <TextArea autoSize={{ minRows: 2, maxRows: 4}} style={{ borderRadius: '15px' }} />
                                </Form.Item>

                                <Form.Item style={{ textAlign: 'right' }}>
                                    <Button type="primary" htmlType="submit">
                                        Send
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            }
            <Footer />
        </div>
    );
}