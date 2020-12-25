import React from 'react'
import {View,TextInput,StyleSheet,Image,Button,TouchableOpacity,Text,Alert} from 'react-native'

export default class RadioButton extends React.Component {


    state = {
        checked : this.props.statusOfChecked,
    }

     handleOnClick = () =>{
         if(this.props.onClick != undefined){
            console.log("coucou")
            this.props.onClick()
         }
         if(this.props.statusOfChecked != undefined){
            if(this.props.statusOfChecked){
                this.setState({
                    checked : true,
                })
            }else{
                this.setState({
                    checked : false,
                })
            }
         }else{
            if(this.state.checked)
            {
                this.setState({
                    checked : false,
                })
            }
            else{
                this.setState({
                    checked : true,
                })
            }    
         }  
         
        
    }

    render()
    {
        const radioButton = () =>{
            if(this.props.statusOfChecked){
                return(
                    <View style = {styles.checked}></View>
                )
            }
            else{
                return(
                    <View style = {styles.notChecked}></View>
                )
            }
        }
        return (
            <View style = {this.props.style}>
                <TouchableOpacity onPress = {this.handleOnClick}>
                    {radioButton()}
                </TouchableOpacity>
            </View>
            
            
        );
    }
    
  }


  const styles = StyleSheet.create({
      notChecked :{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      },
      checked : {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#000',
      }
  })