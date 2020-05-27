import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import { RNCamera } from 'react-native-camera';
import vision, { VisionBarcodeValueType } from '@react-native-firebase/ml-vision';

class BarcodeScanScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Barcode Scan</Text>
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
      this.processBarcodes(data.uri).then(() => console.log('Finished processing file.'));
    }
  };

  async processBarcodes(localPath) {
    console.log('Barcode to be processed from file ==' + localPath);
    const barcodes = await vision().barcodeDetectorProcessImage(localPath);
    let barcodeText = '';
    let displayText = '';
    console.log('Barcode detected from image ==' + barcodes);
  
    barcodes.forEach(barcode => {
      if (barcode.valueType === VisionBarcodeValueType.CALENDAR_EVENT) {
        console.log('Barcode is a calendar event: ', JSON.stringify(barcode.calendarEvent));
        barcodeText = barcode.calendarEvent.location + ';' + barcode.calendarEvent.summary;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.CONTACT_INFO) {
        console.log('Barcode contains contact info: ', JSON.stringify(barcode.contactInfo));
        barcodeText = barcode.contactInfo.name.formatted + ';' + JSON.stringify(barcode.contactInfo.phones);
      }
  
      if (barcode.valueType === VisionBarcodeValueType.DRIVER_LICENSE) {
        console.log('Barcode contains drivers license info: ', JSON.stringify(barcode.driverLicense));
        barcodeText = barcode.driverLicense.licenseNumber;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.EMAIL) {
        console.log('Barcode contains email address info: ', JSON.stringify(barcode.email));
        barcodeText = barcode.email.address;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.GEO) {
        console.log('Barcode contains location info: ', JSON.stringify(barcode.geoPoint));
        barcodeText = barcode.geoPoint;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.PHONE) {
        console.log('Barcode contains phone number info: ', JSON.stringify(barcode.phone));
        barcodeText = barcode.phone.number;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.SMS) {
        console.log('Barcode contains SMS info: ', JSON.stringify(barcode.sms));
        barcodeText = barcode.sms.message;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.URL) {
        console.log('Barcode contains URL info: ', JSON.stringify(barcode.url));
        barcodeText = barcode.url.url;
      }
  
      if (barcode.valueType === VisionBarcodeValueType.WIFI) {
        console.log('Barcode contains WIFI info: ', JSON.stringify(barcode.wifi));
        barcodeText = barcode.wifi.ssid;
      }

      displayText = displayText + '\n' + 'Format=' + barcode.format + '####Text=' + barcode.displayValue + '####' + barcodeText;

    });
    this.props.navigation.navigate('MemoView', {
        displayText: displayText
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

export default BarcodeScanScreen;




