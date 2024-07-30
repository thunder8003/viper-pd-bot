const { SlashCommandBuilder, SlashCommandUserOption} = require('discord.js');
const TimesheetHandler = require('../../timesheetHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceclockout')
        .setDescription('Clocks a user out of the Timesheet')
        .setDMPermission(false)
        .setDefaultMemberPermissions(8)
        .addUserOption( new SlashCommandUserOption()
            .setName('target')
            .setDescription('The user you want to clock in')
            .setRequired(true)),
    async execute(interaction) {

        const target = interaction.options.getUser('target')


        const res = await TimesheetHandler.Clockout(target.id)

        switch (res['Status']) {
            case 1:
                interaction.reply( {content: `Successfully clocked out <@${target.id}>! ${res['MinutesAdded']} minutes were added to their timesheet.`, ephemeral: true } )
                break
            case 2:
                interaction.reply( {content: `They are already clocked out!`, ephemeral: true } )
                break
            default:
                interaction.reply( {content: `An error has occurred, please try again.`, ephemeral: true} )
        }

    },
};