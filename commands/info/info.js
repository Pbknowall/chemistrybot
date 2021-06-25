const { MesssageEmbed, MessageEmbed } = require("discord.js")

module.exports = {
    name: 'info',
    description: 'Bot Stats.',
    category: "Info",
    usage: "!stats",
    aliases: ["stats", "botinfo"],
    execute: async (client, message, args) => {
        let days = Math.floor((process.uptime() % 31536000) / 86400)
        let hours = Math.floor((process.uptime() / 3600) % 24)
        let minutes = Math.floor((process.uptime() / 60) % 60)
        const string = `${days ? `\`${days}\` Days, ` : ""} \`${hours}\` Hours, \`${minutes}\` Minutes`

        const array = [];
        client.guilds.cache.forEach(g => array.push(g.memberCount))
        const users = array.reduce((a, b) => a + b)

        const embed = new MessageEmbed()
            .setTitle("Info")
            .setDescription("**ChemistryBot** is a chemistry-themed Discord bot made for [ChemistryHelp](ttps://discord.gg/hkxdFVMjrd)\n__ChemistryBot V2 is expected to release soon!__")
            .addFields([
                { name: "Ping", value: client.ws.ping + "ms", inline: true },
                { name: "Uptime", value: string, inline: true },
                { name: "Invite", value: "[Click](https://discord.com/oauth2/authorize?client_id=747467735864180836&permissions=2146958847&scope=bot)", inline: true },
                { name: "Servers", value: client.guilds.cache.size, inline: true },
                { name: "Users", value: users, inline: true },
                { name: "Creator", value: "Pbknowall#0001", inline: true },
                { name: "Donate", value: 'https://www.paypal.me/pbknowall', inline: true }

            ])
            .setTimestamp()
            .setThumbnail(client.user.avatarURL())
            .setFooter("Mango Development")
            .setColor("#ffbe42");
        message.channel.send(embed).catch(err => { console.log(err); return })
    }
};