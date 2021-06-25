const Discord = require("discord.js")
const quizQuestions = require("../../src/quizQuestions.json")

module.exports = {
    name: 'quiz',
    description: 'Take a quiz',
    category: "Chem",
    usage: "!quiz",
    aliases: ["trivia"],
    execute: async (client, message, args, Client) => {
        if (!quizQuestions) return message.channel.send("An error occurred whilst fetching a quiz for you, please report this to Pbknowall#0001").catch(err => { console.log(err); return })
        let which = Math.floor(Math.random() * 59)
        const quiz = quizQuestions[which]
        let aws = []
        quiz.options.map(l => aws.push(l))
        let questions = []
        if (quiz.options[0]) questions.push(`**A**. ${quiz.options[0]}`)
        if (quiz.options[1]) questions.push(`**B**. ${quiz.options[1]}`)
        if (quiz.options[2]) questions.push(`**C**. ${quiz.options[2]}`)
        if (quiz.options[3]) questions.push(`**D**. ${quiz.options[3]}`)
        if (quiz.options[4]) questions.push(`**E**. ${quiz.options[4]}`)

        const embed = new Discord.MessageEmbed()
            .setTitle(quiz.question)
            .setDescription(questions.map(q => q).join("\n"))
            .setColor("#ffbe42")
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
        message.channel.send(embed).catch(err => { console.log(err); return })
        try {
            let index = aws.indexOf(quiz.correct)
            let letter = questions[index].charAt(2)
            const filter = m => !m.author.bot && m.author.id === message.author.id
            const collector = message.channel.createMessageCollector(filter, { time: 30000 })
            let winner;
            collector.on("collect", m => {
                if (message.author.bot) return;
                if (quiz.correct.toLowerCase() === m.content.toLowerCase() || letter.toLowerCase() === m.content.toLowerCase()) {
                    winner = m.author
                    collector.stop()
                    let correctEmbed = new Discord.MessageEmbed()
                        .setAuthor("✅ Correct!")
                        .setDescription(`- ${quiz.question}\n- **${quiz.correct}**\n\u200B`)
                        .setColor("#ffbe42")
                        .setFooter(`Nice one ${winner.username}!`, client.user.avatarURL())
                        .setTimestamp()
                    if (quiz.fact) correctEmbed.addField("Fun Fact", quiz.fact)
                    return message.channel.send(correctEmbed).catch(err => { console.log(err); return })
                } else m.react("❌").catch(err => { console.log(err); return })
            })
            collector.on("end", () => {
                if (!winner) return message.channel.send(Client.err("❌ Time's Up!").setDescription(`Looks like you didn't get the answer in time! The correct answer was **${letter}** - **${quiz.correct}**`)).catch(err => { console.log(err); return })
            })
        } catch (err) {
            console.log(err)
            return message.channel.send(Client.err("❌ Time's Up!").setDescription(`Looks like you didn't get the answer in time! The correct answer was **${letter}** - **${quiz.correct}**`)).catch(err => { console.log(err); return })
        }
    }
}