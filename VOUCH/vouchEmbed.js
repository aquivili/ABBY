const { EmbedBuilder } = require("discord.js");

function buildStars(rating) {
  const r = Math.max(1, Math.min(5, rating));
  const full = "★".repeat(r);
  const empty = "☆".repeat(5 - r);
  return full + empty;
}

function buildVouchEmbed(user, rating, description, imageUrl) {
  const stars = buildStars(rating);

  const embed = new EmbedBuilder()
    .setColor("#A3E4D7")
    .setAuthor({
      name: `${user.username} submitted a vouch`,
      iconURL: user.displayAvatarURL()
    })
    .setDescription(description || "*No text provided*")
    .addFields({
      name: "Rating",
      value: stars,
      inline: true
    })
    .setFooter({ text: "Thank you for trusting our shop" })
    .setTimestamp();

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  return embed;
}

module.exports = {
  buildVouchEmbed
};