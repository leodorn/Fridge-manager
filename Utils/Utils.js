import * as ImagePicker from 'expo-image-picker';


export default class Utils{
    
    static JustNumberAndParse(text){
        text =  ('' + text).replace(/[^0-9]+/g, "" )
        return parseInt(text)

    }

    static JustAlphabetAndSpace(text){
        return ('' + text).toLowerCase().replace(/[^a-zA-Z ]+/g, "" )
    }

    static FirstCaractUpperCase(text){
        return ('' + text).charAt(0).toUpperCase()+(''+text).substring(1)
    }

    static CheckANumberisUndefined(number){
        if(number === undefined){
            return true
        }
        return false
    }

    static IfUndefinedTransformToZero(number){
        if(number === undefined || number == ''){
            return 0
        }else{
            return parseInt(number);
        }
    }

    static async TransformImageInBlob(image){
        const response = await fetch(image)
        return await response.blob();       
    }

    static async AskPermissionCameraPicker(){
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        permissionResult.granted = true;
        //permissionResult.granted = true; 
        if (permissionResult.granted === false) {
            console.log("pas autorisé")
            return false;
        }else{
            return true;
        }
    }

    static async GetImagePicked(){
        let permissionResult = await this.AskPermissionCameraPicker();
        if(!permissionResult){
            return undefined
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            console.log("est revenu")
            return undefined
        }
        console.log("yesssaaa")
        return pickerResult;
    }

    static ExcludeItemInList(list,item){
        let result = list.filter(obj => {
            return obj != item
        })
        if(result == undefined){
            console.log("La liste ne contient que l'objet")
        }
        return result
    }

    static CompareByName(a,b){
        if( a.name < b.name ){
            return -1;
          }if ( a.name > b.name ){
            return 1;
          }
          return 0;
        }

    static FilterListItemWhoNameStartBy(list,text){
        return list.filter(element => text === element.name.substring(0,new String(text).length))
    }

    static FindItemWhoNameEqualTo(list,name){
        return list.find(element => name == element.name) 
    }

    static RemoveDoublonName(list){

        function antiDoublon(obj,index,list) {
            for(let i = 0; i<list.length;i++){
                if(i != index){
                    if(obj.name == list[i].name){
                        return false
                    }else{return true}
                }else{return true}
            }
        }
        list = list.filter(antiDoublon)
        return list;
    }

    static CompareByDate(a,b){
        if(a.date == undefined || a.date == null){
            return -1
        }if(b.date == undefined || b.date == null){
            return 1
        }if(a.date <b.date){
            return -1
        }if(a.date > b.date){
            return 1
        }
        return 0
    }

}