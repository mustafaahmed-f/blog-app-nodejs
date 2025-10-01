import { Request } from "express";
import multer from "multer";

export const uploadFile = (filetype: string[]) => {
  const storage = multer.memoryStorage();

  function fileFiltration(req: Request, file: Express.Multer.File, cb: any) {
    if (filetype.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Allowed types: jpeg or png ONLY !!"), false);
    }
  }

  const upload = multer({ fileFilter: fileFiltration, storage });

  return upload;
};
