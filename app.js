const express = require("express");
const app = express();
const globalErrorHandler = require("./controllers/errorController");
app.use(globalErrorHandler);
const Notifier = require("./classes/Notifier");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login(process.env.DISCORD_BOT_TOKEN);
client.on("ready", () => {
  const notifier = new Notifier(client);
  notifier.createChannelIfNotPresent();
  notifier.onMessage();
  setInterval(() => {
    notifier.createChannelIfNotPresent();
  }, 1000 * 10);
  notifier.getChannelsToNotify();
  setInterval(() => {
    notifier.broadcastContestDetails();
  }, 1000 * 60);
});

module.exports = app;
