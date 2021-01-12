import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text,Image} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import UtilsAsyncStorage from '../Utils/UtilsAsyncStorage';



export default class PickIngredient extends React.Component{


    state = {
        image : this.props.ingredient.image,
        name : this.props.ingredient.name,
        unitNumber : this.props.ingredient.unitAverage,
        gramNumber : this.props.ingredient.gramAverage,
        timer : undefined,
        unit : true,
        ingredientsStock : []
    }


    componentDidMount(){
        
        if(this.props.ingredient.unitAverage != 0){
            this.setState({unit : true},() => {
            
            })
        }else if(this.props.ingredient.gramAverage != 0){
            this.setState({unit : false},() => {
            })
        }
        
    }

    handleAddUnit = () =>{
        if(this.state.unit){
            if(this.state.unitNumber<999){           
                let unitNumber = parseInt(this.state.unitNumber) +1
                this.setState({unitNumber})
            }
        }else{
            if(this.state.gramNumber<100000)
            {
                let gramNumber = parseInt(this.state.gramNumber) +1
                    this.setState({gramNumber })
            }
        }
        
   
    }

    handleRemoveUnit = () =>{
        if(this.state.unit){
            if(this.state.unitNumber>0){
                let unitNumber = parseInt(this.state.unitNumber) -1
                    this.setState({ unitNumber })
            }
        }else{
            if(this.state.gramNumber>0){
                let gramNumber = parseInt(this.state.gramNumber) -1
                this.setState({gramNumber})
            }
        }
        
        
    }

    handleTimerRemove = (launch) =>{
        let time 
        if(this.state.unit){
            time = 150;
        }else{
            time = 10;
        }
        if(launch){
            this.handleRemoveUnit();
            this.state.intervale = setInterval(() => { 
                this.handleRemoveUnit();
            }, time ); 
        }
        else{
            clearInterval(this.state.intervale)
        }
        
    }

    handleTimerAdd= (launch) =>{
        let time
        if(this.state.unit){
            time = 150;
        }else{
            time = 10;
        }
        if(launch){
            this.handleAddUnit();
            this.state.intervale = setInterval(() => { 
                this.handleAddUnit();
            }, time ); 
        }else{
            clearInterval(this.state.intervale)      
        }
        
    }


    add = async () =>{
        //Récuperer liste déjà présente.
        let ingredientsStock = []        
        let json =  UtilsAsyncStorage.getJsonObject("fridge");
        this.setState({ingredientsStock : json})
        let unitNumber = parseInt(this.state.unitNumber)
        let gramNumber = parseInt(this.state.gramNumber)
        ingredientsStock = this.state.ingredientsStock
        let ingredientToAdd = {
            name : this.props.ingredient.name,
            image : this.props.ingredient.image,
            unitNumber : unitNumber,
            gramNumber : gramNumber
        };
        if(this.state.ingredientsStock != null && this.state.ingredientsStock != undefined){
            let result = this.state.ingredientsStock.find(element => element.name == ingredientToAdd.name)
            if(result != undefined){
                if(result.unitNumber != 0){
                    ingredientToAdd.unitNumber = ingredientToAdd.unitNumber + result.unitNumber
                }else{
                    ingredientToAdd.gramNumber = ingredientToAdd.gramNumber + result.gramNumber
                }
            }
        }
        //Ajouter l'item à la liste
        ingredientsStock.push(ingredientToAdd)
        //push la liste
        this.setState({
            ingredientsStock : ingredientsStock,
            unitNumber : 0,
            gramNumber : 0,
        })
        UtilsAsyncStorage.saveObject("fridge",this.state.ingredientsStock)     
    }

    render() {

        const number = () =>{
            if(this.state.unit){
                return( <Text style = {styles.textStyle}>{this.state.unitNumber} u</Text>)
               
            }else{
                return(<Text style = {styles.textStyle}>{this.state.gramNumber} g</Text>)
            }
        }
        const buttonAdd = () =>{
            if(this.state.unitNumber >0 || this.state.gramNumber > 0)
            {
                return(
                    <TouchableOpacity style = {styles.touchableButtonTrueStyle} onPress ={this.add}>
                        <Text style = {styles.textButtonStyle}>Ajouter</Text>
                    </TouchableOpacity>
                )
            }else{
                return(
                    <TouchableOpacity style = {[styles.touchableButtonTrueStyle,styles.touchableHiddentStyle]}>
                    <Text style = {styles.textButtonStyle}>Ajouter</Text>
                </TouchableOpacity>
                )
            }
           
        }
        return(
                
                    <View style = {{flexDirection : 'row'}}>
                        <Text>{this.state.name}</Text>
                        <Image style = {{width : 50,height : 50}} source = {{uri : this.state.image}}></Image>
                        <TouchableOpacity  onPressIn = {() => this.handleTimerRemove(true)} onPressOut = {() => this.handleTimerRemove(false)}>
                            <View style = {styles.buttonMoreAndLessStyle}>
                                <Text style = {styles.moreAndLessStyle}>-</Text>
                            </View>
                        </TouchableOpacity>
                        <View style = {{alignItems: "center", justifyContent : "center"}}>
                            {number()}
                            </View>
                        <TouchableOpacity   onPressIn = {() => this.handleTimerAdd(true)} onPressOut = {() => this.handleTimerAdd(false)}>
                            <View style = {styles.buttonMoreAndLessStyle}>
                                <Text style = {styles.moreAndLessStyle}>+</Text>
                            </View>
                        </TouchableOpacity>
                        {buttonAdd()}
                    </View>
            
        )
    }
    
}


const styles = StyleSheet.create({
    viewStyle : {
        alignItems: 'center'
    },
    imageStyle : {
        height : 150,
        width : 150,
        borderRadius : 80,
        marginVertical : 10,
    },
    textStyle : {
        fontFamily: "Glegoo_400Regular",
        fontSize : 15,
        marginHorizontal : 2,
    },
    moreAndLessStyle : {
        fontFamily: "Glegoo_400Regular",
    },
    buttonMoreAndLessStyle  : {
        backgroundColor : '#EDF4EE',
        borderWidth : 1,
        borderColor : 'black',
        width : 30,
        height : 30,
        marginLeft : 5,
        alignItems: "center",
        justifyContent : "center",
        borderRadius : 80
        
    },
    touchableButtonTrueStyle : {
        backgroundColor: "green",
        marginRight : 10,
    },

    touchableHiddentStyle : {
        opacity : 0,
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
        color : "white",
        
    },
})