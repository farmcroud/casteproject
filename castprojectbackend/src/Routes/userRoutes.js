const express = require("express");

const router = express.Router();

const {
  GetAllVillage,
  GetCastList,
  GetSubCastList,
  GetAllData,
} = require("../Controller/UserController");

router.get("/getvillage", GetAllVillage);
router.post("/getcast", GetCastList);
router.post("/getsubcast", GetSubCastList);
router.post("/getdata", GetAllData);

module.exports = router;
