import React from 'react'
import {View,Text,TextInput,StyleSheet,Image} from 'react-native'
import * as firebase from 'firebase'
import firebaseConfig from '../config'

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
        proposition : [],
        ingredients : []
    }

    handleChangeText = (text) =>{
        this.setState({
            value : text,
        })
        var ref = firebase.database().ref("ingredients");
        ref.orderByChild("name").startAt('c').endAt('c').on("child_added", function(snapshot) {
        console.log(snapshot.key);
        console.log(snapshot.val().name)
        this.setState({
            ingredients : snapshot.val().name         
        })
        });


    }
    componentDidMount()
    {
        var ref = firebase.database().ref("ingredients");
        
        ref.orderByChild("name").on("child_added", snapshot => {
            
                         
            var name = snapshot.val().name;
            var path = "ingredients/"+name+"/"+name+"Logo.jpg";
            console.log(path)
            var logo = firebase.storage().ref().child(path).getDownloadURL().then((url) =>
            {
                var ingredients = [...this.state.ingredients];
                var ingredient = {name : name, logo : url };
                ingredients.push(ingredient);
                this.setState({
                ingredients : ingredients,
                loading: false
            });
            
        })
        
        })
   
  }  



    render()
    {
        const ingredients = this.state.ingredients.map(ingredient =>{
            return(
                <View style = {styles.ingredientViewStyle}>
                   <Image style = {styles.ingredientImageStyle} source = {{uri : ingredient.logo} }></Image>
                   <Text style = {styles.ingredientTextStyle}>{ingredient.name}</Text> 
                   
                </View>
            )
        })

        const proposition = this.state.proposition.map((proposition) =>{
            return (<Text>{proposition}</Text>)
        })
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
            
            <View style = {styles.borderStyle}>
                {barSearch}
                {ingredients}
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
        paddingLeft : 25,
        marginHorizontal : 20,
        marginVertical : 10,
        borderRadius : 25,

    },
    ingredientViewStyle : {
       flexDirection : 'row',
       padding : 16,
       alignItems : 'center',
       borderBottomColor : 'gray',
       borderBottomWidth : 3
    },
    ingredientImageStyle : {
        height : 50,
        width : 50,
        borderRadius : 60,
    },
    ingredientTextStyle : {
        marginLeft : 40,
        fontWeight: 'bold'
    }
});