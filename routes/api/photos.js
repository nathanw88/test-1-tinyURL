const router = require("express").Router();
const imgUpload = require("../../utils/imgUpload");
const Multer = require("multer")
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
});

router.post("/upload", multer.single("image"), imgUpload.uploadToGcs, (req, res) => {
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    data.imageUrl = req.file.cloudStoragePublicUrl;
  }

 res.json(data)

})

module.exports = router 