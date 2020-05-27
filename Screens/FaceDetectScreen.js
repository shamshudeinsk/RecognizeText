import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import { utils } from '@react-native-firebase/app';
import { RNCamera } from 'react-native-camera';
import vision, { VisionFaceContourType, VisionFaceDetectorClassificationMode, VisionFaceDetectorContourMode, VisionFaceDetectorLandmarkMode, VisionFaceDetectorPerformanceMode } from '@react-native-firebase/ml-vision';
import CameraRoll from "@react-native-community/cameraroll";

class FaceDetectScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: RNCamera.Constants.Type.back
    };
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

    const detectorOptions = {
      classificationMode: VisionFaceDetectorClassificationMode.ALL_CLASSIFICATIONS,
      //classificationMode: 1,
      //contourMode: 2,
      contourMode: VisionFaceDetectorContourMode.ALL_CONTOURS,
      landmarkMode: VisionFaceDetectorLandmarkMode.ALL_LANDMARKS,
      performanceMode: VisionFaceDetectorPerformanceMode.ACCURATE,
      minFaceSize: 0.1
    }
    console.log(detectorOptions);
    const faces = await vision().faceDetectorProcessImage(localPath, detectorOptions);
    // const faces = await vision().faceDetectorProcessImage(localPath, options);

    console.log('Faces detected from image ==' + JSON.stringify(faces));

    faces.forEach(face => {
      console.log('Head rotation on Y axis: ', face.headEulerAngleY);
      console.log('Head rotation on Z axis: ', face.headEulerAngleZ);

      console.log('Left eye open probability: ', face.leftEyeOpenProbability);
      console.log('Right eye open probability: ', face.rightEyeOpenProbability);
      console.log('Smiling probability: ', face.smilingProbability);

      face.faceContours.forEach(contour => {
        if (contour.type === VisionFaceContourType.FACE) {
          console.log('Face outline points: ', contour.points);
        }
      });
    });

    this.props.navigation.navigate('MemoView', {
        displayText: JSON.stringify(faces)
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

export default FaceDetectScreen;