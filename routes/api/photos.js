const router = require("express").Router();
const imgUpload = require("../../utils/imgUpload");
const photos = require("../../models/photos");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 1e+7
});
const { Storage } = require("@google-cloud/storage");
const uuid = require('uuid');


router.get("/uploadUrl", (reg, res) => {
  const storage = new Storage({
    projectId: "tinyurl-293016",
    keyFilename: "./tinyurl-293016-f86c0f293e7e.json"

  });
  const bucketName = "tiny-url-images";

  async function generateV4UploadSignedUrl() {
    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'application/octet-stream',
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(uuid.v4())
      .getSignedUrl(options);

    res.send(url)
  }

  generateV4UploadSignedUrl()

})
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