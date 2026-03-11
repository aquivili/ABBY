const { getVouches } = require("../vouchManager");

module.exports = {
  name: "vouches",
  async execute(client, message, args) {
    const target =
      message.mentions.users.first() ||
      (args[0] ? await client.users.fetch(args[0]).catch(() => null) : message.author);

    if (!target) {
      return message.reply("Tag a user or give a valid ID.");
    }

    const list = getVouches(target.id);

    if (!list.length) {
      return message.reply(`${target.tag} has no vouches.`);
    }

    const lines = list
      .slice(-10)
      .map((v, i) => {
        const date = new Date(v.timestamp).toLocaleString();
        return `${i + 1}. By <@${v.authorId}> on ${date}: ${v.reason}`;
      })
      .join("\n");

    message.reply(`Vouches for ${target.tag}:\n${lines}`);
  }
};