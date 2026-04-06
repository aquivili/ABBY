const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    AttachmentBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log or update a ticket order')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Order ID or username')
                .setRequired(true)
        ),

    async execute(interaction) {
        const orderName = interaction.options.getString('name');
        const ticketMaker = interaction.user.username;
        const ticketChannel = interaction.channel;

        const banner = new AttachmentBuilder('./assets/order_status.png');

        const embed = new EmbedBuilder()
            .setColor(0x1a1a1a)
            .setTitle(`Order: ${orderName}`)
            .setDescription(`User: ${ticketMaker}\nChannel: ${ticketChannel}`)
            .setImage('attachment://order_status.png')
            .addFields({ name: 'Status', value: 'Pending' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('status_pending')
                    .setLabel('Pending')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('status_processing')
                    .setLabel('Under Processing')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('status_completed')
                    .setLabel('Completed')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            files: [banner]
        });
    }
};