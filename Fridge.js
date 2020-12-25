import React from 'react'
import {View,TextInput,StyleSheet,Image,Button,TouchableOpacity,Text,Alert,FlatList} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Fridge extends React.Component{

    state = {
        ingredientsStock :[]
    }

    componentDidMount(){
        this.getObject(0);       
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


    render(){
        return(
            <View>
               <FlatList
                data={this.state.ingredientsStock}
                renderItem={({ item }) => (
                        <View style = {styles.viewInlineStyle}>
                            <Image style = {styles.imageStyle} source = {{uri : item.image}}></Image>
                            <Text style = {styles.textStyle}>{item.name}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    imageStyle : {
        height : 80,
        width : 80,
    },
    textStyle : {
        fontFamily: "Glegoo_400Regular",
    },
    viewInlineStyle : {
        flexDirection : 'row'
    }
})