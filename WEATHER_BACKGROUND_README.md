# Weather Background Feature

This feature adds dynamic background images to the Metro Weather app based on the current weather conditions.

## Implementation Details

### Files Modified/Created:

1. **`components/core/decorator/WeatherBackground.js`** (NEW)
   - Creates a new component that displays background images based on weather conditions
   - Uses React Native's `ImageBackground` component
   - Includes a semi-transparent overlay for better text readability
   - Maps weather conditions to appropriate background images

2. **`components/compound/PageView.js`** (MODIFIED)
   - Added import for `WeatherBackground` component
   - Added `weatherCondition` prop with default value "Sunny"
   - Wrapped the main content with `WeatherBackground` component
   - Removed the black background (`bg-black`) since background is now handled by the image

3. **`components/MainView.js`** (MODIFIED)
   - Added `weatherCondition` prop to the `PageView` component
   - The weather condition is already being set from the API data using `getWeatherCondition(data)`

### Background Image Mapping:

The app uses the following weather conditions and maps them to background images:

- **"Rain"** or **"Rainy"** → `assets/rainy.jpeg`
- **"Sunny"** → `assets/sunny.jpeg`
- **"Windy"** → `assets/windy.jpeg`
- **"Cloudy"** → `assets/cloudy.jpeg`
- **Default** → `assets/sunny.jpeg` (fallback)

### Weather Condition Logic:

The weather conditions are determined by the `getWeatherCondition()` function in `data-utils.js`:

- **Windy**: Wind speed > 15 m/s
- **Rain**: Precipitation probability ≥ 30%
- **Cloudy**: Humidity > 70% (when not windy or rainy)
- **Sunny**: Default condition when none of the above are met

### Features:

- **Dynamic Backgrounds**: Background images change automatically based on current weather
- **Smooth Transitions**: Uses React Native's built-in image handling
- **Text Readability**: Semi-transparent overlay ensures white text remains readable
- **Fallback Support**: Defaults to sunny background if weather condition is unknown
- **Responsive Design**: Images scale properly across different screen sizes

### How It Works:

1. The app fetches weather data from the API
2. The `getWeatherCondition()` function analyzes the data and returns a condition string
3. The `MainView` component passes this condition to `PageView`
4. `PageView` passes it to `WeatherBackground`
5. `WeatherBackground` selects the appropriate image and displays it as the background
6. All content is rendered on top of the background image with a semi-transparent overlay

The implementation is seamless and doesn't require any changes to the existing UI components or styling. 