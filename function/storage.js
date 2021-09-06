import AsyncStorage from "@react-native-async-storage/async-storage";
import React from 'react';

async function fetch(key){
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? JSON.parse(value) : null;
    } 
    catch (error) {
        console.log(error);
    }
}

async function store(key, value){
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        } 
    catch (error) {
        console.log(error.message);
      }
}

export default {
    fetch,
    store,
 };