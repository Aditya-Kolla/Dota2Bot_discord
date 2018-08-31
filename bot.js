//BOT REQUIRES
const Discord = require('discord.js'),
    fetch = require('node-fetch');
client = new Discord.Client(),
    auth = require('./auth.json');

//CONFIG 
const vars = require("./app_variables.json");

//All the method calls
const stats = require('./commands/index');


client.on("ready", _ => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    let msg = message.content;
    if (msg.startsWith(vars.prefix)) {
        msg = msg.substring(1);
        commands = msg.split(/\s+/);
        switch (commands[0]) {
            case "ping":
                message.reply("PONG");
                break;
            case "medal":
                stats.showMedal(message);
                break;
            case "RECENTS":
                stats.showRecentsGlobal(message);
                break;
            case "recents":
                stats.showRecents(message);
                break;
            case "me":
                stats.initializeUserProfile(message, commands[1]);
                break;
            case "remove":
                stats.removeProfile(message);
                console.log("Trying to remove profile");
                break;
            default: message.reply("What are you trying to do?");
        }
    }
});

client.login(auth.token);

