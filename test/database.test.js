const mocha = require('mocha');
const assert = require('assert');
const db = require('../database');
const dbUrl = 'mongodb://localhost/testdb';

// Necessary import to do collection cleanup.
const mongoose = require('mongoose');


describe("Testing database operations.", function () {
    this.timeout(5000);

    before(() => {
        // If this fails, they rest of the tests would fail anyway.
        return db.connect(dbUrl);
    });
    
    after((done) => {
        return mongoose.disconnect(() => {
            done();
        });
    });

    beforeEach((done) => {
        return mongoose.connection.collection("users").drop((any) => {
            done();
        });
    });

    it("Adding a new user with the DiscordId: ADD_ID", (done) => {
        db.addPlayer("ADD_ID", "TEST_ID").then((testPlayer) => {
            assert(testPlayer.DiscordId === "ADD_ID");
            done();
        });
    });

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