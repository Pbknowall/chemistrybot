const Discord = require("discord.js")
const math = require("mathjs")

module.exports = {
    name: 'calc',
    description: 'Calculate.',
    category: "Chem",
    usage: "!calc <equation>",
    aliases: ["calculate", "cal", "math", "sum"],
    execute: async (client, message, args) => {
        let answer;
        try{
            answer = math.evaluate(args.join(" "))
        } catch (err) {
            return message.channel.send(`\`\`\`autohotkey\n${err}\`\`\``)
        }
        const embed = new Discord.MessageEmbed()
            .setThumbnail("https://azure.hussx.xyz/assets/calc.png")
            .addField("Equation", `\`\`\`autohotkey\n${args.join(" ")}\`\`\``)
            .addField("Solution", `\`\`\`autohotkey\n${answer}\`\`\``)
            .setColor("#ffbe42")
            .setTimestamp()
        message.channel.send(embed)
    }
}