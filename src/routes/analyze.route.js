const express = require("express");
const router = express.Router();
const { analyzeCode } = require("../controllers/analyze.controller");

router.post("/", analyzeCode);

module.exports = router;
