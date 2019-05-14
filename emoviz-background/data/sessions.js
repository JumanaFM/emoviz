
const mongoCollections = require("../config/mongoCollections");
const sessions = mongoCollections.sessions;
const uuid = require("node-uuid");

let exportedMethods = {

    async getSessionById(id) {
        const sessionCollection = await sessions();
        const session = await sessionCollection.findOne({ _id: id });
        if (!session) throw "session not found";
        return session;
    },

    async getAllSessions() {
        const sessionCollection = await sessions()
        return await sessionCollection.find({}).toArray()
    },

    async patchSession(id, updatedSession) {
        const sessionCollection = await sessions();
        const updatedSessionData = {};

        if (updatedSession.isTranscribe) {
            updatedSessionData.isTranscribe = updatedSession.isTranscribe;
        }

        if (updatedSession.isProcessed) {
            updatedSessionData.isProcessed = updatedSession.isProcessed;
        }

        if (updatedSession.words) {
            updatedSessionData.words = updatedSession.words;
        }

        if (updatedSession.segments) {
            updatedSessionData.segments = updatedSession.segments;
        }

        let updateCommand = {
          $set: updatedSessionData
        };
        const query = {
          _id: id
        };
        await sessionCollection.updateOne(query, updateCommand);

        return await this.getSessionById(id);
    },

};

module.exports = exportedMethods;
