const { SlashCommandBuilder } = require('discord.js');
const TimesheetHandler = require('../../timesheetHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clockin')
        .setDescription('Clocks you into the Timesheet')
        .setDMPermission(false),
    async execute(interaction) {

        const res = await TimesheetHandler.Clockin(interaction.user.id, interaction.member.displayName)

        switch (res['Status']) {
            case 1:
                interaction.reply( {content: `Successfully clocked in!`, ephemeral: true } )
                break
            case 2:
                interaction.reply( {content: `You already clocked in <t:${res['ClockinTime']}:R>`, ephemeral: true } )
                break
            default:
                interaction.reply( {content: `An error has occurred, please try again.`, ephemeral: true} )
        }

    },
};