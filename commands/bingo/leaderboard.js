const Discord = require("discord.js")
const db = require("quick.db")
const entries = new db.table("tvirususers")
const special = ['Titanium', 'Vanadium', 'Iodine', 'Rhodium', 'Uranium', 'Sulfur']

module.exports = {
    name: 'leaderboard',
    description: 'View everyone\'s points and placement in the Drop Giveaway',
    category: "Bingo",
    usage: "!points",
    aliases: ['ranks'],
    execute: async (client, message, args, Client) => {
        if (message.guild.id !== '742737352799289375' && message.guild.id !== '431417925744984085') {
            message.channel.send('This feature is currently in a beta phase and will be coming soon to all guilds.')
        }
        function ordinal(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        }
        let allUsers = entries.all()
        let ordered = allUsers.sort((a, b) => (a.data.points < b.data.points) ? 1 : ((b.data.points < a.data.points) ? -1 : 0))
        function podium(i) {
            if (!(i - 1)) return '🏆'
            else if (!(i - 2)) return '🥈'
            else if (!(i - 3)) return '🥉'
            else return ''
        }
        ordered = ordered.slice(0, 15)
        /*let toFetch = ordered;
        let e = 0;
        (function fetch(i) {
            setTimeout(async function () {
                await message.guild.members.fetch(toFetch[e].ID).catch(err => true)
                e++
                if (toFetch[e]) fetch(e)
            })
        })(e)*/
        let userMap = ordered.map(obj =>
            `${podium(ordered.findIndex(e => e.ID === obj.ID) + 1)} **${ordinal(ordered.findIndex(e => e.ID === obj.ID) + 1)}** - ${message.guild.members.cache.get(obj.ID) ? message.guild.members.cache.get(obj.ID) : `<@${obj.ID}>`}`
        ).join('\n')

        const leaderboard = new Discord.MessageEmbed()
            .setTitle('Guild Leaderboard - Drop Giveaway')
            .setDescription(userMap)
            .setColor('#ffbe42')
            .setThumbnail(message.guild.iconURL())
        message.channel.send(leaderboard)
    }
}