import React from 'react';
import {Text, View, Button, StyleSheet, TextInput} from 'react-native';
import naturalLanguage from '@react-native-firebase/ml-natural-language';

class LanguageIdScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: 'Hello there. General Kenobi.',
      displayText: ''
    };
  }

  onChangeText(text)
  {
    this.setState({inputText: text});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Language Identification</Text>
        <TextInput 
            style={{ height: 100, borderColor: 'gray', borderWidth: 1 }} 
            multiline={true}
            onChangeText={text => this.onChangeText(text)}
            value={this.state.inputText}
        >
        </TextInput>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.identifyLanguage()}
            title="Process"
          />
          <Text>Language : {this.state.displayText}</Text>
        </View>
      </View>
    );
  }

  identifyLanguage = async () => {
    console.log("identifyLanguage");
    const language = await naturalLanguage().identifyLanguage(this.state.inputText);
    console.log('Identified language: ', language);

    this.setState(
      {
        displayText: language
      }
    );

   };

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'flex-start',
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

export default LanguageIdScreen;