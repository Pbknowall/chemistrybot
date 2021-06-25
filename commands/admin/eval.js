const Discord = require("discord.js")
const { inspect } = require("util")
const trusted = ["460019301081022464", "283312969931292672"]

module.exports = {
    name: 'eval',
    description: 'Evaluation Commands - For Testing Purposes and is only usable by the bot creator',
    category: "Admin",
    aliases: ["e"],
    execute: (client, message, args, Client) => {
        if (!trusted.includes(message.author.id)) return;
        const command = args.slice(0).join(" ")
        if (!command) return;
        message.react("✅").then(r => { setTimeout(() => { r.remove().catch(err => { console.log(err); return }) }, 3000) }).catch(err => { console.log(err); return })
        try {
            const evaled = eval(command)
            let embed = new Discord.MessageEmbed()
                .setColor("#ffbe42")
                .setAuthor("Evaluation", message.author.avatarURL())
                .addField("Input", `\`\`\`${command}\`\`\``)
                .addField("Output", `\`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)
            message.channel.send(embed).catch((err) => {
                let embed = new Discord.MessageEmbed()
                    .setAuthor("Evaluation Error", message.author.avatarURL())
                    .addField("Error", `\`\`\`${err}\`\`\``)
                    .setColor("#FF0000")
                message.channel.send(embed)
            })
        } catch (err) {
            let embed = new Discord.MessageEmbed()
                .setAuthor("Evaluation Error", message.author.avatarURL())
                .addField("Error", `\`\`\`${err}\`\`\``)
                .setColor("#FF0000")
            message.channel.send(embed).catch(() => { })
        }
    }
}