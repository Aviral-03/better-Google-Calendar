import React from "react";
import { Popconfirm } from "antd";
import { useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

export default function EventCards({ event, colorOptions }) {

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

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
            icon={<BsInfoCircleFill style={{ color: 'red' }} />}
        >
            <button
                className="card event-card"
                style={{
                    backgroundColor: colorOptions.find(
                        (color) => color.sort === event.priority
                    )?.color,
                    width: '100%',
                }}
                onClick={() => {
                    showPopconfirm();
                }}
            >
                <div className="card-body event-card-body">
                    <span className="card-time">{eventTime}</span>
                    <span className="card-event">{event.eventName}</span>
                </div>
            </button>
        </Popconfirm>
    );
};
