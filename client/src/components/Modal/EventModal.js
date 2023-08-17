import React, { useState, useRef } from "react";
import { Button, Modal, Form, Input, DatePicker, Space } from "antd";
import dayjs from 'dayjs';
import '../../style/EventModal.css'

export default function EventModal({ handleCalendarUpdate }) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const formRef = useRef(null);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        const form = formRef.current;
        form.validateFields()
            .then((values) => {
                setConfirmLoading(true);
                setTimeout(() => {
                    form.resetFields();
                    setOpen(false);
                    setConfirmLoading(false);
                }, 2000);
                const formDetails = {
                    eventName: values.eventName,
                    date: values.date,
                    priority: selectedPriority,
                };
                processForm(formDetails);
            })
            .catch((info) => {
                console.log('Validate Failed:', info)
            });
        setSelectedColor(null);
    };

    const handleCancel = () => {
        const form = formRef.current;
        setOpen(false);
        form.resetFields();
        setSelectedColor(null);
    };

    async function processForm(formDetails) {
        try {
            const formattedDate = dayjs(formDetails.date).format('YYYY-MM-DD HH:mm A');
            const response = await fetch('http://localhost:8080/api/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: "64a1ed3a74a5f3820060e9d0",
                    key: formattedDate,
                    eventName: formDetails.eventName,
                    date: formDetails.date,
                    priority: formDetails.priority,
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                console.log("Successfully added event");
                handleCalendarUpdate(true);
            } else {
                console.log("Failed to add event");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const colorOptions = [
        { color: 'red', priority: 'High', sort: 4 },
        { color: 'maroon', priority: 'Medium', sort: 3 },
        { color: 'cornflowerblue', priority: 'Low', sort: 2 },
        { color: 'forestgreen', priority: 'Very Low', sort: 1 },
    ];

    const handleColorSelect = (color, sort) => {
        setSelectedColor(color);
        setSelectedPriority(sort);
    };
    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Open Modal with async logic
            </Button>
            <Modal
                title="Add a new event"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form ref={formRef} name="complex-form">
                    <Form.Item
                        label="Event Name"
                        name="eventName"
                        rules={[
                            {
                                required: true,
                                message: 'Event Name is required',
                            },
                        ]}
                    >
                        <Input style={{ width: 160 }} placeholder="Please input" />
                    </Form.Item>
                    <Form.Item
                        className="color-picker"
                        name="priority"
                        label="Select Color">
                        <Space.Compact>
                            {colorOptions.map((option) => (
                                <div
                                    className={`priority-button ${selectedColor === option.color ? 'selected' : ''}`}
                                    key={option.color}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: '50%',
                                        backgroundColor: option.color,
                                        display: 'inline-block',
                                        cursor: 'pointer',

                                        border: selectedColor === option.color ? `2px solid ${option.color}` : 'none',
                                        transform: selectedColor === option.color ? 'scale(1.2)' : 'none',
                                        transition: 'transform 0.2s',
                                    }}
                                    onClick={() => handleColorSelect(option.color, option.sort)}
                                    title={option.priority}
                                />
                                
                            ))}
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Select Date"
                        rules={[
                            {
                                required: true,
                                message: 'Date is required',
                            },
                        ]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm A" use12Hours minuteStep={15} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
