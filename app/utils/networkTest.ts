// Comprehensive network testing utility
export const testNetworkConnectivity = async () => {
  const baseUrl =
    process.env.EXPO_PUBLIC_VISION_API_URL?.replace("/health", "") ||
    "http://localhost:8000";

  console.log("🌐 Network Connectivity Test");
  console.log("🔧 Target URL:", baseUrl);
  console.log(
    "🔧 Environment Variable:",
    process.env.EXPO_PUBLIC_VISION_API_URL
  );

  const tests = [
    {
      name: "Basic HTTP Request",
      url: baseUrl,
      method: "GET",
      timeout: 5000,
    },
    {
      name: "Health Endpoint",
      url: `${baseUrl}/health`,
      method: "GET",
      timeout: 5000,
    },
    {
      name: "Analyze Food Endpoint",
      url: `${baseUrl}/analyze-food`,
      method: "POST",
      body: JSON.stringify({ image_url: "test" }),
      timeout: 10000,
    },
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`📍 URL: ${test.url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), test.timeout);

      const startTime = Date.now();

      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: test.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Success: ${response.status} (${duration}ms)`);

      if (response.ok) {
        const data = await response.text();
        console.log(`📄 Response: ${data.substring(0, 100)}...`);
      }

      results.push({
        test: test.name,
        success: true,
        status: response.status,
        duration,
        url: test.url,
      });
    } catch (error) {
      console.log(
        `❌ Failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      results.push({
        test: test.name,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        url: test.url,
      });
    }
  }

  return results;
};

// Test different network configurations
export const testNetworkConfigurations = async () => {
  console.log("🔧 Testing Different Network Configurations");

  const configs = [
    {
      name: "Environment Variable",
      url: process.env.EXPO_PUBLIC_VISION_API_URL?.replace("/health", ""),
    },
    { name: "Localhost", url: "http://localhost:8000" },
    { name: "Computer IP", url: "http://localhost:8000" },
    { name: "Alternative IP", url: "http://10.0.2.2:8000" }, // Android emulator
  ];

  for (const config of configs) {
    if (!config.url) continue;

    console.log(`\n🌐 Testing: ${config.name}`);
    console.log(`📍 URL: ${config.url}`);

    try {
      const response = await fetch(`${config.url}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log(`✅ ${config.name}: ${response.status}`);
    } catch (error) {
      console.log(
        `❌ ${config.name}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};

// Check if API server is running
export const checkApiServerStatus = async () => {
  const baseUrl =
    process.env.EXPO_PUBLIC_VISION_API_URL?.replace("/health", "") ||
    "http://localhost:8000";

  console.log("🔍 API Server Status Check");
  console.log("📍 Checking:", baseUrl);

  const checks = [
    {
      name: "Server Reachable",
      test: async () => {
        const response = await fetch(baseUrl, { method: "GET" });
        return response.status;
      },
    },
    {
      name: "Health Endpoint",
      test: async () => {
        const response = await fetch(`${baseUrl}/health`, { method: "GET" });
        return response.status;
      },
    },
    {
      name: "Analyze Endpoint",
      test: async () => {
        const response = await fetch(`${baseUrl}/analyze-food`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: "test" }),
        });
        return response.status;
      },
    },
  ];

  for (const check of checks) {
    try {
      const status = await check.test();
      console.log(`✅ ${check.name}: ${status}`);
    } catch (error) {
      console.log(
        `❌ ${check.name}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};
