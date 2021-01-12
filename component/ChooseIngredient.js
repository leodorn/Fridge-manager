import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text,Image} from 'react-native'
import UtilsAsyncStorage from '../Utils/UtilsAsyncStorage';
import DateTimePicker from '@react-native-community/datetimepicker';
import stylesText from "../Styles/stylesText"


export default class ChooseIngredient extends React.Component{


    state = {
        image : this.props.route.params.ingredient.image,
        name : this.props.route.params.ingredient.name,
        unitNumber : this.props.route.params.ingredient.unitAverage,
        gramNumber : this.props.route.params.ingredient.gramAverage,
        timer : undefined,
        unit : true,
        date : Date.now()
    }


    componentDidMount(){
        
        if(this.props.route.params.ingredient.unitAverage != 0){
            this.setState({unit : true},() => {
            
            })
        }else if(this.props.route.params.ingredient.gramAverage != 0){
            this.setState({unit : false},() => {
            })
        }
        let years = this.props.route.params.ingredient.yearsExpiration
        let mounths = this.props.route.params.ingredient.mounthsExpiration
        let days = this.props.route.params.ingredient.daysExpiration
        if(years== undefined || years == ''){
            years = 0
        }if(mounths == undefined || mounths == ''){
            mounths = 0
        }if(days == undefined || days == '' ){
            days = 0
        }

        //Calcul de la date de péremption moyenne
        this.setState({
            date : new Date((Date.now() 
            + parseInt(years) * 31536000000
            + parseInt(mounths) * 2628000000
            + parseInt(days) * 86400000))
        })
        
        
    }



    //Ajoute 1 unité au compteur
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

    //Soustrait 1 unité au compteur
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


    // Gère la décrémentation de l'unité (ou gram) lorsque l'utilisateur reste appuyé sur le bouton
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


    
     // Gère l'incrémentation de l'unité (ou gram) lorsque l'utilisateur reste appuyé sur le bouton
     handleTimerAdd =(launch) =>{
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





    handleOnChangeDate = (date) =>{
        this.setState({date})
    }

     onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };

    add = async () =>{
        //Récuperer liste déjà présente.
        let ingredientsStock = []      
         UtilsAsyncStorage.getJsonObject("fridge").then(json => {
                console.log(json)
                ingredientsStock = json
                let unitNumber = parseInt(this.state.unitNumber)
                let gramNumber = parseInt(this.state.gramNumber)
                let ingredientToAdd = {
                    name : this.state.name,
                    image : this.state.image,
                    unitNumber : unitNumber,
                    gramNumber : gramNumber
                };
                if(ingredientsStock != null && ingredientsStock != undefined){
                    let result = ingredientsStock.find(element => element.name == ingredientToAdd.name)
                    if(result != undefined){
                        if(result.unitNumber != 0){
                            ingredientToAdd.unitNumber = ingredientToAdd.unitNumber + result.unitNumber
                            
                        }else{
                            ingredientToAdd.gramNumber = ingredientToAdd.gramNumber + result.gramNumber
                        }
                        ingredientsStock = ingredientsStock.filter(obj => {
                            if(obj.name === ingredientToAdd.name ){
                                return false
                            }else{
                                return true
                            }
                        })
                    }
                }
                ingredientToAdd.date = this.state.date
                //Ajouter l'item à la liste
                ingredientsStock.push(ingredientToAdd)
                console.log(ingredientsStock)
                //push la liste
                this.setState({
                    unitNumber : 0,
                    gramNumber : 0,
                })
                UtilsAsyncStorage.saveObject("fridge",ingredientsStock).then(() =>{
                    this.props.navigation.navigate('IngredientList')
                })     
            }).catch(e => console.error(e));
        
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
                    <View style = {{alignItems : "center", justifyContent : "center" , marginVertical : 10}}>
                        <Image style = {{width : 100, height : 100, borderRadius : 50}} source = {{uri : this.state.image}}></Image>
                        <Text style = {{...stylesText.glegoo, fontSize : 20, marginVertical : 10 }}>{this.state.name}</Text>
                        <View style = {{flexDirection : "row", marginVertical : 10}}>
                            <TouchableOpacity  onPressIn = {() => this.handleTimerRemove(true)} onPressOut = {() => this.handleTimerRemove(false)}>
                                <View style = {styles.buttonMoreAndLessStyle}>
                                    <Text style = {stylesText.glegoo}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View style = {{alignItems: "center", justifyContent : "center"}}>
                                {number()}
                                </View>
                            <TouchableOpacity   onPressIn = {() => this.handleTimerAdd(true)} onPressOut = {() => this.handleTimerAdd(false)}>
                                <View style = {styles.buttonMoreAndLessStyle}>
                                    <Text style = {stylesText.glegoo}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text>Date de peremption</Text>
                        <DateTimePicker
                            style={{width : 300, marginVertical : 20}}
                            testID="dateTimePicker"
                            value={this.state.date}
                            mode="date"
                            is24Hour={true}
                            onChange={(event,date) => this.handleOnChangeDate(date)}
                            display = "spinner"
                            /> 
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
        ...stylesText.glegoo,
        fontSize : 15,
        marginHorizontal : 2,
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
        ...stylesText.glegoo,
        marginHorizontal: 10,
        marginVertical : 5,
        color : "white",
        
    },
})
