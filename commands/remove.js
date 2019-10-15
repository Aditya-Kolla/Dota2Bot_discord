const _removeUserProfile = async ({message, params, db} = payload) => {
    if(params.length > 0) {
        return message.reply("invalid use of command.");
    }
    let user = message.author;
    let result = db.removePlayer(user);
    if(result === 1) {
        return message.reply("your profile has been successfully removed.");
    } else {
        return message.reply("something went wrong, try again.");
    }
}

const removeUserProfile = async (payload) => {
    _removeUserProfile(payload);
}

module.exports = {
    removeCommand: removeUserProfile
};