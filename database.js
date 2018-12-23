var mongoose = require('mongoose');
var auth = require('./dbauth.js');
var Schema = mongoose.Schema;
var PlayerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discordID: {
        type: Number,
        required: true,
        unique: true
    },
    dotaID: {
        type: Number,
        required: true,
        unique: true
    },
    dateJoined: {
        type: Date,
        default: Date.now,
        required: true
    }
});

var db = mongoose.connection;
var dbUrl = 'mongodb://' + auth.user + ':' + auth.password + '@ds145083.mlab.com:45083/meramongodb';

var Player = mongoose.model('Player', PlayerSchema);

db.on('error', () => {
    console.log("Error communicating with the database.");
});

mongoose.connect(dbUrl, (err) => {
    if (err)
        return console.log("Error connecting to the database.");
    console.log("Connected to the database."); //remove later
});

exports.addPlayer = (name, discordID, dotaID) => {
    Player.create({
        name: name,
        discordID: discordID,
        dotaID: dotaID
    }, (err, result) => {
        if (err)
            return console.log("Player creation failed!");
        console.log(result);
    });
}

exports.searchPlayer = (record, callback) => {
    _dataOverloader(record, _searchPlayer, callback);
}

exports.removePlayer = (record, callback) => {
    _dataOverloader(record, _removePlayer, callback);
}

//Helper functions

_dataOverloader = (record, helper, callback) => {
    if (record['name'] != undefined) {
        helper({
            name: record['name']
        }, callback);
    } else if (record['dotaID'] != undefined)
        helper({
            dotaID: record['dotaID']
        }, callback);
    else if (record['discordID'] != undefined)
        helper({
            discordID: record['discordID']
        }, callback);
    else
        return 'error';
}

_searchPlayer = (field, callback) => {
    Player.findOne(field, (error, result) => {
        if (error)
            return 'error';
        else if (result === null)
            return 'Record doesn\'t exist.';
        else {
            let player = {
                name: result['name'],
                dotaID: result['dotaID'],
                discordID: result['discordID']
            };
            callback(player);
        }
    });
}

_removePlayer = (field, callback) => {
    Player.deleteOne(field, (error, result) => {
        if (error)
            return 'Player doesn\'t exist';
        else
            callback(result);
    });
}