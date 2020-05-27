import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import naturalLanguage from '@react-native-firebase/ml-natural-language';

class SmartReplyScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayText: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Smart Reply</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.getSmartReply()}
            title="Process"
          />
          <Text>Smart Reply: {this.state.displayText}</Text>
        </View>
      </View>
    );
  }

  getSmartReply = async () => {
    console.log("getSmartReply");
    let replyText = '';
    const replies = await naturalLanguage()
      .suggestReplies([
        { text: 'Hey, long time no speak!' },
        { text: 'I know right, it has been a while..', userId: '123', isLocalUser: false },
        { text: 'We should catchup some time!' },
        { text: 'Definitely, how about we go for lunch this week?', userId: '123', isLocalUser: false },
      ]);
    
    replies.forEach(reply => {
      console.log(reply.text);
      replyText = replyText + '####' + reply.text;
    });
    console.log('displayText ==' + replyText);
    this.setState(
      {
        displayText: replyText
      }
    );

   };

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

export default SmartReplyScreen;