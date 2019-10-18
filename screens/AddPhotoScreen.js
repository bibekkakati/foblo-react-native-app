import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard , Alert, Dimensions} from 'react-native';
import { Thumbnail} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
// import 'firebase/firestore';

const uuidv4 = require('uuid/v4');

export default class CollectionScreen extends React.Component {

	static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Add Photo",
      headerRight: (
        <TouchableOpacity
              style={{marginRight: 15}}
              onPress={() => {
                params.handleSave();
              }}
            >
              <AntDesign name="check" size={28} color="#f62459" />
        </TouchableOpacity>
      ),
    };
  };

	constructor(props) {
    super(props);
    this.state = {
			photoUrl: this.props.navigation.getParam('photoUrl', ''),
      photoDownloadUrl: "",
      photoNumber: "",
      time: "",
      date: "",
      uid: this.props.navigation.getParam('uid', ''),
      photoId: ""
    };
  }

  componentWillMount(){
    this.props.navigation.setParams({ handleSave: this.savePhoto });
  }

  _urlToBlob(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onerror = reject;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr.response);
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob'; // convert type
        xhr.send();
    })
  };

  savePhoto = async () => {
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    if(this.state.photoUrl !== ""){        
      const parts = this.state.photoUrl.split(".");
      var fileExtension = parts[parts.length - 1];
      fileExtension = fileExtension.toLowerCase();
      //checking the file format
      if(fileExtension == "jpg" || fileExtension == "jpeg"){
        var docRef = db.collection("Photos").doc("user" + this.state.uid);
          await docRef.get().then((doc) => {
            var photoNumber = doc.data().photoNumber;
            this.setState({photoNumber: photoNumber});
            photoNumber = photoNumber + 1;
            this.setState({photoNumber: photoNumber});
          })
          .catch(function(error) {
            console.log("Error getting document: ", error);
          });
        
        const blob = await this._urlToBlob(this.state.photoUrl);
        const photoId = uuidv4();
        this.setState({photoId: photoId});
        var ref = storageRef
          .child("Photos")
          .child("user" + this.state.uid)
          .child("Photo" + this.state.photoId + "." + fileExtension);
        await ref.put(blob).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
        });
        await ref.getDownloadURL().then((url) => {
          var d = new Date();
          var date = d.getDate();
          var month = d.getMonth();
          var year = d.getFullYear();
          var hours = d.getHours();
          var minute = d.getMinutes();
          var time;

          if((minute >= 0) && (minute <= 9)){
            minute = "0" + minute;
          }

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
          this.uploadDate(date, month, year);
          this.setState({photoDownloadUrl: url, time: time});

        });
        db.collection("Photos").doc("user" + this.state.uid)
        .set({
          photoDownloadUrl: {
            [this.state.photoId] : {
              photoNo: Date.now(),
              photoId: this.state.photoId,
              link: this.state.photoDownloadUrl, 
              timeStamp: {
                time: this.state.time, 
                date: this.state.date,
              },
              likes: 0,
              likersUid: []
          }, 
            },
          photoNumber: this.state.photoNumber,
        },{ merge: true });
        this.props.navigation.replace('Collection');
      }
      else{
        return Alert.alert("Only jpg & jpeg images are supported.");
      }
    }
    else{
      Alert.alert("No photo selected.")
    }
  }


  uploadDate = (date, month, year) => {
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
        month = "Jun";
        break;
      case 7:
        month = "Jul";
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
		return (
			<KeyboardAvoidingView style={styles.container} behavior="position" enabled>
          <TouchableWithoutFeedback
            onPress={() => {
             // dismiss the keyboard if touch any other area then input
              Keyboard.dismiss();
            }}
          >
          <ScrollView>
						 <TouchableOpacity
						 	style={styles.photo}
						 	onPress={() => {}}
						 >
						 <Thumbnail 
								style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width, borderRadius: 0,}} 
								large 
								source={{uri: this.state.photoUrl}}
							/>
						 </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	photo: {
		justifyContent: "center",
    alignItems: "center",
  },
});