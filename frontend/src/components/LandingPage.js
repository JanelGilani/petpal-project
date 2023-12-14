import React from "react";
import { Input, Button, Card, Row, Col } from "antd";
import { FaPaw, FaHeart, FaCheckCircle } from "react-icons/fa";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import "../styles/landing-page.css";
import "../styles/pet-search.css";
import img1 from "../img/pet2-slideshow.jpeg";
// Component imports
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const auth = useSelector(state => state.auth);
  if (auth.authenticated && auth.objectId === "admin") {
    window.location.href = "/admin";
  }
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function getPets() {
      try {
        const res = await fetch(`http://localhost:8000/pets/all/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        // Only show 3 pets
        data.results = data.results.slice(0, 5);
        setPets(data.results);
      } catch (err) {
        console.log(err);
      }
    }

    getPets();
  }, []);
  console.log(pets);

  return (
    <div className="content">
      <Navbar />
      <div className="slide-show images">
        <div className="joined-search">
          <Input size="large" className="name" placeholder="Search your Pet" suffix={<SearchOutlined />} />
        </div>
        <img alt="Adopt Pet" className="images" src={img1} />
      </div>
      <div className="info-container">
        <h1 style={{ color: 'rgb(77,71,81)', fontFamily: 'var(--font)', fontSize: '45px' }}>
          PROVIDING THE BEST CARE
        </h1>
        <div className="benefit-container">
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Card className="benefit animate__animated animate__bounceIn" style={{ width: '18rem' }}>
                <div className="image" style={{ background: 'none' }}>
                  <FaPaw style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ margin: "10px 0" }}>We Offer</h5>
                  <p className="card-text">Find your perfect pet from a wide selection of adorable animals.</p>
                  {
                    auth.authenticated ?
                      <Link to="/petsearch"><Button type="primary">See Offer</Button></Link>
                      :
                      <Link to="/login"><Button type="primary">See Offer</Button></Link>
                  }
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="benefit animate__animated animate__bounceIn" style={{ width: '18rem', border: 'none' }}>
                <div className="image" style={{ background: 'none' }}>
                  <FaCheckCircle style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ margin: "10px 0" }}>We Care</h5>
                  <p className="card-text">Experience a quick and hassle-free adoption process with PetPal.</p>
                  {
                    auth.authenticated ?
                      <Link to="/petsearch"><Button type="primary">I care</Button></Link>
                      :
                      <Link to="/login"><Button type="primary">I care</Button></Link>
                  }
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="benefit animate__animated animate__bounceIn" style={{ width: '18rem', border: 'none' }}>
                <div className="image" style={{ background: 'none' }}>
                  <FaHeart style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ margin: "10px 0" }}>You Give</h5>
                  <p className="card-text">Give a loving home to a furry friend and make a difference by being a difference.</p>
                  {
                    auth.authenticated ?
                      <Link to="/petsearch"><Button type="primary">Let's Give</Button></Link>
                      :
                      <Link to="/login"><Button type="primary">Let's Give</Button></Link>
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div className="adoption cards">
        <h1 className="adoption title">Looking to Adopt a Pet?</h1>
        <div className="ui cards home">
          {
            pets.map(pet => (
              <div className="adoption-pet card" key={pet.pet_id}>
                <div className="curved-border">
                  <div className="card-image">
                    <img width="100%" src={require(`../img/${pet.name}.jpg`)} className="pet-image" />
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
                  <p class="pet-description">{pet.color} {pet.breed}, Aged {pet.age}</p>
                  <a className="card-description ui button" href={"/petsearch/" + pet.id}>Adopt</a>
                </div>
              </div>
            ))
          }
        </div>
        <div style={{ width: '100%', padding: '0 70px', textAlign: 'right' }}>
          <Link to="/petsearch">
            <Button type="primary" icon={<RightOutlined />}>
              Pets Near You
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
