import React, {Component} from 'react';
import { StyleSheet, Text} from 'react-native';

export default class Blogs extends Component{

  render() {
    return (
      <Text style={styles.text}>Blogs</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
      fontSize: 16
  }
});

