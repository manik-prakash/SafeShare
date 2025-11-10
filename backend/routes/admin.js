const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const checkRole = require('../middleware/rbac');
const auth = require("../middleware/auth");

router.get("/logs", auth,checkRole('admin'), (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const logPath = path.join(__dirname, "../logs.txt");
        if (!fs.existsSync(logPath)) {
            return res.json({ logs: "No logs found." });
        }

        const logs = fs.readFileSync(logPath, "utf-8");
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ error: "Failed to read logs" });
    }
});

module.exports = router;
