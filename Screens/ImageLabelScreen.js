import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import { utils } from '@react-native-firebase/app';
import { RNCamera } from 'react-native-camera';
import vision from '@react-native-firebase/ml-vision';
import CameraRoll from "@react-native-community/cameraroll";

class ImageLabelScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: RNCamera.Constants.Type.back
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Image Label</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.switchCameraType()}
            title="Front / Back"
          />
        </View>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.cameraType}
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
            onPress={() => this.takePicture()}
            // onPress={() => this.processImage()}
            title="Process Image"
          />
        </View>
      </View>
    );
  }

  switchCameraType()
  {
    if(this.state.cameraType == RNCamera.Constants.Type.front)
    {
      this.setState({
        cameraType: RNCamera.Constants.Type.back
      });
    }
    else
    {
      this.setState({
        cameraType: RNCamera.Constants.Type.front
      });
    }
  }

  takePicture = async () => {
    console.log("takePicture");
    if (this.camera) {
      const options = { quality: 0.5, base64: true, fixOrientation: true, orientation: RNCamera.Constants.ORIENTATION_UP, forceUpOrientation: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      CameraRoll.saveToCameraRoll(data.uri);
      console.log('photo saved to Camera Roll');
      this.processImageLabeling(data.uri).then(() => console.log('Finished processing file.'));
    }
  };

  processImage()
  {
    // Local path to file on the device
    const localFile = `${utils.FilePath.PICTURES_DIRECTORY}/sham1.jpg`;
    //const localFile = '/storage/emulated/0/Download/sham.png';
    console.log('file path:' + localFile);
    this.processImageLabeling(localFile).then(() => console.log('Finished processing file.'));
  }

  async processImageLabeling(localPath) {
    console.log('Image Label to be processed from file ==' + localPath);

    const imageLabelerOptions = {
      confidenceThreshold: 0.7
    }

    let labels = await vision().imageLabelerProcessImage(localPath, imageLabelerOptions);
    console.log("Labels Length ==" + labels.length);
    if(labels.length > 5)
    {
      labels = labels.slice(0,5);
    }
    labels.forEach(label => {
      console.log('Service labelled the image: ', label.text);
      console.log('Confidence in the label: ', label.confidence);
    });
    

    console.log('Image Label from image ==' + JSON.stringify(labels));

    this.props.navigation.navigate('MemoView', {
        displayText: JSON.stringify(labels)
    });

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

export default ImageLabelScreen;