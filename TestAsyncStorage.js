import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {  Text, View,Image,Button, Alert } from 'react-native';


export default class TestAsyncStorage extends React.Component{


    state = {
        ingredient : [
            { name : "Salsifi"},
            { name : "Houmous"}
        ]
    }

    storeData = async (key,value) => {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (e) {
          // saving error
        }
      }

    getData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key)
          if(value !== null) {
            console.log(value)
          }
        } catch(e) {
          // error reading value
        }
      }
    storeObject = async (key,value) => {
        
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
          // saving error
        }
      }
    getObject = async (key) => {
        try {
          let jsonValue = await AsyncStorage.getItem(key)
          jsonValue = JSON.parse(jsonValue)
        } catch(e) {
          console.error(e)
        }
      }
      


    render(){
        return (
        <View>
            <Button title='save' onPress = {()=> this.storeData(0,"coucou")} ></Button>
            <Button title='getBack' onPress = {()=> this.getData(0)} ></Button>
            <Button title='saveObject' onPress = {()=> this.storeObject(0,this.state.ingredient)} ></Button>
            <Button title='getBackObject' onPress = {()=> this.getObject(0)} ></Button>
        </View>)
    }
}
