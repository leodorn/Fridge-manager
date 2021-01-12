import React from 'react'
import {View,StyleSheet,TouchableOpacity} from 'react-native'
import styles from "../Styles/styles"
export default class RadioButton extends React.Component {
    state = {
        checked : this.props.statusOfChecked,
    }

     handleOnClick = () =>{
         //Pour ajouter une function quand on clique dessus
         if(this.props.onClick != undefined){
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
                return(<View style = {styles.checked}></View>)       
            }else{
                return (<View style = {styles.notChecked}></View>)
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