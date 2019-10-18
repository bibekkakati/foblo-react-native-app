import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Button, Form, Input, Item} from 'native-base';
import * as firebase from "firebase";


export default class ChangePasswordScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      newPassword: "",
      confirmPassword: ""
    }
  }

  static navigationOptions = {
    title: "Change Password"
  };

  // to check if both input are same or not
  passwordValidation = (newPassword, confirmPassword) => {
    if(newPassword===confirmPassword){
      this.passwordChange(newPassword);
    }
    else{
      alert("Password doesn't match.")
    }
  };

  //to update the password in database
  passwordChange = async newPassword => {
    var user = firebase.auth().currentUser;
    var newPassword = newPassword;
    const db = firebase.firestore();

    await user.updatePassword(newPassword).then(() => {
      // Update successful.
      alert("Password changed successfully.");
      this.props.navigation.replace("Home");
      db.collection("Details").doc("user" + this.state.uid).set({password: newPassword}, {merge: true})
        .then(() => {
          console.log("Password copied");
        })
        .catch((e) => {
          console.log(e);
        });
    }).catch((error) => {
      // An error happened.
      alert(error.message);
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" enabled keyboardVerticalOffset={-100}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>foblo</Text>
        </View>
        <Form style={styles.form}>
          <Item style={styles.item}>
            <Entypo name="key" size={16} color="#f62459" />
            <Input
              placeholder="New password"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry={true}
              onChangeText={(newPassword) => {this.setState({newPassword: newPassword})}}
            />
          </Item>
          <Item style={styles.item}>
            <Entypo name="key" size={16} color="#f62459" />
            <Input
              placeholder="Confirm password"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry={true}
              onChangeText={(confirmPassword) => {this.setState({confirmPassword: confirmPassword})}}
            />
          </Item>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {this.passwordValidation(this.state.newPassword, this.state.confirmPassword)}}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Button>
        </Form>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 100
  },
  logoText: {
    fontSize: 50,
    justifyContent: "center",
    textAlign: "center",
    color: '#f62459',
    fontWeight: "500",
    textShadowColor: "#696969",
    letterSpacing: 2
  },
  form: {
    padding: 20,
    width: "100%",
    marginBottom: 30
  },
  item: {
    marginBottom: 5
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