import React, { useState } from "react";
import "../styles/account-update.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AccountUpdate = () => {
  const [formData, setFormData] = useState({
    name: "User's Name",
    email: "user@example.com",
    password: "",
    confirmPassword: "",
    phone: "123-456-7890",
    location: "Your Location",
    petPreferences: "Your Pet Preferences",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleUpdate = () => {
    // Add your update logic here
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="content">
        <Navbar />
      <div className="row">
        {/* User Profile Picture */}
        <div className="col-md-4 pp">
          <div className="profile-picture">
            <img
              className="profile-image"
              src="../../images/1_BlackPuppy-5ba50070c9e77c0082221c54.jpg"
              alt="Profile Picture"
            />
            {/* Upload Button */}
            <label htmlFor="profilePicture" className="upload-button">
              <i className="fas fa-camera"></i> Upload
            </label>
            {/* File Input (Hidden) */}
            <input type="file" id="profilePicture" accept="image/*" />
          </div>
        </div>

        {/* Account Update Form */}
        <div className="col-md-8">
          <h2 style={{ color: "black" }}>Account Update</h2>
          <form className="ui form" id="updateForm">
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <fieldset className="field additional-info">
              <h3>Additional Information</h3>
              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Your Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Your Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="petPreferences">Pet Preferences</label>
                <textarea
                  id="petPreferences"
                  placeholder="Your Pet Preferences"
                  value={formData.petPreferences}
                  onChange={handleChange}
                ></textarea>
              </div>
            </fieldset>
            <button
              className="ui button"
              id="update-btn"
              type="button"
              onClick={handleUpdate}
            >
              Update
            </button>
          </form>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default AccountUpdate;
