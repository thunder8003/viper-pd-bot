const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption} = require('discord.js');
const SqlHandler = require('../../sqlHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adjusttime')
        .setDescription('Adjusts an individuals Timesheet')
        .addUserOption(new SlashCommandUserOption()
            .setName('target')
            .setDescription('The user to add time to')
            .setRequired(true))
        .addIntegerOption(new SlashCommandIntegerOption()
                .setName('time')
                .setDescription('Time to add time to the Timesheet')
                .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(8),
    async execute(interaction) {

        const target = interaction.options.getUser('target')
        const amount = interaction.options.getInteger('time')

        // Multiply by 60 because command takes minutes and time is stored in seconds in the database
        SqlHandler.sendSQL("UPDATE USERS SET Timesheet = Timesheet + ? WHERE DiscordID = ?", [amount * 60, target.id])

        interaction.reply({ content: `Adjusted <@${target.id}>'s time by ${amount} minutes`, ephemeral: true})

    },
};