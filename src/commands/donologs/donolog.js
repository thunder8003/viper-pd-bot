const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donolog')
        .setDescription('Prompts to fill out a dono log')
        .setDMPermission(false),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('donolog')
            .setTitle('Donolog')

        const incident_number = new TextInputBuilder()
            .setCustomId('incident_number')
            .setLabel('Incident number')
            .setStyle(1)
            .setMaxLength(10)

        const firstActionRow = new ActionRowBuilder().addComponents(incident_number)

        modal.addComponents(firstActionRow)


        await interaction.showModal(modal)


    },
};