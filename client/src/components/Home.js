import React, { useEffect, useState, useRef } from 'react';
import '../style/Home.css'; // Import your CSS file for styling
import Modal from './Modal/EventModal';
import dayjs from 'dayjs';
import { Button, Popconfirm } from 'antd';
import { BsInfoCircleFill } from 'react-icons/bs';
import EventCards from './EventCards';
import { Container, Row, Col } from 'react-bootstrap';

export default function Home() {
    const numRows = 2;
    const numCols = 7 * Number(numRows);
    const eventContainerRef = useRef(null);
    const dateCellRefs = useRef(null);
    const [weekDays, setWeekDays] = useState([]);
    const [weekDates, setWeekDates] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [events, setEvents] = useState();

    useEffect(() => {
        generateWeekDates();
    }, []);

    useEffect(() => {
      }, [events]);
      
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
    const colorOptions = [
        { color: '#d62d20', priority: 'High', sort: 4 },
        { color: 'maroon', priority: 'Medium', sort: 3 },
        { color: 'cornflowerblue', priority: 'Low', sort: 2 },
        { color: 'forestgreen', priority: 'Very Low', sort: 1 },
    ];

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
                        <div>
                <Modal handleCalendarUpdate={handleCalendarUpdate} />
            </div>
            </div>
            <div className="calendar-container">
                <div className="row">
                    <div className="col">
                        <div className="days-row">
                            {weekDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={day === dayjs().format('dddd') ? 'day-cell current' : 'day-cell'}
                                    style={{fontWeight: 300, fontSize: 14}}
                                    >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="date-row">
                            {events && weekDates.slice(0, 7).map((date, index) => {
                                const eventsForDate = events.filter(
                                    (event) => new Date(event.date).getDate() === date.getDate()
                                );
                                return (
                                    <div key={index}
                                        className={date.getDate() === new Date().getDate() ? 'date-cell current' : 'date-cell'}
                                        ref={dateCellRefs}>
                                        <div className="date">
                                            {date.getDate() === new Date().getDate() ? 'Today' : date.getDate()}
                                        </div>
                                        <div 
                                            className="event-container"
                                            ref={eventContainerRef}
                                            >
                                            {eventsForDate.map((event, eventIndex) => (
                                                <div 
                                                key={eventIndex} 
                                                className='event-cards'
                                                >
                                                    <EventCards key={eventIndex} event={event} colorOptions={colorOptions} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="date-row last-child">
                            {events && weekDates.slice(7).map((date, index) => {
                                const eventsForDate = events.filter(
                                    (event) => new Date(event.date).getDate() === date.getDate()
                                );
                                return (
                                    <div key={index}
                                        className='date-cell'>
                                        <div className="date">{date.getDate()}</div>
                                        <div className="event-container">
                                            {eventsForDate.map((event, eventIndex) => (
                                                <EventCards key={eventIndex} event={event} colorOptions={colorOptions} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}