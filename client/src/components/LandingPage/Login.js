import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from '../../redux/authReducer';
import React from "react";
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';


export default function Login({ handleRegistrationEvent}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };
    const success = () => {
        message.open({
            type: 'success',
            content: 'Successfully logged in!',
        });
    };
    
    function resetLogin() {
        setUsername("");
        setPassword("");
    }

    async function handleLogin(e) {
        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                success();
                setTimeout(() => {
                    dispatch(setAuth({auth: true, token: data.user, objectId: data.objectId}));
                }, 2500);
            }
            else {
                error("Invalid username or password");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="login-form body">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={handleLogin}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
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
                        Log In
                    </Button>
                    Or <a style={{textDecoration: "none"}}className="registration-link" onClick={() => handleRegistrationEvent()}>register now!</a>
                </Form.Item>
            </Form>
        </div> 
    )
}