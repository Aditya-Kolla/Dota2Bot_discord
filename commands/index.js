const fetch = require('node-fetch');
const Database = require('nedb');
let db = new Database({filename: "./playerProfiles.json", autoload: true});


const vars = require("../app_variables.json");

var stats = {};


//Actual call methods in bot.js
stats.showMedal = async (message) => {
    vars.playerId.forEach(player => {
        let newUrl = vars.playerUrl + player[1];
        getMedal(player[0], newUrl, message);
    });
};

stats.showRecentsGlobal = async (message) => {
    // params = params.replace("recents", "").trim();
    // let number = parseInt(params);
    // if(params == NaN || params > 5){
    //     return message.channel.send("Try again!");
    // }
    vars.playerId.forEach(player => {
        let url = vars.playerUrl + player[1];
        // for(let m = 0; m < number; m++)
        getRecents(player[0], url + '/recentMatches', message);
    });
};

stats.showRecents = async(message) => {
    let player = message.author.id;
    try{
        console.log("Fetching the latest match of user: " + player);
        await _showRecents(player, message);
    }
    catch(er){
        console.error(er);
        
    }
};

stats.initializeUserProfile = async(message) =>{
    let player = message.author.id;
    try{
        let userID = message.content.replace("!me", "").trim();
        console.log(userID);
        await _initiliazeUserProfile(player, userID, message);
    }
    catch(er){
        console.error(er);
        
    }
};








// Helper functions
//Never call them directly in bot.js
const getMedal = async (name, url, message) => {
    try {
        const res = await fetch(url);
        const json = await res.json();
        let rank = json["rank_tier"];
        let medal = vars.medals[Math.floor(rank / 10) - 1] + " (" + rank % 10 + ")";
        let output = name + " : " + medal;
        console.log(output);
        message.channel.send(output);
    } catch (err) {
        console.log(err);
    }
};

const getRecents = async (name, url, message) => {
    try {
        const res = await fetch(url);
        const matches = await res.json();
        let output = name + "\'s latest match " + ", kills: " + matches[0]['kills'] + ", deaths: " + matches[0]['deaths'] + ", and assists: "
            + matches[0]['assists'] + ".";
        console.log(output);
        message.channel.send(output);
    }
    catch (er) {
        console.error(er);

    }
};

const _initiliazeUserProfile = async(player, userID, message) => {
    try{
        db.find({DiscordID : player}, (error, result) => {
            if(result.length != 0)
                return message.reply("The user profile already exists!");
            else{
                db.insert({DiscordID : player, Dota2: userID});
                return message.reply("Your user profile has been set!");
            }
        });
    }
    catch(er){
        console.error(er);
    }
};

const _showRecents = async(player, message) => {
    try{
        db.find({DiscordID : player}, async (error, result) => {
            if(result.length == 0 )
                return message.reply("You have no user profile!");
            else{
                let playerID = result[0]['Dota2'];
                try{
                    const res = await fetch(vars.playerUrl + `${playerID}/recentMatches`);
                    const matches = await res.json();
                    let output = `your latest match, kills : ${matches[0]['kills']}, deaths : ${matches[0]['deaths']}, and assists : ${matches[0]['assists']}.`;
                    await message.reply(output);
                }
                catch(er){
                    console.error(er);
                    await message.reply("Ooops bot broke!");
                }
            }
        });
    }
    catch(er){
        console.error(er);
        
    }
};

module.exports = stats;