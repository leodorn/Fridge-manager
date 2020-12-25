import React from 'react'
import {View,TextInput,StyleSheet,Image,Button,TouchableOpacity,Text,Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';



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
        console.log("coucou je suis " + this.props.ingredient.name)
        if(this.props.ingredient.unitAverage != 0){
            this.setState({
                unit : true,
            })
        }
        else if(this.props.ingredient.gramAverage != 0){
            this.setState({
                unit : false,
            })
        }
    }

    handleAddUnit = () =>{
        if(this.state.unit){
            if(this.state.unitNumber<999)
            {
                
                let unitNumber = parseInt(this.state.unitNumber) +1
                    this.setState({
                    unitNumber :  unitNumber
                })
            }
        }else{
            if(this.state.gramNumber<100000)
            {
                
                let gramNumber = parseInt(this.state.gramNumber) +1
                    this.setState({
                    gramNumber :  gramNumber
                })
            }
        }
        
   
    }

    handleRemoveUnit = () =>{
        if(this.state.unit){
            if(this.state.unitNumber>0)
            {
                let unitNumber = parseInt(this.state.unitNumber) -1
                    this.setState({
                    unitNumber :  unitNumber
                })
            }
        }else{
            if(this.state.gramNumber>0)
            {
                let gramNumber = parseInt(this.state.gramNumber) -1
                    this.setState({
                    gramNumber :  gramNumber
                })
            }
        }
        
        
    }

    handleTimerRemove = (launch) =>{
        let time
        if(this.state.unit)
        {
            time = 150;
        }else{
            time = 10;
        }
        if(launch)
        {
            this.handleRemoveUnit();
            this.state.intervale = setInterval(() => { 
                this.handleRemoveUnit();
            }, time ); 
        }
        else
        {
            clearInterval(this.state.intervale)
        }
        
    }

    handleTimerAdd= (launch) =>{
        let time
        if(this.state.unit)
        {
            time = 150;
        }else{
            time = 10;
        }
        if(launch)
        {
            this.handleAddUnit();
            this.state.intervale = setInterval(() => { 
                this.handleAddUnit();
            }, time ); 
        }
        else
        {
            clearInterval(this.state.intervale)
             
        }
        
    }

    storeObject = async (key,value) => {
        
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(key, jsonValue)
          this.getObject(0)
        } catch (e) {
          // saving error
        }
      }
    getObject = async (key) => {
        try {
          let jsonValue = await AsyncStorage.getItem(key)
          jsonValue = JSON.parse(jsonValue)
          console.log(jsonValue)
          this.setState({
              ingredientsStock : jsonValue
          })
        } catch(e) {
          console.error(e)
        }
      }


    add = async () =>{
        //Récuperer liste déjà présente.
        let ingredientStock = []        
        await this.getObject(0);
        ingredientStock = this.state.ingredientsStock;
        console.log(ingredientStock)
        let ingredientToAdd = {
            name : this.state.name,
            image : this.state.image,
            unitNumber : this.state.unitNumber,
            gramNumber : this.state.gramNumber,
        }
        
       
        //Ajouter l'item à la liste
        ingredientStock.push(ingredientToAdd)
        //push la liste
        this.setState({
            ingredientStock : ingredientStock,
            unitNumber : 0,
            gramNumber : 0,
        })
        this.storeObject(0,this.state.ingredientsStock)        
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
        marginTop : 10,
    },
    textStyle : {
        fontFamily: "Glegoo_400Regular",
        fontSize : 15
    },
    moreAndLessStyle : {
        fontFamily: "Glegoo_400Regular",
        fontSize : 20,
    },
    buttonMoreAndLessStyle  : {
        backgroundColor : '#EDF4EE',
        borderWidth : 1,
        borderColor : 'black',
        width : 80,
        height : 80,
        marginHorizontal: 30,
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