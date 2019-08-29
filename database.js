const mongoose = require('mongoose');
const User = require('./models/User');

let connect = (dbUrl) => {
    mongoose.connect(dbUrl, { useNewUrlParser: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'database connection error:'));
}

let addPlayer = (discordId, openDotaId, callback) => {
    let player = new User({
        DiscordId: discordId,
        OpenDotaId: openDotaId
    });
    console.log(player);
    player.save();
}

let getPlayer = (discordId, callback) => {
    User.findOne({ DiscordId: discordId }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    })
}

module.exports = {
    connect: connect,
    addPlayer: addPlayer,
    getPlayer: getPlayer
};