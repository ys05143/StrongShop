import React from 'react';
import { Text, View, Modal } from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon  from "react-native-vector-icons/Ionicons";
//components
import Row from '../components/Row';
import ModalView from '../components/ModalView';
//constants
import AppWindow from '../constants/AppWindow';
//pages
import Description from './Description';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const SelectView = styled.View`
    width: ${WIDTH}px;
    height: 60px;
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
const IconView = styled.View`
    background-color: red;
    align-items: center;
    justify-content: ceter;
`;
    
function ExpandSelect(props){
    const [selectName, setSelectName] = React.useState(props.name);
    const [isChoose, setIsChoose] = React.useState(props.choose);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    const section = [selectName];
    const [activeSections, setActiveSections] = React.useState([]);
    const [modal, setModal] = React.useState(false);

    function _renderHeader (section, index, isActive) {
        return (
            <SelectView>
                <Row style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity>
                    <Icon onPress={()=>{ sendChoose(!isChoose);
                                                setIsChoose(!isChoose)}} name={isChoose===false?"square-outline": "checkbox"} size={25} color={'gray'}></Icon>
                    </TouchableOpacity>
                    <SelectName>{props.name}</SelectName>
                    <Icon name="help-circle-outline" size={20} style={{color: 'gray', marginRight: 10}} onPress={()=>{setModal(true)}}></Icon>
                    <SelectResult>
                        <Text style={{color: 'gray'}}>세부사항</Text>
                    </SelectResult>
                </Row>
                <MaterialIcons name={isActive===false?"expand-more": "expand-less"} size={35} color= 'black'></MaterialIcons>
            </SelectView>
        );
    };

    const _renderContent = section => {
        return (
            <Text>{section}</Text>
        );
    };

    function _updateSections(activeSections) {
        setActiveSections(activeSections);
    };

    return(
        <>
        <Accordion
            sections={section}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            underlayColor='transparent'
            />

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

export default ExpandSelect;