import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text,Image ,TextInput,TouchableOpacity} from 'react-native';
import * as firebase from 'firebase'
import PickIngredient from './PickIngredient'
import Utils from '../Utils/Utils'
import UtilsFirebase from '../Utils/UtilsFirebase'

export default class IngredientList extends React.Component{


    state = {
        ingredientsBase : [],
        ingredientsSearch : [],
        text : '',
        find : true,
        loading : true,
        refreshing : false,
    }


    //Ce qu'il faudrait c'est avoir les 20 premiers ingrédients, et charger les autres quand on scroll
    getAllIngredient = async () =>{
        let countMax = 0;
        let countImage = 0;
        let list = []
        UtilsFirebase.getDatabaseIngredientRef().orderByChild("name").startAt('A').limitToFirst(10).on("child_added", snapshot =>{
            console.log("je commence" + snapshot.val().name)
            countMax++
            UtilsFirebase.GetURLImageFromName(snapshot.val().name).then( url => {
                countImage++
                let item = {
                    name : snapshot.val().name,
                    image : url,
                    unitAverage : snapshot.val().unitAverage,
                    gramAverage : snapshot.val().gramAverage,
                    yearsExpiration : snapshot.val().yearsExpiration,
                    mounthsExpiration : snapshot.val().mounthsExpiration,
                    daysExpiration : snapshot.val().daysExpiration
                }
                list.push(item)
                if(countImage == countMax){
                    this.setState({
                        ingredientsSearch : list,
                        ingredientsBase : list,
                    })
                   
                }
                
            })
            })
    }
        //Avoir la ref database

        //Avoir les ingrédients dans l'ordre, donc qui commencent par A
        //Avoir les 10 premiers ingrédients
        //Avoir les images de ces ingrédients
        //Une fois que tout est fini, push ça dans le state dans ingredientBase
        //Et enfin ingredientSearch = ingredientBase
    
     componentDidMount(){
        this.getAllIngredient()
        setTimeout(()=> {this.setState({
            loading: false,
        }),100})
        this.setState({ refreshing: false })

    }


    AddIngredientToDatabase = () => {
        this.props.navigation.navigate('AddIngredient')
    }

    handleSearchInDataBase = (text) =>{
            //Récuperer la liste ingredientBase
            
            //Regarder si l'ingredient est dans la ingredientBase
            let listIngredient = this.state.ingredientsBase.filter((obj) => {
                if(new String(obj.name).substring(0,new String(text).length) == text){
                    return true
                }
                return false
            })
            if(listIngredient.length<10){
                //Il faut que j'ai un événement quand la recherche est finie
                //Pour pouvoir push le résultat dans ingredientBase
                let countMax=0;
                let countImage=0;
                let list = []
                listIngredient = this.state.ingredientsBase
                UtilsFirebase.getDatabaseIngredientRef().orderByChild("name").startAt(text).endAt(text+'\uf8ff').on("child_added", snapshot =>{
                    console.log("je commence" + snapshot.val().name)
                    countMax++
                    UtilsFirebase.GetURLImageFromName(snapshot.val().name).then( url => {
                        countImage++
                        let item = {
                            name : snapshot.val().name,
                            image : url,
                            unitAverage : snapshot.val().unitAverage,
                            gramAverage : snapshot.val().gramAverage,
                            yearsExpiration : snapshot.val().yearsExpiration,
                            mounthsExpiration : snapshot.val().mounthsExpiration,
                            daysExpiration : snapshot.val().daysExpiration
                        }
                        list.push(item)
                        if(countImage == countMax){
                            this.setState({
                                ingredientsSearch : list
                            }, ()=> console.log(this.state.ingredientsBase))
                           
                        }
                        
                    })
                    })
                if(countMax == 0){
                    this.setState({
                        ingredientsSearch : []
                    })
                }
            }
            //Si non, faire une recherche dans la database

            //Recuperer les snapshots des ingrédients qui commencent par le même nom
            //Recuperer l'image de ces ingrédients
            //push ces ingrédients dans la liste ingredientBase
            //Selectionner ces ingrédients dans la liste ingredientBase
            //Une fois selectionnés, les mettres dans la liste ingredientSearch

    }

    onRefresh() {
        
   }

   ChooseIngredient= (ingredient) =>{
        console.log(ingredient)
        this.props.navigation.navigate('ChooseIngredient',{ingredient})
        console.log("coucou")
   }

    Refresh = () =>{
        this.setState({refreshing : true},
            ()=>{this.setState({refreshing : false})})
    }

    handleSearch = (text) =>{
        text = Utils.JustAlphabetAndSpace(text)
        text = Utils.FirstCaractUpperCase(text)

        this.setState({text}, () => {
            if(new String(text).length != 0){
                this.handleSearchInDataBase(text)
            }else{
                let ingredient = this.state.ingredientsBase
                this.setState({ingredientsSearch : ingredient})
            }
        })
       
    }   

    render()
    {

        const list = () =>{
                return(
                    <View >                      
                        <FlatList 
                        data={this.state.ingredientsSearch.sort(Utils.CompareByName)}
                        renderItem={({ item }) => {
                            return(
                            <View >
                                <TouchableOpacity style = {styles.viewIngredient} onPress = {() => this.ChooseIngredient(item)}>
                                    <Image style = {styles.image} source = {{uri : item.image}}></Image>
                                    <Text style = {styles.textIngredient}>{item.name}</Text>
                                </TouchableOpacity>
                                
                            </View>
                        
                        )

                            
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        />                    
                </View>
                )
                
            }
        const page = () =>{
            if(!this.state.loading){
                return(
                    <View>
                        <TextInput value = {this.state.text} placeholder ="ex: tomate"
                        style = {styles.textInputStyle} onChangeText = {text => this.handleSearch(text)}/>
                        {list()}
                        <View style ={{justifyContent : "center", paddingHorizontal : 40 }}>
                            <Text style = {{fontFamily : "Glegoo_400Regular",alignSelf : "center"}}>Votre ingrédient n'existe pas dans la base de données ?</Text>
                            
                                <TouchableOpacity  style = {{backgroundColor : "green", borderColor : "black", borderRadius : 50, paddingHorizontal : 10}}
                                    onPress = {this.AddIngredientToDatabase}>
                                    <Text style = {{fontFamily : "Glegoo_400Regular",alignSelf : "center", color : "white"}}>Ajoutez un ingrédient</Text>
                                </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                )
            }else{
                return(
                    <View>
                        <Text>C'est pas chargé ! </Text>
                    </View>
                )
            }
            
        }
        return (
            <View>
                 {page()}
            </View>
           
            
            
        );
    }
    
}


const styles = StyleSheet.create({
    image : {
        height : 50,
        width : 50,
        borderRadius : 70,
        marginLeft : 10,
        marginVertical : 5,
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
        fontSize : 15,
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
        justifyContent : "space-around",
    }
})
