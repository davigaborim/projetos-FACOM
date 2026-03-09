const express = require('express');
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors({
    origin: true,
    credentials: true, // IMPORTANTE para cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = {app, express};