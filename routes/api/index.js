const router = require("express").Router();
const photoRoutes = require("./photos")

router.use("/photos", photoRoutes);

module.exports = router;
