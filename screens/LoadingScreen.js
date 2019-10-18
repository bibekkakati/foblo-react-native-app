import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import * as firebase from "firebase";


export default class LoadingScreen extends React.Component {

    static navigationOptions = {
        title: "Loading",
        header: null
    };

    componentDidMount(){
        firebase.auth().onAuthStateChanged( (authenticate) => {
            if(authenticate){
                this.props.navigation.replace("Home");
            }
            else{
                this.props.navigation.replace("SignIn")
            }
        })
    }

  render() {
    return (
        <View
            style={{flex: 1, justifyContent: "center", backgroundColor: "#fff"}}
        >
        <Text style={styles.text}>foblo</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 55,
        justifyContent: "center",
        textAlign: "center",
        color: '#f62459',
        fontWeight: "500",
        textShadowColor: "#696969",
        letterSpacing: 2
    }
});