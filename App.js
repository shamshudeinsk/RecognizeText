import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './Screens/HomeScreen';
import RecognizeTextScreen from './Screens/RecognizeTextScreen';
import MemoViewScreen from './Screens/MemoViewScreen';
import BarcodeScanScreen from './Screens/BarcodeScanScreen';
import FaceDetectScreen from './Screens/FaceDetectScreen';
import ImageLabelScreen from './Screens/ImageLabelScreen';
import SmartReplyScreen from './Screens/SmartReplyScreen';
import LanguageIdScreen from './Screens/LanguageIdScreen';
import ImageSegmentationScreen from './Screens/ImageSegmentationScreen';
import ImageDisplayScreen from './Screens/ImageDisplayScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen name="RecognizeText" component={RecognizeTextScreen} />
        <Stack.Screen name="MemoView" component={MemoViewScreen} />
        <Stack.Screen name="BarcodeScan" component={BarcodeScanScreen} />
        <Stack.Screen name="FaceDetect" component={FaceDetectScreen} />
        <Stack.Screen name="ImageLabel" component={ImageLabelScreen} />
        <Stack.Screen name="SmartReply" component={SmartReplyScreen} />
        <Stack.Screen name="LanguageId" component={LanguageIdScreen} />
        <Stack.Screen name="ImageSegmentation" component={ImageSegmentationScreen} />
        <Stack.Screen name="ImageDisplay" component={ImageDisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
