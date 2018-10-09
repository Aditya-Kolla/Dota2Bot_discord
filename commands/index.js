const fetch = require('node-fetch');
const Database = require('nedb');
let db = new Database({ filename: "./playerProfiles.json", autoload: true });


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
    db.find({ DiscordID: author }, (error, players) => {
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
    db.find({ DiscordID: author }, (error, players) => {
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
        }
        else if (players.length > 1) {
            players.forEach(player => {
                let url = vars.playerUrl + player['Dota2'] + '/wl';
                _showWinLoss(player['Name'], url, message)
            });
        }
        else {
            message.channel.send('Register player profiles first');
        }
    });

}
stats.setUserProfile = async (message, msg) => {
    let player = message.author.id;
    try {
        let name = msg[1];
        let userID = msg[2];
        console.log(msg);
        await _setUserProfile(player, name, userID, message);
    }
    catch (err) {
        console.error(err);

    }
};

stats.playerBattle = async (message, msg) => {
    let [, playerA, , playerB] = msg;
    try{
        let pA = '';
        let pB = '';
        db.find({$or:[{Name: playerA}, {Name: playerB}]}, async(error, players) => {
            if(players.length != 2)
                return message.reply("The requested player profiles do not exist!");
            players.forEach(player => {
                if(playerA == player['Name'])
                    pA = player['Dota2'];
                if(playerB == player['Name'])
                    pB = player['Dota2'];
            });
            await _playerBattle(message, pA, pB, playerA, playerB);
        });
    }
    catch(error){
        console.error(error);
        
    }
};

stats.removeUserProfile = async (message) => {
    let user = message.author.id;
    _removeUserProfile(message, user);
}

stats.helpMessage = async (message) => {
    _showHelpMessage(message);
}







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

const _showWinLoss = async (name, url, message) => {
    try {
        const res = await fetch(url);
        const wl = await res.json();
        const { win, lose } = wl;
        let output = `${name} has won ${win} matches and has lost ${lose} matches for a Win % of ${(win / (win + lose) * 100).toFixed(2)}.`;
        console.log(output);
        message.channel.send(output);
    }
    catch (error) {
        console.error(error);

    }
};

const _playerBattle = async (message, playerA, playerB, nameA, nameB) => {
    try{
        let urlA = vars.playerUrl + playerA;
        let urlB = vars.playerUrl + playerB;
        let mmrA = await fetch(urlA);
        mmrA = await mmrA.json();
        mmrA = mmrA['mmr_estimate']['estimate'];
        let mmrB = await fetch(urlB)
        mmrB = await mmrB.json()
        mmrB = mmrB['mmr_estimate']['estimate'];
        let tA = await fetch(urlA + '/wl');
        let {win: wA, lose: lA} = await tA.json();
        let tB = await fetch(urlB + '/wl')
        let{win: wB, lose: lB} = await tB.json();
        let recents = await fetch(urlA + '/recentMatches')
        recents = await recents.json();
        let statsA = {kills : 0, deaths : 0, assists: 0, mmr : mmrA, wins: wA, losses: lA};
        recents.forEach(match => {
            statsA.kills += match['kills'];
            statsA.deaths += match['deaths'];
            statsA.assists += match['assists'];
        });
        let statsB = {kills : 0, deaths : 0, assists : 0, mmr: mmrB, wins : wB, losses : lB};
        recents = await fetch(urlB + '/recentMatches')
        recents = await recents.json();
        recents.forEach(match => {
            statsB.kills += match['kills'];
            statsB.deaths += match['deaths'];
            statsB.assists += match['assists'];
        })
        let output = '';
        let sA = 0;
        let sB = 0;
        Object.keys(statsA).forEach(stat => {
            let s = statsA[stat] - statsB[stat];
            if(s > 0){
                if(stat=='deaths' || stat=='losses'){
                    output += `${nameB} has less ${stat} than ${nameA} with ${statsB[stat]}: ${nameB}\n`;
                    sB++;
                }
                else{
                    output += `${nameA} has more ${stat} than ${nameB} with ${statsA[stat]}: ${nameA}\n`;
                    sA++;
                }
            }
            else if(s == 0){
                output += `${nameA} and ${nameB} have the same ${stat}: DRAW\n`;
            }
            else{
                if(stat=='deaths' || stat=='losses'){
                    output += `${nameA} has less ${stat} than ${nameB} with ${statsA[stat]}: ${nameA}\n`;
                    sA++;
                }
                else{
                    output += `${nameB} has more ${stat} than ${nameA} with ${statsB[stat]}: ${nameB}\n`;
                    sB++;
                }
            }
        });
        if(sA > sB)
            output += `${nameA} wins the duel!`;
        else if(sB > sA)
            output += `${nameB} wins the duel!`;
        else
            output += `It's a draw!`;
        message.channel.send(output);
    }
    catch(error){
        console.error(error);
        
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
                return message.reply('Your user profile has been set');
            }
        });
    }
    catch (err) {
        console.error(err);
    }
};

const _removeUserProfile = async (message, user) => {
    try {
        db.remove({ DiscordID: user }, (error, numRemoved) => {
            if (error)
                console.log(error);
            else
                message.reply(", your profile has been successfully deleted!")
        });
    }
    catch (error) {
        console.error(error);
    }
};

const _showHelpMessage = async (message) => {
    try{
        const helpMessage = "You can use these commands in the Dota2 discord bot:" + "\n";
        helpMessage += "!me -- This command is used to setup your name and opendota ID with our database. It takes two arguments- name and the opendota ID." + "\n" +
                       "!remove -- Remove user profile" + "\n" +
                       "!ping -- Try this command for fun!" + "\n" +
                       "!MEDAL -- This is a global command. It is used to fetch the medal ratings of all players in DB." + "\n" +
                       "!medal -- This command prints your medal rating." + "\n" +
                       "!KDA -- This is a global command. It is used to fetch the last game's KDA of all registered players." + "\n" +
                       "!kda -- This command fetches your last game's Kill Death Assists." + "\n" +
                       "!wl -- This command fetches your overall win and loss percentage." + "\n" +
                       "!WL -- This is a global command. It is used to fetch the win rate of all registered users." + "\n" +
                       "!1v1 -- This command takes two arguments- names of two registered users and puts them against each other. Calculating lifetime and recent games stats to declare one player as the winner." + "\n" +
                       "!help -- Show this help message";

        message.reply(helpMessage);
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = stats;