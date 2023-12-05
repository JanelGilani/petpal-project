// AppRouter.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from "./App";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import PetSearch from "./components/PetSearch";
import Logout from "./components/Logout";
import PetDetails from "./components/PetDetails";
import ShelterManagement from "./components/ShelterManagement";
import PetCreate from "./components/PetCreate";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route exact path="/petsearch" element={<PetSearch />} Component={PetSearch} />
                <Route path="/petsearch/:id/" element={<PetDetails />}/>
                <Route path="/logout" element={<Logout />} />
                <Route path="/manage-shelter" element={<ShelterManagement />} />
                <Route path="/create-pet" element={<PetCreate />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;