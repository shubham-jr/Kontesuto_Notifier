const express = require("express");
const app = express();

const globalErrorHandler = require("./controllers/errorController");
app.use(globalErrorHandler);

const Client = require("./classes/Client");
const client = new Client();

client.clientLogin();
client.onReady();
client.onMessage();

// 1018371881734258758
// 1018363753332482138
// 1018362747072807024

// https://discord.com/oauth2/authorize?client_id=1018735270612439122&scope=bot&permissions=1

module.exports = app;
