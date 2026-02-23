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

client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("pong");
  }

  if (message.content.startsWith("a!pick")) {
    const parts = message.content.replace("a!pick", "").trim().split("|");
    if (parts.length < 2) {
      return message.reply("give me at least two choices separated by |");
    }
    const choice = parts[Math.floor(Math.random() * parts.length)].trim();
    message.reply(choice);
  }

  if (message.content.toLowerCase().includes("i miss you")) {
    message.reply("i miss you too");
  }
});

client.login(process.env.DISCORD_TOKEN);