const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Create a database connection pool
const dbClientPromise = db();
const JWT_KEY = 'key';

router.post('/api/register', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const document = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        };

        const existingUser = await dbClient
            .collection('userdata')
            .findOne({ username: req.body.username });

        if (existingUser) {
            return res.json({ status: 'error', error: 'User already exists' });
        }

        const result = await dbClient.collection('userdata').insertOne(document);
        if (result.insertedCount === 1) {
            const token = jwt.sign({
                _id: req.body.username
            }, JWT_KEY);
            return res.json({ status: 'ok', user: token, objectId: result.insertedId });
        } else {
            return res.json({ status: 'error', error: 'Failed to insert user.' });
        }
    } catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/api/login', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const result = await dbClient.collection('userdata').findOne({
            username: req.body.username,
            password: req.body.password
        });
        if (result) {
            const token = jwt.sign({
                _id: req.body.username
            }, JWT_KEY);
            return res.json({ status: 'ok', user: token, objectId: result._id });
        } else {
            return res.json({ status: 'error', user: false });
        }
    } catch (err) {
        res.json({ status: 'error' });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const users = await dbClient.collection('userdata').find({}).toArray();
        res.json(users);
    } catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/api/addEvent', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { eventName, date, userId, key, priority, frequency } = req.body;
        const newEvent = {
            eventName: eventName,
            date: date,
            priority: priority,
            status: "pending",
            frequency: frequency,
        };

        // Extract the date from the date string
        const processDate = key.split(' ')[0];
        const startDate = new Date(date);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 4, startDate.getDate());
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        async function addToDatabase(date, newEvent) {
            try {
                await dbClient.collection('userdata').updateOne(
                    { _id: new ObjectId(userId) },
                    { $push: { [`events.${date}`]: newEvent } }
                );
            } catch (error) {
                throw error;
            }
        }

        if (frequency === 'none') {
            await addToDatabase(processDate, newEvent);
        } else if (frequency === "daily") {
            for (let i = 0; i < days; i++) {
                const newDate = new Date(startDate); 
                newDate.setDate(startDate.getDate() + i);
                newDate.setHours(startDate.getHours());
                newDate.setMinutes(startDate.getMinutes());
                newDate.setSeconds(startDate.getSeconds());
                newEvent.date = newDate;
                await addToDatabase(newDate.toISOString().split('T')[0], newEvent);
            }
        }
        else if (frequency === "biweekly") {
            for (let i = 0; i < days; i += 14) {
                const newDate = new Date(startDate); 
                newDate.setDate(startDate.getDate() + i);
                newDate.setHours(startDate.getHours());
                newDate.setMinutes(startDate.getMinutes());
                newDate.setSeconds(startDate.getSeconds());
                newEvent.date = newDate;
                await addToDatabase(newDate.toISOString().split('T')[0], newEvent);
            }
        }
        else if (frequency === "weekly") {
            for (let i = 0; i < days; i += 7) {
                const newDate = new Date(startDate);
                newDate.setDate(startDate.getDate() + i);
                newDate.setHours(startDate.getHours());
                newDate.setMinutes(startDate.getMinutes());
                newDate.setSeconds(startDate.getSeconds());
                newEvent.date = newDate;
                await addToDatabase(newDate.toISOString().split('T')[0], newEvent);
            }
        }        
        else if (frequency === "monthly") {
            for (let i = 0; i < days; i += 30) {
                const newDate = new Date(startDate);
                newDate.setDate(startDate.getDate() + i);
                newDate.setHours(startDate.getHours());
                newDate.setMinutes(startDate.getMinutes());
                newDate.setSeconds(startDate.getSeconds());
                newEvent.date = newDate;
                await addToDatabase(newDate.toISOString().split('T')[0], newEvent);
            }
        }

        res.json({ status: 'ok' });

    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: 'An error occurred.' });
    }
});


router.post('/api/getEvents', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { userId } = req.body;
        const result = await dbClient
            .collection('userdata')
            .findOne({ _id: new ObjectId(userId) });
        if (result) {
            res.json({ status: 'ok', events: result.events });
        } else {
            res.json({ status: 'error', events: false });
        }
    } catch (err) {
        res.json({ status: 'error' });
    }
});

router.get('/api/users/:id', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { id } = req.params;
        const user = await dbClient
            .collection('userdata')
            .findOne({ _id: ObjectId(id) });

        res.json(user);
    } catch (err) {
        res.json({ status: 'error' });
    }
});


router.delete('/api/deleteEvent', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { userId, key, priority, eventName, eventDate } = req.body;
        const result = await dbClient.collection('userdata').updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { [`events.${key}`]: { eventName: eventName, priority: priority, date: eventDate } } }
        );
        if (result.modifiedCount === 1) {
            res.json({ status: 'ok' });
        } else {
            res.json({ status: 'error', message: 'Failed to delete event.' });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: 'An error occurred.' });
    }
});

router.put('/api/updateEvent', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { userId, key, priority, eventName, eventDate, status } = req.body;
        const result = await dbClient.collection('userdata').updateOne(
            {
                _id: new ObjectId(userId),
                [`events.${key}.eventName`]: eventName,
                [`events.${key}.priority`]: priority,
                [`events.${key}.date`]: eventDate,
            },
            { $set: { [`events.${key}.$.status`]: status } },
        );
        if (result.modifiedCount === 1) {
            res.json({ status: 'ok' });
        }
        else {
            res.json({ status: 'error', message: 'Failed to update event.' });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', message: 'An error occurred.' });
    }
});

module.exports = router;
