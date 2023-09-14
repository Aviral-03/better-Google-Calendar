import React from "react";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import "../../style/LandingPage.css";
import TitleDisplay from "./titleDisplay";

export default function App() {
    const [registerStatus, setRegisterStatus] = useState(false);

    function handleRegistrationEvent(event) {
        setRegisterStatus(!registerStatus);
    }


    return (
        <div className="App">
          <div className="landing-page">
            <div className="login-container header">
              <h1 className="name" style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1" }}>
                <TitleDisplay />
                {/* Unclusterd */}
              </h1>
            </div>
            <div className="landing-page-body">
              <div className="login-container">
                <div className="login-container body">
                  <div className="login-container title">
                    <h1 className={registerStatus ? "registration-event active" : "registration-event"} style={{ color: "black", marginBottom: "20px" }}>
                      {registerStatus ? "Welcome to RPM" : "Welcome Back!"}
                    </h1>
                  </div>
                  <div className="login-container form" style={{ position: "relative", zIndex: "2" }}>
                    {registerStatus ? <Register handleRegistrationEvent={handleRegistrationEvent} /> : <Login handleRegistrationEvent={handleRegistrationEvent} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );      
}