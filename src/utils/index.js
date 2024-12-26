
import { format } from "date-fns";
export const getIdFromCloudinaryUrl = (url) => {
  try {
    // Find the "/upload/" part and get the substring after it
    const uploadIndex = url.indexOf("/upload/") + 8;
    const path = url.slice(uploadIndex);

    // Remove the version string if present (e.g., 'v1733655921/')
    const pathWithoutVersion = path.replace(/^v\d+\//, ""); // Matches 'v' followed by digits and a '/'

    // Remove the file extension (e.g., '.png')
    const publicId = pathWithoutVersion.substring(
      0,
      pathWithoutVersion.lastIndexOf(".")
    );

    return publicId;
  } catch (error) {
    throw new Error("Failed to extract public ID from Cloudinary URL");
  }
};

export const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
});


export const formatDate_util = (date, pattern) => {
  try {
    if (!date) {
      return;
    }

    return format(new Date(date), pattern);
  } catch (error) {
    console.error(error);
  }
};