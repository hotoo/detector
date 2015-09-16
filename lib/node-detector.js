"use strict";

const Detector = require("./detector");
const Rules = require("./rules");

const detector = new Detector(Rules);

module.exports = detector;
