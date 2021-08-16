import React from 'react';
import styled from 'styled-components';
import { Text, Image } from 'react-native';
import StatusBarHeight from '../constants/StatusBarHeight';
import { ifIphoneX } from "react-native-iphone-x-helper";

const Describe = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
`;
const TextView = styled.View`
    position: absolute;
    margin-left: 15px;
`;

function Description(props) {
    return(
        <Describe>
            <Image style={{height:'100%',width:'100%', position: 'absolute'}} source={props.image} resizeMode='cover'/>
            <TextView style={{marginTop: ifIphoneX()=== true ? StatusBarHeight()+40 : 40}}>
                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>{props.children}</Text>
            </TextView>
        </Describe>
    );
}

export default Description;