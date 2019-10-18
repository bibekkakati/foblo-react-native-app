import React from 'react';
import { StyleSheet, Image, Dimensions, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Text, Thumbnail, Button, Left, Right } from 'native-base';
import Modal from "react-native-modal";
import { Feather, Entypo } from "@expo/vector-icons";
import * as firebase from "firebase";
import 'firebase/firestore';

export default class SinglePostScreen extends React.Component {

  static navigationOptions = {
		title: "Photo"
  }
  
  constructor(props) {
    super(props)
    this.state = {
			data: this.props.navigation.getParam('data', ''),
      uid: this.props.navigation.getParam('uid', ''),
      photoId: this.props.navigation.getParam('photoId', ''),
      photoUrl: "",
      time: "",
      date: "",
      likes: "",
      location: "",
      profilePic: "",
      fullName: "",
      visibleModal: null,
      likedPic: false,
      dataLoaded: false
    };
  }
  
  componentWillMount = () => {
    this.nameAndProPic();
    this.dataAccess();
    this.checkLiked(this.state.photoId, this.state.uid);
  }

  _renderModalContent = () => (
    <View style={styles.modalContent}>
           <TouchableOpacity
              onPress = {() => {
                 this.setState({visibleModal: null})
                 Alert.alert(
                   'Are you sure?',
                   'You want to delete this post.',
                   [
                     {text: 'Cancel', onPress : () => {console.log('Cancelled')}, style: 'cancel' },
                     {text: 'Delete', onPress: () => {this.deletePost()}},
                    ],
                    {cancelable: true},
                   )
               }}
           >
            <Text style={styles.cpText}>Delete</Text>
           </TouchableOpacity>
    </View>
  );

  deletePost = async () => {
    //console.log(this.state.photoId)
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    var docRef = db.collection("Photos").doc("user" + this.state.uid);
    var delref = storageRef
          .child("Photos")
          .child("user" + this.state.uid);

    await delref.child("Photo" + this.state.photoId + ".jpg").delete().then(() => {
      console.log("Deleted from storage.");
      docRef.update(
        {
          ['photoDownloadUrl.'+this.state.photoId]: firebase.firestore.FieldValue.delete(),
          photoNumber: firebase.firestore.FieldValue.increment(-1)
        }
      )
    }).catch(e => {
      console.log(e)
      delref.child("Photo" + this.state.photoId + ".jpeg").delete().then(() => {
        console.log("Deleted from storage.");
        docRef.update(
          {
            ['photoDownloadUrl.'+this.state.photoId]: firebase.firestore.FieldValue.delete(),
            photoNumber: firebase.firestore.FieldValue.increment(-1)
          }
        );
    }).catch(e => {
      console.log(e);
    })

  })
  };

  nameAndProPic = () => {
    const db = firebase.firestore();
    const detailsRef = db.collection("Details").doc("user" + this.state.uid);

    detailsRef.get().then((doc) => {
      // var fullName = doc.data().fullName;
      // var profilePic = doc.data().profilePic;
      this.setState({fullName: doc.data().fullName, profilePic: doc.data().profilePic});
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  };

  dataAccess = () => {
    var data = this.state.data;
    var photoUrl = data.link;
    var likes = data.likes;
    var time = data.timeStamp.time;
    var date = data.timeStamp.date;
    var d = new Date();
    var cdate = d.getDate();
    var cmonth = d.getMonth();
    var cyear = d.getFullYear();
    var chours = d.getHours();
    var cminute = d.getMinutes();
    var ctime;
    
    if((cminute >= 0) && (cminute <= 9)){
      cminute = "0" + cminute;
    }
    if(chours < 12){
      if(chours == 0){
        ctime = "00:" + cminute + " AM";
      }
      else{
        ctime = chours + ":" + cminute + " AM";
      }
    }
    else{
      ctime = chours + ":" + cminute + " PM";
    }
    ctime = ctime.toString();
    var getcdate = this.verifyDate(cdate, cmonth, cyear);

    if(getcdate === date){
      date = "Today";
    }
    
    var len = date.length;
    var temp = date.slice(len-4);
    cyear = cyear.toString();
    if(cyear === temp){
      date = date.slice(0, -4);
    }
    //console.log(date);
    this.setState({
      photoUrl: photoUrl,
      time: time,
      date: date,
      likes: likes,
    });
  };

  verifyDate = (date, month, year) => {
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
    return d;
  };

  checkLiked = async (photoId, uid) => {
    const db = firebase.firestore();
    var docRef = db.collection("Photos").doc("user" + uid);
    await docRef.get().then((doc) => {
      arrLikersUid = doc.data().photoDownloadUrl[photoId].likersUid;
      let res = arrLikersUid.includes(uid);
      // console.log(res);
      this.setState({likedPic: res, dataLoaded: true});
    });
  };

  likeImage = async (photoId, uid) => {
    const db = firebase.firestore();
    var docRef = db.collection("Photos").doc("user" + uid);
    if(this.state.likedPic){
      // var index = arrLikersUid.indexOf(uid);
      // if (index !== -1) arrLikersUid.splice(index, 1);
      await this.setState({likedPic: false});
      await docRef.update({
        ['photoDownloadUrl.'+photoId+'.likersUid']: firebase.firestore.FieldValue.arrayRemove(uid),
        ['photoDownloadUrl.'+photoId+'.likes']: firebase.firestore.FieldValue.increment(-1)
      });
      docRef.onSnapshot((doc) => {
        let likes = doc.data().photoDownloadUrl[photoId].likes;
        //console.log(likes);
        this.setState({likes: likes});
      });
    }else{
      await this.setState({likedPic: true});
     await docRef.update({
        ['photoDownloadUrl.'+photoId+'.likersUid']: firebase.firestore.FieldValue.arrayUnion(uid),
        ['photoDownloadUrl.'+photoId+'.likes']: firebase.firestore.FieldValue.increment(1)
      });
      docRef.onSnapshot((doc) => {
        let likes = doc.data().photoDownloadUrl[photoId].likes;
        //console.log(likes);
        this.setState({likes: likes});
      });
    }
  }

  navPhotoComments = () => {
    this.props.navigation.navigate("PhotoComments", {uid: this.state.uid, photoId: this.state.photoId});
  }

  render() {
    if(!(this.state.dataLoaded)){
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
    return (
      <Container>
        <Content >
          <Card transparent>
            <CardItem>
              <Left style={styles.left}>
                <TouchableOpacity
                  onPress={() => {}}
                >
                <Thumbnail small source={
                  this.state.profilePic == null ? require("../assets/default-profile.png") : {uri: this.state.profilePic}
                }/>
                </TouchableOpacity>
                  <Button transparent style={{
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center",
                    padding: 0,
                    margin: 0
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {}}
                    >
                      <Text style={styles.name}>{this.state.fullName}</Text>
                    </TouchableOpacity>
                    
                  </Button>
              </Left>
              <Right>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ visibleModal: 5 })
                  }}
                >  
                  <Entypo name="dots-three-horizontal" size={26} />
                </TouchableOpacity>
              </Right>
              
            </CardItem>

            <Modal 
              isVisible={this.state.visibleModal === 5} style={styles.bottomModal}
              onBackButtonPress={() => {
                this.setState({visibleModal: null});
              }}
              onBackdropPress={() => {this.setState({visibleModal: null})}}
            >
                {this._renderModalContent()}
            </Modal>


            <CardItem cardBody>
              <Image 
                source={{uri: this.state.photoUrl}} 
                style={{height: Dimensions.get('window').width, width: Dimensions.get('window').width, flex: 1}}
                
              />
            </CardItem>
            <CardItem>
              <Left style={styles.left}>
                <Button transparent 
                  style={{
                    left: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    margin: 0
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {this.likeImage(this.state.photoId, this.state.uid)}}
                  >
                    <Feather name="heart" size={24} color={this.state.likedPic ? "#f62459" : '#2C3335'}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                  >
                      <Text style={styles.customText}>{this.state.likes}</Text>
                  </TouchableOpacity>
                </Button>
                  
                <Button transparent 
                  style={{
                    left: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    margin: 0
                  }}
                  onPress={() => {this.navPhotoComments()}}
                >
                  <TouchableOpacity
                    onPress={() => {this.navPhotoComments()}}
                  >
                    <Feather name="message-circle" size={24}/>
                  </TouchableOpacity>
                  <Text style={styles.customText}>114</Text>
                </Button>
              </Left>
              <Right> 
                <Text note>{this.state.date} at {this.state.time}</Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  customText: {
    fontWeight: "500",
    color: "#2C3335",
    fontSize: 14,
    padding: 0,
    margin: 0,
    left: 0
  },
  name: {
    fontWeight: "500",
    color: "#2C3335",
    fontSize: 18,
    padding: 0,
    margin: 0
  },
  left: {
    left: 0,
    flexDirection: "row",
    padding: 0,
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
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

