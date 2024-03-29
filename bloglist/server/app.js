const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MONGODB"))
  .catch((error) => logger.error("error connecting to MONGODB", error.message));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;