import styled from "styled-components/native";
import React from "react";
import { View } from "react-native";

function TopBox(props){
    return(
        <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
            <View style={{width: '100%', height: 40,}}>
                {props.topbar}
            </View>
            {props.children}
        </View>
    )
}

export default TopBox;