const Discord = require("discord.js")

module.exports = {
	name: 'ping',
	description: 'View My Ping',
    category: "Info",
    usage: "!ping",
    aliases: [],
	execute: async (client, message, args) => {
		message.react("✅").then(r => { setTimeout(() => { r.remove() }, 3000) })
        const pong = new Discord.MessageEmbed().setDescription("...Pong!").setFooter("Mango Development", client.user.avatarURL()).setTimestamp().setColor("#ffbe42")
        const msg = await message.channel.send(pong)
        const ping = new Discord.MessageEmbed()
        .setAuthor("...Pong! 🏓", client.user.avatarURL())
            .setDescription(`**❯** 🔃 Message Round-Trip: \`${msg.createdTimestamp - message.createdTimestamp}ms\`\n**❯** 💓 Heartbeat: \`${~~client.ws.ping}ms\``)
            .setFooter("Mango Development")
            .setTimestamp().setColor("#ffbe42")
        await msg.edit(ping)
	},
};