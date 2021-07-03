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
        /*if (message.guild.id !== '742737352799289375' && message.guild.id !== '431417925744984085') {
            try {
                message.channel.send('This feature is currently in a beta phase and will be coming soon to all guilds.')
                    .catch(err => { return })
            } catch (err) { console.log(err) }
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
        let user;
        if (args.length) {
            try {
                await message.guild.members.fetch(args[0]).catch(err => { return })
                let member = message.mentions.members.first()
                    || message.guild.members.cache.get(args[0])
                    || message.guild.members.cache.find(m => m.user.username.toLowerCase().startsWith(args.join(' ').toLowerCase()))
                    || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(' ').toLowerCase()))

                if (member.user && !member.user.bot) user = member.user
                else user = message.author
            } catch {
                user = message.author
            }
        } else {
            user = message.author
        }
        let hasNoPoints = new Discord.MessageEmbed()
            .setAuthor(`${user.username}'s Points`, client.user.avatarURL())
            .setDescription(`${message.author.id === user.id ? 'You don\'t' : `${user} doesn't`} have any points yet! Pay attention to the main chat and get ready to claim some elements as your own!`)
            .setColor('#ffbe42')
            .setThumbnail(user.displayAvatarURL({ size: 256, dynamic: true }))
        if (!entries.has(user.id) || !entries.get(`${user.id}.points`)) {
            message.channel.send({ embed: hasNoPoints })
                .catch(err => { return })
            return
        }
        let dbUser = entries.get(user.id)
        let allUsers = entries.all()
        let ordered = allUsers.sort((a, b) => (a.data.points < b.data.points) ? 1 : ((b.data.points < a.data.points) ? -1 : 0))
        function podium(i) {
            if (!(i - 1)) return '🏆'
            else if (!(i - 2)) return '🥈'
            else if (!(i - 3)) return '🥉'
            else return '🧪'
        }
        let place = ordered.findIndex(e => e.ID === user.id) + 1
        let specials = dbUser.elements.filter(e => special.includes(e.name))
        let common = dbUser.elements.filter(e => !special.includes(e.name))

        let pointsEmbed = new Discord.MessageEmbed()
            .setAuthor(`${user.username}'s Points`, client.user.avatarURL())
            .setDescription(`${message.author.id === user.id ? 'You currently have' : `${user} currently has`} **${dbUser.points}** Points
            
            - \`${common.length}\` **Common Elements**: ${common.map(e => `\`${e.name}\``).join(', ')}
            - \`${specials.length}\` **__Special__ Elements**: ${specials.map(e => `\`${e.name}\``).join(', ')}
            - ${podium(place)} ${message.author.id === user.id ? 'You are' : `${user} is`} in **${ordinal(place)}** Place.`)
            .setColor('#ffbe42')
            .setThumbnail(user.displayAvatarURL({ size: 256, dynamic: true }))
        message.channel.send({ embed: pointsEmbed })
            .catch(err => { return })*/
    }
}