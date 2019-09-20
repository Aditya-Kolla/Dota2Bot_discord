const mocha = require('mocha');
const assert = require('assert');
const db = require('../database');
const dbUrl = 'mongodb://localhost/testdb';

// Necessary import to do collection cleanup.
const mongoose = require('mongoose');

// If this fails, they rest of the tests would fail anyway.
db.connect(dbUrl);

describe("Testing database operations.", () => {

    beforeEach((done) => {
        mongoose.connection.collection("users").drop(() => {
            done();
        });
    });

    it("Adding a new user with the DiscordId: ADD_ID", (done) => {
        db.addPlayer("ADD_ID", "TEST_ID").then((testPlayer) => {
            assert(testPlayer.DiscordId === "ADD_ID");
            done();
        });
    })

    it("Retrieving a user with the DiscordId: FIND_ID", (done) => {
        db.addPlayer("FIND_ID", "TEST_ID").then(() => {
            db.getPlayer("FIND_ID").then((testPlayer) => {
                assert(testPlayer.DiscordId === "FIND_ID");
                done();
            });
        });
    });

    it("Updating a user with the DiscordId: UPDT_ID", (done) => {
        db.addPlayer("UPDT_ID", "OLD_ID").then(() => {
            db.updatePlayer("UPDT_ID", "NEW_ID").then(() => {
                db.getPlayer("UPDT_ID").then((testPlayer) => {
                    assert(testPlayer.OpenDotaId === "NEW_ID");
                    done();
                });
            });
        });
    });

    it("Deleting a user with the DiscordId: BYE_ID", (done) => {
        db.removePlayer("BYE_ID").then((result) => {
            assert(result === 0);
        });
        db.addPlayer("BYE_ID", "TEST_ID").then(() => {
            db.removePlayer("BYE_ID").then((result) => {
                assert(result === 1);
                done();
            });
        });
    });

});

process.on('SIGINT', () => {
    mongoose.connection.collection("users").drop().then(() => {
        mongoose.connection.close();
    });
});