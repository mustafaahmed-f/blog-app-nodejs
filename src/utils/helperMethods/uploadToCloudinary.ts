import { Readable } from "stream";
import cloudinary from "../../services/cloudinary.js";

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (err, result) => {
          if (err) {
            console.error("Cloudinary callback error:", err);
            return reject(err);
          }
          if (!result) {
            console.error("Cloudinary returned no result");
            return reject(new Error("No upload result"));
          }
          resolve(result);
        }
      );

      const readable = Readable.from(buffer);
      readable.on("error", (err) => {
        console.error("Readable stream error:", err);
        reject(err);
      });

      readable.pipe(stream).on("error", (err) => {
        console.error("Pipe error:", err);
        reject(err);
      });
    } catch (err) {
      console.error("UploadToCloudinary threw before stream:", err);
      reject(err);
    }
  });
}
