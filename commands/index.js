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
    if (message.author.bot)
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