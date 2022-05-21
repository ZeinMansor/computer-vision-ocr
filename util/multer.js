const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split('.')
    cb(null, file.fieldname + '_' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('This is not image file type'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
    files: 5
  },
  fileFilter: fileFilter
})

module.exports = upload