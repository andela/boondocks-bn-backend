import multer from 'multer';
import fs from 'fs';
import aws from 'aws-sdk';
import { s3Config } from '../config';
import ErrorHandler from '../utils/error';


/**
 * Files service
 */
class fileService {
  /**
  * @param {String} field
  * @param {String} folderName
  * @param {String} sizeLimit
  * @param {Array} accept accepted file formats
  * @param {String} uploadErrorMessage Error message
  * @returns {object} file
  */
  upload(field, folderName, sizeLimit, accept, uploadErrorMessage) {
    const dir = `public/${folderName}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `public/${folderName}`);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
      onError: (err, next) => next(err)
    });

    const fileFilter = (req, file, cb) => {
      if (accept.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error(uploadErrorMessage));
      }
    };
    return multer({
      limits: { fieldSize: sizeLimit * 1024 * 1024 },
      storage,
      fileFilter,
    }).single(field);
  }

  /**
   * Upload a file to AWS S3 Storage
   * @param {String} file path to file
   * @param {String} file.path path to file
   * @param {String} file.filename file name
   * @param {String} file.mimetype file content type
   * @param {String} s3Folder S3 destination folder
   * @returns {String} S3 url
   */
  async s3Upload({ path, filename, mimetype }, s3Folder) {
    aws.config.setPromisesDependency();
    const keysExist = s3Config.S3_ACCESS_KEY_ID
                          && s3Config.S3_SECRET_ACCESS_KEY
                          && s3Config.S3_REGION
                          && s3Config.S3_BUCKET_NAME;

    if (!keysExist) {
      throw new ErrorHandler('S3 Storage keys are not available', 500);
    }

    aws.config.update({
      accessKeyId: s3Config.S3_ACCESS_KEY_ID,
      secretAccessKey: s3Config.S3_SECRET_ACCESS_KEY,
      region: s3Config.S3_REGION
    });

    const s3 = new aws.S3();
    const params = {
      ACL: 'public-read',
      Bucket: s3Config.S3_BUCKET_NAME,
      Body: fs.createReadStream(path),
      Key: `${s3Folder}/${filename}`,
      ContentType: mimetype,
    };

    let data = null;

    try {
      data = await s3.upload(params).promise();
    } catch (error) {
      throw new ErrorHandler('Upload failed', 500);
    }

    if (data) {
      fs.unlinkSync(path);
    }
    return data.Location;
  }
}

export default new fileService();
