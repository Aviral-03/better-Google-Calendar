import React from "react";
import { Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import "../../style/EventCards.css";

export default function EventCards({ event, colorOptions }) {
    const [open, setOpen] = useState("pending");
    const objectId = useSelector((state) => state.auth.objectId);
    const [taskStatus, setTaskStatus] = useState(event.status);
    const eventTime = new Date(event.date).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });
    const [messageApi, contextHolder] = message.useMessage();

    const error = (err) => {
        message.open({
            type: 'error',
            content: err,
        });
    };

    const success = (succ) => {
        message.open({
            type: 'success',
            content: succ,
        });
    };

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setTaskStatus('complete');
        const formattedDate = dayjs(event.date).format('YYYY-MM-DD');
        try {
            const response = fetch(`${process.env.REACT_APP_SERVER_URL}/api/updateEvent`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: objectId,
                    key: formattedDate,
                    priority: event.priority,
                    eventName: event.eventName,
                    eventDate: event.date,
                    status: 'complete'
                })
            });
            if (response.status === 200) {
                success("Congratulations! You've completed a task!");
                setInterval(() => {
                    window.location.reload();
                }, 1500);
            }
        }
        catch (error) {
            error(error);
        }
    };

    async function deleteEvent() {
        const formattedDate = dayjs(event.date).format('YYYY-MM-DD');
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/deleteEvent`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: objectId,
                    key: formattedDate,
                    priority: event.priority,
                    eventName: event.eventName,
                    eventDate: event.date,
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                success("Successfully deleted event");
                setInterval(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            error(error);
        }
    };

    return (
        <Popconfirm
            placement="right"
            title="Text"
            description="Description"
            onConfirm={handleOk}
            okText="Completed"
            cancelText="Delete"
            onCancel={() => deleteEvent()}
            icon={<BsInfoCircleFill style={{ color: 'red' }} />}
            cancelButtonProps={{ danger: true }}
            okButtonProps={{disabled: taskStatus === 'complete' ? true : false}}
        >
            <button
                className="card event-card-button"
                style={{
                    backgroundColor: taskStatus  === 'complete' ? "lightgrey" : colorOptions.find(
                        (color) => color.sort === event.priority
                    )?.color,
                }}
                onClick={() => {
                    showPopconfirm();
                }}
            >
                <div className="card-body button-body">
                    <span className="event-text">
                        <span style={{ 
                            fontWeight: 600, 
                            marginRight: "5px",
                            textDecoration: taskStatus === 'complete' ? "line-through" : ""
                            }}>{eventTime} </span>
                        <span style={{ 
                            fontWeight: 400,
                            textDecoration: taskStatus === 'complete' ? "line-through" : ""
                            }}>{event.eventName}</span>
                    </span>
                </div>
            </button>
        </Popconfirm>
    )
};
