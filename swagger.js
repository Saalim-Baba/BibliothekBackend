const swaggerAutogen = require('swagger-autogen')();

const doc = {
info: {
title: 'My API',
description: 'Description'
},
host: 'localhost:3000'
};

const outputFile = './Aufgaben 5/swagger-output.json';
const routes = ['./Aufgaben 5/bibliothek.js'];

swaggerAutogen(outputFile, routes, doc);