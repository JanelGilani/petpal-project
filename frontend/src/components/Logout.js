import React, { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { RiLogoutBoxLine } from 'react-icons/ri';
import { setAuth } from "../redux/authReducer"
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setAuth({ auth: false, token: "", objectId: "", userId: "" }));
        navigate("/home");
    }, [dispatch, navigate]);

}