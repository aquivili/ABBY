const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("v")
    .setDescription("Submit a vouch with stars, message, and proof")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Who are you vouching for?")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("stars")
        .setDescription("Star rating (1–5)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addStringOption(option =>
      option.setName("message")
        .setDescription("Your vouch message")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName("proof")
        .setDescription("Proof image or file")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const stars = interaction.options.getInteger("stars");
    const message = interaction.options.getString("message");
    const proof = interaction.options.getAttachment("proof");

    const embed = new EmbedBuilder()
      .setColor("#A3E4D7")
      .setTitle(`Vouch for ${target.username}`)
      .addFields(
        { name: "Stars", value: "⭐".repeat(stars), inline: true },
        { name: "Message", value: message }
      )
      .setImage(proof.url)
      .setFooter({ text: `Submitted by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};