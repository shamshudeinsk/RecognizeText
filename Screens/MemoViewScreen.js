import React from 'react';
import {Text, Button, View, StyleSheet, TextInput, Clipboard} from 'react-native';
import Share from 'react-native-share';

class MemoViewScreen extends React.Component {

  constructor(props) {
    super(props);

    console.log('navigation=' + this.props.navigation);
    console.log('route' + this.props.route);
    console.log('route params' + this.props.route.params);
    console.log('displayText' + this.props.route.params.displayText);
    
    this.state = {
      displayText: this.props.route.params.displayText
    };
  }

  onChangeText(text)
  {
    this.setState({displayText: text});
  }

  share()
  {
    // let shareOptions = {
    //   title: 'RecognizeText',
    //   url: 'http://www.cortexmind.com',
    //   message: this.state.displayText,
    //   social: Share.Social.WHATSAPP,
    // };
    let shareOptions = {
      title: 'RecognizeText',
      url: 'http://www.cortexmind.com',
      message: this.state.displayText
    };
    console.log('social', Share);
    // Share.shareSingle(
    //   Object.assign(shareOptions, {
    //     social: Share.Social.WHATSAPP,
    //   })
    // );
    Share.open(shareOptions);
  }

  render() {
    return (
      <View style={styles.container}>
          <View>
            <Button 
                  onPress={async () => {
                  await Clipboard.setString(this.state.displayText);
                  alert('Copied to Clipboard!');
                }}
                title="Copy">
            </Button>
            <Button 
                onPress={() => {
                  setTimeout(() => {
                    this.share();
                  }, 300);
                }}
                title="Share">
            </Button>
          </View>
          <TextInput 
            style={{ height: 400, borderColor: 'gray', borderWidth: 1 }} 
            multiline={true}
            onChangeText={text => this.onChangeText(text)}
            value={this.state.displayText}
          >
          </TextInput>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'flex-start',
  }
});

export default MemoViewScreen;