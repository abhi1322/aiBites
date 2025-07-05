# Food Analysis API Integration

This document describes the setup and usage of the food analysis feature that analyzes food images using AI.

## File Structure

```
app/
├── services/
│   ├── foodAnalysisApi.ts     # API service for food analysis
│   └── index.ts              # Service exports
├── hooks/
│   └── useFoodAnalysis.ts    # Custom hook for food analysis
├── utils/
│   └── foodAnalysisUtils.ts  # Utility functions for data conversion
└── screens/
    └── image-preview.tsx     # Updated with food analysis integration
```

## API Endpoint

- **URL**: `http://localhost:8000/analyze-food`
- **Method**: POST
- **Content-Type**: application/json

### Request Body

```json
{
  "image_url": "https://example.com/food.jpg"
}
```

### Response

```json
{
  "calories": { "total": 350, "unit": "kcal" },
  "macronutrients": {
    "protein": "12g",
    "carbs": "45g",
    "fats": "10g",
    "fiber": "5g"
  },
  "items": [
    { "name": "Grilled Chicken", "quantity": "100g" },
    { "name": "Rice", "quantity": "150g" },
    { "name": "Broccoli", "quantity": "50g" }
  ]
}
```

## Usage

### 1. In Components

```tsx
import { useFoodAnalysis } from "../hooks/useFoodAnalysis";

const { analyzeImage, isLoading, analysisResult, error } = useFoodAnalysis();

// Analyze an image
const result = await analyzeImage(imageUrl);
```

### 2. Data Conversion

```tsx
import { convertAnalysisToFoodData } from "../utils/foodAnalysisUtils";

const foodData = convertAnalysisToFoodData(analysisResult);
```

## Integration Flow

1. **Image Upload**: Image is uploaded to Cloudinary
2. **URL Generation**: Public URLs are generated for the uploaded image
3. **AI Analysis**: The image URL is sent to the food analysis API
4. **Data Conversion**: API response is converted to food data format
5. **User Integration**: Clerk user ID is added to the food data
6. **Database Storage**: Food item is created in the database with user association
7. **Navigation**: User is redirected to the food detail page

## User Data Integration

The system now integrates with Clerk authentication:

- **User ID**: Retrieved from `useUser()` hook
- **Food Ownership**: Each food item is associated with the authenticated user
- **No Fallback Data**: System requires successful API analysis to proceed

## Error Handling

- Network errors are caught and displayed to the user
- Analysis failures result in error messages (no fallback data)
- Loading states are managed for both upload and analysis
- User authentication is required for food item creation

## Configuration

Update the `API_BASE_URL` in `foodAnalysisApi.ts` if your API is hosted elsewhere:

```ts
const API_BASE_URL = "http://your-api-domain.com";
```

## Testing

1. Start your local API server on port 8000
2. Ensure user is authenticated with Clerk
3. Take a photo of food using the camera
4. Click "Next" to trigger the analysis
5. Check console logs for API responses
6. Verify the food item is created with analyzed data and user association
