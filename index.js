const Discord = require("discord.js")
const fs = require('fs');
const DBL = require("dblapi.js")
const client = new Discord.Client({ disableEveryone: true/*, ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] } */ })
//const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NzQ2NzczNTg2NDE4MDgzNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA5MTY5NjI1fQ.5gL83XWWXlrSGphJSXffhj3sQgzfaCz6iVF3_ql-RjY', client)
const { prefix, token } = require("./config.json")
const Client = new (require("./src/functions.js"))
const settings = new (require("quick.db")).table("settings")
client.permMsg = new Discord.MessageEmbed().setDescription("❌ You don't have permission to use this command").setColor("#FF0000")
client.commands = new Discord.Collection()


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
    console.log(`\n##################################################
#                                                #
# ⚗️  ${client.user.tag} has logged into ${client.guilds.cache.size} guilds. #
#                                                #
##################################################\n`)

    let array = [];
    client.guilds.cache.forEach(g => array.push(g.memberCount))
    let users = array.reduce((a, b) => a + b)

    const activities = ["🧪 !help", "🔬 Chemical & Physical Reactions", `👨‍🔬 ${users} Users`]
    setInterval(function () {
        client.user.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: "WATCHING" })
    }, 20000)
})


client.on('message', message => {
    if (message.guild.type === 'dm') return;
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