const Discord = require("discord.js")
const math = require("mathjs")
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: 'calc',
    description: 'Calculate.',
    category: "Chem",
    usage: "!calc <equation>",
    aliases: ["calculate", "cal", "math", "sum"],
    execute: async (client, message, args) => {
        let button = new MessageButton().setLabel('(').setStyle('grey').setID('(')
        let button2 = new MessageButton().setLabel(')').setStyle('grey').setID(')')
        let button3 = new MessageButton().setLabel('^').setStyle('grey').setID('^')
        let button4 = new MessageButton().setLabel('Del').setStyle('blurple').setID('del')
        let button5 = new MessageButton().setLabel('AC').setStyle('red').setID('all_clear')

        let button6 = new MessageButton().setLabel('7').setStyle('grey').setID('7')
        let button7 = new MessageButton().setLabel('8').setStyle('grey').setID('8')
        let button8 = new MessageButton().setLabel('9').setStyle('grey').setID('9')
        let button9 = new MessageButton().setLabel('/').setStyle('grey').setID('/')
        let button10 = new MessageButton().setLabel('CE').setStyle('red').setID('clear_entry')

        let button11 = new MessageButton().setLabel('4').setStyle('grey').setID('4')
        let button12 = new MessageButton().setLabel('5').setStyle('grey').setID('5')
        let button13 = new MessageButton().setLabel('6').setStyle('grey').setID('6')
        let button14 = new MessageButton().setLabel('*').setStyle('grey').setID('*')
        let button15 = new MessageButton().setLabel(' ').setStyle('grey').setID('spacer')

        let button16 = new MessageButton().setLabel('1').setStyle('grey').setID('1')
        let button17 = new MessageButton().setLabel('2').setStyle('grey').setID('2')
        let button18 = new MessageButton().setLabel('3').setStyle('grey').setID('3')
        let button19 = new MessageButton().setLabel('-').setStyle('grey').setID('-')
        let button20 = new MessageButton().setLabel(' ').setStyle('grey').setID('spacer')

        let button21 = new MessageButton().setLabel('.').setStyle('grey').setID('.')
        let button22 = new MessageButton().setLabel('0').setStyle('grey').setID('0')
        let button23 = new MessageButton().setLabel('=').setStyle('green').setID('equals')
        let button24 = new MessageButton().setLabel('+').setStyle('grey').setID('+')
        let button25 = new MessageButton().setLabel(' ').setStyle('grey').setID('spacer')
console.log('After buttons')
        let row = new MessageActionRow().addComponent(button).addComponent(button2).addComponent(button3).addComponent(button4).addComponent(button5)
        let row2 = new MessageActionRow().addComponent(button6).addComponent(button7).addComponent(button8).addComponent(button9).addComponent(button10)
        let row3 = new MessageActionRow().addComponent(button11).addComponent(button12).addComponent(button13).addComponent(button14).addComponent(button15)
        let row4 = new MessageActionRow().addComponent(button16).addComponent(button17).addComponent(button18).addComponent(button19).addComponent(button20)
        let row5 = new MessageActionRow().addComponent(button21).addComponent(button22).addComponent(button23).addComponent(button24).addComponent(button25)
        console.log('After message row')
        let calc = ['>> ']
        const msg = await message.channel.send(`\`\`\`autohotkey\n${calc.map(c => c)}\`\`\``, { components: [row, row2, row3, row4, row5] }).catch(err => { console.log(err); return })

        const collector = msg.createButtonCollector(() => true, { time: 120000 });

        const edit = function (b, calc) {
            b.message.edit(`\`\`\`autohotkey\n${calc.map(c => c).join('')}\`\`\``, { components: [row, row2, row3, row4, row5] }).catch(err => { console.log(err); return })
        }

        collector.on('collect', async (b) => {
            await b.clicker.fetch()
            if (b.clicker.user.id !== message.author.id) return b.reply.defer();
            if (b.id === 'del') {
                if (calc.length <= 1) return b.reply.defer()
                calc.pop()
                b.reply.defer()
                edit(b, calc)
            } else if (b.id === 'all_clear' || b.id === 'clear_entry') {
                if (calc.length <= 1) return b.reply.defer()
                calc.length = 1;
                b.reply.defer()
                edit(b, calc)
            } else if (b.id === 'spacer') {
                b.reply.defer()
            } else if (b.id === 'equals') {
                let string = calc.slice(1).map(c => c).join('')
                try {
                    let answer = math.evaluate(string)
                    b.reply.defer()
                    calc.splice(1)
                    answer = answer.toString().split('')
                    for (let digit of answer) {
                        calc.push(digit)
                    }
                    edit(b, calc)
                } catch (err) {
                    b.reply.defer()
                    calc.splice(1)
                    calc.push(err)
                    edit(b, calc)
                    setTimeout(() => {
                        calc.length = 1
                        edit(b, calc)
                    }, 1000)
                }
            } else {
                calc.push(b.id)
                b.reply.defer()
                edit(b, calc)
            }
        })

        collector.on('end', (col) => {
            let b = col.first()
            let m = b ? b.message : msg
            m.edit('Calculator Expired - Please run the command again').catch(err => { console.log(err); return })
        })
    }
}



/*let answer;
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
        */