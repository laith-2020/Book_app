'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');

const cors = require('cors');
const server = express();
server.use(cors());

server.use(express.static('./public'));
server.set('view engine', 'ejs');

//middle
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// http://localhost:3030/hello
server.get('/hello', (req, res) => {
    res.render('pages/index');
})

const PORT = process.env.PORT;

server.get('*', (req, res) => {
    res.status(404).send(`the rout dosn't exist `);
})

server.listen(PORT, (req, res) => {
    console.log(`lestening on port ${PORT}`);
});