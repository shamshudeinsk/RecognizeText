import React from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';


class ImageDisplayScreen extends React.Component {

  constructor(props) {
    super(props);

    console.log('navigation=' + this.props.navigation);
    console.log('route' + this.props.route);
    console.log('route params' + this.props.route.params);
    console.log('dataUri' + this.props.route.params.dataUri);
    
    this.state = {
      dataUri: this.props.route.params.dataUri
    };
  }

  render() {
    return (
      <View style={styles.container}>
         <View>
         <Text style={styles.centeredText}>Image B4</Text>
          <Image
            style={styles.imagePreview}
            source={{uri: this.state.dataUri}} />
          <Text style={styles.centeredText}>Image After</Text>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'flex-start',
  },
  imagePreview: {
    width: 400,
    height: 520,
  },
});

export default ImageDisplayScreen;