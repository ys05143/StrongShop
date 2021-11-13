import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "./storage";
import {Alert} from 'react-native';

async function checkJwt(props){
    try{
        const isToken = await AsyncStorage.getAllKeys();
        if(isToken.filter(item=>item === 'auth').length !== 0 ){
            const token = await storage.fetch('auth')
            const auth = token.auth;
            console.log('get auth');
            //console.log(auth);
            return auth;
        }
        else return null;
    }
    catch{e=> 
        console.log(e);
        return null;
    }
}
export default checkJwt;