const express = require("express");
const router = express.Router();
const { getSellerActivities, getBuyerActivities, getAdminActivities } = require("../controllers/activityController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/seller", protect, getSellerActivities);
router.get("/buyer", protect, getBuyerActivities);
router.get("/admin", protect, getAdminActivities);

module.exports = router;
