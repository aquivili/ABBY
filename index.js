const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// load commands
client.commands = new Map();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Bot is online");
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const prefix = "a!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) return command.execute(message, args);

  if (message.content === "a!ping") return message.reply("pong");

  if (message.content.startsWith("a!pick")) {
    const parts = message.content.replace("a!pick", "").trim().split("|");
    if (parts.length < 2) return message.reply("give me at least two choices separated by |");
    const choice = parts[Math.floor(Math.random() * parts.length)].trim();
    return message.reply(choice);
  }

  if (message.content.startsWith("a!embed ")) {
    const content = message.content.slice("a!embed ".length);
    const embed = new EmbedBuilder().setDescription(content).setColor("#5865F2");
    return message.channel.send({ embeds: [embed] });
  }

  if (
    message.content.toLowerCase().includes("i love you") ||
    message.content.toLowerCase().includes("love you") ||
    message.content.toLowerCase().includes("abby")
  ) {
    const replies = [
      "may gf na ako",
      "friends lang talaga",
      "sorry may mahal na akong iba",
      "palibhasa kasi alam mo kung pano ako kunin eh",
      "sorry may asawa na ako may anak na kame",
      "oh tapos ano tapos magiging friends tayo tapos magkakagusto ka saken tapos magugustuhan din kita tapos hindi tayo aamin sa isa't isa Kahit tinutukso na tayo ng friends natin tapos magiinuman kayo ng friends mo tapos magda drunk chat ka sasabihin mo gusto mo ako at mahal mo na tapos sasabihin ko mahal na rin kita tapos magiging tayo tapos kalaunan magkakatampuhan tayo tapos susuyuin kita then at some point susuyuin mo ko tapos mapapagod ka tapos iiwan mo ko tapos hahabulin kita tapos babalik ka ulit tapos mag aaway ulit tapos pag nabuntis ako aalis ka tapos pag malaki na ang anak natin sasabihin mo pasensya na at hindi ka lang handa sa responsibilidad, wag na lang."
    ];
    const pick = replies[Math.floor(Math.random() * replies.length)];
    return message.reply(pick);
  }

  if (message.content.toLowerCase().includes("i miss you")) {
    return message.reply("i miss you too");
  }
});

client.login(process.env.DISCORD_TOKEN);