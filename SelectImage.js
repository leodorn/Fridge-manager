import React from 'react';
import { Image, StyleSheet, Text, View , Button, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase'
import firebaseConfig from './config'
import { Constants, DocumentPicker } from 'expo';

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}

export default function SelectImage()
{
    const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    permissionResult.granted = true;
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
    uploadImage(pickerResult.uri, "test-image");
  };

  let uploadImage = async (uri, imageName) => {
      console.log("hello")
      console.log(uri)
      console.log(imageName)
    const response = await fetch(uri)
    const blob = await response.blob();
    console.log(blob.size);
    console.log(blob.type)
    var ref = firebase.storage().ref().child("Images/" + imageName);
    ref.put(blob).then( console.log('sucess') )
    .catch( (error) => console.log(error.messaeg) )
    return console.log("c'est fini ! ");
  }

  if (selectedImage !== null) {
    return (
        <View>
            <View style={styles.container}>
            <Button title = "pick a photo " onPress = {openImagePickerAsync}/>
        </View>  
        <View style={styles.container}>
            <Text>Tête de con</Text>
            <Image
            source={{ uri: selectedImage.localUri }}
            style={styles.thumbnail}
            />
         </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Button title = "pick a photo " onPress = {openImagePickerAsync}/>
    </View>
  );
}
const styles = StyleSheet.create({
    /* Other styles hidden to keep the example brief... */
    thumbnail: {
      width: 300,
      height: 300,
      resizeMode: "contain"
    },
  });
