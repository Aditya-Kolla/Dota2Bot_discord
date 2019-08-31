const mongoose = require('mongoose');
const User = require('./models/User');

let logger = console.log;

const attachLogger = (userLogger) => {
    logger = userLogger;
}

const connect = (dbUrl) => {
    mongoose.connect(dbUrl, { useNewUrlParser: true });
    let db = mongoose.connection;
    db.once('open', () => logger(`Connected to the database.`));
}

const addPlayer = (discordId, openDotaId, callback) => {
    let player = new User({
        DiscordId: discordId,
        OpenDotaId: openDotaId
    });
    logger(`Player saved to database:${player}.`);
    player.save();
}

const getPlayer = (discordId, callback, projection) => {
    User.findOne({ DiscordId: discordId }, projection, (err, result) => {
        if (err) {
            logger(err);
        } else {
            callback(result);
        }
    })
}

module.exports = {
    attachLogger: attachLogger,
    connect: connect,
    addPlayer: addPlayer,
    getPlayer: getPlayer
};