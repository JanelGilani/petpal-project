import React, { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";
import '../styles/header-footer.css';
import Logo from "../img/logo_large.png";
import { Image, Avatar, Dropdown, Menu, Badge, notification } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

export default function Header() {
    const auth = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const profileMenu = (
        <Menu>
            <Menu.Item key="1">
                <Link to="/your-applications" style={{ textDecoration: "none" }}>Your Applications</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/account-settings" style={{ textDecoration: "none" }}>Account Settings</Link>
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
            const res = await fetch(`http://localhost:8000/notifications/`, {
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

    const notificationMenu = (
        <Menu>
            {notifications.map((notification) => (
                <Menu.Item key={notification.id}>{notification.title}</Menu.Item>
            ))}
        </Menu>
    );

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
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        {
                            !auth.authenticated && (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/login">Login</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/register">Register</a>
                                    </li>
                                </>
                            )
                        }
                        <li className="nav-item">
                            <a className="nav-link" href="/petsearch">Pet Search</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/shelter">Shelters</a>
                        </li>
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
