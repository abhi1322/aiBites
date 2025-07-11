import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

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

// Utility to generate original and square URLs (JPG only, no compression)

export function getCloudinaryImageUrls(publicIdOrUrl: string) {
  console.log("Generating URLs for publicIdOrUrl:", publicIdOrUrl);

  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }

  // Extract public ID from full URL if needed
  const publicId = extractPublicId(publicIdOrUrl);
  console.log("Extracted publicId:", publicId);

  // Method 1: Using Cloudinary SDK (if available)
  try {
    const cld = new Cloudinary({
      cloud: { cloudName },
    });

    // Original: just the original image as JPG
    const original = cld.image(publicId).format("jpg");

    // Square: resize and crop to 400x400 JPG
    const square = cld
      .image(publicId)
      .resize(fill().width(400).height(400))
      .format("jpg");

    const originalUrl = original.toURL();
    const squareUrl = square.toURL();

    console.log("Generated originalUrl:", originalUrl);
    console.log("Generated squareUrl:", squareUrl);

    return {
      originalUrl,
      squareUrl,
    };
  } catch (error) {
    console.warn(
      "Cloudinary SDK failed, falling back to manual URL construction:",
      error
    );

    // Method 2: Manual URL construction (fallback)
    const originalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_jpg/${publicId}`;
    const squareUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_400,w_400,f_jpg/${publicId}`;

    console.log("Generated originalUrl (manual):", originalUrl);
    console.log("Generated squareUrl (manual):", squareUrl);

    return {
      originalUrl,
      squareUrl,
    };
  }
}

function extractPublicId(publicIdOrUrl: string): string {
  // If it's already just a public ID (no http/https), return as is
  if (!publicIdOrUrl.startsWith("http")) {
    return publicIdOrUrl;
  }

  try {
    const url = new URL(publicIdOrUrl);
    const pathname = url.pathname;

    // Cloudinary URL pattern: /image/upload/[transformations]/[version]/[public_id].[extension]
    // We need to extract everything after the last occurrence of /upload/
    const uploadIndex = pathname.lastIndexOf("/upload/");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL format");
    }

    // Get everything after /upload/
    let pathAfterUpload = pathname.substring(uploadIndex + 8); // 8 = length of '/upload/'

    // Remove version if present (starts with v followed by numbers)
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    throw new Error(`Invalid Cloudinary URL: ${publicIdOrUrl}`);
  }
}

// Alternative: Pure manual URL construction (most reliable)
export function getCloudinaryImageUrlsManual(publicIdOrUrl: string) {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }

  const publicId = extractPublicId(publicIdOrUrl);

  // Manual URL construction - this is the most reliable approach
  const originalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  const squareUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_400,w_400/${publicId}`;

  return {
    originalUrl,
    squareUrl,
  };
}

// Test function to verify URLs work
export async function testCloudinaryUrls(publicIdOrUrl: string) {
  const { originalUrl, squareUrl } =
    getCloudinaryImageUrlsManual(publicIdOrUrl);

  console.log("Testing URLs:");
  console.log("Original:", originalUrl);
  console.log("Square:", squareUrl);

  // You can use these URLs to test in browser or with fetch
  return { originalUrl, squareUrl };
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
  // Upload and get the secure_url (original, directly accessible)
  const secureUrl = await uploadToCloudinary(localUri);
  return secureUrl;
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
      const { originalUrl, squareUrl } = getCloudinaryImageUrls("sample");
      console.log("Test URLs generated successfully");
      console.log("Test original:", originalUrl);
      console.log("Test square:", squareUrl);
    } catch (error) {
      console.error("Error generating test URLs:", error);
    }
  } else {
    console.error("Cloud name is not configured!");
  }
}
