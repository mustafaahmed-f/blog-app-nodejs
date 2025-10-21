import cloudinary from "../../../services/cloudinary.js";

export async function removeUploadedImages(publicIds: string[]) {
  const results = await Promise.allSettled(
    publicIds.map((id) => {
      return cloudinary.uploader.destroy(id);
    })
  );

  //todo : use Rabbit MQ to delete the images that weren't deleted successfully;

  for (let result of results) {
    if (result.status === "rejected") {
      console.log("Failed to delete image : ", result.reason);
    }
  }
}
