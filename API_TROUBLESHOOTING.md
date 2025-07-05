# API Connection Troubleshooting Guide

## Network Request Failed Error

If you're getting `Network request failed` errors, follow these steps:

## 🔧 **Step 1: Find Your Computer's IP Address**

### On Windows:

```bash
ipconfig
```

Look for `IPv4 Address` under your active network adapter.

### On Mac/Linux:

```bash
ifconfig
# or
ip addr
```

Look for `inet` followed by your IP address.

## 🔧 **Step 2: Update API Configuration**

In `app/services/foodAnalysisApi.ts`, replace the IP address:

```ts
// Replace with your actual IP address
return "http://192.168.1.100:8000"; // ← Change this
```

**Example:**

- If your IP is `192.168.1.50`, use `http://192.168.1.50:8000`
- If your IP is `10.0.0.15`, use `http://10.0.0.15:8000`

## 🔧 **Step 3: Ensure API Server is Running**

1. **Start your API server** on port 8000
2. **Test the endpoint** in your browser:
   ```
   http://your-ip-address:8000/analyze-food
   ```
3. **Check firewall settings** - allow port 8000

## 🔧 **Step 4: Test Network Connectivity**

### Option A: Use Simulator/Emulator

- Simulators can use `localhost:8000`
- Change the API URL to: `http://localhost:8000`

### Option B: Use Expo Tunnel

1. Install ngrok: `npm install -g ngrok`
2. Start your API server on port 8000
3. Run: `ngrok http 8000`
4. Use the ngrok URL in your API config

### Option C: Use Physical Device

1. Ensure device and computer are on same WiFi
2. Use computer's IP address (not localhost)
3. Test with browser on your phone first

## 🔧 **Step 5: Alternative Solutions**

### For Development Only:

```ts
// In foodAnalysisApi.ts - temporary mock data
static async analyzeFoodImage(imageUrl: string): Promise<FoodAnalysisResponse> {
  // Mock response for testing
  return {
    calories: { total: 350, unit: "kcal" },
    macronutrients: {
      protein: "25g",
      carbs: "30g",
      fats: "15g",
      fiber: "5g"
    },
    items: [
      { name: "Grilled Chicken", quantity: "150g" },
      { name: "Brown Rice", quantity: "100g" }
    ]
  };
}
```

## 🔧 **Step 6: Debug Steps**

1. **Check console logs** - Look for the API URL being used
2. **Test with Postman/curl** - Verify API endpoint works
3. **Check network tab** - See if requests are being made
4. **Verify CORS settings** - API should allow requests from your app

## 🔧 **Common Issues & Solutions**

| Issue                                 | Solution                                        |
| ------------------------------------- | ----------------------------------------------- |
| Physical device can't reach localhost | Use computer's IP address                       |
| API server not responding             | Check if server is running on port 8000         |
| CORS errors                           | Add CORS headers to your API server             |
| Firewall blocking                     | Allow port 8000 in firewall settings            |
| Wrong IP address                      | Use `ipconfig` or `ifconfig` to find correct IP |

## 🔧 **Quick Test**

Add this to your component to test the connection:

```tsx
useEffect(() => {
  // Test API connection
  fetch("http://your-ip:8000/analyze-food", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: "test" }),
  })
    .then((response) => console.log("API test response:", response.status))
    .catch((error) => console.log("API test error:", error));
}, []);
```

## 🔧 **Production Setup**

For production, update the API URL to your hosted endpoint:

```ts
// In foodAnalysisApi.ts
return "https://your-production-api.com";
```
