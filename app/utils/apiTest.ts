// Simple API test utility
const getApiBaseUrl = () => {
  const envApiUrl = process.env.EXPO_PUBLIC_VISION_API_URL;

  if (envApiUrl) {
    const baseUrl = envApiUrl.replace("/health", "");
    console.log("🔧 Using environment API URL:", baseUrl);
    return baseUrl;
  }

  // Fallback
  return "http://localhost:8000";
};

export const testApiConnection = async () => {
  const baseUrl = getApiBaseUrl();
  const testUrl = `${baseUrl}/analyze-food`;

  console.log("🧪 Testing API connection to:", testUrl);
  console.log(
    "🔧 Environment variable:",
    process.env.EXPO_PUBLIC_VISION_API_URL
  );

  try {
    const startTime = Date.now();

    const response = await fetch(testUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: "https://example.com/test-image.jpg",
      }),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("✅ API Response Status:", response.status);
    console.log("⏱️ Response Time:", duration + "ms");

    if (response.ok) {
      const data = await response.json();
      console.log("📊 Response Data:", data);
      return { success: true, duration, data };
    } else {
      console.log("❌ API Error Status:", response.status);
      const errorText = await response.text();
      console.log("❌ Error Response:", errorText);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.log("❌ Network Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test different scenarios
export const runApiTests = async () => {
  const baseUrl = getApiBaseUrl();

  console.log("🚀 Starting API Tests...");
  console.log("🔧 Base URL:", baseUrl);
  console.log(
    "🔧 Environment variable:",
    process.env.EXPO_PUBLIC_VISION_API_URL
  );

  // Test 1: Basic connectivity
  console.log("\n📡 Test 1: Basic Connectivity");
  const result = await testApiConnection();

  // Test 2: Health check endpoint
  console.log("\n📡 Test 2: Health Check");
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log("Health Check Status:", healthResponse.status);
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log("Health Data:", healthData);
    }
  } catch (error) {
    console.log(
      "Health endpoint not available:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  // Test 3: Simple GET request to root
  console.log("\n📡 Test 3: Root Endpoint");
  try {
    const getResponse = await fetch(baseUrl);
    console.log("Root Response Status:", getResponse.status);
    if (getResponse.ok) {
      const rootData = await getResponse.text();
      console.log("Root Data:", rootData.substring(0, 100) + "...");
    }
  } catch (error) {
    console.log(
      "Root request failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  return result;
};
