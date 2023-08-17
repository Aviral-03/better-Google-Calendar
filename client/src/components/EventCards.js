import React from "react";
import { Popconfirm } from "antd";
import { useState, useEffect } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

export default function EventCards({ event, colorOptions }) {

    const [open, setOpen] = useState(false);

    const eventTime = new Date(event.date).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        console.log('OK');
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            placement="right"
            title="Text"
            description="Description"
            onConfirm={handleOk}
            okText="Completed"
            cancelText="Cancel"
            onCancel={handleCancel}
            icon={<BsInfoCircleFill style={{ color: 'red' }} />}
        >
            <button
                className="card event-card-button"
                style={{
                    backgroundColor: colorOptions.find(
                        (color) => color.sort === event.priority
                    )?.color,
                    // transform: cardTransform,
                }}  
                onClick={() => {
                    showPopconfirm();
                }}
            >
                <div className="card-body button-body">
                    <span className="event-time">{eventTime}</span>
                    <span className="event-text">{event.eventName}</span>
                </div>
            </button>
        </Popconfirm>
    );
};
