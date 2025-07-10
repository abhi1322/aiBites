import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { scale } from "@cloudinary/url-gen/actions/resize";

// Example function to upload an image from React Native
export async function uploadToCloudinary(localUri: string) {
  try {
    const data = new FormData();
    data.append("file", {
      uri: localUri,
      type: "image/jpeg", // or the correct mime type
      name: "upload.jpg",
    } as any); // Use 'as any' for React Native

    data.append(
      "upload_preset",
      process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    console.log("Uploading to cloud:", cloudName);
    console.log(
      "Using preset:",
      process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    console.log("Upload response status:", res.status);
    console.log("Upload response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload error response:", errorText);
      throw new Error(`Upload failed: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    console.log("Upload result:", result);

    // Return the secure_url (Cloudinary image URL) directly
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

// Utility to generate original and compressed URLs
export function getCloudinaryImageUrls(publicId: string) {
  console.log("Generating URLs for publicId:", publicId);

  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }

  const cld = new Cloudinary({
    cloud: { cloudName },
  });

  // Original (with some optimization)
  const original = cld
    .image(publicId)
    .delivery(format("auto"))
    .delivery(quality("auto"));

  // Compressed: resize and lower quality
  const compressed = cld
    .image(publicId)
    .resize(scale().width(400))
    .delivery(quality("auto:low"))
    .delivery(format("auto")); // Use 'auto' instead of 'webp' for better compatibility

  const originalUrl = original.toURL();
  const compressedUrl = compressed.toURL();

  console.log("Generated originalUrl:", originalUrl);
  console.log("Generated compressedUrl:", compressedUrl);

  return {
    originalUrl,
    compressedUrl,
  };
}

// Alternative: Extract public_id from secure_url if you prefer to keep returning secure_url
export function extractPublicIdFromUrl(secureUrl: string): string {
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
  // We want to extract "sample" (without the file extension)
  const parts = secureUrl.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename.split(".")[0]; // Remove file extension

  // Handle versioned URLs (v1234567890/sample.jpg)
  if (parts[parts.length - 2] && parts[parts.length - 2].startsWith("v")) {
    return publicId;
  }

  return publicId;
}

/**
 * Uploads an image to Cloudinary and returns a compressed/optimized URL for profile pictures.
 * @param localUri - The local file URI of the image
 * @returns The compressed Cloudinary image URL (suitable for profile pictures)
 */
export async function uploadProfilePictureToCloudinary(
  localUri: string
): Promise<string> {
  // Upload and get the secure_url (original)
  const secureUrl = await uploadToCloudinary(localUri);
  // Extract public_id from the secure_url
  const publicId = extractPublicIdFromUrl(secureUrl);
  // Get the compressed URL
  const { compressedUrl } = getCloudinaryImageUrls(publicId);
  return compressedUrl;
}

// Debug function to test configuration
export function debugCloudinaryConfig() {
  console.log("=== Cloudinary Debug Info ===");
  console.log("Cloud Name:", process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log(
    "Upload Preset:",
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  // Test URL generation with a sample public_id
  if (process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    try {
      const { originalUrl, compressedUrl } = getCloudinaryImageUrls("sample");
      console.log("Test URLs generated successfully");
      console.log("Test original:", originalUrl);
      console.log("Test compressed:", compressedUrl);
    } catch (error) {
      console.error("Error generating test URLs:", error);
    }
  } else {
    console.error("Cloud name is not configured!");
  }
}
