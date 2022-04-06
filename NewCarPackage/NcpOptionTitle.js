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

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

//onPress={()=>{ sendChoose(!isChoose); setIsChoose(!isChoose);}}
const SelectView = styled.View`
    width: 100%;
    height: 50px;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 1px;
    flex-direction: row;
    justify-content: space-between;
`;

const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 25px;
    font-family: Jua-Regular;
`;

const DetailModal = styled.View`
    width: 90%;
    height: ${450+40}px;
`;

function NcpOptionTitle (props){
    const [isChoose, setIsChoose] = React.useState(props.choose);
    const [modal, setModal] = React.useState(false);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    React.useEffect(()=>{
        setIsChoose(props.choose);
    },[props.choose]);

    return(
        <>
        <SelectView>
            <View style={{width: 18, height: 18, marginTop: 5}}/>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={()=>{ sendChoose(!isChoose);
                                setIsChoose(!isChoose)}} >
                <Icon name={isChoose===false?"square-outline": "checkbox"} size={30} color= 'gray'></Icon>
                <SelectName>{props.name}</SelectName>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setModal(true)}} style={{width: 18, height: 18, marginTop: 5}}>
                <Icon name="help" size={18} style={{color: Color.mainText}}></Icon>
            </TouchableOpacity>
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
                    <View style={{borderRadius: 5, overflow: 'hidden', width: '100%', height: 450}}>
                        <Description image={null}>{props.name}</Description>
                    </View>
                </DetailModal>
            </ModalView>
        </Modal>
        </>
    )
}

export default NcpOptionTitle;