import React from 'react';
import { View, Text } from 'react-native';

function TempWindow(props){
    return(
        <View style={{flex: 1, backgroundColor: 'red'}}>
            {props.children}
        </View>
    );
}

export default TempWindow;