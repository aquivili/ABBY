const {
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");
const { addVouch, getVouchesForUser } = require("./vouchStore");
const { buildVouchEmbed } = require("./vouchEmbed");

const commands = [
  new SlashCommandBuilder()
    .setName("vouch")
    .setDescription("Submit a vouch")
    .addIntegerOption(option =>
      option
        .setName("rating")
        .setDescription("Rating from 1 to 5")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addStringOption(option =>
      option
        .setName("description")
        .setDescription("Describe your experience")
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option
        .setName("image")
        .setDescription("Optional image")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("vouches")
    .setDescription("Show vouch count for a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to check")
        .setRequired(false)
    )
].map(c => c.toJSON());

async function registerVouchCommands() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;

  if (!token || !clientId) {
    console.error("Missing DISCORD_TOKEN or CLIENT_ID");
    return;
  }

  try {
    const rest = new REST({ version: "10" }).setToken(token);
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("Vouch slash commands registered");
  } catch (err) {
    console.error("Failed to register vouch commands", err);
  }
}

async function handleVouchInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const vouchChannelId = process.env.VOUCH_CHANNEL_ID;
  const guild = interaction.guild;

  if (interaction.commandName === "vouch") {
    if (!vouchChannelId) {
      await interaction.reply({
        content: "Vouch channel is not configured",
        ephemeral: true
      });
      return;
    }

    const vouchChannel = guild.channels.cache.get(vouchChannelId);
    if (!vouchChannel) {
      await interaction.reply({
        content: "Vouch channel not found",
        ephemeral: true
      });
      return;
    }

    const user = interaction.user;
    const rating = interaction.options.getInteger("rating");
    const description = interaction.options.getString("description");
    const attachment = interaction.options.getAttachment("image");

    const imageUrl =
      attachment &&
      attachment.contentType &&
      attachment.contentType.startsWith("image")
        ? attachment.url
        : null;

    addVouch(user.id, rating, description, imageUrl);

    const embed = buildVouchEmbed(user, rating, description, imageUrl);

    await vouchChannel.send({ embeds: [embed] });
    await interaction.reply({
      content: "Your vouch has been submitted",
      ephemeral: true
    });
  }

  if (interaction.commandName === "vouches") {
    const target = interaction.options.getUser("user") || interaction.user;
    const vouches = getVouchesForUser(target.id);
    const count = vouches.length;

    await interaction.reply({
      content: `${target.username} has ${count} vouch entries`,
      ephemeral: true
    });
  }
}

module.exports = {
  registerVouchCommands,
  handleVouchInteraction
};