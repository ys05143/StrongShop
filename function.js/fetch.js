import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetch(key){
    
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
        else{
            return null;
        }
    } 
    catch (error) {
        console.log(error);
        return -1;
    }
}

export default fetch;