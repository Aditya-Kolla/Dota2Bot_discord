const fetch = require('node-fetch');

const vars = require("../app_variables.json");

var stats = {};


//Actual call methods in bot.js
stats.showMedal = async (message) => {
    vars.playerId.forEach(player => {
        let newUrl = vars.playerUrl + player[1];
        getMedal(player[0], newUrl, message);
    });
};

stats.showRecents = async (message, params) => {
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
module.exports = stats;