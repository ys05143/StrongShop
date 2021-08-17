import React from 'react';
import styled from 'styled-components';
import { Text, Image, StyleSheet, Modal, View } from 'react-native';
import Ionicons  from "react-native-vector-icons/Ionicons";

const IconView = styled.View`
    border: 1px solid #0000ff;
`;

function Icon(props){
    return(
        <IconView style={{backgroundColor: props.backgroundColor}}>
            <Ionicons style={{flex: 1}} name="checkbox-outline" size={props.size} color={props.color}></Ionicons>
        </IconView>
    );
}

export default Icon;