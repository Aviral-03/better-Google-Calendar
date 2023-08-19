import React from "react";
import { useDispatch } from 'react-redux'
import { RiLogoutBoxLine } from 'react-icons/ri';
import { setAuth } from "../redux/authReducer"
import { useNavigate } from "react-router-dom";
import '../../src/style/LandingPage.css'

export default function Logout() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const onButtonClick = (e) => {
        e.preventDefault();
        dispatch(setAuth({auth: false, token: ""}));
        navigate('/');
    }
    return (
        <div className="logout">
            <RiLogoutBoxLine onClick={onButtonClick}/>
        </div>
    )
}