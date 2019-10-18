import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Footer, FooterTab, Button, Container, Tab, Tabs, TabHeading, Fab} from 'native-base';
import * as ImagePicker from "expo-image-picker";
import Photos from '../components/Photos';
import Posts from '../components/Posts';
import Blogs from '../components/Blogs';


export default class CollectionScreen extends React.Component {

	static navigationOptions = {
		title: "Collection",
		header: null
	}

	constructor(props) {
    super(props)
    this.state = {
			active: false,
			photoUrl: "",
			uid: this.props.navigation.getParam('uid', ''),
    };
	}
	
	pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if(!result.cancelled){
			this.setState({photoUrl: result.uri});
			this.props.navigation.navigate('AddPhoto', {photoUrl: this.state.photoUrl, uid: this.state.uid});
    }
  };

	render() {
		return (
			
			<Container>
				<View style={styles.container}>
					<Tabs tabBarUnderlineStyle={{borderBottomWidth:4, borderColor: "#f62459"}}>
						<Tab 
							heading={ 
								<TabHeading style={{backgroundColor:"#fff"}}>
									<MaterialCommunityIcons name="image-filter" size={22} color="#000" />
										<Text style={styles.tabText}> Photos</Text>
								</TabHeading>
							}
						>
							<Photos 
								uid={this.state.uid}
							/>
						</Tab>
						<Tab 
							heading={ 
								<TabHeading style={{backgroundColor:"#fff"}}>
									<MaterialCommunityIcons name="newspaper" size={22} color="#000" />
										<Text style={styles.tabText}> Posts</Text>
								</TabHeading>
							}
						>
						<Posts />
						</Tab>
						<Tab 
							heading={ 
								<TabHeading style={{backgroundColor:"#fff"}}>
									<MaterialCommunityIcons name="file-document-box-multiple-outline" size={22} color="#000" />
										<Text style={styles.tabText}> Blogs</Text>
								</TabHeading>
							}
						>
						<Blogs />
						</Tab>
					</Tabs>
					<Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#f62459' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <MaterialCommunityIcons name="plus-circle" size={22} color="#f62459"/>
            <Button style={{ backgroundColor: '#fff' }} onPress={() => {this.pickImage()}}>
							<MaterialCommunityIcons name="image-filter" size={22} color="#f62459" />
            </Button>
            <Button style={{ backgroundColor: '#fff' }}>
							<MaterialCommunityIcons name="newspaper" size={22} color="#f62459" />
            </Button>
            <Button style={{ backgroundColor: '#fff' }}>
              <MaterialCommunityIcons name="file-document-box-multiple-outline" size={22} color="#f62459" />
            </Button>
          </Fab>
				</View>
        
				<Footer
					style={{
						height: 50,
						shadowColor: "#f2f1ef",
						shadowOffset: {
							width: 0,
							height: 10,
						},
						elevation: 5
					}}
				>
					<FooterTab style={{backgroundColor:"#fff"}}>
						<Button
							onPress={() => {this.props.navigation.goBack()}}
						>
							<Feather name="home" size={22} color="#000" />
						</Button>
						<Button>
							<Feather name="users" size={22} color="#000" />
						</Button>
						<Button>
							<Feather name="grid" size={22} color="#f62459" />
						</Button>
						<Button>
							<MaterialCommunityIcons name="message-text-outline" size={22} color="#000" />
						</Button>
						<Button>
							<Feather name="user" size={22} color="#000" />
						</Button>
					</FooterTab>
				</Footer>
			</Container>

		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 25,
	},
	tabText: {
		fontSize: 14,
		fontWeight: "bold",
	}
});