const mongoose = require('mongoose');
const User = require('./models/User');

/**
 * Connect to the MongoDB database.
 * @param {*} dbUrl The URL of the database to connect to.
 */
const connect = (dbUrl) => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

/**
 * Add a new player to the database.
 * @param {*} discordId The Discord ID of the new player.
 * @param {*} openDotaId The OpenDota ID of the new player.
 * @returns The newly added player, null if the player already exists.
 */
const addPlayer = (discordId, openDotaId) => {
    return getPlayer(discordId)
        .then(player => {
            if (player != null) {
                return null;
            } else {
                let player = new User({
                    DiscordId: discordId,
                    OpenDotaId: openDotaId
                });
                return player.save();
            }
        })
        .catch(err => { return err });
}

/**
 * Retrieve the details of a player.
 * @param {*} discordId The Discord ID of the player whose details should be retrieved. 
 * @param {*} projection The projection to perform on the retrieved results, if any.
 * @returns null if there is no such player, otherwise the details of the player..
 */
const getPlayer = (discordId, projection) => {
    return User
        .findOne({ DiscordId: discordId }, projection)
        .then(player => { return player })
        .catch(err => { return err });
}

/**
 * Update the OpenDota ID of an existing player.
 * @param {*} discordId The Discord ID of the existing player.
 * @param {*} newOpenDotaId The new OpenDota ID of the player.
 * @returns null if there is no such player, otherwise the old details of the player.
 */
const updatePlayer = (discordId, newOpenDotaId) => {
    return User
        .findOneAndUpdate({ DiscordId: discordId }, { OpenDotaId: newOpenDotaId })
        .then(result => { return result })
        .catch(err => { return err });
}

/**
 * Removes an existing player from the database.
 * @param {*} discordId The Discord ID of the player who should be removed.
 * @returns 0 if no such player exists, 1 if the player has been removed.
 */
const removePlayer = (discordId) => {
    return User
        .deleteOne({ DiscordId: discordId })
        .then(result => { return result.n })
        .catch(err => { return err });
}

module.exports = {
    connect: connect,
    addPlayer: addPlayer,
    getPlayer: getPlayer,
    updatePlayer: updatePlayer,
    removePlayer: removePlayer
};