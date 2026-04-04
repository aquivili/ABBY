const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const stickyFile = './sticky.json';

// load sticky data
function loadSticky() {
    if (!fs.existsSync(stickyFile)) return {};
    return JSON.parse(fs.readFileSync(stickyFile, 'utf8'));
}

// save sticky data
function saveSticky(data) {
    fs.writeFileSync(stickyFile, JSON.stringify(data, null, 2));
}

module.exports = {
    data: [
        new SlashCommandBuilder()
            .setName('stick')
            .setDescription('Set a sticky message for this channel')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('The sticky message')
                    .setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('remsticky')
            .setDescription('Remove the sticky message for this channel')
    ],

    async execute(interaction) {
        const channel = interaction.channel;
        const channelId = channel.id;
        const stickies = loadSticky();

        if (interaction.commandName === 'stick') {
            const content = interaction.options.getString('message');

            // delete old sticky if exists
            if (stickies[channelId] && stickies[channelId].messageId) {
                try {
                    const oldMsg = await channel.messages.fetch(stickies[channelId].messageId);
                    await oldMsg.delete();
                } catch {}
            }

            // create new sticky embed
            const embed = new EmbedBuilder()
                .setColor('#ffffff')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setDescription(content)
                .setTimestamp();

            const msg = await channel.send({ embeds: [embed] });

            // save sticky
            stickies[channelId] = {
                text: content,
                messageId: msg.id
            };

            saveSticky(stickies);

            await interaction.reply({ content: 'Sticky set', ephemeral: true });
        }

        if (interaction.commandName === 'remsticky') {
            if (!stickies[channelId]) {
                return interaction.reply({ content: 'No sticky in this channel', ephemeral: true });
            }

            // delete sticky message
            try {
                const oldMsg = await channel.messages.fetch(stickies[channelId].messageId);
                await oldMsg.delete();
            } catch {}

            delete stickies[channelId];
            saveSticky(stickies);

            await interaction.reply({ content: 'Sticky removed', ephemeral: true });
        }
    }
};