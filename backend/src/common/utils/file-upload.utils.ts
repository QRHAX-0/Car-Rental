import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = (folderName: string) =>
  diskStorage({
    destination: `./uploads/${folderName}`,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
