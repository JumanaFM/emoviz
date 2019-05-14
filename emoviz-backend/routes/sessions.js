const express = require("express");
const router = express.Router();
const data = require("../data");
const sessionData = data.sessions;

router.get("/", async (req, res) => {
    try {
        const sessionList = await sessionData.getAllSessions();
        res.json(sessionList);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/:id", async (req, res) => {
    try {
        const session = await sessionData.getSessionById(req.params.id);
        res.json(session);
    } catch (e) {
        res.status(404).json({ message: "Session not found" });
    }
});

router.post("/", async (req, res) => {
    const sessionPostData = req.body;
    console.log(sessionPostData);
    try {
        const { audioFile } = sessionPostData;
        const newSession = await sessionData.addSession(audioFile);
        console.log(newSession);
        res.json(newSession);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
