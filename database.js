var mongoose = require('mongoose');
var auth = require('./dbauth.js');
var Schema = mongoose.Schema;
var PlayerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    discordID: {
        type: Number,
        required: true
    },
    dotaID: {
        type: Number,
        required: true
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

mongoose.connect(dbUrl, (err) =>{
    if(err)
        return console.log("Error connecting to the database.");
    console.log("Connected!"); //remove later
});

exports.addPlayer = (name, discordID, dotaID) => {
    Player.create({name: name, discordID: discordID, dotaID: dotaID}, (err, result) => {
        if(err)
            return console.log("Player creation failed!");
        console.log(result);
    });
}

exports.searchPlayer = (record, callback) => {
    if(record['name'] != undefined){
        _searchPlayer({name: record['name']}, callback);
    }
    else if(record['dotaID'] != undefined)
        _searchPlayer({dotaID: record['dotaID']}, callback);
    else if(record['discordID'] != undefined)
        _searchPlayer({discordID: record['discordID']}, callback);
    else
        return 'error';
}

_searchPlayer = (field, callback) => {
    Player.find(field, (error, result) => {
        if(error)
            return 'error';
        else
            callback(result);
    });
}