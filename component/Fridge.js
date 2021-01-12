import React from 'react'
import {View,StyleSheet,Image,Text,FlatList,TouchableOpacity} from 'react-native'
import UtilsAsyncStorage from '../Utils/UtilsAsyncStorage';
import Utils from '../Utils/Utils';
import stylesText from '../Styles/stylesText'
export default class Fridge extends React.Component{

    state = {
        ingredientsStock :[],
        orderByName : false,
        loading : true,
    }

    componentDidMount(){
        this.getObject("fridge").then(this.setState({loading : false}))    
        const refresh = this.props.navigation.addListener('focus', () => {
            this.getObject("fridge").then(console.log("je charge"),this.setState({
                loading : false
            }));  
          }); 
    }

    getObject = async (key) => {
        UtilsAsyncStorage.getJsonObject(key).then(result => {
            this.setState({ingredientsStock : result}, () => {
                console.log(this.state.ingredientsStock)
            })
        })
        
        
      }



    Order = (a,b) => {
        if(this.state.orderByName){
            return Utils.CompareByName(a,b)
        }else{
            return Utils.CompareByDate(a,b)
        }
    }  
    removeItem = (item) =>{
        let result = Utils.ExcludeItemInList(this.state.ingredientsStock,item)
        this.setState({ingredientsStock : result}
            ,() => {UtilsAsyncStorage.saveObject("fridge",this.state.ingredientsStock)})
        
    }

    handleGoToAddIngredient = () => {
        this.props.navigation.navigate('IngredientList')
    }
      
    sayHello = () => {
        return(<Text>coucou</Text>)
    }


    showButtonRemove = (item) =>{
        let result = Utils.ExcludeItemInList(this.state.ingredientsStock,item)
        item.wantRemove = true,
        result.push(item)
        this.setState({ingredientsStock : result})
    }

    OrderByName  = () => {
        this.setState({orderByName : true})
    }

    OrderByDate  = () => {
        this.setState({orderByName : false})
    }

    render(){

        const unitOrGram = (item ) =>{
            if(item.unitNumber != 0){
                return (<Text style = {{alignSelf : "center"}}>{item.unitNumber} u</Text>)            
            }else{
                return(<Text style = {{alignSelf : "center"}}>{item.gramNumber} g</Text>)
            }
        }
        const showIngredient = (item) => {
            if(item.wantRemove){
                return(
                    <View> 
                        <TouchableOpacity onPress = {() => this.removeItem(item)}>
                            <View style = {{marginLeft : 10, borderRadius : 80,borderColor : "black",borderWidth : 1, width : 50,alignItems: "center",justifyContent: "center"}}>
                                <Text>X</Text>
                               
                            </View>
                            
                        </TouchableOpacity>
                        <Image style = {styles.imageStyle} source = {{uri : item.image}}></Image>
                        <Text style = {styles.textStyle}>{item.name}</Text>
                        {unitOrGram(item)}
                    </View>
                )
            }else{
                return(
                    <View style = {{width : 50, height : 50}}>
                         <TouchableOpacity onLongPress = {() => this.showButtonRemove(item)}>
                                <Image style = {styles.imageStyle} source = {{uri : item.image}}></Image>
                                <Text style = {styles.textStyle}>{item.name}</Text> 
                                {unitOrGram(item)}                                
                        </TouchableOpacity>
                    </View>                  
                )
            }
            
            
        }

        const listEmpty = () => {
            return (
                <View style = {{justifyContent : "center", alignItems : "center", marginVertical : 200}}>
                    <Text style = {{fontSize : 15, fontFamily : "Glegoo_400Regular"}}>Vous n'avez pas d'ingrédient dans votre frigo !</Text>
                </View>
            )
        }


        const showList = () =>{
            if(this.state.ingredientsStock != undefined || this.state.ingredientsStock != null || this.state.ingredientsStock.length == 0){
                return(             
                        <FlatList
                            data={this.state.ingredientsStock.sort((a,b) => this.Order(a,b))}
                            numColumns = {3}
                            renderItem={({ item }) => (
                                    <View style = {{marginHorizontal : 20, marginVertical :40}} >
                                        {showIngredient(item)}
                                        </View>
                            )}
                            keyExtractor={(item, index) => index.toString()
                            }
                            ListEmptyComponent = {listEmpty()}
                            />
                )
                
            }else{     
                return(
                    <View >
                        <Text>Il n'y a aucun ingrédient dans votre frigo !</Text>
                    </View>
                )    
                
            }
            
        }
        return(
            <View style = { styles.mainContainer }>
                <View style = {{flexDirection : 'row', justifyContent : "space-around", marginVertical : 10}}>
                    <TouchableOpacity  style = {styles.touchableOpacityStyle} onPress = {this.OrderByName}>
                        <Text style = {{...stylesText.glegoo,color : "white"}}>Order by name</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style = {styles.touchableOpacityStyle} onPress = {this.OrderByDate}>
                        <Text style = {{...stylesText.glegoo ,color : "white" }}>Order by Date</Text>
                    </TouchableOpacity>
                </View>
                
                {showList()}
 
               

               <TouchableOpacity style={ styles.bottomView} onPress = {this.handleGoToAddIngredient}>
                <View>
                    <Text style={styles.textStyle}>Ajouter un ingrédient</Text>
                </View>
               </TouchableOpacity>
               
 
            </View>
              
        )
    }
}


const styles = StyleSheet.create({
    imageStyle : {
        height : 70,
        width : 70,
    },
    textStyle : {
        ...stylesText.textGlegooAndAlignSelfCenter,
        fontSize : 12
    },
    viewInlineStyle : {
        flexDirection : 'row'
    },
    absoluteAddStyle : {
        position : 'absolute',
        bottom:0,
        left:0,
    },
    mainContainer:
    {
        flex: 1,
        justifyContent : "center"
    },
 
    bottomView:{
 
      width: '100%', 
      height: 50, 
      backgroundColor: '#FF9800', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
    },
    touchableOpacityStyle : {
        backgroundColor : "green", 
        borderColor : "black",
        borderRadius : 50,
        paddingHorizontal : 10
    }
})