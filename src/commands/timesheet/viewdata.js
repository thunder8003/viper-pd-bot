const { SlashCommandBuilder } = require('discord.js');
const SqlHandler = require('../../sqlHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewdata')
        .setDescription('Shows you your timesheet.')
        .setDMPermission(false),
    async execute(interaction) {

        const req = await SqlHandler.sendSQL("SELECT TimeSheet from USERS WHERE DiscordID = ?", [interaction.user.id])

        if (req.length > 1) {
            interaction.reply( {content: 'An error has occured while trying to gather your time sheet, try again.', ephemeral: true} )
            return
        } else if (req.length < 1) {
            interaction.reply( {content: 'You haven\'t clocked in since the last time it was cleared.', ephemeral: true} )
            return
        }

        let totalSeconds = req[0]['TimeSheet'];

        const days = Math.floor(totalSeconds / 86400);
        totalSeconds = totalSeconds % 86400
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600
        const minutes = Math.floor(totalSeconds / 60);

        interaction.reply({ content: `You currently have ${days} day(s), ${hours} hour(s), and ${minutes} minute(s).`, ephemeral: true})

    },
};