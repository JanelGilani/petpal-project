import React from "react";
import { useEffect, useState } from "react";
import { Image } from "antd";
import Logo from "../img/logo.png";
import Footer from "./Footer";
import "../styles/pet-search.css";
import "../styles/landing-page.css";
import Navbar from "./Navbar";
import { Select, Tag } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function PetSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [sort, setSort] = useState({
        "sort_by": ["name"],
    });
    useEffect(() => {
        getPet();
    }, []);
    console.log(sort);
    async function getPet() {
        try {
            const response = await fetch("http://localhost:8000/pets/all");
            const jsonData = await response.json();

            const availablePets = jsonData.results.filter((pet) => pet.status === "Available");
            setPets(availablePets);
        } catch (err) {
            console.error(err.message);
        }
    }
    // sort meny    
    const sortOptions = [
        { key: "1", text: "Name", value: "name" },
        { key: "2", text: "Age", value: "age" },
        { key: "3", text: "Size", value: "size" },
    ];

    const handleSortChange = (e) => {
        const { name, value } = e;
        setSort({ ...sort, [name]: value });
    }


    // Filters
    const [filters, setFilters] = useState({
        "species": "",
        "color": "",
        "breed": "",
        "age": "",
        "gender": "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e;
        setFilters({ ...filters, [name]: value });
    }

    useEffect(() => {
        // Filter out null values
        const filtered = Object.keys(filters).filter((key) => filters[key] !== "");
        // Sort by sort_by
        const filteredObj = {};
        filtered.forEach((key) => {
            if (filters[key] === "All") {
                return;
            }
            filteredObj[key] = filters[key];
        });
        if (sort.sort_by && sort.sort_by.length > 0) {
            const sort_by = Array.isArray(sort.sort_by) ? sort.sort_by.join(",") : sort.sort_by;
            filteredObj["sort_by"] = sort_by;
        }
        if (filters > 0 || sort.sort_by.length > 0) {
            console.log(filteredObj);
            const params = new URLSearchParams(filteredObj);
            const path = `/pets/search/?${params.toString()}`;
            console.log(path);
            getFilteredPets(path);
        }

    }, [filters, sort]);

    async function getFilteredPets(path) {
        try {
            const response = await fetch(`http://localhost:8000/${path}`, {
                // Pass in filters as query params
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();
            setPets(jsonData.results);

        } catch (err) {
            console.error(err.message);
        }
    }



    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        }
        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
            >
                {label}
            </Tag>
        );
    }


    console.log(pets)

    return (
        <div id="content">
            <Navbar />
            <div className="ui container search" style={{ marginTop: '50px' }}>
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <label>Type</label>
                            <Select
                                style={{ width: 120 }}
                                defaultValue="All"
                                name="type"
                                onChange={(value) => handleFilterChange({ name: "species", value })}
                                options={[
                                    { key: "1", text: "All", value: "All" },
                                    { key: "2", text: "Dog", value: "Dog" },
                                    { key: "3", text: "Cat", value: "Cat" },
                                    { key: "4", text: "Other", value: "Other" },
                                ]}
                            />
                        </div>
                        <div className="field">
                            <label>Color</label>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange({ name: "color", value })}
                                name="color"
                                defaultValue="All"
                                options={[
                                    { key: "1", text: "All", value: "All" },
                                    { key: "2", text: "Black", value: "Black" },
                                    { key: "3", text: "White", value: "White" },
                                    { key: "4", text: "Brown", value: "Brown" },
                                    { key: "5", text: "Golden", value: "Golden" }
                                ]}
                            />
                        </div>
                        <div className="field">
                            <label>Breed</label>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange({ name: "breed", value })}
                                name="breed"
                                defaultValue="All"
                                options={[
                                    { key: "0", text: "All", value: "All" },
                                    { key: "1", text: "Labrador Retriever", value: "Labrador Retriever" },
                                    { key: "2", text: "German Shepherd", value: "German Shepherd" },
                                    { key: "3", text: "Golden Retriever", value: "Golden Retriever" },
                                    { key: "4", text: "French Bulldog", value: "French Bulldog" },
                                ]}
                            />
                        </div>
                        <div className="field">
                            <label>Age</label>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange({ name: "age", value })}
                                name="age"
                                defaultValue="All"
                                options={[
                                    { key: "1", text: "All", value: "All" },
                                    { key: "2", text: "Baby", value: "1" },
                                    { key: "3", text: "Young", value: "3" },
                                    { key: "4", text: "Adult", value: "5" },
                                    { key: "5", text: "Senior", value: "9" }
                                ]}
                            />
                        </div>
                        <div className="field">
                            <label>Gender</label>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange({ name: "gender", value })}
                                name="gender"
                                defaultValue="All"
                                options={[
                                    { key: "1", text: "All", value: "All" },
                                    { key: "2", text: "Male", value: "Male" },
                                    { key: "3", text: "Female", value: "Female" },
                                ]}
                            />
                        </div>
                        <div className="field">
                            <label>Sort By:</label>
                            <Select
                                mode="multiple"
                                tagRender={tagRender}
                                placeholder="Sort By"
                                defaultValue={['Name']}
                                value={sort.sort_by}
                                options={sortOptions}
                                onChange={(value) => handleSortChange({ name: "sort_by", value })}
                                style={{ width: 300 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="adoption cards">
                <div className="ui cards home">
                    {
                        pets.map(pet => (
                            <div className="adoption-pet card" key={pet.pet_id}>
                                <div className="curved-border">
                                    <div className="card-image">
                                        <Image src={Logo} />
                                        <i className="heart icon"></i>
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
                                    <a className="card-description ui button" href="pages/seeker/pet-details.html">Adopt</a>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};



