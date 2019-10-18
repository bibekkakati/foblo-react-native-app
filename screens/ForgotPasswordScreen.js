import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Button, Form, Input, Item} from 'native-base';
import * as firebase from "firebase";


export default class ForgotPasswordScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: ""
    }
  }

  static navigationOptions = {
    title: "Forgot Password",
  };

  //password reset function
  passwordReset = async email => {
    var auth = firebase.auth();
    var emailAddress = email;

    await auth.sendPasswordResetEmail(emailAddress).then(() => {
      alert("Password reset email sent.");
      this.props.navigation.goBack();
    }).catch(function(error) {
      // An error happened.
      alert(error.message);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>foblo</Text>
        </View>
        <Form style={styles.form}>
          <Item style={styles.item}>
            <Entypo name="email" size={16} color="#f62459" />
            <Input
              style={{color: "#000"}}
              placeholder="Email"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(email) => {this.setState({email: email})}}
            />
          </Item>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {this.passwordReset(this.state.email)}}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Button>
        </Form>
      </View>
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