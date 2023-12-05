import React from "react";
import { Input, Button, Card, Row, Col } from "antd";
import { FaHeart } from "react-icons/fa";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import "../styles/landing-page.css";
import img1 from "../img/pet2-slideshow.jpeg";
// Component imports
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LandingPage() {
  
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
                  <FaHeart style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">We Offer</h5>
                  <p className="card-text">Find your perfect pet from a wide selection of adorable animals.</p>
                  <Button type="primary">Go somewhere</Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="benefit animate__animated animate__bounceIn" style={{ width: '18rem', border: 'none' }}>
                <div className="image" style={{ background: 'none' }}>
                  <FaHeart style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">We Care</h5>
                  <p className="card-text">Experience a quick and hassle-free adoption process with PetPal.</p>
                  <Button type="primary">Go somewhere</Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="benefit animate__animated animate__bounceIn" style={{ width: '18rem', border: 'none' }}>
                <div className="image" style={{ background: 'none' }}>
                  <FaHeart style={{ fontSize: '4em' }} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">You Give</h5>
                  <p className="card-text">Give a loving home to a furry friend and make a difference by being a difference.</p>
                  <Button type="primary">Go somewhere</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="adoption cards">
        <h1 className="adoption title">Looking to Adopt a Pet?</h1>
        <Row gutter={[16, 16]} justify="center">
          {/* Your adoption cards go here */}
        </Row>
        <div style={{ width: '100%', padding: '0 70px', textAlign: 'right' }}>
          <Button type="primary" icon={<RightOutlined />} className="bg-light">
            Pets Near You
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
