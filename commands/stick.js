const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: [
        new SlashCommandBuilder()
            .setName('stick')
            .setDescription('Stick a message into the current channel')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('The message you want to stick')
                    .setRequired(true)
            ),

        new SlashCommandBuilder()
            .setName('remsticky')
            .setDescription('Remove a sticky message by its message ID')
            .addStringOption(option =>
                option.setName('id')
                    .setDescription('The message ID of the sticky to remove')
                    .setRequired(true)
            )
    ],

    async execute(interaction) {
        const name = interaction.commandName;

        if (name === 'stick') {
            const content = interaction.options.getString('message');
            const stickChannel = interaction.channel;

            const embed = new EmbedBuilder()
                .setColor('#ffffff')
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setDescription(content)
                .setTimestamp();

            await stickChannel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Message stuck', ephemeral: true });
        }

        if (name === 'remsticky') {
            const messageId = interaction.options.getString('id');
            const channel = interaction.channel;

            try {
                const msg = await channel.messages.fetch(messageId);
                await msg.delete();
                await interaction.reply({ content: 'Sticky removed', ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: 'Could not find or delete that message', ephemeral: true });
            }
        }
    }
};