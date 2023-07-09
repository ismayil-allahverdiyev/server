const crypto = require('crypto');
const path = require('path');
const uuid = require("uuid")
const multer = require("multer")
const sharp = require('sharp');
const {GridFsStorage} = require('multer-gridfs-storage');

const DB = process.env.URL;

const storage = new GridFsStorage({
  url: DB,
  file:async (req, file) => {
    const buffer = await sharp(file.buffer)
          .resize({ quality: 70 })
          .toBuffer();
    console.log("Compressor working 2")
    file.buffer = buffer;
    console.log("GridFsStorage worked")
    return new Promise((resolve, reject) => {
      const { v4: uuidv4 } = require('uuid');
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(uuidv4());
        const fileInfo = {
          filename: filename,
          bucketName: 'poster_images'
        };
        resolve(fileInfo);
      });
    });
  }
});
const posterImageUploadGfs = multer({ storage });
module.exports = posterImageUploadGfs