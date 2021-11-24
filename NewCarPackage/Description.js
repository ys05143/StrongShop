import React from 'react';
import styled from 'styled-components/native';
import { Text, Image } from 'react-native';
import Color from '../constants/Color';

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
            <Image style={{height:'70%',width:'100%'}} source={props.image} resizeMode='cover'/>
            <TextView>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{props.children}</Text>
            </TextView>
        </Describe>
    );
}

export default Description;