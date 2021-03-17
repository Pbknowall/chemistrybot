const Discord = require("discord.js")
const emojis = require("../../src/emojis.js")
const { yes, no } = require("../../src/yesno.js")
const db = require("quick.db")
const el = new db.table("elements")
const { mods } = require("../../config.json")

module.exports = {
    name: 'start',
    description: 'Start a Unique Giveaway Where Users Can Pick an Element From the Periodic Table',
    category: "Bingo",
    usage: "!start",
    aliases: [],
    execute: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.permMsg)
        message.react("✅").then(r => { setTimeout(() => { r.remove() }, 3000) })

        const embed = new Discord.MessageEmbed()
            .setTitle("⭕ Start")
            .setDescription("**Are you sure you want to start a new collection?\nThis will wipe my current database of users from the previous collection. `(Y/N)`**")
            .setFooter("Type \"cancel\" to cancel this prompt - It will be automatically cancelled in 10 seconds.")
            .setColor("#ffbe42")
        message.channel.send(embed)
        const prompt = await message.channel.awaitMessages(res => res.author.id === message.author.id, { max: 1, time: 10000 })
            .then(async m => {
                m = m.first()
                if (m.author.id !== message.author.id) return;
                if (m.content.toLowerCase() === "cancel") return message.channel.send("Prompt Cancelled")
                if (yes.includes(m.content.toLowerCase())) {
                    if (el.has(`start_${message.guild.id}.list`)) el.delete(`start_${message.guild.id}.list`)
                    const wiping = await message.channel.send({
                        embed: {
                            author: {
                                name: "Wiping Database...",
                                iconURL: client.guilds.cache.get("747466183913242724").emojis.cache.get("748214624150880276").url
                            },
                            color: "#00FF00"
                        }
                    })
                    emojis.map(e => el.push(`start_${message.guild.id}.list`, e))
                    await wiping.edit({
                        embed: {
                            author: {
                                name: "✅ Wiped Successfully - Started"
                            },
                            color: "#00FF00"
                        }
                    })
                } else if (no.includes(m.content.toLowerCase())) {
                    message.channel.send({
                        embed: {
                            author: {
                                name: "⭕ Cancelled"
                            },
                            color: "#FF0000"
                        }
                    })
                } else {
                    return message.channel.send("Invalid Option - Cancelled")
                }

            }).catch(err => {
                console.log(err)
                message.channel.send("Prompt Cancelled")
            })
    },
}