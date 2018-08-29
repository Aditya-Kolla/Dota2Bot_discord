//BOT REQUIRES
const Discord   = require('discord.js'),
    auth        = require('./auth.json'),
    client      = new Discord.Client();

//GLOBAL VARIABLES
const prefix = "!";

client.on("ready", _ => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    let msg = message.content;
    if(msg.startsWith(prefix)){
        msg = msg.substring(1);
        switch(msg){
            case "ping":
                message.reply("PONG");
                break;
            default: message.reply("What are you trying to do?");
        }
    }
});

client.login(auth.token);