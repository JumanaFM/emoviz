const sessionsRoutes = require("./sessions");

const constructorMethod = app => {
  app.use("/sessions", sessionsRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;