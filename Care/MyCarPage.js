import React from "react";
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AppWindow from "../constants/AppWindow";
import FastImage from 'react-native-fast-image';
import Icon from "react-native-vector-icons/Ionicons";

const WIDTH = AppWindow.width;

const ImgView = styled.View`
    width: ${WIDTH - (16 + 36) * 2 }px;
    height: ${WIDTH - (16 + 36) * 2 }px;
    background-color: white;
    justify-content: center;
    align-items: center;
`;

function MyCar({item}){
    return(
        <View style={{width: '100%', height: '100%', justifyContent: 'space-between'}}>
        {item.id !== 5 ? <View>
            <ImgView>
                <FastImage style={{height:'100%', width:'100%'}} source={{uri:item.uri}} resizeMode="cover"/>
            </ImgView>
            <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
                <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>{item.carName}</Text>
            </View>
        </View> : 
        <View style={{width: '100%', height: '100%', backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity>
                <Icon name={'add-circle-outline'} size={80} color={'gray'}/>
            </TouchableOpacity>
        </View>}
        
        </View>
    )
}

export default MyCar;