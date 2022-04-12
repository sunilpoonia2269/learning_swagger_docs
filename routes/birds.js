const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("Time : ", Date.now().toLocaleString());
  next();
});

// Router level middleware
router.use("/:birdID", (req, res, next) => {
  if (req.params.birdID === "0") next("route");

  console.log("Bird id was not 0");
  next();
});

router.get("/", (req, res) => {
  res.send("Birds home page");
});

router.get("/about", (req, res) => {
  res.send("This page is about birds");
});
router.get("/:birdId", (req, res) => {
  res.send("bird Id is " + req.params.birdId);
});

module.exports = router;
