// AppRouter.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./App";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import PetSearch from "./components/PetSearch";
import Logout from "./components/Logout";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route exact path="/petsearch" element={<PetSearch />} Component={PetSearch} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;