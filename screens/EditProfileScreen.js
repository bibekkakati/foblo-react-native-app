import React from 'react';
import { StyleSheet, Alert, Text, View, KeyboardAvoidingView, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Thumbnail, Form, Input, Item, DatePicker, Picker } from "native-base";
import Modal from 'react-native-modal';
import { Header } from "react-navigation-stack";
import * as firebase from "firebase";
// import 'firebase/firestore';


export default class EditProfileScreen extends React.Component{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Edit Profile",
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

  constructor(props){
    super(props);
    this.state = {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      profession: "",
      birthdate: "",
      college: "",
      bio: "",
      relationship: "",
      religion: "",
      gender: "",
      profilePic: "",
      profilePicDownloadUrl: "",
      uid: "",
      isLoading: true,
      isUploading: false,
      visibleModal: null,
    };
  }

  componentWillMount(){
    this.props.navigation.setParams({ handleSave: this.saveDetails });
    this.getDetails();
  }

  _renderModalContent = () => (
    <View style={styles.modalContent}>
           <TouchableOpacity
              onPress = {() => {
                 this.pickImage()
               }}
           >
            <Text style={styles.cpText}>Upload Profile Picture</Text>
           </TouchableOpacity>
           <TouchableOpacity
              onPress = {() => {
                  this.removeImage()
              }}
            >
              <Text style={styles.cpText}>Remove Profile Picture</Text>
            </TouchableOpacity>
    </View>
  );

  //get details from firestore and auth
  getDetails = () => {
   firebase.auth().onAuthStateChanged((authenticate) => {
      var name, email, uid, profilePic;
      if (authenticate) {
        // User is signed in.
        name = authenticate.displayName;
        email = authenticate.email;
        uid = authenticate.uid;
        profilePic = authenticate.photoURL;

        this.setState({
          fullName: name,
          email: email,
          profilePicDownloadUrl: profilePic,
          uid: uid
        });
        const db = firebase.firestore();
        const detailsRef = db.collection("Details").doc("user" + this.state.uid);

        detailsRef.get().then((doc) => {
          if (doc && doc.exists) {
            this.setState({
              city: doc.data().city,
              birthdate: doc.data().birthdate,
              gender: doc.data().gender,
              college: doc.data().college,
              bio: doc.data().bio,
              phone: doc.data().phone,
              profession: doc.data().profession,
              religion: doc.data().religion,
              relationship: doc.data().relationship,
              isLoading: false
        });
      } else {
          // doc.data() will be undefined in this case
          this.setState({ isLoading: false});
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
      } else {
        // No user is signed in.
        this.props.navigation.replace("SignIn");
      }
    })
  }

  //select the image to be uploaded
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if(!result.cancelled){
      this.setState({profilePicDownloadUrl: result.uri});
      this.setState({visibleModal: null});
    }
  };

  //to remove the image
  removeImage = async() => {
    const storageRef = firebase.storage().ref();
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    const delRef = storageRef.child("ProfilePic").child(this.state.uid + ".jpg");
    delRef.delete().then(() => {
      user.updateProfile({
        photoURL: null
      });
      this.setState({profilePicDownloadUrl: null});
      db.collection("Details").doc("user" + this.state.uid).set({profilePic: ""}, {merge: true})
          .then(function() {
            console.log("Document successfully written!");
          })
          .catch(function(error) {
            console.log("Error writing document: ", error);
          });
    })
    .catch((e) => {
      console.log(e);
      let delRef = storageRef.child("ProfilePic").child(this.state.uid + ".jpeg");
      delRef.delete().then(() => {
        user.updateProfile({
          photoURL: null
        });
        this.setState({profilePicDownloadUrl: null});
        this.setState({visibleModal: null});
        db.collection("Details").doc("user" + this.state.uid).set({profilePic: ""}, {merge: true})
          .then(function() {
            console.log("Document successfully written!");
          })
          .catch(function(error) {
            console.log("Error writing document: ", error);
          });
      })
      .catch((e) => {
        console.log(e);
        
      })
    })
  }

  //url to bob
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
  }

  // save details and image to firestore
  saveDetails = async() => {
    var self = this;
    if( this.state.fullName !== "" &&
        this.state.email !== ""
      ){
        this.setState({isUploading: true});
        const db = firebase.firestore();
        const storageRef = firebase.storage().ref();
        const user = firebase.auth().currentUser;
        this.titleCase(this.state.fullName, "fullName");
        user.updateProfile({
          displayName: this.state.fullName,
          email: this.state.email
        }).then(function() {
          // Update successful.
          console.log("Loaded");
        }).catch(function(error) {
          // An error happened.
          console.log(error);
          alert(error.message);
        });

        //image saving
        if(this.state.profilePicDownloadUrl !== ""){
          const parts = this.state.profilePicDownloadUrl.split(".");
          var fileExtension = parts[parts.length - 1];
          fileExtension = fileExtension.toLowerCase();
          //checking the file format
          if(fileExtension == "jpg" || fileExtension == "jpeg"){
            const blob =  await this._urlToBlob(this.state.profilePicDownloadUrl);
            const ref = storageRef
              .child("ProfilePic")
              .child(this.state.uid + "." + fileExtension);
            await ref.put(blob).then(function(snapshot) {
              console.log('Uploaded a blob or file!');
            });
            await ref.getDownloadURL().then((url) => {
              this.setState({profilePic: url});
              user.updateProfile({
                photoURL: url
              }).then(function() {
                // Update successful.
                console.log("Loaded url");
              }).catch(function(error) {
                // An error happened.
                console.log(error);
              });
            });
          }
          else{
            return Alert.alert("Only jpg & jpeg images are supported.");
          }
        }
        
        var details = {};
        //check if states are blank if not assign to object details
        if(this.state.profilePic !== ""){
          Object.assign(details, {profilePic: this.state.profilePic});
        }
        if(this.state.fullName !== ""){
          Object.assign(details, {fullName: this.state.fullName});
        }
        if(this.state.city !== ""){
          Object.assign(details, {city: this.state.city});
        }
        if(this.state.birthdate !== ""){
          Object.assign(details, {birthdate: this.state.birthdate});
        }   
        if(this.state.gender !== ""){
          Object.assign(details, {gender: this.state.gender});
        }
        if(this.state.college !== ""){
          Object.assign(details, {college: this.state.college});
        }
        if(this.state.bio !== ""){
          Object.assign(details, {bio: this.state.bio});
        }
        if(this.state.phone !== ""){
          Object.assign(details, {phone: this.state.phone});
        }
        if(this.state.profession !== ""){
          Object.assign(details, {profession: this.state.profession});
        }
        if(this.state.religion !== ""){
          Object.assign(details, {religion: this.state.religion});
        }
        if(this.state.relationship !== ""){
          Object.assign(details, {relationship: this.state.relationship});
        }
        
        //check if object details is not empty then update details to firestore
        if(Object.keys(details).length > 0){
          Object.assign(details, {uid: this.state.uid});
          await db.collection("Details").doc("user" + this.state.uid).set(details, {merge: true})
          .then(function() {
            console.log("Document successfully written!");
            self.setState({isUploading: false});
          })
          .catch(function(error) {
            self.setState({isUploading: false});
            self.props.navigation.goBack();
            console.log("Error writing document: ", error);
          });
        }
        self.setState({isUploading: false});
        self.props.navigation.goBack();
      }
      else{
        alert("Blank fields are required.");
      }
  }

  //titleCase function to convert first alphabet of every words in a sentence to upperCase
  titleCase = (str, option) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    splitStr = splitStr.join(' '); 
    //checking which state need to be updated
    if(option == "fullName"){
      this.setState({fullName: splitStr});
    }
    if(option == "city"){
      this.setState({city: splitStr});
    }
    if(option == "profession"){
      this.setState({profession: splitStr});
    }
    if(option == "college"){
      this.setState({college: splitStr});
    }
    if(option == "religion"){
      this.setState({religion: splitStr});
    }
  }

  //to conert the birthdate into a readable format
  birthdate = (year, month, date) => {
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
    var bDay = date + ' ' + month + ' ' + year;
    bDay = bDay.toString();
    this.setState({birthdate: bDay});
  }

  //rendering design part
  render(){
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#f62459" />
          <Text style={{ textAlign: "center" }}>
            Loading...
          </Text>
        </View>
      );
    }
    if (this.state.isUploading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#f62459" />
          <Text style={{ textAlign: "center" }}>
            Saving...
          </Text>
        </View>
      );
    }
    var date = new Date();
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled keyboardVerticalOffset={Header.HEIGHT + 20}>
      <TouchableWithoutFeedback
          onPress={() => {
            // dismiss the keyboard if touch any other area then input
            Keyboard.dismiss();
          }}
      >
      <ScrollView>
        <View style={styles.profilePic}>
          <Thumbnail 
            style={{width: 100, height: 100, borderRadius: 100}} 
            large 
            source={
              this.state.profilePicDownloadUrl == null ? require("../assets/default-profile.png") : {uri: this.state.profilePicDownloadUrl}
            } 
          />
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => {
              this.setState({ visibleModal: 5 })

            }}
          >
            <Text style={styles.text}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
        
         <Modal 
            isVisible={this.state.visibleModal === 5} style={styles.bottomModal}
            onBackButtonPress={() => {
               this.setState({visibleModal: null});
            }}
            onBackdropPress={() => {this.setState({visibleModal: null})}}
          >
              {this._renderModalContent()}
          </Modal>



        <Form style={styles.form}>
          <Text style={styles.labelText}>Full Name</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.fullName}
              onChangeText={(fullName) => {this.setState({fullName: fullName})}}
            />
          </Item>
          <Text style={styles.labelText}>Email</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={(email) => {this.setState({email: email})}}
            />
          </Item>
          <Text style={styles.labelText}>Phone</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.phone}
              maxLength={13}
              onChangeText={(phone) => {this.setState({phone: phone})}}
            />
          </Item>
          <Text style={styles.labelText}>Profession</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="Profession"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.profession}
              onChangeText={(profession) => {this.titleCase(profession, "profession")}}
            />
          </Item>
          <Text style={styles.labelText}>Bio</Text>
          <Item style={{marginTop: 15}}>
            <Input
              style={styles.input}
              onChangeText={(text) => this.setState({bio: text})}
              multiline={true}
              maxLength={160}
              editable = {true}
              placeholder="Bio"
              placeholderTextColor="#7B8788"
              value={this.state.bio}
            />
          </Item>
          <Text style={styles.labelText}>City</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.city}
              onChangeText={(city) => {this.titleCase(city, "city")}}
            />
          </Item>
          <Text style={styles.labelText}>Birthdate</Text>
          <Item style={styles.item}>
            <DatePicker
              defaultDate={new Date(1998, 1, 1)}
              minimumDate={new Date(1970, 1, 1)}
              maximumDate={new Date(date.getFullYear() - 13, 1, 1)}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={this.state.birthdate}
              textStyle={{ color: "#000" }}
              placeHolderTextStyle={{ color: "#000" }}
              onDateChange={(date) => {this.birthdate(date.getFullYear(),date.getMonth(),date.getDate())}}
              disabled={false}
            />
          </Item>
          <Text style={styles.labelText}>College/University</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="College/University"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(college) => {this.titleCase(college, "college")}}
              value={this.state.college}
            />
          </Item>
          <Text style={styles.labelText}>Religion</Text>
          <Item style={styles.item}>
            <Input
              style={styles.input}
              placeholder="Religion"
              placeholderTextColor="#7B8788"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.religion}
              onChangeText={(religion) => {this.titleCase(religion, "religion")}}
            />
          </Item>
          <Text style={styles.labelText}>Relationship</Text>
          <Item style={styles.item}>
            <Picker
              itemTextStyle={{fontSize: 14}}
              activeItemTextStyle={{fontSize: 14, fontWeight: "bold"}}
              mode="dropdown"
              placeholder="Relationship"
              placeholderTextColor="#7B8788"
              note={false}
              selectedValue={this.state.relationship}
              onValueChange={(relationship) => {this.setState({relationship: relationship})}}
            >
              <Picker.Item label="Select Relationship Status" value="Not specified" />
              <Picker.Item label="Single" value="Single" />
              <Picker.Item label="In a relationship" value="In a relationship" />
              <Picker.Item label="Married" value="Married" />
              <Picker.Item label="Divorce" value="Divorce" />
              <Picker.Item label="Widowed" value="Widowed" />
            </Picker>
          </Item>
          <Text style={styles.labelText}>Gender</Text>
          <Item style={styles.item}>
            <Picker
              itemTextStyle={{fontSize: 14}}
              activeItemTextStyle={{fontSize: 14, fontWeight: "bold"}}
              mode="dropdown"
              placeholder="Gender"
              placeholderTextColor="#7B8788"
              note={false}
              selectedValue={this.state.gender}
              onValueChange={(gender) => {this.setState({gender: gender})}}
            >
              <Picker.Item label="Select Gender" value="Not specified" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </Item>
        </Form>
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profilePic: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f62459"
  },
  labelText:{
    paddingLeft: 20,
    color: "grey",
    marginTop: 20
  },
  form: {
    padding: 10,
    width: "100%",
    marginBottom: 30
  },
  button: {
    padding: 20,
    marginTop: 20,
    alignContent: "center"
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    padding: 5,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1.5,
  },
  input: {
    fontSize: 15
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  cpText: {
    padding: 5,
    fontSize: 16,
    fontWeight: "500"
  }
});