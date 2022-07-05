const models = {};

// MODELS
models.User = require("../models/user.model");
models.Category = require("../models/category.model");
models.UCategory = require("../models/uCategory.model");
models.UDocument = require("../models/uDocument.model");
models.Institute = require("../models/institute.model");
models.Profession = require("../models/profession.model");
models.Competition = require("../models/competition.model");
models.Round = require("../models/round.model");
models.Room = require("../models/room.model");
models.Judge = require("../models/judge.model");
models.Container = require("../models/container.model");

module.exports = models;
