const { MessageEmbed, Message } = require("discord.js")
const fetch = require("node-fetch")

module.exports = {
    name: 'mw',
    description: 'Calculate the weight of a molecule.',
    category: "Chem",
    usage: "!mw <molecule>",
    aliases: ["weight", "molweight", "molecularweight", "w", "molmass", "molecularmass", "mass", "m", "mm"],
    execute: async (client, message, args, Client) => {
        if (!args[0]) return message.channel.send({ embed: { title: "Molar Mass Usage", description: "Usage: \n\`\`\`\n!mw <substance>\`\`\`", color: "#ffbe42" } }).catch(err => { console.log(err); return })
        const string = `What is the molar mass of ${args.join(" ")}`
        message.channel.send(`${client.guilds.cache.get("747466183913242724").emojis.cache.get("748214624150880276")} Calculating...`)
            .then(msg => {
                fetch(`http://api.wolframalpha.com/v1/result?appid=AV5KRK-H72X35QKW2&i=${string}`)
                    .then(res => res.text())
                    .then(async body => {
                        if (body === "Wolfram|Alpha did not understand your input") { msg.delete().catch(err => { console.log(err); return }); return Client.err(message, "Invalid Input") }
                        const mass = body.replace("about ", "").replace("grams per mole", "g/mol")
                        const embed = new MessageEmbed()
                            .setAuthor("Molecular Mass Calculator", client.user.avatarURL())
                            .addField("Input", "```autohotkey\n" + args.join(" ") + "```")
                            .addField("Mass", "```autohotkey\n" + mass + "```")
                            .setColor("#ffbe42")
                            .setTimestamp()
                        msg.delete().catch(err => { console.log(err); return })
                        message.channel.send(embed).catch(err => { console.log(err); return })
                    })
            }).catch(err => { console.log(err); return })

    }
}