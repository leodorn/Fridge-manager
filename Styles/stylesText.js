import {StyleSheet} from 'react-native';




const stylesText = StyleSheet.create({
    glegooAndBlack : {
        ...stylesText.glegoo,
        color : 'black',
    },

    glegoo : {
        fontFamily: "Glegoo_400Regular"
    },

    alignSelfCenter : {
        alignSelf : "center",
    },
    textGlegooAndAlignSelfCenter : {
        ...stylesText.glegoo,
        ...stylesText.alignSelfCenter,    
    },

    });

export default stylesText;
  