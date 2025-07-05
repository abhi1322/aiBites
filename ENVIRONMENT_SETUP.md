# Environment Variables Setup Guide

## 🔧 **Current Issue**

You're getting "Network request failed" because the app can't reach your localhost API server.

## 📋 **Environment Variable Configuration**

### **Option 1: For Simulator/Emulator (Easiest)**

```bash
# In your .env file
EXPO_PUBLIC_VISION_API_URL=http://localhost:8000
```

### **Option 2: For Physical Device (Recommended)**

```bash
# In your .env file - Replace with your computer's IP
EXPO_PUBLIC_VISION_API_URL=http://192.168.1.100:8000
```

### **Option 3: For Production**

```bash
# In your .env file
EXPO_PUBLIC_VISION_API_URL=https://your-production-api.com
```

## 🔧 **Step-by-Step Setup**

### **Step 1: Create .env file**

Create a `.env` file in your project root:

```bash
# .env
EXPO_PUBLIC_VISION_API_URL=http://localhost:8000
```

### **Step 2: Find Your Computer's IP Address**

```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### **Step 3: Update .env with Your IP**

```bash
# .env - Replace with your actual IP
EXPO_PUBLIC_VISION_API_URL=http://192.168.1.50:8000
```

### **Step 4: Restart Expo Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart
npx expo start
```

## 🔧 **Different Scenarios**

### **Scenario A: Using Simulator/Emulator**

```bash
# .env
EXPO_PUBLIC_VISION_API_URL=http://localhost:8000
```

### **Scenario B: Using Physical Device**

```bash
# .env - Use your computer's IP
EXPO_PUBLIC_VISION_API_URL=http://192.168.1.50:8000
```

### **Scenario C: Using ngrok Tunnel**

```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start your API server
python app.py  # or whatever starts your server

# 3. Start ngrok tunnel
ngrok http 8000

# 4. Use the ngrok URL in .env
EXPO_PUBLIC_VISION_API_URL=https://abc123.ngrok.io
```

## 🔧 **Testing Your Setup**

### **Test 1: Check Environment Variable**

The app will log the environment variable when you click "Test API":

```
🔧 Environment variable: http://localhost:8000
🔧 Base URL: http://localhost:8000
```

### **Test 2: API Connectivity**

Click the red "Test API" button and check console logs for:

- ✅ Connection successful
- ❌ Network errors
- ⏱️ Response times

### **Test 3: Manual Browser Test**

Open your browser and go to:

```
http://localhost:8000/health
```

Should show your API health status.

## 🔧 **Troubleshooting**

### **Issue: "Network request failed"**

**Solution:** Use your computer's IP address instead of localhost

### **Issue: "Request timed out"**

**Solution:**

1. Check if your API server is running
2. Check server logs for errors
3. Try with a smaller image

### **Issue: Environment variable not working**

**Solution:**

1. Restart Expo development server
2. Check .env file is in project root
3. Verify variable name starts with `EXPO_PUBLIC_`

## 🔧 **Quick Configuration Examples**

### **For Development (Simulator)**

```bash
# .env
EXPO_PUBLIC_VISION_API_URL=http://localhost:8000
```

### **For Development (Physical Device)**

```bash
# .env - Replace with your IP
EXPO_PUBLIC_VISION_API_URL=http://192.168.1.50:8000
```

### **For Production**

```bash
# .env
EXPO_PUBLIC_VISION_API_URL=https://api.yourapp.com
```

## 🔧 **API Server Requirements**

Your API server should:

1. **Run on port 8000**
2. **Have CORS enabled** for cross-origin requests
3. **Accept POST requests** to `/analyze-food`
4. **Return JSON responses**

### **Example API Response**

```json
{
  "calories": { "total": 350, "unit": "kcal" },
  "macronutrients": {
    "protein": "25g",
    "carbs": "30g",
    "fats": "15g",
    "fiber": "5g"
  },
  "items": [{ "name": "Grilled Chicken", "quantity": "150g" }]
}
```

## 🔧 **Next Steps**

1. **Create .env file** with your API URL
2. **Restart Expo server**
3. **Test with the red "Test API" button**
4. **Check console logs** for connection status
5. **Try taking a food photo** to test the full flow
