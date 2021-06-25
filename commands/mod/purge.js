const Discord = require("discord.js")

module.exports = {
    name: 'purge',
    description: 'Clear a Specific Amount of Messages',
    category: "Mod",
    aliases: ["clear", "delete"],
    execute: (client, message, args, Client) => {
        message.react("✅").catch(err => { console.log(err); return })
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(client.permMsg).catch(err => { console.log(err); return })
        const integer = parseInt(args[0])
        if (!integer) return Client.err(message, 'Please provide a number of messages to delete.')
        if (integer >= 100) return Client.err(message, "I can only clear up to 100 messages at a time!")
        message.channel.bulkDelete(integer + 1)
            .then(() => {
                const embed = new Discord.MessageEmbed().setDescription(`✅ Cleared **${integer}** messages`).setColor("#00FF00")
                message.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }).catch(err => { console.log(err); return })).catch(err => { console.log(err); return })
            })
            .catch((err) => {
                console.log('bulkDelete Error: ', err)
                return Client.err(message, 'I don\'t have permission to clear messages.')
            })
    }
}