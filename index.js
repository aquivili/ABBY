const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Collection,
  REST,
  Routes
} = require("discord.js");
const fs = require("fs");
const statusButtons = require("./interactions/statusButtons.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers // ⭐ REQUIRED FOR BLOOMBEARER MENTIONS
  ]
});

// ⭐ REQUIRED: load ALL members (offline + online)
client.on("ready", () => {
  client.guilds.cache.forEach(guild => guild.members.fetch());
  console.log("Bot is online");
});

// load slash commands
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const commandFile = require(`./commands/${file}`);

  // support multiple commands in one file
  if (Array.isArray(commandFile.data)) {
    for (const cmd of commandFile.data) {
      client.commands.set(cmd.name, {
        data: cmd,
        execute: commandFile.execute
      });
    }
  } else {
    client.commands.set(commandFile.data.name, commandFile);
  }
}

client.on("ready", async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: client.commands.map(cmd => cmd.data.toJSON()) }
  );

  console.log("Slash commands registered");
});

// handle slash commands
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
  }

  if (interaction.isButton()) {
    if (statusButtons.customIds.includes(interaction.customId)) {
      return statusButtons.execute(interaction);
    }
  }
});

// your original messageCreate stays exactly the same
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // CATEGORY: STICKY AUTO-REFRESH
  const stickyFile = './sticky.json';

  function loadSticky() {
    if (!fs.existsSync(stickyFile)) return {};
    return JSON.parse(fs.readFileSync(stickyFile, 'utf8'));
  }

  const stickies = loadSticky();
  const channelId = message.channel.id;

  if (stickies[channelId]) {
    try {
      message.channel.messages.fetch(stickies[channelId].messageId)
        .then(m => m.delete())
        .catch(() => {});

      const embed = new EmbedBuilder()
        .setColor('#ffffff')
        .setDescription(stickies[channelId].text)
        .setTimestamp();

      message.channel.send({ embeds: [embed] }).then(newMsg => {
        stickies[channelId].messageId = newMsg.id;
        fs.writeFileSync(stickyFile, JSON.stringify(stickies, null, 2));
      });
    } catch {}
  }

  const autoThreadChannels = [
    "1475756752136966204",
    "1453055255557439601",
    "1453053634282651830"
  ];

  if (autoThreadChannels.includes(message.channel.id)) {
    try {
      const thread = await message.startThread({
        name: `${message.author.username}-thread`,
        autoArchiveDuration: 60
      });

      await thread.send(`Thread created for ${message.author.username}.`);
    } catch (err) {
      console.error("Thread creation failed:", err);
    }
  }

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

  if (message.content.startsWith("a!embed ")) {
    const content = message.content.slice("a!embed ".length);

    const embed = new EmbedBuilder()
      .setDescription(content)
      .setColor("#5865F2");

    message.channel.send({ embeds: [embed] });
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
      "hawak mo ang beat hawak mo ang beat hawak mo ang beat hawak mo ang beat dubai chewy cookie ano tara ilocos empanada ano tara scramble ng tomboy isang araw nagmamaneho ako sa laguna pipipeeppeep dubidubidapdap maglaro tayo maglarue gagayahin mo ako tentenentenentententen",
      "ilocos empanada, dubai chewy cookies, dokito burger, i miss my baby",
      "goodness gracious! ikaw 'yung nag shoplift~ you're the one caught stealing on cctv  oh my god, no way! cannot take this anymore, no way!! my twin brother is a criminal. 'yan ang 'di ko matatanggap at tawagin mo 'kong— criminal? BROTHER!",
      "oh tapos ano tapos magiging friends tayo tapos magkakagusto ka saken tapos magugustuhan din kita tapos hindi tayo aamin sa isa't isa Kahit tinutukso na tayo ng friends natin tapos magiinuman kayo ng friends mo tapos magda drunk chat ka sasabihin mo gusto mo ako at mahal mo na tapos sasabihin ko mahal na rin kita tapos magiging tayo tapos kalaunan magkakatampuhan tayo tapos susuyuin kita then at some point susuyuin mo ko tapos mapapagod ka tapos iiwan mo ko tapos hahabulin kita tapos babalik ka ulit tapos mag aaway ulit tapos pag nabuntis ako aalis ka tapos pag malaki na ang anak natin sasabihin mo pasensya na at hindi ka lang handa sa responsibilidad, wag na lang."
    ];

    const pick = replies[Math.floor(Math.random() * replies.length)];
    message.reply(pick);
  }

  if (message.content.toLowerCase().includes("i miss you")) {
    message.reply("i miss you too");
  }
});

client.login(process.env.DISCORD_TOKEN);