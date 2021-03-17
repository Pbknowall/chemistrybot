const chalk = require('chalk')
const { MessageEmbed } = require('discord.js')

class Functions {
    prompt(message, filter, time, err, active) {
        filter = filter ? filter : res => res.author.id === message.author.id
        const prompt = message.channel.createMessageCollector(filter, { time: time })
        return new Promise(resolve => {
            prompt.on("collect", async (msg) => {
                prompt.stop()
                resolve(msg.content)
            })
            prompt.on("end", (i, reason) => {
                if (active) active.delete(message.channel.id)
                if (reason == "time") {
                    if (err) message.channel.send(err)
                    resolve("cancelled")
                }
            })
        })
    }
    err(message, msg) {
        const embed = new MessageEmbed().setDescription(`⭕ ${msg ? msg : "An Error Occurred"}`).setColor("#FF0000")
        return message.channel ? message.channel.send(embed) : embed
    }
    collect(message, author, e1, e2, time, msg, active) {
        message.react(e1)
        message.react(e2)
        const f1 = (r, u) => r.emoji.name === e1 && u.id === author.id
        const f2 = (r, u) => r.emoji.name === e2 && u.id === author.id
        const c1 = message.createReactionCollector(f1, { time: time })
        const c2 = message.createReactionCollector(f2, { time: time })
        return new Promise(resolve => {
            let timeOut = setTimeout(() => {
                resolve(undefined)
                message.channel.send({ embed: { author: { name: `⭕ ${msg ? msg : "You took too long to react!"}` }, color: "#FF0000" } })
                if (active) active.delete(message.channel.id)
            }, time)
            c1.on("collect", r => { resolve(r); clearTimeout(timeOut); if (active) active.delete(message.channel.id) })
            c2.on("collect", r => { resolve(r); clearTimeout(timeOut); if (active) active.delete(message.channel.id) })
        })
    }


    /*start() {
        let logo = `                   --                   
                  -//-                  
                 -////-                 
                -+++///-                
               -+++++++/-               
              -++++++++++- `
        let logo2 = `             -o++++//+++++-             
            :ooooo/  /+++++-            
           :ooooo/    /ooooo-           
          :ooooo+      +ooooo:          
         :ooooo+       \`+ooooo:`
        let logo3 = `        :sssss+\`        \`+sssss:        
       :sssss+\`     ......osssss:       
      :sssss+\`     +sssssssssyyyy/      
     :ssssso\`     +yyyyyyyyyyyyyyy/     
    :ssssso\`     +yyyyyyyyyyyyyyyyy/`
        let azure = `\n\n  █████╗ ███████╗██╗   ██╗██████╗ ███████╗
 ██╔══██╗╚══███╔╝██║   ██║██╔══██╗██╔════╝
 ███████║  ███╔╝ ██║   ██║██████╔╝█████╗  
 ██╔══██║ ███╔╝  ██║   ██║██╔══██╗██╔══╝  
 ██║  ██║███████╗╚██████╔╝██║  ██║███████╗
 ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`
        console.log([chalk.rgb(66, 200, 255)(logo), chalk.rgb(49, 148, 255)(logo2), chalk.rgb(22, 59, 255)(logo3), chalk.rgb(0, 127, 255)(azure)].join("\n"))
    }*/
}

module.exports = Functions