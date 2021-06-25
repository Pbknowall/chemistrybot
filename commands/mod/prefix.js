const { MessageEmbed } = require("discord.js")
const settings = new (require("quick.db")).table("settings")

module.exports = {
	name: 'prefix',
	description: 'Change my prefix in your server',
    category: "Mod",
    usage: "!prefix <prefix>",
    aliases: [],
	execute: async (client, message, args, Client) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.permMsg).catch(err => { console.log(err); return })
        const embed = new MessageEmbed().setDescription(`⭕ My prefix in this server is \`${settings.get(`${message.guild.id}.prefix`) ? settings.get(`${message.guild.id}.prefix`) : '!'}\``).setColor("#ffbe42")
        const embed2 = new MessageEmbed().setDescription(`⭕ My prefix has successfully been set to \`${args[0]}\``).setColor("#00FF00")
        if (!args[0]) return message.channel.send(embed).catch(err => { console.log(err); return })
        if (args[0].length > 2) return Client.err(message, 'That prefix is too long! Please choose a prefix with 2 characters or less.')
        settings.set(`${message.guild.id}.prefix`, args[0])
        return message.channel.send(embed2).catch(err => { console.log(err); return })
	}
}