// AppRouter.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./App";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;