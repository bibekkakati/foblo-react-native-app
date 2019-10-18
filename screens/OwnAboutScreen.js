import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from "firebase";


export default class OwnAboutScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>OwnAboutScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});