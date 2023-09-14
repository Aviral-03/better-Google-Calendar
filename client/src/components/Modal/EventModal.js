import React, { useState, useRef } from "react";
import { Button, Modal, Form, Input, DatePicker, Space, Select } from "antd";
import dayjs from 'dayjs';
import '../../style/EventModal.css'
import { PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

export default function EventModal({ handleCalendarUpdate }) {
    const objectId = useSelector((state) => state.auth.objectId);
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
                    priority: selectedPriority, // Use selectedPriority here
                    frequency: values.frequency,
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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/addEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: objectId,
                    key: formattedDate,
                    eventName: formDetails.eventName,
                    date: formDetails.date,
                    priority: formDetails.priority,
                    status: "pending",
                    frequency: formDetails.frequency,
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
            <Button
                type="dashed"
                onClick={showModal}
                className="add-event-button"
                style={{ marginRight: "15px" }}
                icon={<PlusCircleOutlined />}>
                Add a new Event
            </Button>
            <Modal
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form ref={formRef} name="complex-form" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                    <Form.Item
                        name="eventName"
                        rules={[
                            {
                                required: true,
                                message: 'Event Name is required',
                            },
                        ]}
                    >
                        <Input size="large" style={{height: "auto", fontSize: "20px", width: "450px"}} placeholder="Add your Title" bordered={false} />
                    </Form.Item>
                    <Form.Item
                        className="color-picker"
                        name="priority"
                        label="Select Color"
                    >
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
                        label="Start Date"
                        rules={[
                            {
                                required: true,
                                message: 'Date is required',
                            },
                        ]}
                    >
                        <DatePicker className="form-input" showTime format="YYYY-MM-DD HH:mm A" use12Hours minuteStep={15} />
                    </Form.Item>
                    <Form.Item
                        name="frequency"
                        label="Frequency"
                    >
                        <Select className="form-input" style={{ width: 120 }}>
                            <Select.Option value="none">None</Select.Option>
                            <Select.Option value="daily">Daily</Select.Option>
                            <Select.Option value="weekly">Weekly</Select.Option>
                            <Select.Option value="biweekly">Biweekly</Select.Option>
                            <Select.Option value="monthly">Monthly</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>

            </Modal>
        </div>
    );
};
