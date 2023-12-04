import React from "react";


export default function Footer() {
    return (
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-md-2 text-center">
                        {/* <img alt="Pet Pal Logo" class="logo" src="images/logo.png"> */}
                    </div>
                    <div class="col-md-2 text-center">
                        <h3>Contact Us</h3>
                        <p>Email:
                            <a
                                class="email"
                                href="mailto:info@petpal.com?subject=Queries%20Regarding%20Pet">info@petpal.com</a></p>
                        <p>Phone: +1 (123) 456-7890</p>
                    </div>
                    <div class="col-md-4 text-center ">
                        <h3>Follow Us</h3>
                        <p>Stay connected on social media</p>
                        <ul class="social-icons">
                            <li><a href="#"><i class="fab fa-facebook"></i></a></li>
                            <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="pages/seeker/pet-search.html">Adopt a Pet</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <p class="copyright text-center">&copy; 2023 Pet Pal. All rights reserved.</p>
            </div>
        </footer>
    )
}