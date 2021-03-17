const Discord = require("discord.js")

module.exports = {
    name: 'help',
    description: 'View My Available Commands',
    category: "Info",
    usage: "!help / !help <command>",
    aliases: ["cmds", "commands"],
    execute: async (client, message, args, Client) => {
        message.react("✅").then(r => { setTimeout(() => { r.remove() }, 3000) })

        if (!args[0]) {
            const mod = client.commands.filter(c => c.category === "Mod")
            const info = client.commands.filter(c => c.category === "Info")
            const bingo = client.commands.filter(c => c.category === "Bingo")
            const chem = client.commands.filter(c => c.category === "Chem")
            const embed = new Discord.MessageEmbed()
                .setTitle(`My Commands (${mod.size + info.size + bingo.size})`)
                .addField("❯ Moderation", mod.map(c => `\`${c.name}\``).join(", "))
                .addField("❯ Chemistry", chem.map(c => `\`${c.name}\``).join(", "), true)
                .addField("❯ Info", info.map(c => `\`${c.name}\``).join(", "))
                .addField("❯ ChemBingo", bingo.map(c => `\`${c.name}\``).join(", "))
                .setFooter("Mango Development", client.user.avatarURL())
                .setTimestamp()
                .setThumbnail(client.user.avatarURL())
                .setColor("#ffbe42")
            message.channel.send(embed)
        } else if (args[0]) {
            const commandName = args.join(" ")
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            if (!command) return Client.err(message, "**Unknown Command** - Use \`!help\` to view all of my commands")

            const embed = new Discord.MessageEmbed()
                .setTitle(`Command "${command.name.charAt(0).toUpperCase() + command.name.slice(1)}"`)
                .setDescription(`❯ **Description**: ${command.description}
❯ **Usage**: \`${command.usage}\`
❯ **Aliases**: ${command.aliases.map(a => `\`${a}\``).join(", ")}`)
                .setTimestamp()
                .setColor("#ffbe42")
            message.channel.send(embed)
        }
    },
};