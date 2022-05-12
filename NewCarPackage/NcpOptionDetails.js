import React from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon  from "react-native-vector-icons/Ionicons";
//components
import Row from '../components/Row';
import ModalView from '../components/ModalView';
//pages
import Description from './Description';
//constant
import AppWindow from '../constants/AppWindow';

const HEIGHT = AppWindow.height;

const SelectView = styled.View`
    width: 100%;
    height: 35px;
    flex-direction: row;
    padding-left: 10px;
    align-items: center;
    margin-top: 10px;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 18px;
    font-weight: bold;
`;

function NcpOptionDetails (props){
    const [touchable, setTouchable] = React.useState(props.touchable);
    const [isChoose, setIsChoose] = React.useState(props.choose);

    React.useEffect(()=>{
        setTouchable(props.touchable);
        if(props.touchable === false) { setIsChoose(false); sendChoose(false);}
    },[props.touchable])

    React.useEffect(()=>{
        setIsChoose(props.choose);
    },[props.choose]);
    
    function sendChoose(bool){
        props.getChoose(bool);
    }

    return(
        <>
        <SelectView>
            <Row style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={()=>{ if(touchable) {sendChoose(!isChoose);
                                    setIsChoose(!isChoose)}}} >
                    <Icon name={isChoose===false?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                    <SelectName>{props.name}</SelectName>
                </TouchableOpacity>
            </Row>
        </SelectView>
        </>
    )
}

export default NcpOptionDetails;