const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("Bot is online");
});

client.login(process.env.DISCORD_TOKEN);
client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (message.content === "ping") {
    message.reply("pong");
  }
});