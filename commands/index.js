const fetch = require('node-fetch');
const Database = require('nedb');
let db = new Database({filename: "./playerProfiles.json", autoload: true});


const vars = require("../app_variables.json");

var stats = {};


//Actual call methods in bot.js
//Global Functions
stats.showMedalGlobal = async (message) => {
    db.find({}, (error, players) => {
        if(error) 
            console.log(error);
        if(players.length > 0){
            players.forEach(player => {
                let url = vars.playerUrl + player["Dota2"];
                _getMedal(player["Name"], url, message);
            });
        } else {
            message.channel.send("Register player profiles first");
        }
    });
};

stats.showKdaGlobal = async (message) => {
    db.find({}, (error, players) => {
        if(error)
            console.log(error);
        if(players.length > 0){
            players.forEach(player => {
                let url = vars.playerUrl + player["Dota2"] + '/recentMatches';
                _getKda(player["Name"], url, message);
            });
        } else {
            message.channel.send("Register player profiles first");
        }
    });
};


//Personal functions
stats.showMedalPersonal = async (message) => {
    let author = message.author.id;
    db.find({DiscordID: author}, (error, players) => {
        if (error) console.log(error);
        if(players.length > 0){
            players.forEach(player => {
                let newUrl = vars.playerUrl + player["Dota2"];
                _getMedal(player["Name"], newUrl, message);
            });
        } else {
            message.reply("You have no user profile! Register player profile");
        }
    });
};

stats.showKdaPersonal = async(message) => {
    db.find({}, (error, players) => {
        if (error)
            console.log(error);
        if (players.length > 0) {
            players.forEach(player => {
                let url = vars.playerUrl + player["Dota2"] + '/recentMatches';
                _getKda(player["Name"], url, message);
            });
        } else {
            message.channel.send("Register player profiles first");
        }
    });
};

stats.setUserProfile = async(message, msg) =>{
    let player = message.author.id;
    try{
        let name = msg[1];
        let userID = msg[2];
        console.log(msg);
        await _setUserProfile(player, name, userID, message);
    }
    catch(err){
        console.error(err);
        
    }
};








// Helper functions
//Never call them directly in bot.js
const _getMedal = async (name, url, message) => {
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

const _getKda = async (name, url, message) => {
    try {
        const res = await fetch(url);
        const matches = await res.json();
        let output = name + "\'s latest match " + ", kills: " + matches[0]['kills'] + ", deaths: " + matches[0]['deaths'] + ", and assists: "
            + matches[0]['assists'] + ".";
        console.log(output);
        message.channel.send(output);
    }
    catch (err) {
        console.error(err);
    }
};



// const _showRecents = async (player, message) => {
//     try{
//         db.find({DiscordID : player}, async (error, result) => {
//             if(error) 
//                 console.log(error);
//             if(result.length == 0 )
//                 return message.reply("You have no user profile!");
//             else{
//                 let playerID = result[0]['Dota2'];
//                 try{
//                     const res = await fetch(vars.playerUrl + `${playerID}/recentMatches`);
//                     const matches = await res.json();
//                     let output = `your latest match, kills : ${matches[0]['kills']}, deaths : ${matches[0]['deaths']}, and assists : ${matches[0]['assists']}.`;
//                     message.reply(output);
//                 }
//                 catch(err){
//                     console.error(err);
//                     await message.reply("Ooops bot broke!");
//                 }
//             }
//         });
//     }
//     catch(err){
//         console.error(err);   
//     }
// };

const _setUserProfile = async (player, name, userID, message) => {
    try {
        db.find({ DiscordID: player }, (error, players) => {
            if (error)
                console.log(error);
            if (players.length > 0)
                return message.reply("The user profile already exists!");
            else {
                db.insert({ Name: name, DiscordID: player, Dota2: userID });
                return message.reply('Your user profile has been set' );
            }
        });
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = stats;