import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {  Text, View,Image,Button, Alert } from 'react-native';
import firebaseConfig from './config'
import styles from './styles'
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import SelectImage from './SelectImage';
import Ingredient from './Ingredient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FridgePage from './FridgePage';

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}


const Stack = createStackNavigator();


class App extends React.Component
{

  state = {
    ingredients : [],
    urlImage : null,
    textChanging : 'Bonjour à tous ! ',
    imagePick : '',
    selectedImage :  ''
  }


  
  

  openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    permissionResult.granted = true
    if (permissionResult.granted === false) {
      console.log("coucou")
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    this.setState({
      selectedImage : pickerResult.uri
    })
    return;
  }
  

  componentDidMount()
  {
    firebase.database().ref('ingredients').on('value', snapshot => {
      this.setState({
      ingredients : snapshot.val(),
      loading: false
      })
    })
    /*firebase.storage().ref('Images/fillPot.jpg').getDownloadURL().then((url) =>
    {
      this.setState({
        urlImage: url
      })
    });*/
   
  }  


  /*uploadImage = async (urinimageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("Images/" + imageName);
    return ref.put(blob);
  }*/

  render()
  {
    const ingredients = this.state.ingredients.map((ingredient) => {
      return (<Text>{ingredient.name}</Text>)
    })
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Mon Frigo" component= {FridgePage}/>
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  }
}

export default App;


