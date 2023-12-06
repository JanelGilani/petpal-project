import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../styles/shelter-details.css';
import '../styles/landing-page.css';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Error from "./404.js";

export default function ShelterDetails() {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const url = location.pathname;
    const shelterId = url.split("/")[2];
    const [shelter, setShelter] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function getShelter() {
            try {
                // Pass the auth token as a header
                const res = await fetch(`http://localhost:8000/accounts/shelters/profile/${shelterId}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (res.status !== 200) {
                    alert(data.detail);
                } else {
                    setShelter(data);

                    const comments = await fetch(`http://localhost:8000/comments/shelters/${shelterId}/comments/`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${auth.token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    const commentsData = await comments.json();
                    if (comments.status !== 200) {
                        alert(commentsData.detail);
                    } else {
                        console.log(commentsData);
                        // setComments(commentsData.results);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
        getShelter();
    }, [auth.authenticated]);

    if (!auth.authenticated) {
        return <Error error="401" />
    } else if (auth.objectId === "shelter") {
        return <Error error="403" />
    }


    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                {/* <div className="center-image">
          <img
            src="../../images/64caae3acd560.image.jpg"
            alt="Avatar"
            style={{ borderRadius: "50%", maxWidth: "100%", height: "300px" }}
          />
        </div> */}
            </div>
            <div className="container mt-4">
                <p className="name">Happy Tails Refuge</p>
            </div>

            <div className="container mt-4">
                <div className="column">
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px", marginTop: "50px" }}>Contact Information</p>
                        <p>Email: shelter@example.com</p>
                        <p>Phone: (123) 456-7890</p>
                        <p style={{ marginBottom: "50px" }}>Address: 123 Shelter Street, City, State</p>
                    </div>
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>Location</p>
                        <p>Our shelter is located in a beautiful and accessible area.</p>
                        <p> 123 Pet Haven Street Serenityville, PA 12345 United States.</p>
                        <p style={{ marginBottom: "50px" }}>Come visit us!</p>
                    </div>
                    <div className="row-lg-3">
                        <p style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>Mission Statement</p>
                        <p>"At Happy Tails Refuge, our mission is to be a beacon of hope and compassion for animals in need. We are committed to providing a safe, loving, and nurturing environment for abandoned, abused, and neglected pets. Our unwavering dedication is to ensure their well-being, rehabilitation, and the opportunity for a second chance at a happy and fulfilling life.</p>
                        <p>We strive to:</p>
                        <p>Rescue and Protect: We rescue animals from dire situations, offering them refuge from harm and suffering. Our doors are open to pets of all species, breeds, and ages.</p>
                        <p>Provide Love and Care: Every animal in our care receives the love, attention, and medical care they deserve. We are devoted to helping them heal, both physically and emotionally.</p>
                        <p>Find Forever Homes: Our ultimate goal is to match each pet with a loving and responsible forever family. We take pride in thorough adoption processes, ensuring the best possible match for both pets and adopters.</p>
                        <p>Educate and Advocate: We believe in the power of education to promote responsible pet ownership. We share our knowledge with the community, advocating for the welfare and rights of all animals.</p>
                        <p>Foster a Community of Compassion: We aim to foster a community that shares our passion for animals. Through collaboration, we can make a lasting impact on the lives of countless pets.</p>
                        <p style={{ marginBottom: "50px" }}>At Happy Tails Refuge, we envision a world where every pet is valued and cherished, where no animal is left to suffer, and where love knows no bounds. Our mission is driven by a deep sense of compassion, and we invite all kindred spirits to join us on this journey of love, healing, and transformation. Together, we can create a better world for our furry friends."</p>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "50px", marginBottom: "10px" }}>Reviews</p>
                <div className="row">
                    <div className="column-lg-4 review-column">
                        <p>Rating: ★★★★★ (5/5)

                            I recently had the privilege of visiting Happy Tails Refuge, and the experience left an indelible mark on my heart. This remarkable pet shelter is a beacon of hope for animals in need, and it's evident from the moment you step through their doors.

                            Dedicated and Caring Staff:
                            The staff and volunteers at [Pet Shelter Name] are nothing short of heroes. Their unwavering dedication to the welfare of the animals in their care is truly inspiring. They are not only knowledgeable but also genuinely compassionate. It's heartwarming to see their commitment to finding loving forever homes for each and every one of their furry residents.
                        </p>
                    </div>
                    <div className="column-lg-4 review-column">
                        <p>Rating: ★★★★★ (5/5)

                            My visit to Happy Tails Refuge left me utterly impressed and touched by the depth of care and compassion that permeates every corner of this remarkable shelter. The dedication of the staff and volunteers is truly heartwarming. They are not only well-informed but also incredibly nurturing toward the animals under their watchful eye.

                            Immaculate and Comfortable Environment:
                            The shelter's facilities are spotless and comfortable. The living spaces for animals are spacious and well-maintained, with plenty of room for dogs to run and play and cozy corners for cats to curl up. It's evident that every effort is made to ensure the animals' happiness and well-being.
                        </p>
                    </div>
                    <div className="column-lg-4 review-column">
                        <p>Rating: ★★★★★ (5/5)

                            Happy Tails Refuge is a true paradise for animals in need, and my visit there left me profoundly moved. The staff and volunteers radiate warmth and compassion, making this shelter a place of hope and transformation for countless animals.

                            A Team of Dedicated Angels:
                            The people at Happy Tails Refuge are angels in disguise. Their unwavering commitment to the animals is evident in every interaction. They take the time to understand each pet's unique needs and personality, ensuring that they find the perfect forever home.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
