
import React from 'react';
import firebaseConfig from './config'
import * as firebase from 'firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddIngredient from './component/AddIngredient'
import { useFonts, Glegoo_400Regular } from '@expo-google-fonts/glegoo';
import AppLoading from 'expo-app-loading'
import IngredientList from './component/IngredientList'
import PickIngredient from './component/PickIngredient'
import Fridge from './component/Fridge'
import ChooseIngredient from './component/ChooseIngredient'
import DatePicker from './component/DatePicker'

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}




const Stack = createStackNavigator()


export default function App() {
  let [fontsLoaded] = useFonts({
    Glegoo_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }


  return (
    
     <NavigationContainer>
        <Stack.Navigator initialRouteName="Fridge">
          <Stack.Screen name="AddIngredient" component= {AddIngredient} options={{ title: 'Ajouter un ingredient' }}/>
          <Stack.Screen name="IngredientList" component= {IngredientList} options={{ title: 'Mon Frigo' }}/>
          <Stack.Screen name="PickIngredient" component= {PickIngredient} options={{ title: 'Choisir cet ingrédient' }}/>
          <Stack.Screen name="Fridge" component= {Fridge} options={{ title: 'Mon Frigo' }}/>
          <Stack.Screen name="ChooseIngredient" component= {ChooseIngredient} options={{ title: 'Ajouter' }}/>
          <Stack.Screen name="DatePicker" component= {DatePicker} options={{ title: 'Ajouter' }}/>
       </Stack.Navigator>
      </NavigationContainer>
  );
}

  
  
  

  /*openImagePickerAsync = async () => {
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
  }*/
  

  /*componentDidMount()
  {
    
    firebase.database().ref('ingredients').on('value', snapshot => {
      this.setState({
        ingredients : snapshot.val(),
        loading: false
      })
    })*/
    /*firebase.storage().ref('Images/fillPot.jpg').getDownloadURL().then((url) =>
    {
      this.setState({
        urlImage: url
      })
    });*/
   
  //}  


  /*uploadImage = async (urinimageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("Images/" + imageName);
    return ref.put(blob);
  }*/
  
  /*render()
  {
    /*const ingredients = this.state.ingredients.map((ingredient) => {
      return (<Text>{ingredient.name}</Text>)
    })*/
    
  
    // //return (
    //   <NavigationContainer>
    //     <Stack.Navigator>
    //       <Stack.Screen name="Ajouter un ingrédient" component= {AddIngredient}/>
    //     </Stack.Navigator>
    //   </NavigationContainer>
     
//     )
//   }
// }

// export default App;


