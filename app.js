/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

global.__basedir = __dirname;

const app = express();

// DATABASE CONNECTION
require("./src/NOSQL/database/connection");

const api = require("./src/v1/routes/api");

app.use(helmet());
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders(res, _path, stat) {
      res.set("x-timestamp", Date.now().toString());
    },
  })
);

app.use(
  morgan("common", {
    skip: (req, res) => req.originalUrl.startsWith("/socket"),
  })
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/v1/api/", api);

module.exports = app;
