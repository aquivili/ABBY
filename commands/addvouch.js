const { addVouch } = require("../vouchManager");

module.exports = {
  name: "addvouch",
  async execute(client, message, args) {
    const target =
      message.mentions.users.first() ||
      (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null);

    if (!target) {
      return message.reply("Tag a user or give a valid ID.");
    }

    const reason = args.slice(1).join(" ");
    if (!reason) {
      return message.reply("Give a reason.");
    }

    const list = addVouch(target.id, message.author.id, reason);

    message.reply(`Vouch added for ${target.tag}. Total now ${list.length}.`);
  }
};