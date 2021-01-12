import AsyncStorage from '@react-native-async-storage/async-storage';


export default class UtilsAsyncStorage{


   static async getJsonObject(key){
       return new Promise( async (resolve,reject) => {
            try {
                let jsonValue = await AsyncStorage.getItem(key)
                jsonValue = JSON.parse(jsonValue)
                resolve(jsonValue)
            } catch(e) {
                console.error(e)
                reject(jsonValue)
            }
       })
       
    }

    static async saveObject(key,value){
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
          }catch (e) {
            console.error(e)
          }
    }
}