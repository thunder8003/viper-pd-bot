const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const TimesheetHandler = require('../../timesheetHandler.js')
const SqlHandler = require('../../sqlHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createclockinbutton')
        .setDescription('Creates a button that can be used to clock in or out.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(8),
    async execute(interaction) {

        if (interaction.user.id !== '183680478967103489') {
            interaction.reply( {content: 'Only <@183680478967103489> can create a clockin button.', ephemeral: true})
            return
        }

        const embed = TimesheetHandler.GetDefaultTimesheetEmbed()

        const clockinButton = new ButtonBuilder()
            .setCustomId('clockin')
            .setLabel('Clock In')
            .setStyle(3)

        const clockoutButton = new ButtonBuilder()
            .setCustomId('clockout')
            .setLabel('Clock Out')
            .setStyle(1)

        const dataButton = new ButtonBuilder()
            .setCustomId('viewdata')
            .setLabel('View Data')
            .setStyle(2)

        const rows  = new ActionRowBuilder().addComponents(clockinButton, clockoutButton, dataButton)

        const guildID = interaction.guildId
        const channelID = interaction.channelId
        const channel = await interaction.client.channels.fetch(channelID)
        const messageID = (await channel.send({ components: [rows], embeds: [embed]})).id

        if (messageID == null) {
            interaction.reply({ content: 'Failed to make a clockin button, try again.', ephemeral: true })
            return
        }

        await SqlHandler.sendSQL("INSERT INTO STATICMESSAGES VALUES (?, ?, ?, \'clockin-button\')", [messageID, channelID, guildID])

        interaction.reply({ content: 'Successfully created clockin button!', ephemeral: true})
        SqlHandler.updateClockinEmbeds(interaction.client)

    },
};