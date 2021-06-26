const Discord = require("discord.js")
const db = require("quick.db")
const el = new db.table("elements")

module.exports = {
    name: 'end',
    description: 'End The Current Collection And Choose to Pick a Winner or Not',
    category: "Bingo",
    usage: "!end",
    aliases: [],
    execute: async (client, message, args, Client) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.permMsg)    .catch(err => { console.log(err); return })
        const list = el.get(`start_${message.guild.id}.list`)
        if (!list) return Client.err(message, "There Is No Ongoing Collection")
        let array = [];
        list.map(l => { if (l.user) array.push(l) })
        let w = false; let index; let winnerID; let winnerEl; let winner;
        if (!array.length) return Client.err(message, 'Nobody has picked an element yet!')

        while (w === false) {
            index = Math.floor(Math.random() * array.length)
            winnerID = array[index].user
            winnerEl = array[index].name
            winner = message.guild.members.cache.get(winnerID)
            if (winner && !winner.user.bot) w = true
        }
        if (!array.length) return Client.err(message, "Nobody Has Picked an Element Yet")
        const end = new Discord.MessageEmbed()
            .setTitle("End").setDescription("Are you sure you want to end this giveaway? Next you will have the ability to choose a winner or not.").setColor("#ffbe42").setTimestamp()
        message.channel.send(end).then(msg => {
            Client.collect(msg, message.author, "✅", "❌", 10000).then(r => {
                if (!r) return;
                if (r.emoji.name === "✅") {
                    r.users.remove(message.author).catch(error => console.log(error))

                    const winnerOrNot = new Discord.MessageEmbed()
                        .setTitle("Winner")
                        .setDescription("Ended - Would you like me to pick a winner?")
                        .setColor("#ffbe42")
                        .setTimestamp()
                    msg.edit({ embed: winnerOrNot }).then(mesg => {
                        Client.collect(msg, message.author, "✅", "❌", 10000).then(r => {
                            if (!r) return;
                            if (r.emoji.name === "✅") {
                                mesg.delete().catch(err => { console.log(err); return })
                                message.delete().catch(err => { console.log(err); return })
                                console.log(winnerEl)
                                console.log(winnerID)
                                let ended = new Discord.MessageEmbed().setAuthor("Ended", "https://images.emojiterra.com/twitter/512px/1f389.png")
                                    .setDescription(`Congratulations ${winner}! You WON with the element **${winnerEl.replace(parseInt(array[index].name), "").replace("Tile", "").replace("0", "")}**!`).setColor("#00FF00").setThumbnail(client.user.avatarURL()).setTimestamp()
                                message.channel.send(ended)
                            } else if (r.emoji.name === "❌") {
                                r.message.reactions.removeAll().catch(error => console.log(error))
                                mesg.edit({ embed: { author: { name: "⭕ Ended - No Winner Picked" }, color: "#FF0000" } }).catch(err => { console.log(err); return })
                            }
                        })
                    }).catch(err => { console.log(err); return })
                } else if (r.emoji.name === "❌") {
                    r.message.reactions.removeAll().catch(error => console.log(error))
                    msg.edit({ embed: { author: { name: "⭕ Cancelled" }, color: "#FF0000" } }).catch(err => { console.log(err); return })
                }
            })
        })    .catch(err => { console.log(err); return })
    }
}