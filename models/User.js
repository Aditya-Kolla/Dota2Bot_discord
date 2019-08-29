const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    DiscordId: String,
    OpenDotaId: String,
    LastUpdate: Date
});

let User = mongoose.model('Users', UserSchema);

module.exports = User;