import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';
import * as firebase from "firebase";


export default class SettingsScreen extends React.Component {

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.replace("SignIn");
    }).catch((error) => {
      alert(error.message);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
            style={styles.button}
            full
            rounded
            onPress={() => {this.signOut()}}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </Button>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {this.props.navigation.navigate("EditProfile")}}
          >
            <Text style={styles.buttonText}>Edit profile</Text>
          </Button>
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
  button: {
    marginTop: 20,
    backgroundColor: '#f62459',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300"
  },
});