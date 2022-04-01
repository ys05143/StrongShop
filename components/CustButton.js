import React from "react";
import { Button } from "react-native-paper";
import Color from "../constants/Color";

function CustButton(props){
    return(
        <Button mode="outlined" style={{width: 120, height: 45, borderRadius: 15, borderWidth: 2, borderColor: Color.main, backgroundColor: 'white'}} contentStyle={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15}} labelStyle={{fontFamily: 'NotoSansKR-Medium', fontSize: 18}} color={'black'} onPress={props.onPress} disabled={props.disabled}>{props.children}</Button>
    )
}

export default CustButton;