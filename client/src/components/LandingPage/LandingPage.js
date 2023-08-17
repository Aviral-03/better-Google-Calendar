import React from "react";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import "../../style/LandingPage.css";

export default function App() {
    const [registerStatus, setRegisterStatus] = useState(false);

    function handleRegistrationEvent(event) {
        setRegisterStatus(!registerStatus);
    }

    return (
        <div className="App">
            <div className="landing-page">
                <div className="landing-page-body">
                    <div className="login-container">
                        <div className="login-container body">
                            <div className="login-container title">
                                <h1 className={registerStatus ? "registration-event active" : "registration-event"} style={{ color: "black", marginBottom: "20px" }}>
                                    {registerStatus ? "Welcome to RPM" : "Welcome Back!"}
                                </h1>
                                {/* <h5 style={{ fontWeight: 200, fontSize: "18px", width: "70%" }}>
                                    RPM offers students advanced trading and portfolio management features that allow them to focus their time on the portfolio design and management process
                                </h5> */}
                            </div>
                            <div className="login-container form">
                                {registerStatus ? <Register handleRegistrationEvent={handleRegistrationEvent} /> : <Login handleRegistrationEvent={handleRegistrationEvent} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}