import React, { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Link, useLocation } from "react-router-dom";
import '../styles/header-footer.css';
import Logo from "../img/logo_large.png";
import { Image, Avatar, Dropdown, Menu, Badge, notification, Button } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

export default function Header() {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const url = location.pathname;
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const profileMenu = (
        <Menu>
            <Menu.Item key="1" className={url.startsWith("/your-applications") ? "dropdown-item active" : "dropdown-item"} >
                <Link to="/your-applications" style={{ textDecoration: "none" }}>Your Applications</Link>
            </Menu.Item>
            <Menu.Item key="2" style={{ backgroundColor: url.startsWith("/your-account") ? "#f7f7f7" : "inherit" }}>
                <Link to="/your-account" style={{ textDecoration: "none" }}>Account Settings</Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
                <Link to="/logout" style={{ textDecoration: "none" }}>Logout</Link>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        if (auth.authenticated) {
            getNotifications();
        }
    }, [auth.authenticated]);

    async function getNotifications() {
        try {
            // Pass the auth token as a header
            const res = await fetch(`http://localhost:8000/notifications/?status=unread`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            });
            const data = await res.json();
            if (res.status !== 200) {
                alert(data.detail);
            } else {
                setNotifications(data.results); // Update state with notifications
                let count = 0;
                for (let i = 0; i < data.results.length; i++) {
                    if (data.results[i].is_read === 'unread') {
                        count++;
                    }
                }
                setNotificationCount(count);
            }
        } catch (err) {
            console.log(err);
        }
    }
    async function readNotification(notificationId) {
        try {
            // Pass the auth token as a header
            const res = await fetch(`http://localhost:8000/notifications/${notificationId}/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            });
            const data = await res.json();
            if (res.status !== 200) {
                alert(data.detail);
            } else {
                getNotifications();
            }
        } catch (err) {
            console.log(err);
        }
    }
    const notificationMenu = (
        <Menu>
            {notifications.length === 0 ? (
                <Menu.Item key="1">No notifications</Menu.Item>
            ) : (
                notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                        {notification.title}
                        <Button type="link" onClick={async () => { await readNotification(notification.id) }}>
                            Mark as read
                        </Button>
                    </Menu.Item>
                ))
            )}
        </Menu>
    );

{/* <Button type="link" onClick={async () => {} }>Mark all as read</Button> */}
    return (
        <div className="pusher">
            <nav className="navbar navbar-expand-lg navbar-light" style={{ height: '80px' }}>
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <Image className="logo" src={Logo} preview={false} width={115} />
                </a>
                <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    className="navbar-toggler navbar-toggler-start" type="button">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="navbarNav">
                    <ul className="nav navbar-nav">
                        <li className={url.startsWith("/home") ? "nav-item active" : "nav-item"}>
                            <a className="nav-link" href="/home">Home</a>
                        </li>
                        {
                            !auth.authenticated && (
                                <>
                                    <li className={url.startsWith("/login") ? "nav-item active" : "nav-item"}>
                                        <a className="nav-link" href="/login">Login</a>
                                    </li>
                                    <li className={url.startsWith("/register") ? "nav-item active" : "nav-item"}>
                                        <a className="nav-link" href="/register">Register</a>
                                    </li>
                                </>
                            )
                        }
                        <li className={url.startsWith("/petsearch") ? "nav-item active" : "nav-item"}>
                            <a className="nav-link" href="/petsearch">Pet Search</a>
                        </li>
                        {
                            auth.authenticated && (
                                auth.objectId === "seeker" ? (
                                    <li className={url.startsWith("/shelters") ? "nav-item active" : "nav-item"}>
                                        <a className="nav-link" href="/shelters">Shelters</a>
                                    </li>
                                ) : (
                                    <li className={url.startsWith("/manage-shelter") ? "nav-item active" : "nav-item"}>
                                        <a className="nav-link" href="/manage-shelter">Manage Shelter</a>
                                    </li>
                                )
                            )
                        }

                        {auth.authenticated && (
                            <>
                                <li className="nav-item">
                                    <Dropdown overlay={notificationMenu} placement="bottomRight">
                                        <Badge count={notifications.length}>
                                            <Avatar icon={<BellOutlined />} style={{ marginLeft: '10px' }} />
                                        </Badge>
                                    </Dropdown>
                                </li>
                                <li className="nav-item">
                                    <Dropdown overlay={profileMenu} placement="bottomRight">
                                        <Avatar icon={<UserOutlined />} style={{ marginLeft: '20px' }} />
                                    </Dropdown>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
