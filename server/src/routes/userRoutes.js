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
        res.json({ status: 'ok' });
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
            return res.json({ status: 'ok', user: token });
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
        // console.log(users);
        res.json(users);
    } catch (err) {
        res.json({ status: 'error' });
    }
});

router.post('/api/addEvent', async (req, res) => {
    try {
        const dbClient = await dbClientPromise;
        const { eventName, date, userId, key } = req.body;
        const newEvent = {
            eventName: eventName,
            date: date
        };
        // Extract the date from the date string
        const processDate = key.split(' ')[0];
        const result = await dbClient.collection('userdata').updateOne(
            { _id: new ObjectId(userId) },
            { $push: { [`events.${processDate}`]: newEvent } }
        );

        if (result.modifiedCount === 1) {
            res.json({ status: 'ok' });
        } else {
            res.json({ status: 'error', message: 'Failed to insert event.' });
        }
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

module.exports = router;
