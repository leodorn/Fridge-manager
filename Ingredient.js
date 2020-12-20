import React from 'react';
import {  Text, View,Image,Button, Alert,StyleSheet } from 'react-native';
import * as firebase from 'firebase';

export default class Ingredient extends React.Component{



    render()
    {
        return(
            <View styles = {styles.container}>
                <Image source = {this.props.image} style = {styles.imageIngredient}/>
                <Text style = {styles.textIngredient}>{this.props.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageIngredient : {
        borderRadius : 20,
        width: 60,
        height: 60,
        marginBottom : 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#273920',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textIngredient : {
        marginLeft : 10,
    }
    });