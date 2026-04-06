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
            status_pending: '**__PENDING__**\n```diff\n- Pending\n```',
            status_processing: '**__UNDER PROCESSING__**\n```yaml\n# Under Processing\n```',
            status_completed: '**__COMPLETED__**\n```diff\n+ Completed\n```',
            status_voided: '**__VOIDED__**\n```diff\n- Voided\n```'
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
            image: oldEmbed.image,   // ⭐ KEEP IMAGE
            footer: oldEmbed.footer  // ⭐ KEEP TIMESTAMP
        };

        await interaction.update({
            embeds: [updatedEmbed],
            components: interaction.message.components
        });
    }
};