const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

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

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  // AUTO-THREAD FOR THREE CHANNELS
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
  // END AUTO-THREAD SECTION

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
      "oh tapos ano tapos magiging friends tayo tapos magkakagusto ka saken tapos magugustuhan din kita tapos hindi tayo aamin sa isa't isa Kahit tinutukso na tayo ng friends natin tapos magiinuman kayo ng friends mo tapos magda drunk chat ka sasabihin mo gusto mo ako at mahal mo na tapos sasabihin ko mahal na rin kita tapos magiging tayo tapos kalaunan magkakatampuhan tayo tapos susuyuin kita then at some point susuyuin mo ko tapos mapapagod ka tapos iiwan mo ko tapos hahabulin kita tapos babalik ka ulit tapos mag aaway ulit tapos pag nabuntis ako aalis ka tapos pag malaki na ang anak natin sasabihin mo pasensya na at hindi ka lang handa sa responsibilidad, wag na lang."
    ];

    const pick = replies[Math.floor(Math.random() * replies.length)];
    message.reply(pick);
  }

  if (message.content.toLowerCase().includes("i miss you")) {
    message.reply("i miss you too");
  }

  // VOUCH SYSTEM
const vouchChannel = "1473361996689707204";

if (message.channel.id === vouchChannel && !message.author.bot) {
    const lower = message.content.toLowerCase();

    if (lower.startsWith("a!vouch")) {
        const user = message.author;

        // Remove the command part
        const raw = message.content.slice("a!vouch".length).trim();

        // Split into item + feedback
        const parts = raw.split(" ");
        const item = parts.shift() || "Unknown item";
        const feedback = parts.join(" ") || "No feedback provided.";

        const attachment = message.attachments.first();

        if (!raw && !attachment) {
            return message.reply("Please include your item + feedback or an attachment.");
        }

        await message.delete().catch(() => {});

        const embed = new EmbedBuilder()
            .setColor("#A3E4D7")
            .setDescription(
`**<@${user.id}> claimed *${item}* successfully!**

**Feedback:** Thank you <@Shorekeeper> for the *${feedback}*.

┈┈┈┈┈┈┈
**Item:** ${item}
**Handled by:** <@Shorekeeper>
**Date:** <t:${Math.floor(Date.now() / 1000)}:F>
┈┈┈┈┈┈┈

-# Thank you for trusting our shop! ♡`
            );

        if (attachment) {
            embed.setImage(attachment.url);
        }

        const channel = message.guild.channels.cache.get(vouchChannel);
        if (channel) {
            channel.send({ embeds: [embed] });
        }
    }
}
});

client.login(process.env.DISCORD_TOKEN);