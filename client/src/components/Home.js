import React, { useEffect, useState } from 'react';
import '../style/Home.css'; // Import your CSS file for styling
// import jwt from 'jsonwebtoken';
import Modal from './Modal/EventModal';
import dayjs from 'dayjs';
import { Card } from 'antd';

export default function Home() {
    const numRows = 2;
    const numCols = 7 * Number(numRows);

    const [weekDays, setWeekDays] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [events, setEvents] = useState();

    useEffect(() => {
        generateWeekDates();
    }, []);

    function generateWeekDates() {
        const weekDates = [];
        const weekDays = [];
        const currentDate = new Date();
        for (let i = 0; i < numCols; i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + i
            );
            if (i < 7) {
                const day = date.toLocaleString('default', { weekday: 'long' });
                weekDays.push(day);
                setWeekDays(weekDays);
            }
            weekDates.push(date);
        }
        setWeekDates(weekDates);
        updateCalendarEvents(dayjs(weekDates[0]).format('YYYY-MM-DD'), dayjs(weekDates[weekDates.length - 1]).format('YYYY-MM-DD'));
    }

    const handleCalendarUpdate = (e) => {
        // e.preventDefault();
        if (e) {
            updateCalendarEvents(startDate, endDate);
        }
    };

    async function updateCalendarEvents(startDate, endDate) {
        setStartDate(startDate);
        setEndDate(endDate);
        let calendarEvents;
        try {
            const response = await fetch('http://localhost:8080/api/getEvents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: "64a1ed3a74a5f3820060e9d0",
                })
            });
            const data = await response.json();
            if (data.status === "ok") {
                console.log("Successfully fetched events");
                calendarEvents = data.events;
            }
        } catch (error) {
            console.log("Failed to fetch events");
            console.log(error);
        }
        const event = [];
        for (const date in calendarEvents) {
            const eventDate = dayjs(date).format('YYYY-MM-DD');
            if (eventDate >= startDate && eventDate <= endDate) {
                for (let i = 0; i < calendarEvents[date].length; i++) {
                    const eventDetails = calendarEvents[date][i];
                    event.push(eventDetails);
                }
            }
        }
        setEvents(event);
    }
    console.log(new Date(startDate).toLocaleString('default', { month: 'long' }), endDate)
    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2 className='month-header'>
                    {new Date(startDate).toLocaleString('default', { month: 'long' }) === new Date(endDate).toLocaleString('default', { month: 'long' }) 
                    ? new Date(startDate).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      }) : 
                    new Date(startDate).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      }) - new Date(endDate).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      })}</h2>
                <div className="modal">
                    <Modal handleCalendarUpdate={handleCalendarUpdate} />
                </div>
            </div>
            <div className="calendar-grid">
                {weekDays.map((day, index) => (
                    <div key={index} className={day === dayjs().format('dddd') ? 'calendar-day current' : 'calendar-day'}>
                        {day}
                    </div>
                ))}
                {events &&
                    weekDates.map((date, index) => {
                        const eventsForDate = events.filter(
                            (event) => new Date(event.date).getDate() === date.getDate()
                        );
                        return (
                            <div
                                key={index}
                                className={
                                    date.getDate() === new Date().getDate()
                                        ? 'calendar-date current'
                                        : 'calendar-date'
                                }
                            >
                                <div className="date">{date.getDate() === new Date().getDate() ? 'Today' : date.getDate()}</div>
                                <div className="event-container">
                                    {eventsForDate.map((event, eventIndex) => {
                                        const eventTime = new Date(event.date).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        });

                                        return (
                                            <Card key={eventIndex} className="event-card">
                                                <Card.Meta
                                                    title={event.eventName}
                                                    description={eventTime}
                                                    style={{ width: '100%' }}
                                                />
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

            </div>
        </div>
    );
}