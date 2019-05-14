
const mongoCollections = require("../config/mongoCollections");
const sessions = mongoCollections.sessions;
const uuid = require("node-uuid");

let exportedMethods = {

    async addSession(audioFile) {
        const sessionCollection = await sessions();
        const newSession = {
            audioFile: audioFile,
            segments: [],
            words: [],
            date: new Date,
            isTranscribe: false,
            isProcessed: false,
            _id: uuid.v4()
        };
        const newInsertInformation = await sessionCollection.insertOne(newSession);
        const newId = newInsertInformation.insertedId;
        return await this.getSessionById(newId);
    },

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

};

module.exports = exportedMethods;
