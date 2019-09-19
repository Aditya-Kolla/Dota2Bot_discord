const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    DiscordId: {
        type: String,
        required: true,
        unique: true
    },
    OpenDotaId: {
        type: String,
        required: true,
        unique: true
    },
    LastUpdate: Date
});

let User = mongoose.model('Users', UserSchema);

module.exports = User;