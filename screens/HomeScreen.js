import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'native-base';
import * as firebase from "firebase";

export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: "",
      email: "",
      emailVerified: "",
      uid: "",
      phone: ""
    }
  }


  componentWillMount(){
    firebase.auth().onAuthStateChanged((authenticate) => {
      var name, email, uid, emailVerified, phone;
      if (authenticate) {
        // User is signed in.
        name = authenticate.displayName;
        email = authenticate.email;
        emailVerified = authenticate.emailVerified;
        uid = authenticate.uid;
        phone = authenticate.phoneNumber;

        this.setState({name: name, email: email, emailVerified: emailVerified, uid: uid, phone: phone});
      } else {
        // No user is signed in.
        this.props.navigation.replace("SignIn");
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.name}</Text>
        <Text>{this.state.email}</Text>
        <Text>{this.state.emailVerified}</Text>
        <Text>{this.state.uid}</Text>
        <Text>{this.state.phone}</Text>
        <Button
          full rounded success
          onPress = {() => {this.props.navigation.navigate("SettingsScreen")}}
        ><Text>settings</Text></Button>
        <Button
          full rounded success
          onPress = {() => {this.props.navigation.navigate("ChangePassword")}}
        ><Text>change password</Text></Button>
        <Button
          full rounded success
          onPress = {() => {this.props.navigation.navigate("Collection", {uid: this.state.uid})}}
        ><Text>collection</Text></Button>
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