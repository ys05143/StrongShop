import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, View, ScrollView } from 'react-native';
import Color from '../constants/Color';
import Icon  from "react-native-vector-icons/Ionicons";
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;

const Describe = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: ${Color.main};
`;
const TextView = styled.View`
    margin-top: 10px;
`;

function Description(props) {
    return(
        <Describe>
            <ScrollView>
            {props.image !== null ? <Image style={{height: WIDTH*0.9-30, width: WIDTH*0.9-30}} source={props.image} resizeMode='cover'/>
            : <View style={{height: WIDTH*0.9-30, width: WIDTH*0.9-30, backgroundColor: '#e5e5e5', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='image-outline' size={30} color={'gray'}/>
            </View>}
            <TextView>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{props.children}</Text>
            </TextView>
            </ScrollView>
        </Describe>
    );
}

export default Description;