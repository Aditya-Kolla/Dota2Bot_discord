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
        msg = msg.split(/\s+/);
        console.log(msg);
        switch (msg[0]) {
            case "me":
                stats.setUserProfile(message, msg)
                break;

            case "remove":
                stats.removeUserProfile(message);
                break;
            case "ping":
                message.reply("PONG");
                break;

            case "MEDAL":
                stats.showMedalGlobal(message)
                break;

            case "medal":
                stats.showMedalPersonal(message);
                break;

            case "KDA":
                stats.showKdaGlobal(message);
                break;

            case "kda":
                stats.showKdaPersonal(message);
                break;

            case "wl":
                stats.showWinLoss(message);
                break;

            case "WL":
                stats.showWinLoss(message);
                break;
            
            case "1v1":
                stats.playerBattle(message, msg);
                break;
            default: message.reply("What are you trying to do?");
        }
    }
});

client.login(auth.token);

