import React from 'react';
import { ImageBackground, View } from 'react-native';

const WeatherBackground = ({ weatherCondition, children, onImageLoad, onImageLoadStart }) => {
  const getBackgroundImage = (condition) => {
    switch (condition) {
      case 'Rainy':
      case 'Rain':
        return require('../../../assets/rainy.jpeg');
      case 'Sunny':
        return require('../../../assets/sunny.jpeg');
      case 'Windy':
        return require('../../../assets/windy.jpeg');
      case 'Cloudy':
        return require('../../../assets/cloudy.jpeg');
      default:
        return require('../../../assets/sunny.jpeg'); // Default fallback
    }
  };

  return (
    <ImageBackground
      source={getBackgroundImage(weatherCondition)}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      resizeMode="cover"
      onLoad={onImageLoad}
      onLoadStart={onImageLoadStart}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {children}
      </View>
    </ImageBackground>
  );
};

export default WeatherBackground; 