const Discord = require("discord.js")

module.exports = {
    name: 'table',
    description: 'View the Periodic Table',
    category: "Chem",
    usage: "!table",
    aliases: ["table", "periodictable", "periodic", "pt"],
    execute: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Periodic Table", client.user.avatarURL())
            .setImage("https://sciencenotes.org/wp-content/uploads/2013/06/PeriodicTable-NoBackground2.png")
            .setColor("#ffbe42")
            .setTimestamp()
        message.channel.send(embed)
            .catch(err => { console.log(err); return })
    }
}