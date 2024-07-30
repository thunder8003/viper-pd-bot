const { EmbedBuilder } = require("discord.js");
const { GetEpochTime } = require('./utilities.js')
const SqlHandler = require("./sqlHandler.js")

class TimesheetHandler {

    static client;

    static init(client) {
        this.client = client
    }

    static DepartmentFromName(name) {
        if ( name.startsWith('7') ) {
            return 'LSPD'
        } else if ( name.startsWith('6') ) {
            return 'SAST'
        } else if ( name.startsWith('5') ) {
            return 'BCSO'
        } else {
            return 'UPD'
        }
    }
    
    static GetDefaultTimesheetEmbed() {
        return new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Viper Data Tracker')
            .setFooter( { text: 'Created By: Tesla Semi', iconURL: 'https://cdn.discordapp.com/avatars/183680478967103489/c19326728abb57012f647726497e3798.png'})
            .setImage('https://cdn.discordapp.com/banners/940326731598929920/ab78e156604aca1563509f2839f02110.webp?size=512')
    }

    // Returns values
    // 1 - Successfully clocked in
    // 2 - Already clocked in
    // 3 - Error occurred
    static async Clockin(discord_id, display_name) {
        const res = await SqlHandler.sendSQL("SELECT * FROM USERS WHERE DiscordID = ?", [discord_id])

        if (res.length === 0) {

            await SqlHandler.sendSQL("INSERT INTO USERS VALUES (?, ?, ?, 0)", [discord_id, display_name, GetEpochTime()]);
            await this.UpdateTimesheetEmbeds()
            return { Status: 1 } // Successfully clocked in

        } else if (res.length === 1) {

            if (res[0]['ClockinTime'] != null) {
                return { Status: 2, ClockinTime: res[0]['ClockinTime'] } // Already clocked in
            } else {
                await SqlHandler.sendSQL("UPDATE USERS SET ClockinTime = ?, Name = ? WHERE DiscordID = ?", [GetEpochTime(), display_name, discord_id])
                await this.UpdateTimesheetEmbeds()
                return { Status: 1 } // Successfully clocked in
            }


        } else {
            return { Status: 3 } // Error occurred
        }
    }

    // Returns values
    // 1 - Successfully clocked out
    // 2 - Already clocked out
    // 3 - Error occurred
    static async Clockout(discord_id) {

        const res = await SqlHandler.sendSQL("SELECT * FROM USERS WHERE DiscordID = ?", [discord_id])

        if (res.length === 0) {
            return { Status: 2 } // Already not clocked in
        } else if (res.length === 1) {

            if (res[0]['ClockinTime'] != null) {

                const addedTime = GetEpochTime() - res[0]['ClockinTime'];

                await SqlHandler.sendSQL( "UPDATE USERS SET TimeSheet = TimeSheet + ?, ClockinTime = NULL WHERE DiscordID = ?", [addedTime, discord_id])
                await this.UpdateTimesheetEmbeds()
                return { Status: 1, MinutesAdded: Math.floor(addedTime / 60) } // Already not clocked in
            } else {
                return { Status: 2 } // Already not clocked in
            }
        }

        return { Status: 3 }

    }
    
    static async UpdateTimesheetEmbeds() {
        const timesheet_messages = await SqlHandler.sendSQL("SELECT * FROM STATICMESSAGES WHERE Type = \'clockin-button\'")
        const clockedin = await SqlHandler.sendSQL("SELECT * FROM USERS WHERE ClockinTime IS NOT NULL ORDER BY Name")

        let fields = []

        for (const data of clockedin) {

            let field = {}

            field['name'] = data['Name']
            field['value'] = `${this.DepartmentFromName(data['Name'])} | <t:${data['ClockinTime']}:t>`

            fields.push(field)
        }

        for (const message of timesheet_messages) {
            const channel = await this.client.channels.fetch(message['ChannelID'])
            const actualMessage = await channel.messages.fetch(message['MessageID'])

            const embed = EmbedBuilder.from(actualMessage.embeds[0]).setFields(fields)

            if (clockedin.length === 1) {
                embed.setDescription('There is 1 officer clocked in!')
            } else {
                embed.setDescription(`There are ${clockedin.length} officers clocked in!`)
            }



            actualMessage.edit({ embeds: [embed]})

        }
    }

}

module.exports = TimesheetHandler