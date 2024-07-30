const { SlashCommandBuilder } = require('discord.js');
const SqlHandler = require('../../sqlHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleardata')
        .setDescription('Clears the Timesheet')
        .setDMPermission(false)
        .setDefaultMemberPermissions(8),
    async execute(interaction) {

        await SqlHandler.sendSQL("DELETE FROM USERS WHERE TRUE")
        await SqlHandler.updateClockinEmbeds(interaction.client)

        interaction.reply( {content: "Timesheet has been cleared!", ephemeral: true} )

    },
};