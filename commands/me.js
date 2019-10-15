const _setUserProfile = async ({message, params, db} = payload) => {
    let user = message.author;
    let openDotaId = params[0];
    let result = db.addPlayer(user, openDotaId);
    if(result === null) {
        return message.reply("a profile already exists!");
    } else {
        return message.reply("your profile has been set.");
    }
}

const setUserProfile = async(payload) => {
    _setUserProfile(payload);
}

module.exports = {
    meCommand = _setUserProfile
};