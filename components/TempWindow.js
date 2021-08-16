import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';

function TempWindow(props){
    return(
        <View style={{flex: 1, backgroundColor: 'red'}}>
            {props.children}
        </View>
    );
}

export default TempWindow;