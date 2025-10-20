import cloudinary from "../../services/cloudinary.js";

export async function checkCloudinaryFolderEmpty(
  draftId: string
): Promise<boolean> {
  try {
    const folderPath = `${process.env.CLOUDINARY_FOLDER}/Posts/${draftId}`;
    const { resources: remaining } = await cloudinary.api.resources({
      type: "upload",
      prefix: folderPath + "/",
      max_results: 1,
    });

    if (remaining.length === 0) {
      await cloudinary.api.delete_folder(folderPath);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to check cloudinary folder");
  }
}
