import { useState, useEffect } from "react";
import React from "react";
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import "../../style/LandingPage.css";

export default function Register({handleRegistrationEvent}) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'User registered',
        });
    };

    function resetRegistration() {
        setUsername("");
        setPassword("");
    }

    useEffect(() => {
        showUsers();
    }, []);

    async function showUsers() {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            const data = await response.json();
            // console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRegistration(e) {
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                success();
                window.location.href = "/home";
            }
            else {
                error("User already Exist");
            }
        } catch (error) {
            console.log(error);
        }
        resetRegistration();
    }
    return (
        <div className="register-form body">
            {contextHolder}
            <Form
                name="normal_login"
                className="normal-login"
                initialValues={{
                    remember: true,
                }}
                onFinish={handleRegistration}
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Name!',
                        },
                        {
                            min: 6,
                            message: 'Name must be at least 6 characters long'
                        }
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        {
                            min: 6,
                            message: 'Username must be at least 6 characters long'
                        }
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        {
                            min: 6,
                            message: 'Password must be at least 6 characters long'
                        }
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button style={{ width: "100%", marginBottom: "0.5rem" }} type="primary" htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                    Or <a style={{textDecoration: "none"}} className="registration-link" onClick={() => handleRegistrationEvent()}>login now!</a>
                </Form.Item>
            </Form>
        </div>
    )
}