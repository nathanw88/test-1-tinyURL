const router = require("express").Router();
const imgUpload = require("../../utils/imgUpload");
const photos = require("../../models/photos");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 1e+7
});

//client request contains photo to be saved to google bucket server response is photo url
router.post("/upload", multer.single("image"), imgUpload.uploadToGcs, (req, res) => {
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    data.imageUrl = req.file.cloudStoragePublicUrl;
  }
  return res.json(data)
})
//client request has tittle, caption, and photo url response is id for the row where info was saved
router.post("/saveInfo", (req, res) => {
  photos.create(req.body, (insertId) => {
    return res.json(insertId)
  })
})
//client request photo by id response is tittle, caption, and photo url
router.get("/photo/:id", (req, res) => {
  photos.selectWhere(req.params.id, (data) => {
    return res.json(data)
  })
})

module.exports = router;