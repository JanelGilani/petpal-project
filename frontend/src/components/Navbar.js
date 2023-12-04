import React from "react";
import 'semantic-ui-css/semantic.min.css';
import {Link, useLocation } from "react-router-dom";
import '../styles/header-footer.css';

export default function Header() {
    // const location = useLocation();
    // const path = location.pathname;
    return (
        <div class="pusher">
        <nav class="navbar navbar-expand-lg navbar-light" style={{ height: '80px' }}>
            <a class="navbar-brand d-flex align-items-center" href="#">
                {/* <img alt="logo" class="logo" src="images/logo_large.png"> */}
            </a>
            <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    class="navbar-toggler navbar-toggler-start" type="button">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse" id="navbarNav">
                <ul class="nav navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Login</a>
                        {/* <Link to="/login">Login</Link> */}
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/seeker/pet-search.html">Pet Search</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/signup.html">Register</a>
                    </li>
                    {/* <li class="nav-item notification">

                    </li> */}
                    <li class="nav-item notification">
                        <button class="ui vertical animated button" data-content="1 new message" data-inverted=""
                                data-position="bottom left"
                                id="notificationButton">
                            <div class="hidden content">Notifications</div>
                            <div class="visible content">
                                <i class="mail icon"></i>
                                <span class="notification-count">1</span>
                            </div>
                        </button>
                    </li>
                    <li class="ui dropdown">
                        
                        <div class="menu">
                            <a class="item" data-value="0" href="pages/seeker/application.html">Your
                                Application</a>
                            <a class="item" data-value="1" href="pages/seeker/account-update.html">Account Settings
                            </a>
                            <div class="item" data-value="2">Logout</div>
                        </div>
                    </li>
                </ul>
                <div class="ui bottom center popup" id="notificationPopup">
                    <div class="list-group">
                        <div class="list-group-item notification-content">
                            {/* <img class="ui avatar image" src="https://xsgames.co/randomusers/avatar.php?g=pixel"> */}
                            <a href="pages/seeker/application.html" class="header"><b>GoDoggy Adoption</b></a>
                            <div class="description"><b>Your application was rejected</b></div>
                        </div>
                        <div class="list-group-item notification-content">
                            {/* <img class="ui avatar image" src="https://xsgames.co/randomusers/avatar.php?g=pixel"> */}
                            <div class="header">Meow Center</div>
                            <div class="description">Your application is still under consideration</div>
                        </div>
                        <div class="list-group-item notification-content">
                            {/* <img class="ui avatar image" src="https://xsgames.co/randomusers/avatar.php?g=pixel"> */}
                            <div class="header">GetPets Org</div>
                            <div class="description">New update on your application</div>
                        </div>
                        <div class="list-group-item notification-content">
                            {/* <img class="ui avatar image" src="https://xsgames.co/randomusers/avatar.php?g=pixel"> */}
                            <div class="header">Jenny Hess</div>
                            <div class="description">Welcome to PetPal</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    );
}
