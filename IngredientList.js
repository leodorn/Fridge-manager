import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text,Image ,TextInput,TouchableOpacity} from 'react-native';
import * as firebase from 'firebase'
import PickIngredient from './PickIngredient'



export default class IngredientList extends React.Component{
    state = {
        ingredientsBase : [],
        ingredients : [],
        text : undefined,
        find : true,
    }
    
     componentDidMount(){
        const ingredientsBase = []
        let ref = firebase.database().ref("ingredients")
        ref.orderByChild("name").startAt("A").on("child_added", snapshot => {
            let name = snapshot.val().name;
            let unitAverage = snapshot.val().unitAverage;
            let gramAverage = snapshot.val().gramAverage;
            console.log("Début : "+ name)
            let path = "ingredients/"+name+"/"+name+"Logo.jpg";
            const ingredientTemp = {name : name, unitAverage : unitAverage, gramAverage : gramAverage}
            const ingredientsTemp = []
            ingredientsTemp.push(ingredientTemp)
            this.setState({
                ingredientsBase: ingredientsTemp
            })
             firebase.storage().ref().child(path).getDownloadURL().then(url => {
                const ingredient = {name : name, image : url, unitAverage : unitAverage, gramAverage : gramAverage}
                ingredientsBase.push(ingredient);
               
                this.setState({
                    ingredientsBase : ingredientsBase
                })
            }).catch(error => {
                console.log(error)
              })        
        })
    }







    handleSearchInDataBase = (text) =>{
            console.log("je lance ma recherche")
            let ref = firebase.database().ref("ingredients")
            const ingredients = []
            this.setState({
                ingredients : ingredients
            })
            ref.orderByChild("name").startAt(text).endAt(text+"\uf8ff").on("child_added", snapshot => {
                let name = snapshot.val().name;
                let unitAverage = snapshot.val().unitAverage;            
                let gramAverage = snapshot.val().gramAverage;
                let path = "ingredients/"+name+"/"+name+"Logo.jpg";
                const ingredientTemp = {name : name, unitAverage : unitAverage, gramAverage : gramAverage}
                const ingredientsTemp = []
                ingredientsTemp.push(ingredientTemp)
                this.setState({
                    ingredients: ingredientsTemp
                })
                firebase.storage().ref().child(path).getDownloadURL().then(url => {
                    const ingredient = {name : name, image : url, unitAverage : unitAverage, gramAverage : gramAverage}              
                    ingredients.push(ingredient);
                    console.log("taille " + ingredients.length)
                    this.setState({
                        ingredients : ingredients
                    })
                    console.log(this.state.ingredients.length)
                }).catch(error => {
                    console.log(error)
                  })         
            })
            console.log("taille à la fin " + ingredients.length)                   
    }


    handleSearch = (text) =>{
        console.log(this.state.find)
        text = (''+text).toLowerCase().replace(/[^a-zA-Z]/g, "")
        text = (''+text).charAt(0).toUpperCase()+(''+text).substring(1)
        this.setState({
            text : text
        })
        if((''+text).length == 0)
        {
            console.log("mince");
        }
        else
        {
           this.handleSearchInDataBase(text)
        }
       
    }



    handleIngredient = (ingredient) =>{
            this.props.navigation.navigate(
              'PickIngredient',
              { ingredient },
            );
    }

    render()
    {
        const list = () =>{
           
            if(((''+ this.state.text).length == 0) || this.state.text == undefined )
            {
                return(
                    <SafeAreaView>
                        
                        <FlatList
                        data={this.state.ingredientsBase}
                        renderItem={({ item }) => (
                            <View style = {styles.viewIngredient}>
                                <Image style = {styles.image} source = {{uri : item.image}}></Image>
                                <Text style = {styles.textIngredient}>{item.name}</Text>
                                <PickIngredient ingredient = {item}/>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        />
                </SafeAreaView>
                )
                
            }
            else
            {
                return(
                    <SafeAreaView>
                        
                        <FlatList
                        data={this.state.ingredients}
                        renderItem={({ item }) => (
                                <View style = {styles.viewIngredient}>
                                    <Image style = {styles.image} source = {{uri : item.image}}></Image>
                                    <Text style = {styles.textIngredient}>{item.name}</Text>
                                <PickIngredient ingredient = {item}/>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        />
                    </SafeAreaView>
                )
            }
            
        }
        return (
            <View>
                <TextInput value = {this.state.text} placeholder ="ex: tomate"
                style = {styles.textInputStyle} onChangeText = {text => this.handleSearch(text)}/>
                {list()}
            </View>
            
            
        );
    }
    
}


const styles = StyleSheet.create({
    image : {
        height : 100,
        width : 100,
        borderRadius : 70,
        marginLeft : 10,
    },
    textInputStyle : {
        height : 40,
        borderColor : 'gray',
        borderWidth : 1,
        color : 'black',
        paddingLeft : 25,
        marginHorizontal : 10,
        marginVertical : 10,
        borderRadius : 25,
        fontFamily: "Glegoo_400Regular"
    },
    textIngredient : {
        marginLeft : 70,
        fontSize : 20,
        fontFamily : "Glegoo_400Regular",
        alignSelf : "center"
    },
    viewIngredient :{
        flexDirection : 'row',
        marginVertical : 10,
        borderTopWidth : 1,
        borderBottomWidth : 1,
        borderTopColor : "gray",
        borderBottomColor : "gray",
        paddingVertical: 5,
        alignItems : "center",
        justifyContent : "space-between",
        

    }
})
