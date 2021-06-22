const Discord = require("discord.js")
const db = require("quick.db")
const entries = new db.table("tvirususers")
const special = ['Titanium', 'Vanadium', 'Iodine', 'Rhodium', 'Uranium', 'Sulfur']

module.exports = {
    name: 'points',
    description: 'View your points in the Drop Giveaway',
    category: "Bingo",
    usage: "!points",
    aliases: ['rank'],
    execute: async (client, message, args, Client) => {
        if (message.guild.id !== '742737352799289375' || message.guild.id !== '431417925744984085') {
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

        let hasNoPoints = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}'s Points`, client.user.avatarURL())
            .setDescription('You don\'t have any points yet! Pay attention to the main chat and get ready to claim some elements as your own!')
            .setColor('#ffbe42')
            .setThumbnail(message.author.displayAvatarURL({ size: 256, dynamic: true }))
        if (!entries.has(message.author.id) || !entries.get(`${message.author.id}.points`)) return message.channel.send({ embed: hasNoPoints })
        let user = entries.get(message.author.id)
        let allUsers = entries.all()
        let ordered = allUsers.sort((a, b) => (a.data.points < b.data.points) ? 1 : ((b.data.points < a.data.points) ? -1 : 0))
        console.log(ordered)
        function podium(i) {
            if (!(i - 1)) return '🏆'
            else if (!(i - 2)) return '🥈'
            else if (!(i - 3)) return '🥉'
            else return '🧪'
        }
        let place = ordered.findIndex(e => e.ID === message.author.id) + 1
        console.log(place)
        let pointsEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}'s Points`, client.user.avatarURL())
            .setDescription(`You currently have **${user.points}** Points
            
            - \`${user.elements.filter(e => !special.includes(e.name)).length}\` **Common Elements**
            - \`${user.elements.filter(e => special.includes(e.name)).length}\` **__Special__ Elements**
            - ${podium(place)} You are in **${ordinal(place)}** Place.`)
            .setColor('#ffbe42')
            .setThumbnail(message.author.displayAvatarURL({ size: 256, dynamic: true }))
        message.channel.send(pointsEmbed)
        if (-1) return 1; else return 0

    }
}