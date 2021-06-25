const { MessageEmbed } = require("discord.js")
const quick = require("quick.db")
const { slice } = require("../../src/emojis")
const el = new quick.table("elements")
const active = new quick.table("active")

module.exports = {
    name: 'pick',
    description: 'Once Started With `!start`, You Can Choose an Item From The Periodic Table for Giveaway Purposes',
    category: "Bingo",
    usage: "!pick",
    aliases: ["choose"],
    execute: async (client, message, args, Client) => {
        if (message.guild.id === "742737352799289375" && message.channel.id !== "748926371216097280") return Client.err(message, `You can only use this command in ${message.guild.channels.cache.get("748926371216097280") ? message.guild.channels.cache.get("748926371216097280") : "#👑giveaway-entry"}`)
        if (active.has(message.channel.id)) return Client.err(message, "Only 1 person can pick at a time - Please wait for the previous user to finish picking.")

        const db = el.get(`start_${message.guild.id}.list`)
        if (!db) return Client.err(message, "There Is No Ongoing Collection")

        let list = el.get(`start_${message.guild.id}.list`)
        db.map(e => {
            if (e.user) {
                const index = list.indexOf(e)
                if (list[index]) {
                    list.splice(index)
                }
            }
        })
        el.set(`start_${message.guild.id}.list`, list)

        let users = []
        db.map(e => { if (e.user) users.push(e.user) })
        if (users.includes(message.author.id)) return Client.err(message, "You have already chosen an element")
        active.push(message.channel.id, true)

        let first = list.slice(0, 40).map(e => { if (!e.user) return `<:${e.name}:${e.id}>` }).join("")
        let second = list.slice(40, 79).map(e => { if (!e.user) return `<:${e.name}:${e.id}>` }).join("")
        let third = list.slice(79).map(e => { if (!e.user) return `<:${e.name}:${e.id}>` }).join("")

        if (!first.length && !second.length && !third.length) return Client.err(message, "All elements have been picked! The giveaway should end soon.")
        const embed = new MessageEmbed().setAuthor("Pick an Element", client.user.avatarURL()).setDescription(`**Here are the current available options:**`).setColor("#ffbe42")
        const embed2 = new MessageEmbed().setFooter("Type \"cancel\" to cancel this prompt - It will be automatically cancelled in 45 seconds.").setColor("#ffbe42")

        message.channel.send(embed)    .catch(err => { console.log(err); return })
        if (first.length) { message.channel.send("> " + first)    .catch(err => { console.log(err); return }) }
        if (second.length) { message.channel.send("> " + second)    .catch(err => { console.log(err); return }) }
        if (third.length) { message.channel.send("> " + third)    .catch(err => { console.log(err); return }) }
        message.channel.send(embed2)    .catch(err => { console.log(err); return })

        Client.prompt(message, "", 45000, "You took too long to reply! Please run the command again.", active)
            .then(m => {
                if (m.toLowerCase() === "cancel") {
                    active.delete(message.channel.id)
                    return message.channel.send("Prompt Cancelled")
                            .catch(err => { console.log(err); return })
                }
                if (m === "cancelled") return active.delete(message.channel.id)
                let index;
                if (!isNaN(m)) {
                    let masses = []
                    list.map(l => masses.push(l.name))
                    if (m.includes("0")) { if (parseInt(m) < 10) m = `0${m}` }
                    const name = masses.find(mass => parseInt(mass).toString() === m)
                    index = masses.indexOf(name)
                } else if (isNaN(m) && m.length <= 3 && m.toLowerCase() !== "tin") {
                    let masses = []
                    list.map(l => masses.push(l.symbol))
                    const name = masses.find(mass => mass.toLowerCase() === m.toLowerCase())
                    index = masses.indexOf(name)
                } else {
                    let masses = []
                    list.map(l => masses.push(l.name))
                    const name = masses.find(mass => mass.toLowerCase().includes(m.toLowerCase()))
                    index = masses.indexOf(name)
                }

                if (index === undefined || !db[index]) {
                    active.delete(message.channel.id)
                    return Client.err(message, "Element Not Found")
                }

                if (db[index].user) {
                    active.delete(message.channel.id)
                    return Client.err(message, "Another User has Chosen this Element")
                }

                const guildEmoji = client.guilds.cache.get(list[index].guild).emojis.cache.get(list[index].id)

                const confirmationEmbed = new MessageEmbed()
                    .setTitle(`⮞ ${guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "")} ⮜`)
                    .setAuthor("Pick an Element", guildEmoji.url).setColor("#ffbe42").setThumbnail(`${guildEmoji.url}?size=2048`)
                    .setDescription("Are you sure you want to choose this element? You cannot change element later on.")
                    .setURL(`https://en.wikipedia.org/wiki/${guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "")}`)
                    .setFooter("ChemistryBot", client.user.avatarURL()).setTimestamp()

                message.channel.send(confirmationEmbed).then(msg => {
                    const chosenEmbed = new MessageEmbed()
                        .setAuthor(`✅ Element Chosen: ${guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "")}`).setColor("#00FF00")
                    Client.collect(msg, message.author, "✅", "❌", 10000, "", active).then(r => {
                        if (!r) return;
                        if (r.emoji.name === "✅") {
                            r.message.reactions.removeAll().catch(error => console.log(error))
                            msg.edit({ embed: chosenEmbed }).catch(err => { console.log(err); return })
                            const array = []
                            array.push({ name: list[index].name, symbol: list[index].symbol, id: list[index].id, guild: list[index].guild, user: message.author.id })
                            list.splice(index, 1, array[0])
                            el.set(`start_${message.guild.id}.list`, list)
                            console.log(list[index])
                            active.delete(message.channel.id)
                        } else if (r.emoji.name === "❌") {
                            r.message.reactions.removeAll().catch(error => console.log(error))
                            msg.edit({ embed: { author: { name: "⭕ Cancelled" }, color: "#FF0000" } }).catch(err => { console.log(err); return })
                            active.delete(message.channel.id)
                        }
                    })
                    setTimeout(() => active.delete(message.channel.id), 10000)
                })    .catch(err => { console.log(err); return })
            })
    }
}