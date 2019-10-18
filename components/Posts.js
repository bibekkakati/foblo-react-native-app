import React, {Component} from 'react';
import { StyleSheet, Text} from 'react-native';

export default class Posts extends Component{

  render() {
    return (
      <Text style={styles.text}>Posts</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
      fontSize: 16
  }
});
