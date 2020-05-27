import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import { utils } from '@react-native-firebase/app';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import Tflite from 'tflite-react-native';

class ImageSegmentationScreen extends React.Component {

  tflite = new Tflite();
  constructor(props) {
    super(props);
    this.state = {
      cameraType: RNCamera.Constants.Type.back
    };
  }

  setModel(){
    console.log('loading model');
    this.tflite.loadModel({
      model:  'deeplabv3_257_mv_gpu.tflite',// required
      labels: 'deeplabv3_257_mv_gpu.txt',  // required
      numThreads: 1,                              // defaults to 1  
    },
    (err, res) => {
      if(err)
        console.log(err);
      else
        console.log(res);
    });
  }

  async segmentImage(imagePath){
    console.log("#############segmentImage##############");

    this.path = imagePath;
    await this.tflite.runSegmentationOnImage({
      path: imagePath,
      outputType: 'png'
    },
    async (err, res) => {
      if(err){
        console.log(err);
      }
      else{
        
        console.log("Successfully segmented the image")
        console.log(res);
        const dataUri = 'data:image/png;base64,' + res;
        //const array = decodebase64(res,this.state.imageHeight,this.state.imageWidth);
        //const arrbsf = await tensorToImageUrl(array);
        //console.log(arrbsf)
        // this.setState({
        //   isSegmentationReady: true,
        //   segmentation: dataUri
        // });
        this.props.navigation.navigate('ImageDisplay', {
          dataUri: dataUri
        });
      }
    });
  }


  async componentDidMount()
  {
    await this.setModel();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Face Detection</Text>
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
      this.processFaceDetection(data.uri).then(() => console.log('Finished processing file.'));
    }
  };

  processImage()
  {
    // Local path to file on the device
    const localFile = `${utils.FilePath.PICTURES_DIRECTORY}/sham1.jpg`;
    //const localFile = '/storage/emulated/0/Download/sham.png';
    console.log('file path:' + localFile);
    this.processFaceDetection(localFile).then(() => console.log('Finished processing file.'));
  }

  async processFaceDetection(localPath) {
    console.log('Face Detection to be processed from file ==' + localPath);
    await this.segmentImage(localPath);
    console.log('Image Segmentation Completed');
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

export default ImageSegmentationScreen;