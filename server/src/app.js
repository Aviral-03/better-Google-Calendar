// aviral04
// 0K5Ea5YQjOy8edYb

const express = require('express');
const cors = require('cors');
const loadEnvironment = require('../loadEnvironment.js')

// Routes
const userRoutes = require('./routes/userRoutes.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}
);