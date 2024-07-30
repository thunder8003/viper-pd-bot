const { SlashCommandBuilder } = require('discord.js');
const TimesheetHandler = require('../../timesheetHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clockout')
        .setDescription('Clocks you out of the Timesheet')
        .setDMPermission(false),
    async execute(interaction) {

        const res = await TimesheetHandler.Clockout(interaction.user.id)

        switch (res['Status']) {
            case 1:
                interaction.reply( {content: `Successfully clocked out! ${res['MinutesAdded']} minutes were added to your timesheet.`, ephemeral: true } )
                break
            case 2:
                interaction.reply( {content: `You are already clocked out!`, ephemeral: true } )
                break
            default:
                interaction.reply( {content: `An error has occurred, please try again.`, ephemeral: true} )
        }

    },
};