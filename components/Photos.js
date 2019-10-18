import React, {Component} from 'react';
import { StyleSheet, ScrollView, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native';
import { withNavigation } from 'react-navigation';
import * as firebase from "firebase";
import 'firebase/firestore';

class Photos extends Component{

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      uid: this.props.uid,
    };
  }

  // componentWillMount = () => {
  //   firebase.auth().onAuthStateChanged((authenticate) => {
  //     var uid;
  //     if (authenticate) {
  //       // User is signed in.
  //       uid = authenticate.uid;
  //       this.setState({
  //         uid: uid,
  //       });
  //     }
  //   })
  // }

  componentDidMount = () => {
    const db = firebase.firestore();
    var docRef = db.collection("Photos").doc("user" + this.state.uid);
    docRef.get().then((doc) => {
        var arrPhotoLink = doc.data().photoDownloadUrl;
        arrPhotoLink = Object.values(arrPhotoLink);
        //var arrPhotos = [];
        // arrPhotoLink.forEach(element => {
        //   arrPhotos.push(element);
        // var len = arrPhotoLink.length;
        // for (var i = 1; i<= len; i++){
        //   arrPhotoLink.forEach(element => {
        //     element.photoNo  ? arrPhotos.push(element) : false;
        //   })
        // };
        arrPhotoLink.sort(function(a, b){
          return b.photoNo - a.photoNo;
        });
        this.setState({data: arrPhotoLink});
        //console.log(arrPhotos);
    }).catch(e => {
      console.log(e);
    })
  }

  navPhoto = (data, photoId) => {
    this.props.navigation.navigate("SinglePhoto", {data: data, uid: this.state.uid, photoId: photoId});
    //console.log(index);
  }
  

  render() {
    return (
      <ScrollView style={styles.photosContainer}>
        <FlatList
          data={this.state.data}
          numColumns={3}
          renderItem={({item}) => {
            return(
              <TouchableOpacity
                onPress = {() => {
                  this.navPhoto(item, item.photoId);
                }}
                style={styles.outer}
              >
                <Image
                  style={styles.img}
                  source={{uri: item.link}}
                />
            </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => item.link}
        />
      </ScrollView>
    );
  }
}

const width = (Dimensions.get('window').width)/3;

const styles = StyleSheet.create({
  photosContainer: {
    backgroundColor: "#fff",
    flexDirection: 'column',
    margin: 0,
  },
  outer: {
    margin: 1
  },
  img: {
    width: width-1,
    height: width-1,
    borderRadius: 0
  }
});


export default withNavigation(Photos);

