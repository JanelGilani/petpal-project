import { useEffect, useState } from "react";
import "../styles/account-update.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Error from "./404.js";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import Logout from "./Logout";


export default function AccountUpdate() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [shelterData, setShelterData] = useState({
    shelter_name: "",
    username: "",
    email: "",
    location: "",
    password: "",
    mission_statement: "",
  });

  const [petseekerData, setPetseekerData] = useState({
    seeker_name: "",
    username: "",
    email: "",
    location: "",
    password: "",
  });

  const error = (err) => {
    message.open({
      type: 'error',
      content: err,
    });
  };
  const success = () => {
    message.open({
      type: 'success',
      content: 'Profile Updated!',
    });
    navigate("/");
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (auth.objectId === "shelter") {
          response = await fetch(`http://localhost:8000/accounts/shelters/profile/${auth.userId}/`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${auth.token}`,
            },
          });
        } else {
          response = await fetch(`http://localhost:8000/accounts/petseekers/profile/${auth.userId}/`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${auth.token}`,
            },
          });
        }

        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          if (auth.objectId === "shelter") {
            setShelterData({
              shelter_name: userData.shelter_name,
              username: userData.user.username,
              email: userData.user.email,
              location: userData.location,
              password: userData.password,
              mission_statement: userData.mission_statement,
            });
          } else {
            setPetseekerData({
              seeker_name: userData.seeker_name,
              username: userData.user.username,
              email: userData.user.email,
              location: userData.location,
              password: userData.password,
            });
          }
        } else {
          error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [auth.userId, auth.token, auth.objectId]);

  if (!auth.authenticated) {
    return <Error error={403} />;
  }

  const handleShelterUpdate = async (e) => {
    e.preventDefault();
    console.log(shelterData);
    try {
      const response = await fetch(`http://localhost:8000/accounts/shelters/${auth.userId}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        method: "PUT",
        body: JSON.stringify(shelterData),
      });

      if (response.ok) {
        console.log("Updated shelter data");
        success();
      }
      else {
        error("Error updating shelter data");
      }

    } catch (error) {
      console.error("Error updating shelter data:", error);
    }
  };

  const handleAccountChange = (key, value) => {
    if (auth.objectId === "shelter") {
      setShelterData({ ...shelterData, [key]: value });
    } else {
      setPetseekerData({ ...petseekerData, [key]: value });
    }
  };

  const handlePetseekerUpdate = async (e) => {
    e.preventDefault();
    console.log(petseekerData);
    try {
      const response = await fetch(`http://localhost:8000/accounts/petseekers/${auth.userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify(petseekerData),
      });

      if (response.ok) {
        console.log("Updated pet seeker data");
        success();
      } else {
        error("Error updating pet seeker data");
      }
    }
    catch (error) {
      console.error("Error updating pet seeker data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      let response;
      if (auth.objectId === "shelter") {
        response = await fetch(`http://localhost:8000/accounts/shelters/${auth.userId}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${auth.token}`,
          },
        });
      } else {
        response = await fetch(`http://localhost:8000/accounts/petseekers/${auth.userId}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${auth.token}`,
          },
        });
      }

      if (response.ok) {
        console.log(`Deleted ${auth.objectId === "shelter" ? "shelter" : "pet seeker"} data`);
        success();
      } else {
        error(`Error deleting ${auth.objectId === "shelter" ? "shelter" : "pet seeker"} data`);
      }
    } catch (error) {
      console.error(`Error deleting ${auth.objectId === "shelter" ? "shelter" : "pet seeker"} data:`, error);
    }
    navigate("/");
  };

  return (
    <div className="content">
      <Navbar />
      <div className="row">
        <div className="col-md-4 pp">
          <div className="profile-picture">
            <img
              className="profile-image"
              src="../../images/1_BlackPuppy-5ba50070c9e77c0082221c54.jpg"
              alt="Profile Picture"
            />
            <label htmlFor="profilePicture" className="upload-button">
              <i className="fas fa-camera"></i> Upload
            </label>
            <input type="file" id="profilePicture" accept="image/*" />
          </div>
        </div>

        <div className="col-md-8">
          <h2 style={{ color: "black" }}>Account Update</h2>
          {auth.objectId === "shelter" ? (
            <form className="ui form" id="updateForm">
              <div className="field">
                <label htmlFor="shelter_name">Shelter Name</label>
                <input
                  type="text"
                  id="shelter_name"
                  placeholder="Shelter Name"
                  value={shelterData.shelter_name}
                  onChange={(e) => handleAccountChange("shelter_name", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={shelterData.username}
                  onChange={(e) => handleAccountChange("username", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  value={shelterData.email}
                  onChange={(e) => handleAccountChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="New Password"
                  value={shelterData.password}
                  onChange={(e) => handleAccountChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Location"
                  value={shelterData.location}
                  onChange={(e) => handleAccountChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="mission_statement">Mission Statement</label>
                <textarea
                  id="mission_statement"
                  placeholder="Mission Statement"
                  value={shelterData.mission_statement}
                  onChange={(e) => handleAccountChange("mission_statement", e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                className="ui button"
                id="update-btn"
                type="button"
                onClick={handleShelterUpdate}
              >
                Update
              </button>
            </form>
          ) : (
            <form className="ui form" id="updateForm">
              <div className="field">
                <label htmlFor="seeker_name">Pet Seeker Name</label>
                <input
                  type="text"
                  id="seeker_name"
                  placeholder="Pet Seeker Name"
                  value={petseekerData.seeker_name}
                  onChange={(e) => handleAccountChange("seeker_name", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={petseekerData.username}
                  onChange={(e) => handleAccountChange("username", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  value={petseekerData.email}
                  onChange={(e) => handleAccountChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="New Password"
                  value={petseekerData.password}
                  onChange={(e) => handleAccountChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Location"
                  value={petseekerData.location}
                  onChange={(e) => handleAccountChange("location", e.target.value)}
                  required
                />
              </div>
              <button
                className="ui button"
                id="update-btn"
                type="button"
                onClick={handlePetseekerUpdate}
              >
                Update
              </button>
              <Button
                type="primary"
                danger
                onClick={() => { handleDelete() }}
              >
                Delete
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

