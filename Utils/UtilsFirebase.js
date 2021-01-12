import * as firebase from 'firebase'
import firebaseConfig from '../config'

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig);
}
else
{
  firebase.app();
}


export default class UtilsFirebase{

    static getDatabaseRef(ref){
        return firebase.database().ref(ref)
    }

    static getDatabaseIngredientRef(){
        return this.getDatabaseRef("ingredients")
    }

    static getDatabaseListOrderedByAttribut(attribut,ref){
        return this.getDatabaseRef(ref).orderByChild(attribut)
    }

    static getDatabaseListIngredientOrderedByName(){
        return this.getDatabaseListOrderedByAttribut("name",this.getDatabaseIngredientRef)
    }

    static getDatabaseListIngredientOrderedByNameAndEqualTo(something){
        let text = something
        return this.getDatabaseListIngredientOrderedByName().equalTo(text)
    }

    static getDatabaseCountEqualTo(something){
        let count = 0
        this.getDatabaseListIngredientOrderedByNameAndEqualTo(text).on("child_added", snapshot =>{
            count++
        })
        console.log("nombre :" + count)
        return count
    }

    static GetRefStorage(ref){
        return firebase.storage().ref(ref)
    }

    static async PushIngredientImageInStorage(nameIngredient,blob){
        let ref =  firebase.storage().ref();
        await ref.child(this.GetPathIngredientImage(nameIngredient)).put(blob)
        .catch(error => {console.error(error)})
        
    }

    static GetPathIngredientImage(name){
        return "ingredients/"+name+"/"+name+"Logo.jpg";
    }

    static GetURLImageFromName(name){
        let path = this.GetPathIngredientImage(name)
        return this.GetURLImageFromPath(path)
    }

    static GetURLImageFromPath(path)
    {
        return new Promise((resolve,reject) =>{
            firebase.storage().ref().child(path).getDownloadURL().then( image => {
                resolve(image)
            }).catch(e => reject(e))
        })
       
    }

    static async GetIngredient(listToPush,snapshot){
        return new Promise((resolve,reject) =>{
            //Stocker nom, unit et gramme
            let name = snapshot.val().name;
            let unitAverage = snapshot.val().unitAverage;
            let gramAverage = snapshot.val().gramAverage;
             UtilsFirebase.GetURLImageFromName(name).then(url => {
                const ingredient = {name : name, image : url, unitAverage : unitAverage, gramAverage : gramAverage}
                listToPush.push(ingredient);
                resolve()        
             }).catch(e => {reject(e)})    
        })
    }

    
}