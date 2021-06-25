const Discord = require("discord.js")
const emojis = require("../../src/emojis.js")

module.exports = {
    name: 'element',
    description: 'View extra information on an element.',
    category: "Chem",
    usage: "!element <name / symbol / atomic number>",
    aliases: ["el"],
    execute: async (client, message, args, Client) => {
        message.react("✅").then(r => { setTimeout(() => { r.remove().catch(err => { console.log(err); return }) }, 3000) }).catch(err => { console.log(err); return })

        const element = args[0]
        if (!element) return Client.err(message, "Please Specify an Element")

        let index;
        if (!isNaN(element)) {
            let masses = []
            emojis.map(l => masses.push(l.name))
            if (element.includes("0") && parseInt(element) < 10) element = `0${element}`
            const name = masses.find(mass => parseInt(mass).toString() === element)
            index = masses.indexOf(name)
        } else if (isNaN(element) && element.length <= 3 && element.toLowerCase() !== "tin") {
            let masses = []
            emojis.map(l => masses.push(l.symbol))
            const name = masses.find(mass => mass.toLowerCase() === element.toLowerCase())
            index = masses.indexOf(name)
        } else {
            let masses = []
            emojis.map(l => masses.push(l.name))
            const name = masses.find(mass => mass.toLowerCase().includes(element.toLowerCase()))
            index = masses.indexOf(name)
        }

        if (index === undefined || !emojis[index]) return Client.err(message, "Unknown Element")
        index = emojis[index]
        const guildEmoji = client.guilds.cache.get(index.guild).emojis.cache.get(index.id)

        message.channel.send({
            embed: {
                title: `⮞ ${guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "")} ⮜`,
                color: "#ffbe42",
                thumbnail: {
                    url: guildEmoji.url,
                    height: 2048
                },
                fields: [
                    { name: "❯ Name", value: guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "") },
                    { name: "❯ Symbol", value: index.symbol, inline: true },
                    { name: "❯ Atomic Number", value: parseInt(index.name), inline: true }
                ],
                author: {
                    name: "Element Info",
                    iconURL: guildEmoji.url
                },
                timestamp: Date.now(),
                url: `https://en.wikipedia.org/wiki/${guildEmoji.name.replace(parseInt(guildEmoji.name), "").replace("Tile", "").replace("0", "")}`,
                footer: {
                    text: "ChemistryBot",
                    iconURL: client.user.avatarURL()
                }
            }
        }).catch(err => { console.log(err); return })
    }
}