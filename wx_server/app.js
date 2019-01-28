const express = require('express');
const bodyParser = require('body-parser');

let server = new express();

server.listen(8080)

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));


const login = require('./route/login')
server.use('/api',login)