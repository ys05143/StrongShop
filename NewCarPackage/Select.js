import React from 'react';
import { Text, Modal, View } from 'react-native';
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
import { TouchableOpacity } from 'react-native-gesture-handler';

const HEIGHT = AppWindow.height;

//onPress={()=>{ sendChoose(!isChoose); setIsChoose(!isChoose);}}
const SelectView = styled.View`
    width: 100%;
    height: 60px;
    border-bottom-width: 1px;
    flex-direction: row;
    padding: 5px;
    align-items: center;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 20px;
`;
const SelectResult = styled.View`
    height: 30px;
    justify-content: center;
`;
const DetailModal = styled.View`
    width: 90%;
    height: ${HEIGHT*2/5+40}px;
`;

function Select (props){
    const [isChoose, setIsChoose] = React.useState(props.choose);
    const [modal, setModal] = React.useState(false);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    return(
        <>
        <SelectView>
            <Row style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity>
                    <MaterialIcons onPress={()=>{ sendChoose(!isChoose);
                                                setIsChoose(!isChoose)}} name={isChoose===false?"check-box-outline-blank": "check-box"} size={35} color= 'gray'></MaterialIcons>
                </TouchableOpacity>
                <SelectName>{props.children}</SelectName>
                <Icon name="help-circle-outline" size={20} style={{color: 'gray'}} onPress={()=>{setModal(true)}}></Icon>
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

export default Select;