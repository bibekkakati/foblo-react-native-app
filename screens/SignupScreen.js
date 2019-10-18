import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Button, Form, Input, Item} from 'native-base';
import * as firebase from "firebase";
// import 'firebase/firestore';


export default class SignupScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      fullName: "",
      time: "",
      date: "",
      isLoading: false
    }
  }

  static navigationOptions = {
    title: "SignUp",
    header: null
  };

  //email-password sign-up
  signupUser = (fullName, email, password) => {
    this.setState({isLoading: true});
    var fullName = this.titleCase(fullName);
    const db = firebase.firestore();

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(authenticate => {
      return authenticate.user.updateProfile({
        displayName: fullName
      })
      .then(() => {
        var d = new Date();
          var date = d.getDate();
          var month = d.getMonth();
          var year = d.getFullYear();
          var hours = d.getHours();
          var minute = d.getMinutes();
          var time;
          if(hours < 12){
            if(hours == 0){
              time = "00:" + minute + " AM";
            }
            else{
              time = hours + ":" + minute + " AM";
            }
          }
          else{
            time = hours + ":" + minute + " PM";
          }
          time = time.toString();
          this.creationDate(date, month, year);
        db.collection("Details").doc("user" + this.state.uid).set({
          password: password,
          creationDate: this.state.date,
          creationTime: this.state.time,
        })
        .then(() => {
          console.log("Password copied");
        })
        .catch((e) => {
          console.log(e);
        });
        this.setState({isLoading: false});
        this.props.navigation.replace("Home");
        db.collection("Photos").doc("user" + this.state.uid)
        .set({
          photoNumber: 0
          })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.log("Error writing document: ", error);
        });
      })
    })
    .catch(error => {
      alert(error.message);
    })
  }

  //google sign-up
  signupWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(authenticate => {
      return authenticate.user.updateProfile({
        displayName: name
      })
    }).catch(function(error) {
      // Handle Errors here.
      alert(error.message);
    });
  }

  titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
  }

  creationDate = (date, month, year) => {
    var date = date;
    var month = month+1;
    var year = year;
    switch(month){
      case 1:
        month = "Jan";
        break;
      case 2:
        month = "Feb";
        break;
      case 3:
        month = "Mar";
        break;
      case 4:
        month = "Apr";
        break;
      case 5:
        month = "May";
        break;
      case 6:
        month = "June";
        break;
      case 7:
        month = "July";
        break;
      case 8:
        month = "Aug";
        break;
      case 9:
        month = "Sep";
        break;
      case 10:
        month = "Oct";
        break;
      case 11:
        month = "Nov";
        break;
      case 12:
        month = "Dec";
        break;
    }
    var d = date + ' ' + month + ' ' + year;
    d = d.toString();
    this.setState({date: d});
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#f62459" />
          <Text style={{ textAlign: "center" }}>
            Creating account...
          </Text>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" enabled keyboardVerticalOffset={-200}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>foblo</Text>
        </View>
        <Form style={styles.form}>
          <Item style={styles.item}>
            <Entypo name="user" size={16} color="#f62459" />
            <Input
              placeholder="Full Name"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="name-phone-pad"
              onChangeText={(fullName) => {this.setState({fullName: fullName})}}
            />
          </Item>
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
            onPress={() => {
              this.signupUser(
                this.state.fullName,
                this.state.email,
                this.state.password
              )
            }}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Button>
          <Button
            style={styles.buttonG}
            full
            rounded
            onPress={() => {
              this.signupWithGoogle();
            }}
          >
            <Text style={styles.buttonText}>Sign up with Google</Text>
          </Button>
        </Form>
        <View style={styles.footer}>
          <Text style={styles.footerText} onPress={() => {this.props.navigation.replace("SignIn")}}>Have account? Sign in.</Text>
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
    color: "#f62459",
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
  buttonG: {
    marginTop: 10,
    backgroundColor: '#279DE1',
  },
  footer: {
    alignItems: "center",
    marginTop: 50
  },
  footerText: {
    color: "#7b8788",
    fontSize: 14
  },
});