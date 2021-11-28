import React from 'react';
import { Text, Modal, View, TouchableOpacity } from 'react-native';
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
import Color from '../constants/Color';

const HEIGHT = AppWindow.height;

//onPress={()=>{ sendChoose(!isChoose); setIsChoose(!isChoose);}}
const SelectView = styled.View`
    width: 100%;
    height: 50px;
    flex-direction: row;
    align-items: center;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 25px;
    font-weight: bold;
`;
const SelectResult = styled.View`
    height: 30px;
    justify-content: center;
`;
const DetailModal = styled.View`
    width: 90%;
    height: ${HEIGHT*2/5+40}px;
`;
function Select4Screen3_3 (props){
    const [isChoose, setIsChoose] = React.useState(props.choose);
    const [modal, setModal] = React.useState(false);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    return(
        <>
        <SelectView>
            <Row style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>{ sendChoose(!isChoose);
                                    setIsChoose(!isChoose)}} >
                    <Icon name={isChoose===false?"square-outline": "checkbox"} size={30} color= 'gray'></Icon>
                    <SelectName>{props.name}</SelectName>
                </TouchableOpacity>
                
                <Icon name="help-circle-outline" size={25} style={{color: 'rgb(200,0,0)'}} onPress={()=>{setModal(true)}}></Icon>
            </Row>
        </SelectView>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {setModal(!modal);}}
        >
            <ModalView>
                <DetailModal>
                    <View style={{width: '100%', height: 40, alignItems: 'flex-end'}}>
                        <Icon name="close-outline" size={35} color={'white'} onPress={()=>{setModal(false)}}></Icon>
                    </View>
                    <View style={{borderRadius: 10, overflow: 'hidden', width: '100%', height: HEIGHT*2/5}}>
                        <Description image={require('../resource/Temp.png')}>신차 패키지란?</Description>
                    </View>
                </DetailModal>
            </ModalView>
        </Modal>
        </>
    )
}

export default Select4Screen3_3;