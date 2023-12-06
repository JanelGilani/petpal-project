import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PetApplication() {

    return (
        <div className="content">
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-7">
                        <form className="adoption-form">
                            <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Adoption Application</p>
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" className="form-control" id="name" name="name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" className="form-control" id="email" name="email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Home Address</label>
                                <input type="text" className="form-control" id="address" name="address" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pettype">Pet Type</label>
                                <select className="form-control" id="pettype" name="pettype" required>
                                    <option value="dog">Dog</option>
                                    <option value="cat">Cat</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="bird">Bird</option>
                                    {/* Add more pet types as needed */}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Preferred Pet Age</label>
                                <input type="number" className="form-control" id="age" name="age" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="own">Have you owned pets before? If so, what happened to them?</label>
                                <textarea className="form-control" rows={4} id="own" placeholder="Enter Your answer here" required></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="plan">How do you plan to provide for your new pet's exercise and mental stimulation needs?</label>
                                <textarea className="form-control" rows={4} id="plan" placeholder="Enter Your answer here" required></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reason">Reason for adoption</label>
                                <textarea className="form-control" rows={4} id="reason" placeholder="Enter Your reason here" required></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ename">Emergency contact name</label>
                                <input type="text" className="form-control" id="ename" name="ename" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="eemail">Emergency contact email address</label>
                                <input type="email" className="form-control" id="eemail" name="eemail" required />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" id="agreement" name="agreement" value="Bike" />
                                <label htmlFor="agreement"> I acknowledge and agree to the shelter or rescue organization's adoption policies, including spaying/neutering, return policies, and commitment to providing proper care and love.</label><br />
                            </div>

                            <a className="btn btn-primary" href="../seeker/application.html" role="button">Submit Application</a>
                        </form>
                    </div>
                    <div className="col-lg-4">
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>Learn About Adoption</p>
                        {/* ... your cards and content */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

