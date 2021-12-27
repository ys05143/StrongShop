import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, View } from 'react-native';
import Color from '../constants/Color';
import Icon  from "react-native-vector-icons/Ionicons";

const Describe = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: ${Color.main};
`;
const TextView = styled.View`
    margin-left: 10px;
    margin-top: 10px;
`;

function Description(props) {
    return(
        <Describe>
            {props.image !== null ? <Image style={{height:'70%',width:'100%'}} source={props.image} resizeMode='cover'/>
            : <View style={{height:'70%',width:'100%', backgroundColor: '#e5e5e5', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='image-outline' size={30} color={'gray'}/>
            </View>}
            <TextView>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{props.children}</Text>
            </TextView>
        </Describe>
    );
}

export default Description;