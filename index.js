const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas');
const path = require('path');


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
const command = require(./commands/${file});
client.commands.set(command.name, command);
}


client.on("ready", () => {
console.log("Bot is online");
});


// Helper function to generate booster image
async function generateBoosterImage(user) {
const templatePath = path.join(__dirname, 'boost.png');
const canvas = createCanvas(400, 200); // Adjust size according to your template
const ctx = canvas.getContext('2d');


// Load and draw the template
const template = await loadImage(templatePath);
ctx.drawImage(template, 0, 0, canvas.width, canvas.height);


// Load user's avatar
const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 128 });
const avatar = await loadImage(avatarUrl);


// Draw avatar as a circle
const avatarX = 20;
const avatarY = 20;
const avatarSize = 128;


ctx.save();
ctx.beginPath();
ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
ctx.closePath();
ctx.clip();
ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
ctx.restore();


// Draw username text
ctx.font = '28px Sans-serif';
ctx.fillStyle = '#FFFFFF'; // White color, change if needed
ctx.fillText(user.username, avatarX + avatarSize + 20, avatarY + avatarSize / 2 + 10);


// Return image buffer to send as file
return canvas.toBuffer();
}


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