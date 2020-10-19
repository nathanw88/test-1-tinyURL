const router = require("express").Router();
const imgUpload = require("../../utils/imgUpload");
const photos = require("../../models/photos");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
});

router.post("/upload", multer.single("image"), imgUpload.uploadToGcs, (req, res) => {
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    data.imageUrl = req.file.cloudStoragePublicUrl;
  }
 return res.json(data)
})

router.post("/saveInfo", (req, res)=>{
  photos.create(req.body, (insertId)=>{
    return res.json(insertId)
  })
})

router.get("/photo/:id", (req, res)=>{
  photos.selectWhere(req.params.id, (data)=>{
    return res.json(data)
  })
})

module.exports = router;