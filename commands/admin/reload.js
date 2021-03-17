const Discord = require("discord.js")

module.exports = {
    name: 'reload',
    description: 'Reload - For Testing Purposes and is only usable by the bot creator',
    category: "Admin",
    aliases: [],
    execute: (client, message, args) => {
        if (message.author.id !== "283312969931292672") return;

        if (!args[0]) return;
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.react("❌").then(r => { setTimeout(() => { r.remove() }, 3000) })
        delete require.cache[require.resolve(`./../${command.category.toLowerCase()}/${command.name}.js`)]

        try {
            const newCommand = require(`./../${command.category.toLowerCase()}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.react("✅").then(r => { setTimeout(() => { r.remove() }, 3000) })
            message.channel.send(`✅ \`!${command.name}\` Reloaded!`)
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading \`${command.name}\`:\n\`${error.message}\``);
        }
        
    }
}