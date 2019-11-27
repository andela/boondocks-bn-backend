import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { PassThrough } from 'stream';
import onFinished from 'on-finished';

export const file = (name) => createReadStream(join(__dirname, 'files', name));

export const fileSize = (path) => statSync(path).size;

export const submitForm = (multer, form, cb) => {
  form.getLength((err, length) => {
    if (err) return cb(err);

    const req = new PassThrough();

    req.complete = false;
    form.once('end', () => {
      req.complete = true;
    });

    form.pipe(req);
    req.headers = {
      'content-type': `multipart/form-data; boundary=${form.getBoundary()}`,
      'content-length': length
    };

    multer(req, null, (err) => {
      onFinished(req, () => { cb(err, req); });
    });
  });
};
