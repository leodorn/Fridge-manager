import React from 'react'
import {View,TextInput,StyleSheet,Image,Button,TouchableOpacity,Text,Alert} from 'react-native'
import * as firebase from 'firebase'
import firebaseConfig from './config'
import * as ImagePicker from 'expo-image-picker';
import { createNavigatorFactory } from '@react-navigation/native';
import RadioButton from './RadioButton'
import { Dimensions } from 'react-native';
if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}

export default class AddIngredient extends React.Component{


    state = {
        image : require('./uploadyourimage.png'),
        textInInput : undefined,
        canSubmit : false,
        count : 0,
        exist : false,
        haveChooseImage : false,
        lenghtTextValid : false,
        years : undefined,
        mounths : undefined,
        days : undefined,
        unit : true,
        valueUnit : undefined,
        valueGramme : undefined,
    }

    getIngredient = (textInInput) => {
        let count = 0;
        let ref = firebase.database().ref("ingredients")
         ref.orderByChild("name").equalTo(textInInput).on("child_added", snapshot => {
            count++         
        })
        console.log(count)
        return count
    }


    handleOnChangeYears = (years) => { 
        years =  (''+years).toLowerCase().replace(/[^0-9]+/g, "" )
        if(parseInt(years)>0){
            years = parseInt(years)
            
        }
        this.setState({
            years : years,
        })

    }

    handleOnChangeMounths = (mounths) => { 
        mounths =  (''+mounths).toLowerCase().replace(/[^0-9]+/g, "" )
        if(parseInt(mounths)>0){
            mounths = parseInt(mounths)
            
        }
        this.setState({
            mounths : mounths,
        })
        

        

    }


    handleOnChangeDays = (days) => { 
        days =  (''+days).toLowerCase().replace(/[^0-9]+/g, "" )
        if(parseInt(days)>0){
            days = parseInt(days)
            
        }
        this.setState({
            days : days,
        })
    }

    handleChangeUnit = (unit) =>{
        unit = (''+unit).toLowerCase().replace(/[^0-9]+/g, "" )
        this.setState({
            valueUnit: unit
        })
    }

    handleChangeGramme = (gramme) =>{
        gramme = (''+gramme).toLowerCase().replace(/[^0-9]+/g, "" )
        console.log("gramme1 " + gramme)
        this.setState({
            valueGramme: gramme
        })
        console.log("gramme2 " + this.state.valueGramme)
    }

    

    handleOnChangeIngredientName = async (textInInput) =>{
        textInInput =  (''+textInInput).toLowerCase().replace(/[^a-zA-Z ]+/g, "" )
        textInInput = (''+textInInput).charAt(0).toUpperCase()+(''+textInInput).substring(1)
        this.setState({
            textInInput : textInInput,
        })
        if((''+textInInput).length >=2)
        {
            this.setState({
                lenghtTextValid : true,
            })
            if(await this.getIngredient(textInInput) > 0)
            {
                this.setState({
                    exist : true,
                })
            }
            else
            {
                this.setState({
                    exist : false,
                })
            }
        }
        else
        {
            this.setState({
                lenghtTextValid : false,
            })
        }
       
        
     

    }

    CheckIfDateIsUndefined = (number) =>{
        if(number === undefined)
        {
            return 0
        }
        else
        {
            return number;
        }
    }

    handleSubmit = async () =>{
        if(this.getIngredient(this.state.textInInput) >0)
        {
            return;
        }
        const years = this.CheckIfDateIsUndefined(this.state.years);
        const mounths =  this.CheckIfDateIsUndefined(this.state.mounths);
        const days =  this.CheckIfDateIsUndefined(this.state.days);
        let valueUnit = this.state.valueUnit;
        let valueGram = this.state.valueGramme;
        console.log("valueGram " + this.state.valueGramme)
        if(this.state.valueUnit == undefined){
            valueUnit = 0;
        }
        if(this.state.valueGramme == undefined){
            valueGram = 0;
        }       
            
            await firebase.database().ref("ingredients").push().set({
            name : this.state.textInInput,
            yearsExpiration : years,
            mounthsExpiration : mounths,
            daysExpiration : days,
            unitAverage : valueUnit,
            gramAverage : valueGram,
        })
        const response = await fetch(this.state.image)
        const blob = await response.blob();
        console.log(blob.type)
        console.log(blob.size)
        let refStorage =  firebase.storage().ref();
        let path = "ingredients/"+this.state.textInInput+"/"+this.state.textInInput+"Logo.jpg";
        await refStorage.child(path).put(blob).then( console.log('sucess') )
        .catch( (error) => console.log(error.messaeg) )
        this.setState({
            image : require('./uploadyourimage.png'),
            textInInput : '',
            canSubmit : false,
            count : 0,
            exist : false,
            haveChooseImage : false,
            lenghtTextValid : false,
            years : '',
            mounths : '',
            days : '',
            unit : true,
            valueUnit : '',
            valueGramme : '',
        })
        return console.log("c'est fini ! ");
        

    }

    handleChooseImage = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        permissionResult.granted = true;
        if (permissionResult.granted === false) {
            console.log("pas autorisé")
        return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            console.log("est revenu")
        return;
        }
        this.setState({
        image : pickerResult.uri,
        haveChooseImage : true,
        })
        console.log("c'est bon")
        return;
    }

    handleNotSubmit = () =>{
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
        )
    }


    checkRadioButtonUnit = () => {
        this.setState({
            unit : true,
        })
    }

    checkRadioButtonGramme = () => {
        this.setState({
            unit : false,
        })
    }



    render()
    {

        const radioBoxZone = () =>{
            if(this.state.unit){
                return(
                    <View style = {{marginVertical : 10}}>
                        <View style = {{flexDirection: 'row'}} >
                            <Text style = {{marginHorizontal: 20, fontFamily: "Glegoo_400Regular", fontSize : 15,}}>En Unités</Text>
                            <Text style = {{ fontFamily: "Glegoo_400Regular", fontSize : 15,}}>En grammes</Text>
                        </View>
                        <View style = {{flexDirection : 'row', justifyContent : "space-around"}}>
                            <RadioButton  onClick={this.checkRadioButtonUnit} statusOfChecked = {true}/>
                            <RadioButton  onClick={this.checkRadioButtonGramme} statusOfChecked = {false}/>
                        </View>
                        <Text style = {styles.textStyle}>Unités en moyenne</Text>
                        <TextInput placeholder = "ex : 6u" style = {styles.textInputStyle}
                        value = {this.state.valueUnit} onChangeText = {text => this.handleChangeUnit(text)} textAlign='center'/>
                    </View>
                    
                )
                
            }else{
                return(
                    <View style = {{marginVertical : 10}}>
                        <View style = {{flexDirection: 'row'}} >
                            <Text style = {{marginHorizontal: 20, fontFamily: "Glegoo_400Regular", fontSize : 15,}}>En Unités</Text>
                            <Text style = {{ fontFamily: "Glegoo_400Regular", fontSize : 15,}}>En grammes</Text>
                        </View>
                        <View style = {{flexDirection : 'row', justifyContent : "space-around"}}>
                            <RadioButton  onClick={this.checkRadioButtonUnit} statusOfChecked = {false}/>
                            <RadioButton  onClick={this.checkRadioButtonGramme} statusOfChecked = {true}/>
                        </View>
                        <Text style = {styles.textStyle}>Grammes en moyenne</Text>
                        <TextInput placeholder = "ex : 50g" style = {styles.textInputStyle}
                        value = {this.state.valueGramme} onChangeText = {text => this.handleChangeGramme(text)} textAlign={"center"}/>
                    </View>
                )
                
            }
        }

        const imageZone = () =>{
            if(this.state.haveChooseImage){
                return(
                    <Image style = {styles.imageStyle} source = {{uri : this.state.image}} />
                )
               
            }
            else{
                return (
                    <View>
                        <Image style = {styles.imageStyle} source = {this.state.image} />
                        <Text style = { styles.textFalse}>Veuillez choisir une image</Text>
                    </View>

                    
                )
                
            }
        }

        const dateExpirationZone = () => {
            return(
                <View> 
                    <Text style = {styles.textStyle}>Date d'expiration en moyenne</Text>  
                    <View style = {{flexDirection : 'row'}} >
                        <TextInput style = {styles.textInputStyle} onChangeText = {text => this.handleOnChangeYears(text)}
                        placeholder = "Années" value = {this.state.years} textAlign={"center"}/>
                        <TextInput style = {styles.textInputStyle} onChangeText = {text => this.handleOnChangeMounths(text)}
                         placeholder = "Mois" value = {this.state.mounths} textAlign={"center"}/>
                        <TextInput style = {styles.textInputStyle} onChangeText = {text => this.handleOnChangeDays(text)}
                         placeholder = "Jours" value = {this.state.days} textAlign={"center"}/>
                    </View>
                </View>
            )
        }
        const nameIngredientZone = () =>
        {
            if(this.state.lenghtTextValid)
            {
                if(!this.state.exist)
                {
                return(
                    <View>
                        <Text style = {styles.textStyle}>Nom de l'ingrédient</Text>
                        <TextInput 
                        style = {styles.textInputStyle}
                        onChangeText = {text => this.handleOnChangeIngredientName(text)}
                        value = {this.state.textInInput}
                        placeholder = "ex: Tomate"
                        />
                        <Text style = {styles.textTrue}>Nom : OK</Text>
                        
                    </View>         
                  )
                }
                else
                {
                    return(
                        <View>
                        <Text style = {styles.textStyle}>Nom de l'ingrédient</Text>
                        <TextInput 
                        style = {styles.textInputStyle}
                        onChangeText = {text => this.handleOnChangeIngredientName(text)}
                        value = {this.state.textInInput}
                        placeholder = "ex: Tomate"
                        />
                        <Text style = {styles.textFalse}>Cet ingrédient existe déjà !  </Text>
                        
                    </View>   
                    )   
                    
                }
            }
            else{
                return(
                    <View>
                    <Text style = {styles.textStyle}>Nom de l'ingrédient</Text>
                    <TextInput 
                    style = {styles.textInputStyle}
                    onChangeText = {text => this.handleOnChangeIngredientName(text)}
                    value = {this.state.textInInput}
                    placeholder = "ex: Tomate"
                    />                   
                </View>     
                )
            }
            
   
        }

        const buttonZone = () =>{
            if(this.state.exist || !this.state.haveChooseImage || !this.state.lenghtTextValid || 
                ((this.state.valueGramme == undefined ||this.state.valueGramme == "") && (this.state.valueUnit== undefined ||this.state.valueUnit == "")))
            {
                return(
                    <View>
                        <TouchableOpacity style = {styles.touchableButtonFalseStyle}>
                        <Text style = {styles.textButtonStyle} >Impossible </Text>
                        </TouchableOpacity>
                    </View>
                    
                )
                
            }
            else if(!this.state.exist && this.state.haveChooseImage && this.state.lenghtTextValid )
            {
                return(
                    <View>
                    <TouchableOpacity style = {styles.touchableButtonTrueStyle} onPress = {this.handleSubmit}>
                        <Text style = {styles.textButtonStyle}>Enregistrer l'ingrédient </Text>
                    </TouchableOpacity>
                    </View>
                )       
            }
        }

        return(
            <View>
                <View style = {styles.viewStyle}>
                    <TouchableOpacity  onPress = {this.handleChooseImage}>
                        {imageZone()}
                    </TouchableOpacity>
                
                    {nameIngredientZone()}
                    {dateExpirationZone()}
                    {radioBoxZone()} 
                    {buttonZone()}
                
                </View>
                       
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    imageStyle :{
        height : 200,
        width : 200,
        borderRadius : 80,
        marginTop : 10,       
    },
    viewStyle : {
        alignItems: 'center'
    },
    buttonSubmitStyle : {
        fontFamily: "Glegoo_400Regular",
        marginVertical : 50,

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
        fontFamily: "Glegoo_400Regular",
    },
    textStyle : {
        marginTop : 20,
        fontSize : 15,
        alignSelf : "center",
        fontFamily: "Glegoo_400Regular"
        
    },
    textTrue : {
        marginVertical : 5,
        fontSize : 15,
        alignSelf : "center",
        fontFamily: "Glegoo_400Regular",
        color : "green",
    },
    textFalse : {
        marginVertical : 5,
        fontSize : 15,
        color : "red",
        alignSelf : "center",
        fontFamily: "Glegoo_400Regular"
    },
    touchableButtonTrueStyle : {
        backgroundColor: "green",
    },
    touchableButtonFalseStyle : {
        backgroundColor: "red",
        borderRadius : 20,
        marginTop : 10,
    },
    textButtonStyle : {
        fontFamily : "Glegoo_400Regular",
        marginHorizontal: 10,
        marginVertical : 5,
        color : "white"
    },



})

//style = {...styles.panel.button,...styles.panel.backButton} pour avoir plusieurs styles
