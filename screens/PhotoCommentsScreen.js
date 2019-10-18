import React, { Component } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableOpacity} from 'react-native';
import { Container, Content, Icon, Item, Input, Footer, List, ListItem, Left, Body, Right, Thumbnail, Text, Button } from 'native-base';
import { Header } from "react-navigation";

export default class PhotoCommentsScreen extends Component {
    static navigationOptions = {
        title: "Comments"
    }

    constructor(props){
        super(props);
        this.state = {
            uid: this.props.navigation.getParam('uid', ''),
            photoId: this.props.navigation.getParam('photoId', ''),
            profilePic: null
        }
    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.Comments} behavior="padding" enabled keyboardVerticalOffset={Header.HEIGHT + 20}>
            <Container>
                <ScrollView
                    style={styles.viewComments}
                    onPress={
                        Keyboard.dismiss()
                    }
                >
                    <Content>
                        <List>
                            <ListItem avatar style={{left: 0, marginLeft: 0}}>
                            <Left style={styles.left}>
                                <Thumbnail 
                                    small
                                    source={
                                        this.state.profilePic == null ? require("../assets/default-profile.png") : {uri: this.state.profilePic}
                                    }
                                />
                            </Left>
                            <Body>                                
                                <TouchableOpacity
                                    onPress={() => {}}
                                >
                                    <Text style={styles.name}>Bibek Kakati</Text>
                                </TouchableOpacity>
                                <Text style={{fontSize: 14}}>Doing what you like will always keep you happy, List Avatars are medium to showcase an image with your list item whose dimension lays between icon and thumbnail. To create a avatar list,</Text>
                            </Body>                            
                            </ListItem>                            
                        </List>
                    </Content>
                </ScrollView>
                <Footer
                    style={{
                        height: 50,
                        shadowColor: "#f2f1ef",
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        elevation: 5,
                        backgroundColor: "#fff"
                    }}
                >                    
                    <Content>
                        <Item>
                            <Input placeholder='Write your comment...' style={{paddingLeft: 15}}/>
                            <Icon active name='paper-plane' 
                                onPress={() => {}}
                                style={{paddingRight: 15}}/>
                        </Item>
                    </Content>                    
                </Footer>
            </Container>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    Comments: {
        flex: 1,
        backgroundColor: "#fff",
    },
    viewComments: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
    },
    name: {
        fontWeight: "500",
        color: "#2C3335",
        fontSize: 14,
        padding: 0,
        margin: 0,
        left: 0,
        paddingBottom: 2
    },
    left: {
        left: 0,
        flexDirection: "row",
        padding: 0,
        margin: 0,
    },
});