const fetch = require('node-fetch');

const vars = require("../app_variables.json");

var stats = {};


//Actual call methods in bot.js
stats.showMedal = async(message) =>{
    vars.playerId.forEach( player => {
        let newUrl = vars.playerUrl + player[1];
        getMedal(player[0], newUrl, message);
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

module.exports = stats;