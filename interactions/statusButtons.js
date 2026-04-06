module.exports = {
    customIds: [
        'status_pending',
        'status_processing',
        'status_completed'
    ],

    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({
                content: 'Only admins can update order status.',
                ephemeral: true
            });
        }

        let newStatus = 'Pending';

        if (interaction.customId === 'status_processing') newStatus = 'Under Processing';
        if (interaction.customId === 'status_completed') newStatus = 'Completed';

        const oldEmbed = interaction.message.embeds[0];

        await interaction.update({
            embeds: [
                {
                    color: oldEmbed.color ?? 0x1a1a1a,
                    title: oldEmbed.title,
                    description: oldEmbed.description,
                    fields: [
                        ...oldEmbed.fields.filter(f => f.name !== 'Status'),
                        { name: 'Status', value: newStatus }
                    ],
                    image: oldEmbed.image
                }
            ],
            components: interaction.message.components
        });
    }
};