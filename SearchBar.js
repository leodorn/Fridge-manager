import React from 'react'
import {View,Text,TextInput,StyleSheet} from 'react-native'
import * as firebase from 'firebase'
import firebaseConfig from './config'

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}


export default class SearchBar extends React.Component{


    state = {
        value : undefined,
        defaultValue : "Ingrédient à ajouter...",
    }

    handleChangeText = (text) =>{
        this.setState({
            value : text,
        })
        console.log("coucou")
        var ref = firebase.database().ref("ingredients");
        ref.orderByChild("name").startAt('c').endAt('c').on("child_added", function(snapshot) {
        console.log(snapshot.key);
        console.log(snapshot.val().name)
        });

    }

    handleEndEditing = () =>{
        console.log("Ingrédient trouvé ")
    }

    render()
    {
        const barSearch =  <TextInput style = {styles.textInput}
        onChangeText={text => this.handleChangeText(text)}
        value = { this.state.value}
        clearTextOnFocus
        blurOnSubmit
        textAlign = "center"
        autoCorrect = {false}
        placeholder = "Ingrédient à ajouter..."
        />

        return(
            
            <View>
                {barSearch}
               
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    textInput : {
        height : 40,
        borderColor : 'gray',
        borderWidth : 1,
        color : 'black',
        padding: 10,
    },
});