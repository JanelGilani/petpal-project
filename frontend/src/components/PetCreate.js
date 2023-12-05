import React from "react";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import '../styles/pet-create.css';
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import Error from "./404.js";

const { Option } = Select;

export default function PetCreate() {
    const auth = useSelector((state) => state.auth);
    // const history = useHistory();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!auth.authenticated) {
            return <Error error={401} />;
        }
    }
    , [auth]);
    const onFinish = async (values) => {
        // console.log(values);
        try {
            const response = await fetch(`http://localhost:8000/pets/create/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${auth.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });
            const data = await response.json();
            if (response.status !== 201) {
                <Error error={response.status} />;
            } else {
                message.success('Pet created successfully!');
                // history.push(`/pet/${data.id}`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const normFile = (e) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div class="content">
            <NavBar />
            <div class="container mt-4">
                <div class="row">
                    <div class="col-lg-7">
                        <form class="adoption-form">
                            <p style={{fontSize: "30px", fontWeight: "bold"}}>Pet Creation</p>
                            <div class="form-group">
                                <label for="name">Pet Name</label>
                                <input class="form-control" id="name" name="name" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="desc">Description of the Pet</label>
                                <input class="form-control" id="desc" name="desc" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="breed">Breed</label>
                                <input class="form-control" id="breed" name="breed" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="age">Age</label>
                                <input class="form-control" id="age" name="age" required type="number"/>
                            </div>
                            <div class="form-group">
                                <label for="size">Size</label>
                                <input class="form-control" id="size" name="size" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="chars">Characteristic</label>
                                <input class="form-control" id="chars" name="chars" required type="email"/>
                            </div>
                            <div class="form-group">
                                <label for="train">House-trained?</label>
                                <input class="form-control" id="train" name="train" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="health">Health</label>
                                <input class="form-control" id="health" name="health" required type="text"/>
                            </div>
                            <div class="form-group">
                                <label for="fee">Adoption Fee (in $)</label>
                                <input class="form-control" id="fee" name="fee" required type="number"/>
                            </div>

                            <a class="btn btn-primary" type="submit" href="../../error.html">Register Pet</a>
                        </form>
                    </div>
                    <div class="col-lg-1">

                    </div>
                    <div class="col-lg-4">
                        {/* <img alt="Cute Dog" class="pic" src="../../images/doggy.jpg"> */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}