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
  * @returns {object} file
  */
  upload(field) {
    const dir = 'public/images';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images');
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
      onError: (err, next) => next(err)
    });
    return multer({
      limits: { fieldSize: 5 * 1024 * 1024 },
      storage
    }).single(field);
  }

  /**
   * Upload a file to AWS S3 Storage
   * @param {String} path path to file
   * @param {String} filename file name
   * @param {String} s3Folder S3 destination folder
   * @returns {String} S3 url
   */
  async s3Upload(path, filename, s3Folder) {
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
      Key: `${s3Folder}/${filename}`
    };
    const data = await s3.upload(params).promise();

    if (data) {
      fs.unlinkSync(path);
    }
    return data.Location;
  }
}

export default new fileService();
