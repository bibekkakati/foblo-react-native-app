import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Button, Form, Input, Item} from 'native-base';
import * as firebase from "firebase";


export default class SigninScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }

  static navigationOptions = {
    title: "SignIn",
    header: null
  };

  //email-password sign-in method
  signinUser = async(email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      this.props.navigation.replace("Home");
    })
    .catch(error => {
      alert(error.message);
    })
  }

  //google sign-in method
  signinWithGoogle = async() => {
    var provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider)
    .then(authenticate => {
      return authenticate.user.updateProfile({
        displayName: name
      })
      .then(() => {
        this.props.navigation.replace("Home");
      })
    }).catch(function(error) {
      // Handle Errors here.
      alert(error.message);
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" enabled keyboardVerticalOffset={-200}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>foblo</Text>
        </View>
        <Form style={styles.form}>
          <Item style={styles.item}>
            <Entypo name="email" size={16} color="#f62459" />
            <Input
              placeholder="Email"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(email) => {this.setState({email: email})}}
            />
          </Item>
          <Item style={styles.item}>
            <Entypo name="key" size={16} color="#f62459" />
            <Input
              placeholder="Password"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry={true}
              onChangeText={(password) => {this.setState({password: password})}}
            />
          </Item>
          <Button
            style={styles.button}
            full
            rounded
            onPress={() => {this.signinUser(
              this.state.email,
              this.state.password
            )}}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </Button>
          <Button
            style={styles.buttonG}
            full
            rounded
            onPress={() => {this.signinWithGoogle()}}
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </Button>
        </Form>
        <View style={styles.footer}>
          <Text style={styles.forgotPassword} onPress={() => {this.props.navigation.navigate("ForgotPassword")}}>Forgot password?</Text>
          <Text style={styles.footerText} onPress={() => {this.props.navigation.replace("SignUp")}}>Create an account.</Text>
        </View>
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
    marginBottom: 30,
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
  buttonG: {
    marginTop: 10,
    backgroundColor: '#279DE1',
  },
  footer: {
    alignItems: "center",
    marginTop: 50
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f62459",
    paddingBottom: 5
  },
  footerText: {
    color: "#7b8788",
    fontSize: 14
  }
});