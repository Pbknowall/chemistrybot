const Discord = require("discord.js")
const el = new (require("quick.db")).table("elements")

module.exports = {
    name: 'users',
    description: 'View the users that have already chosen their respective element.',
    category: "Bingo",
    usage: "!users",
    aliases: [],
    execute: async (client, message, args, Client) => {
        message.react("✅").then(r => { setTimeout(() => { r.remove() }, 3000) })
        const e = el.get(`start_${message.guild.id}.list`)
        let list = []
        e.map(l => { if (l.user) list.push(l) })
        if (!list[0]) return Client.err(message, "Nobody Has Picked an Element Yet!")

        let one = list.slice(0, 40).map(l => `• ${message.guild.members.cache.get(l.user) ? message.guild.members.cache.get(l.user) : `<@${l.user}>`} - ${l.name.replace(parseInt(l.name), "").replace("Tile", "").replace("0", "")} (${l.symbol} - ${parseInt(l.name)})`).join("\n")
        let two = list.slice(40, 79).map(l => `• ${message.guild.members.cache.get(l.user) ? message.guild.members.cache.get(l.user) : `<@${l.user}>`} - ${l.name.replace(parseInt(l.name), "").replace("Tile", "").replace("0", "")} (${l.symbol} - ${parseInt(l.name)})`).join("\n")
        let three = list.slice(79).map(l => `• ${message.guild.members.cache.get(l.user) ? message.guild.members.cache.get(l.user) : `<@${l.user}>`} - ${l.name.replace(parseInt(l.name), "").replace("Tile", "").replace("0", "")} (${l.symbol} - ${parseInt(l.name)})`).join("\n")

        const page1 = new Discord.MessageEmbed().setTitle(`Users (${list.length})`).setDescription(one).setColor("#ffbe42").setTimestamp().setFooter("Page 1/3")
        const page2 = new Discord.MessageEmbed().setTitle(`Users (${list.length})`).setDescription(two).setColor("#ffbe42").setTimestamp().setFooter("Page 2/3")
        const page3 = new Discord.MessageEmbed().setTitle(`Users (${list.length})`).setDescription(three).setColor("#ffbe42").setTimestamp().setFooter("Page 3/3")
        let pages = [page1, page2, page3]
        let page = 1

        message.channel.send(page1).then(msg => {
            msg.react('⏪').then(r => {
                msg.react('⏩')
                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
                const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;
                const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    msg.edit({ embed: pages[page - 1] }).then(r.users.remove(message.author)).catch(error => console.log(error))
                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    msg.edit({ embed: pages[page - 1] }).then(r.users.remove(message.author)).catch(error => console.log(error))
                })
            })
        })
    }
}