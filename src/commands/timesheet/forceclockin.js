const { SlashCommandBuilder, SlashCommandUserOption} = require('discord.js');
const TimesheetHandler = require('../../timesheetHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceclockin')
        .setDescription('Clocks a user into the Timesheet')
        .setDMPermission(false)
        .setDefaultMemberPermissions(8)
        .addUserOption( new SlashCommandUserOption()
            .setName('target')
            .setDescription('The user you want to clock in')
            .setRequired(true)),
    async execute(interaction) {

        const target = interaction.options.getUser('target')
        const target_member = await interaction.guild.members.fetch(target.id)

        const res = await TimesheetHandler.Clockin(target.id, target_member.displayName)

        switch (res['Status']) {
            case 1:
                interaction.reply( {content: `Successfully clocked <@${target.id}> in!`, ephemeral: true } )
                break
            case 2:
                interaction.reply( {content: `They already clocked in <t:${res['ClockinTime']}:R>`, ephemeral: true } )
                break
            default:
                interaction.reply( {content: `An error has occurred, please try again.`, ephemeral: true} )
        }

    },
};