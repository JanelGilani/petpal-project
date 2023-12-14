import React from "react";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import '../styles/shelter-management.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useState, useEffect } from "react";
import { Image, Button } from 'antd';
import Logo from '../img/logo.png';
import { MdDelete } from "react-icons/md";

export default function ShelterManagement() {
    const auth = useSelector((state) => state.auth);
    const [pets, setPets] = useState([]);
    const [shelterId, setShelterId] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!auth.authenticated) {
                    return <Error error={401} />;
                }

                const userInfoResponse = await fetch(`http://localhost:8000/accounts/userinfo/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    }
                });

                const userInfoData = await userInfoResponse.json();
                if (userInfoResponse.status !== 200) {
                    alert(userInfoData.detail);
                } else {
                    try {
                        const shelter_id = userInfoData.id;
                        setShelterId(shelter_id);
                        const petRes = await fetch(`http://localhost:8000/pets/shelter/${shelter_id}/`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${auth.token}`
                            }
                        });
                        const petData = await petRes.json();
                        if (petRes.status !== 200) {
                            alert(petData.detail);
                        } else {
                            setPets(petData.results);
                            // console.log(petData.results);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [auth]);

    const handleDelete = async (petId) => {
        try {
            const response = await fetch(`http://localhost:8000/pets/${petId}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                }
            });

            if (response.status !== 204) {
                const data = await response.json();
                alert(data.detail);
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-2 d-flex flex-column align-items-center text-center">
                        <Link to="#" className="add_pet_btn" style={{ marginBottom: "5px" }}>
                            <FaPaw />
                        </Link>
                        Edit Shelter
                    </div>
                    <div className="col-4 d-flex flex-column align-items-center text-center">
                        <h1 className="heading">List of Pets in your Shelter</h1>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-center text-center">
                        <Link to={`/create-pet/${shelterId}`} className="add_pet_btn" style={{ marginBottom: "5px" }}>
                            <IoIosAddCircle />
                        </Link>
                        Add Pet
                    </div>
                </div>
            </div>
            <div className="adoption cards">
                <div className="ui cards home">
                    {
                        pets.map(pet => (
                            <div className="adoption-pet card" key={pet.id}>
                                <div className="curved-border">
                                    <div className="card-image">
                                        <img src={require(`../img/${pet.name}.jpg`)} alt="pet" />
                                        <Link onClick={() => handleDelete(pet.id)} className="edit icon" style={{ marginBottom: "5px" }}>
                                            <MdDelete color="black" size={"14px"} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <div className="card-wave">
                                        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0,192L120,176C240,160,480,128,720,128C960,128,1200,160,1320,176L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
                                                fill="white"
                                                fill-opacity="1"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="card-description">
                                    <h3 className="card-description title">{pet.name}</h3>
                                    <p className="pet-description">{pet.color} {pet.breed}, Aged {pet.age}</p>
                                    <a className="card-description ui button" href={`/edit-pet/${pet.id}`}>Edit Pet</a>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
}
