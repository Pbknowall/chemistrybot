const Discord = require("discord.js")
const fs = require('fs');
const DBL = require("dblapi.js")
const client = new Discord.Client({ disableEveryone: true/*, ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] } */ })
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NzQ2NzczNTg2NDE4MDgzNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA5MTY5NjI1fQ.5gL83XWWXlrSGphJSXffhj3sQgzfaCz6iVF3_ql-RjY', client)
const { prefix, token } = require("./config.json")
const Client = new (require("./src/functions.js"))
const settings = new (require("quick.db")).table("settings")
const disbut = require('discord-buttons')(client)
client.permMsg = new Discord.MessageEmbed().setDescription("❌ You don't have permission to use this command").setColor("#FF0000")
client.commands = new Discord.Collection()
//"token": "NzQ3NDY3NzM1ODY0MTgwODM2.X0PTkw.SpcHhdNE_YGrSnXX1_xutFJjCtw",

console.log("\n-|- ⌛ Loading Commands... -|-")
fs.readdirSync("./commands/").forEach(folder => {
    fs.readdir(`./commands/${folder}`, (err, folders) => {
        if (err) console.log(err)
        let jsFiles = folders.filter(file => file.endsWith('.js'))
        jsFiles.forEach(f => {
            const command = require(`./commands/${folder}/${f}`)
            client.commands.set(command.name, command)
        })
    })
})



client.on("ready", () => {
    console.log(`\n-|- ✅ Loaded ${client.commands.size} Commands -|-`)
    console.log(`\n#####################################################
#                                                   #
# ⚗️  ${client.user.tag} has logged into ${client.guilds.cache.size} guilds. #
#                                                   #
#####################################################\n`)

    let array = [];
    client.guilds.cache.forEach(g => array.push(g.memberCount))
    let users = array.reduce((a, b) => a + b)

    const activities = ["🧪 !help", "🔬 Chemical & Physical Reactions", `👨‍🔬 ${users} Users`]
    setInterval(function () {
        client.user.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: "WATCHING" })
    }, 20000)


    const el = require('./src/T-Virus Defaults')
    const db = require('quick.db')
    const drop = new db.table('tvirus')
    const entries = new db.table('tvirususers')
    /*const id = '431417925744984085'
    const channel = '431417925744984088'*/

    const id = '742737352799289375'
    const channel = '742849666256732170'

    const special = ['Titanium', 'Vanadium', 'Iodine', 'Rhodium', 'Uranium', 'Sulfur']
    drop.set(`${id}.active`, true)
    drop.set(`${id}.elements`, el)
    if (drop.has(`${id}.active`)) {
        (function giveaway(first) {
            let max = 14400000, min = 21600000
            if (first) {
                max = 10000; min = 5000;
                console.log('first')
            }
            //let max = 30000, min = 25000
            console.log(first)
            console.log(max)
            let rand = Math.floor(Math.random() * (max - min)) + min

            setTimeout(function () {
                let elements = drop.get(`${id}.elements`)
                let elementIndex = Math.floor(Math.random() * elements.length)
                element = elements[elementIndex]
                let bool = special.includes(element.name)
                const embed = new Discord.MessageEmbed()
                    .setTitle(bool ? '⚠️ A RARE ELEMENT Has Been Dropped!!! ⚠️' : '⚠️ An Element Has Been Dropped! ⚠️')
                    .setDescription(`The element **${element.name}** has been dropped! Use \`!claim <Element Name/Symbol>\` to add this to your collection, gain ${bool ? '**20 POINTS**' : '**5 Points**'} and closen yourself to victory!`)
                    .setColor(bool ? '#b300b3' : '#40E0D0')
                    .setThumbnail(client.guilds.cache.get(element.guild).emojis.cache.get(element.id).url)
                    .setFooter('ChemistryBot T-Virus Giveaway', client.user.avatarURL())
                client.channels.cache.get(channel).send({ embed: embed }).then(msg => {
                    const filter = m =>
                        m.content.toLowerCase() === `!claim ${element.name}`.toLowerCase() ||
                        m.content.toLowerCase() === `!claim ${element.symbol}`.toLowerCase()
                    msg.channel.awaitMessages(filter, { max: 1, time: 3600000, errors: ['time'] })
                        .then(async col => {
                            col = col.first()
                            const successEmbed = new Discord.MessageEmbed()
                                .setAuthor(`A${bool ? 'RARE' : 'n'} Element Was Dropped`, client.guilds.cache.get(element.guild).emojis.cache.get(element.id).url)
                                .setDescription(`The element **${element.name}** was dropped and claimed in ${Math.round(Math.abs(msg.createdAt - col.createdAt) / 10) / 100} seconds by ${col.author} for ${bool ? '**20 Points**' : '**5 Points**'}!`)
                                .setColor('#ffbe42')
                                .setThumbnail(col.author.displayAvatarURL({ size: 1024 }))
                            await msg.edit({ embed: successEmbed })
                            entries.add(`${col.author.id}.points`, bool ? 20 : 5)
                            entries.push(`${col.author.id}.elements`, element)

                            console.log(element)
                            elements.splice(elementIndex, 1)
                            drop.set(`${id}.elements`, elements)
                        })
                        .catch(col => {
                            let errorEmbed = new Discord.MessageEmbed()
                                .setAuthor('An Element Was Dropped', client.guilds.cache.get(element.guild).emojis.cache.get(element.id).url)
                                .setDescription(`The element **${element.name}** was dropped but no one claimed it within 30 seconds! Good luck next time!`)
                                .setColor('#ffbe42')
                                .setFooter('Hint: Use !claim <Element Name> to claim an element once it appears!')
                            msg.edit({ embed: errorEmbed })
                        })
                })
                if (!elements.length) return client.channels.cache.get('742849666256732170').send('<@283312969931292672> last element has been picked!')
                giveaway()
            }, rand)

        }('yes'))
    } else if (!drop.has(id)) {
        drop.set(`${id}.active`, true)
        drop.set(`${id}.elements`, el)
    }













})


client.on('message', message => {
    if (message.channel.type === 'dm') return;
    if (message.channel.id === '742747575320313986') message.react('♥️');
    const pref = settings.get(`${message.guild.id}.prefix`) ? settings.get(`${message.guild.id}.prefix`) : prefix
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mentionRegex = new RegExp(`^(<@!?${client.user.id}>)s*`)
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(pref)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    if (!args.join(" ") && mentionRegex.test(message.content)) return message.channel.send({ embed: { description: `⭕ My prefix in this server is \`${settings.get(`${message.guild.id}.prefix`)}\``, color: '#ffbe42' } })

    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return;

    try {
        command.execute(client, message, args, Client)
        console.log(`-|- ⭕ Command "${command.name.charAt(0).toUpperCase() + command.name.slice(1)}" run by ${message.author.tag} in ${message.guild.name} -|-`)
    } catch (error) {
        console.log(error)
        message.channel.send('There was an error trying to execute that command!');
    }
})

client.on('guildCreate', guild => {
    console.log(`💬 Joined Guild '${guild.name}' (${guild.id}) (${guild.memberCount}) owned by ${client.users.cache.get(guild.ownerID) ? client.users.cache.get(guild.ownerID).tag : guild.ownerID}`)
})

client.on('guildDelete', guild => {
    console.log(`❌ Left Guild '${guild.name}' (${guild.memberCount}) owned by ${client.users.cache.get(guild.ownerID) ? client.users.cache.get(guild.ownerID).tag : guild.ownerID}`)
})


client.login(token)