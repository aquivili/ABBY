const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    AttachmentBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Create an order log')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Order ID')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('bloombearer')
                .setDescription('Member involved in the order')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Ticket channel')
                .setRequired(true)
        ),

    async execute(interaction) {
        const orderName = interaction.options.getString('name');
        const bloombearer = interaction.options.getUser('bloombearer');
        const ticketChannel = interaction.options.getChannel('channel');

        // IMPORTANT: using .dat so Discord does NOT auto-embed the file
        const banner = new AttachmentBuilder('./assets/order_status.dat', {
            name: 'order_status.png'
        });

        const embed = new EmbedBuilder()
            .setColor(0x1a1a1a)
            .setTitle(`Order: ${orderName}`)
            .addFields(
                { name: 'Shorekeeper', value: interaction.user.username, inline: true },
                { name: 'Bloombearer', value: bloombearer.toString(), inline: true },
                { name: 'Channel', value: ticketChannel.toString(), inline: true },
                { name: 'Status', value: '**__PENDING__**\n```diff\n- Pending\n```' }
            )
            .setImage('attachment://order_status.png')
            .setFooter({ text: `Logged on ${new Date().toLocaleString()}` });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('status_pending')
                    .setLabel('Pending')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('status_processing')
                    .setLabel('Under Processing')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('status_completed')
                    .setLabel('Completed')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('status_voided')
                    .setLabel('Voided')
                    .setStyle(ButtonStyle.Danger)
            );

        const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);

        await interaction.reply({
            embeds: [embed],
            files: [banner],
            components: isAdmin ? [row] : []
        });
    }
};