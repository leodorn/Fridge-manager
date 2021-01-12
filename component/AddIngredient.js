import React from 'react'
import {View,TextInput,StyleSheet,Image,TouchableOpacity,Text,Alert,ScrollView} from 'react-native'
import RadioButton from './RadioButton'
import Utils from '../Utils/Utils'
import UtilsFirebase from '../Utils/UtilsFirebase'
import stylesText from "../Styles/stylesText"
export default class AddIngredient extends React.Component{


    state = {
        image : require('../uploadyourimage.png'),
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


    //Gère la barre de saisie du nombre d'années de date de péremption
    handleOnChangeYears = (years) => { 
        years = Utils.JustNumberAndParse(years)
        this.setState({years})

    }


    //Gère la barre de saisie du nombre de mois de péremption 
    handleOnChangeMounths = (mounths) => { 
        mounths = Utils.JustNumberAndParse(mounths)
        this.setState({mounths})
 
    }

    //Gère la barre de saisie du nombre de jours de péremption
    handleOnChangeDays = (days) => { 
        days = Utils.JustNumberAndParse(days)
        this.setState({days})
    }


    //Gère la barre de saisie du nombre de d'unités de l'ingrédient en moyenne
    handleChangeUnit = (unit) =>{
        unit = Utils.JustNumberAndParse(unit)
        this.setState({valueUnit: unit})
    }
    
    //Gère la barre de saisie du nombre de gramme de l'ingrédient en moyenne
    handleChangeGramme = (gramme) =>{
        gramme = Utils.JustNumberAndParse(gramme)
        this.setState({valueGramme: gramme})
    }

    

    //Gère la barre de saisie du nom de l'ingrédient
    handleOnChangeIngredientName =  (textInInput) =>{
        textInInput =  Utils.JustAlphabetAndSpace(textInInput)
        textInInput = Utils.FirstCaractUpperCase(textInInput)

        this.setState({ textInInput }, ()=> {
            if(new String(textInInput).length >=2){
                this.setState({lenghtTextValid : true})
                let count = 0
                UtilsFirebase.getDatabaseIngredientRef().orderByChild("name").equalTo(textInInput).on("child_added", snapshot =>{
                    count++
                })
                if(count > 0){
                    this.setState({exist : true}, () => {
                        console.log("coucou")
                    })
                }else{
                    this.setState({exist : false})
                }
            }
        })
    }





    //Gère le push de l'ingrédient dans la base de données
    handleSubmit = async () =>{
        const name = this.state.textInInput;
        const years = Utils.IfUndefinedTransformToZero(this.state.years);
        const mounths =  Utils.IfUndefinedTransformToZero(this.state.mounths);
        const days =  Utils.IfUndefinedTransformToZero(this.state.days);
        const valueUnit =  Utils.IfUndefinedTransformToZero(this.state.valueUnit);
        const valueGram = Utils.IfUndefinedTransformToZero(this.state.valueGramme);        
        await UtilsFirebase.getDatabaseIngredientRef().push().set({
            name : name,
            yearsExpiration : years,
            mounthsExpiration : mounths,
            daysExpiration : days,
            unitAverage : valueUnit,
            gramAverage : valueGram
        })
        Utils.TransformImageInBlob(this.state.image).then(blob =>{
            UtilsFirebase.PushIngredientImageInStorage(this.state.textInInput,blob).then(() =>{
                this.setState({
                    image : require('../uploadyourimage.png'),
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
            })
        })
            
       
    }

    handleChooseImage = async () => {
        pickerResult = await Utils.GetImagePicked()
        if(pickerResult != undefined){
            this.setState({
                image : pickerResult.uri,
                haveChooseImage : true,
            })
            return;
        }
        
    }



    checkRadioButtonUnit = () => {
        this.setState({unit : true})
    }

    checkRadioButtonGramme = () => {
        this.setState({unit : false})
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
            if(new String(this.state.textInInput).length>0)
            {
                if(!this.state.exist){
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
                }else{
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
                <ScrollView>
                    <View  style = {styles.viewStyle}>
                        <TouchableOpacity  onPress = {this.handleChooseImage}>
                            {imageZone()}
                        </TouchableOpacity>
                    
                        {nameIngredientZone()}
                        {dateExpirationZone()}
                        {radioBoxZone()} 
                        {buttonZone()}
                    </View>
                   
                
                </ScrollView>
                       
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
        ...styles.glegoo,
        marginVertical : 50,

    },
    textInputStyle : {
        height : 40,
        borderColor : 'gray',
        borderWidth : 1,
        paddingLeft : 25,
        marginHorizontal : 10,
        marginVertical : 10,
        borderRadius : 25,
        ...styles.glegooAndBlack,
    },

    textStyle : {
        marginTop : 20,
        fontSize : 15,
        ...styles.textGlegooAndAlignSelfCenter,
        
    },

    text : {
        marginVertical : 5,
        fontSize : 15,
        ...stylesText.textGlegooAndAlignSelfCenter,
    },
    textTrue : {
        ...styles.text,
        color : "green",
    },
    textFalse : {
        ...styles.text,
        color : "red",
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
        ...stylesText.glegoo,
        marginHorizontal: 10,
        marginVertical : 5,
        color : "white"
    },



})

//style = {...styles.panel.button,...styles.panel.backButton} pour avoir plusieurs styles
