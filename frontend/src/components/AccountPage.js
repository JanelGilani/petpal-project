import { useEffect, useState} from "react";
import "../styles/account-update.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios"; // Import Axios for making HTTP requests
import { useSelector } from "react-redux";

const AccountUpdate = () => {
  const auth = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    petPreferences: "",
  });
  console.log(auth.userId);
  useEffect(() => {
    // Fetch user data and prepopulate the form
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/accounts/petseekers/profile/${auth.userId}/`, // Replace with your Django API endpoint to fetch user data
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
  
        const userData = response.data;
        console.log(userData);
        // Set the form data with the fetched user data
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          petPreferences: userData.petPreferences,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [auth.token, auth.userId]); //


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/petseekers/${formData.username}/`, // Replace with your Django API endpoint to update user data
        formData
      );

      console.log("User updated:", response.data);
      // Handle success: show a success message or perform any other actions
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error: show an error message or perform any other actions
    }
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
