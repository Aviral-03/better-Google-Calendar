import React from "react";


export default function GridLayout() {
    return (
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
    )
}