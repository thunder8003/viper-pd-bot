const { SlashCommandBuilder, PermissionFlags } = require('discord.js');
const SqlHandler = require('../../sqlHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewalldata')
        .setDescription('Displays everyone\'s data')
        .setDMPermission(false)
        .setDefaultMemberPermissions(8),
    async execute(interaction) {

        const data = await SqlHandler.sendSQL("SELECT * FROM USERS")

        while (data.length > 0) {
            let current = ""
            let current_length = data.length;

            // Post up to 5 at a time
            for(let i = 0; i < Math.min(current_length, 8); i++) {
                let person = data.pop()

                let totalSeconds = person['TimeSheet'];
                const days = Math.floor(totalSeconds / 86400);
                totalSeconds = totalSeconds % 86400
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds = totalSeconds % 3600
                const minutes = Math.floor(totalSeconds / 60);

                current = current + `${person['Name']} (${person['DiscordID']})\n${days}d ${hours}h ${minutes}m\n\n`

            }

            interaction.user.send(current)

        }

        await interaction.reply({content: "Done! Check your dms.", ephemeral: true})

    },
};