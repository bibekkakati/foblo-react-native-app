import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as firebase from "firebase";
import HomeScreen from "./screens/HomeScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import LoadingScreen from "./screens/LoadingScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import NotificationScreen from "./screens/NotificationScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import AboutUserProfileScreen from "./screens/AboutUserProfileScreen";
import LikesScreen from "./screens/LikesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import BlogFeedScreen from "./screens/BlogFeedScreen";
import ArticleScreen from "./screens/ArticleScreen";
import SinglePhotoScreen from "./screens/SinglePhotoScreen";
import OwnProfileScreen from "./screens/OwnProfileScreen";
import OwnAboutScreen from "./screens/OwnAboutScreen";
import CollectionScreen from "./screens/CollectionScreen";
import AddPhotoScreen from "./screens/AddPhotoScreen";
import PhotoCommentsScreen from "./screens/PhotoCommentsScreen";

//CONFIGURE WITH YOUR OWN FIREBASE ACCOUNT

var config = {
  apiKey: "***",
  authDomain: "***",
  databaseURL: "***",
  projectId: "***",
  storageBucket: "***",
  messagingSenderId: "***"
};
firebase.initializeApp(config);

const MainNavigator = createStackNavigator(
  {
    Loading: { screen: LoadingScreen },
    SignIn: { screen: SigninScreen },
    SignUp: { screen: SignupScreen },
    Home: { screen: HomeScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    EditProfile: { screen: EditProfileScreen },
    Notification: { screen: NotificationScreen },
    UserProfile: { screen: UserProfileScreen },
    AboutUserProfile: { screen: AboutUserProfileScreen },
    LikesScreen: { screen: LikesScreen },
    SettingsScreen: { screen: SettingsScreen },
    BlogFeed: { screen: BlogFeedScreen },
    Article: { screen: ArticleScreen },
    SinglePhoto: { screen: SinglePhotoScreen },
    OwnProfile: { screen: OwnProfileScreen },
    OwnAbout: { screen: OwnAboutScreen },
    Collection: { screen: CollectionScreen },
    AddPhoto: { screen: AddPhotoScreen },
    PhotoComments: { screen: PhotoCommentsScreen }
  },
  {
    //launcher screen
    initialRouteName: "Loading"
  }
);

//create app container
const App = createAppContainer(MainNavigator);
export default App;
