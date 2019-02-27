// const fetch = require('node-fetch');
const axios = require('axios');
const Database = require('nedb');
let db = new Database({
    filename: "./playerProfiles.json",
    autoload: true
});

const vars = require("../app_variables.json");

var stats = {};


//Actual call methods in bot.js
//Global Functions
stats.showMedalGlobal = async (message) => {
    db.find({}, (error, players) => {
        if (error)
            console.log(error);
        if (players.length > 0) {
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


//Personal functions
stats.showMedalPersonal = async (message) => {
    let author = message.author.id;
    db.find({
        DiscordID: author
    }, (error, players) => {
        if (error) console.log(error);
        if (players.length > 0) {
            players.forEach(player => {
                let newUrl = vars.playerUrl + player["Dota2"];
                _getMedal(player["Name"], newUrl, message);
            });
        } else {
            message.reply("You have no user profile! Register player profile");
        }
    });
};

stats.showKdaPersonal = async (message) => {
    let author = message.author.id;
    db.find({
        DiscordID: author
    }, (error, players) => {
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

stats.showWinLoss = async (message) => {
    let player = {};
    if (message.content === '!wl')
        player.DiscordID = message.author.id;
    console.log(player);
    db.find(player, (error, players) => {
        console.log(players);
        if (error)
            console.log(error);
        if (players.length == 1) {
            let url = vars.playerUrl + players[0]['Dota2'] + '/wl';
            _showWinLoss(players[0]['Name'], url, message);
        } else if (players.length > 1) {
            players.forEach(player => {
                let url = vars.playerUrl + player['Dota2'] + '/wl';
                _showWinLoss(player['Name'], url, message)
            });
        } else {
            message.channel.send('Register player profiles first');
        }
    });

}
stats.setUserProfile = async (message, msg) => {
    let player = message.author.id;
    if(message.author.bot)
        return;
    try {
        let name = msg[1];
        let userID = msg[2];
        console.log(msg);
        await _setUserProfile(player, name, userID, message);
    } catch (err) {
        console.error(err);
    }
};

// stats.playerBattle = async (message, msg) => {
//     console.log(msg);
//     try {
//         let pA = '';
//         let pB = '';
//         if (msg.length < 3) {
//             db.find({
//                 $or: [{
//                     Name: msg[1]
//                 }, {
//                     DiscordID: message.author.id
//                 }]
//             }, async (error, players) => {
//                 let me = '';
//                 if (players.length != 2)
//                     return message.reply("The requested player profiles do not exist!");
//                 players.forEach(player => {
//                     if (player['DiscordID'] == message.author.id) {
//                         pA = player['Dota2'];
//                         me = player['Name'];
//                     } else
//                         pB = player['Dota2'];
//                 });
//                 if (pb != '')
//                     await _playerBattle(message, pA, pB, me, msg[1]);
//                 else
//                     message.reply.send("https://www.goiowaawesome.com/sites/default/files/styles/904x490/public/c/2017/09/1983_h.jpg?itok=0097jRvB");
//             }).catch(console.error);
//         } else {
//             db.find({
//                 $or: [{
//                     Name: playerA
//                 }, {
//                     Name: playerB
//                 }]
//             }, async (error, players) => {
//                 if (players.length != 2)
//                     return message.reply("The requested player profiles do not exist!");
//                 players.forEach(player => {
//                     if (playerA == player['Name'])
//                         pA = player['Dota2'];
//                     if (playerB == player['Name'])
//                         pB = player['Dota2'];
//                 });
//                 await _playerBattle(message, pA, pB, playerA, playerB);
//             }).catch(console.error);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };

stats.removeUserProfile = async (message) => {
    let user = message.author.id;
    _removeUserProfile(message, user);
}







// Helper functions
//Never call them directly in bot.js
const _getMedal = async (name, url, message) => {
    try {
        const json = await axios(url);
        // console.log(json);
        let rank = json["data"]["rank_tier"];
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
        let matches = await axios.get(url);
        matches = matches["data"];
        let output = name + "\'s latest match " + ", kills: " + matches[0]['kills'] + ", deaths: " + matches[0]['deaths'] + ", and assists: " +
            matches[0]['assists'] + ".";
        console.log(output);
        message.channel.send(output);
    } catch (err) {
        console.error(err);
    }
};

const _showWinLoss = async (name, url, message) => {
    try {
        let wl = await axios.get(url);
        wl = wl["data"];
        const {
            win,
            lose
        } = wl;
        let output = `${name} has won ${win} matches and has lost ${lose} matches for a Win % of ${(win / (win + lose) * 100).toFixed(2)}.`;
        console.log(output);
        message.channel.send(output);
    } catch (error) {
        console.error(error);

    }
};

// const _playerBattle = async (message, playerA, playerB, nameA, nameB) => {
//     try {
//         let urlA = vars.playerUrl + playerA;
//         let urlB = vars.playerUrl + playerB;
//         let mmrA = await axios.get(urlA);
//         mmrA = mmrA["data"]['mmr_estimate']['estimate'];
//         let mmrB = await axios.get(urlB);
//         mmrB = mmrB["data"]['mmr_estimate']['estimate'];
//         let tA = await axios.get(urlA + '/wl');
//         // let {
//         //     win: wA,
//         //     lose: lA
//         // } = await tA;
//         let tB = await axios.get(urlB + '/wl')
//         // let {
//         //     win: wB,
//         //     lose: lB
//         // } = await tB;

//         let recents = await axios.get(urlA + '/recentMatches')
//         recents = recents["data"];
//         let statsA = {
//             kills: 0,
//             deaths: 0,
//             assists: 0,
//             mmr: mmrA,
//             wins: tA["data"]["win"],
//             losses: tA["data"]["lose"]
//         };
//         recents.forEach(match => {
//             statsA.kills += match['kills'];
//             statsA.deaths += match['deaths'];
//             statsA.assists += match['assists'];
//         });
//         let statsB = {
//             kills: 0,
//             deaths: 0,
//             assists: 0,
//             mmr: mmrB,
//             wins: tB["data"]["win"],
//             losses: tB["data"]["lose"]
//         };
//         recents = await axios.get(urlB + '/recentMatches');
//         recents = recents.data;
//         recents.forEach(match => {
//             statsB.kills += match['kills'];
//             statsB.deaths += match['deaths'];
//             statsB.assists += match['assists'];
//         })
//         let output = '';
//         let sA = 0;
//         let sB = 0;
//         Object.keys(statsA).forEach(stat => {
//             let s = statsA[stat] - statsB[stat];
//             if (s > 0) {
//                 if (stat == 'deaths' || stat == 'losses') {
//                     output += `${nameB} has less ${stat} than ${nameA} with ${statsB[stat]}: ${nameB}\n`;
//                     sB++;
//                 } else {
//                     output += `${nameA} has more ${stat} than ${nameB} with ${statsA[stat]}: ${nameA}\n`;
//                     sA++;
//                 }
//             } else if (s == 0) {
//                 output += `${nameA} and ${nameB} have the same ${stat}: DRAW\n`;
//             } else {
//                 if (stat == 'deaths' || stat == 'losses') {
//                     output += `${nameA} has less ${stat} than ${nameB} with ${statsA[stat]}: ${nameA}\n`;
//                     sA++;
//                 } else {
//                     output += `${nameB} has more ${stat} than ${nameA} with ${statsB[stat]}: ${nameB}\n`;
//                     sB++;
//                 }
//             }
//         });
//         if (sA > sB)
//             output += `${nameA} wins the duel!`;
//         else if (sB > sA)
//             output += `${nameB} wins the duel!`;
//         else
//             output += `It's a draw!`;
//         message.channel.send(output);
//         console.log(output);
//     } catch (error) {
//         console.error(error);

//     }
// };

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
        db.find({
            DiscordID: player
        }, (error, players) => {
            if (error)
                console.log(error);
            if (players.length > 0)
                return message.reply("The user profile already exists!");
            else {
                db.insert({
                    Name: name,
                    DiscordID: player,
                    Dota2: userID
                });
                return message.reply('Your user profile has been set');
            }
        });
    } catch (err) {
        console.error(err);
    }
};

const _removeUserProfile = async (message, user) => {
    try {
        db.remove({
            DiscordID: user
        }, (error, numRemoved) => {
            if (error)
                console.log(error);
            else
                message.reply(", your profile has been successfully deleted!")
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = stats;