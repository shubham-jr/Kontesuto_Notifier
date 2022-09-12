const { Client, GatewayIntentBits } = require("discord.js");
const Notifier = require("./../classes/Notifier");
class DiscordClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.notifier = {};
  }
  getNotifier() {
    this.notifier = new Notifier(this);
  }
  clientLogin() {
    this.getNotifier();
    this.login(process.env.DISCORD_BOT_TOKEN);
  }
  onReady() {
    this.on("ready", () => {
      this.notifier.createChannelIfNotPresent();

      setInterval(() => {
        this.notifier.createChannelIfNotPresent();
        this.notifier.getChannelsToNotify();
      }, process.env.GET_CHANNEL_CHECK_TIME);

      setInterval(() => {
        this.notifier.broadcastContestDetails();
        console.log(new Date(Date.now()).toString());
      }, process.env.BROADCAST_TIME);
    });
  }

  onMessage() {
    this.notifier.onMessage();
  }
}

module.exports = DiscordClient;
