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
import PetApplication from "./components/Application";
import ShelterList from "./components/ShelterList";
import ShelterDetails from "./components/ShelterDetail";
import AccountPage from "./components/AccountPage";
import EditPet from "./components/EditPet";
import AdminPage from "./components/AdminPage";
import ApplicationList from "./components/ApplicationList";
import ApplicationDetails from "./components/ApplicationDetail";

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
                <Route path="/create-pet/:id" element={<PetCreate />} />
                <Route path="/adopt/:id" element={<PetApplication />} />
                <Route path="/shelters" element={<ShelterList />} />
                <Route path="/shelters/:id/:username/:id" element={<ShelterDetails />} />
                <Route path="/your-account" element={<AccountPage />} />
                <Route path="/edit-pet/:id" element={<EditPet />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/your-applications" element={<ApplicationList />} />
                <Route path="/your-applications/:id" element={<ApplicationDetails />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;