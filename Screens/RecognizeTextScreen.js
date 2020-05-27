import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { utils } from '@react-native-firebase/app';
import vision from '@react-native-firebase/ml-vision';

class RecognizeTextScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>RecognizeText1 Screen</Text>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          zoom={0}
        >
        </RNCamera>
        <View style={styles.buttonContainer}>
          <Button
            // onPress={() => this.processImage()}
            onPress={() => this.takePicture()}
            title="Process Image"
          />
        </View>
      </View>
    );
  }

  takePicture = async () => {
    console.log("takePicture");
    if (this.camera) {
      const options = { quality: 0.5, base64: true, orientation: RNCamera.Constants.ORIENTATION_UP, forceUpOrientation: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.processDocument(data.uri).then(() => console.log('Finished processing file.'));
    }
  };

  async processDocument(localPath) {
    const processed = await vision().textRecognizerProcessImage(localPath);

    console.log('Found text in document: ', processed.text);

    processed.blocks.forEach(block => {
      console.log('Found block with text: ', block.text);
      console.log('Confidence in block: ', block.confidence);
      console.log('Languages found in block: ', block.recognizedLanguages);
    });

    this.props.navigation.navigate('MemoView', {
      displayText: processed.text,
    });

  }

  processImage()
  {
    // Local path to file on the device
    const localFile = `${utils.FilePath.PICTURES_DIRECTORY}/Wege_der_parlamentarischen_Demokratie.jpg`;
    //const localFile = 'Assets/Text1.jpg';
    console.log('file path:' + localFile);
    this.processDocument(localFile).then(() => console.log('Finished processing file.'));
  }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default RecognizeTextScreen;




