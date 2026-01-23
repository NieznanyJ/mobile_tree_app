import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// Jeśli Twój plik z animacją nazywa się inaczej, zmień 'logo-animation.json' na właściwą nazwę.
const animationSource = require('@/assets/animations/leaves.json');

type AnimatedSplashScreenProps = {
  onAnimationFinish?: (isCancelled: boolean) => void;
};

const AnimatedSplashScreen = ({ onAnimationFinish }: AnimatedSplashScreenProps) => {
  return (
    <View className='w-full h-full flex-1 bg-background'>
      <LottieView
        source={animationSource}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={onAnimationFinish}
        style={styles.lottie}
      />
      <Text className="text-3xl  text-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
        SMART TREE
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',

    backgroundColor: '#ffffff', // Możesz zmienić ten kolor, aby pasował do motywu aplikacji
  },
  lottie: {
    width: '50%',
    height: '100%',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
});

export default AnimatedSplashScreen;
