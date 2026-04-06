module.exports = {
    customIds: [
        'status_pending',
        'status_processing',
        'status_completed',
        'status_voided'
    ],

    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({
                content: 'Only admins can update order status.',
                ephemeral: true
            });
        }

        const statusMap = {
            status_pending: "```fix\nPENDING\n```",
            status_processing: "```yaml\nPROCESSING\n```",
            status_completed: "```diff\n+ COMPLETED\n```",
            status_voided: "```diff\n- VOIDED\n```"
        };

        const newStatus = statusMap[interaction.customId];
        const oldEmbed = interaction.message.embeds[0];

        const updatedEmbed = {
            color: oldEmbed.color,
            title: oldEmbed.title,
            fields: oldEmbed.fields.map(f =>
                f.name === 'Status'
                    ? { name: 'Status', value: newStatus }
                    : f
            ),
            image: { url: 'attachment://order_status.png' },
            footer: oldEmbed.footer
        };

        await interaction.update({
            embeds: [updatedEmbed],
            components: interaction.message.components
        });
    }
};