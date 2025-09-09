const { Activity } = require("../models");

const getSellerActivities = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }
    const activities = await Activity.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller activities", error: error.message });
  }
};

const getBuyerActivities = async (req, res) => {
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const activities = await Activity.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyer activities", error: error.message });
  }
};

const getAdminActivities = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const activities = await Activity.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin activities", error: error.message });
  }
};

module.exports = {
  getSellerActivities,
  getBuyerActivities,
  getAdminActivities,
};
