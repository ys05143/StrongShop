import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function store(key, value){
    
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        } 
    catch (error) {
        console.log(error.message);
        return -1;
      }
}

export default store;