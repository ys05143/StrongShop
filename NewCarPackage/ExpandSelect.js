import React from 'react';
import { Text,View } from 'react-native';
import styled from 'styled-components';
import Row from '../components/Row';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Tinting_renderContent from '../Shop/Tinting_renderContent';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;

const SelectView = styled.View`
    width: ${WIDTH}px;
    height: 60px;
    border-bottom-width: 1px;
    flex-direction: row;
    padding: 5px;
    align-items: center;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 10px;
    font-size: 20px;
`;
const SelectResult = styled.View`
    height: 30px;
    justify-content: center;
`;
    
function ExpandSelect(props){
    const [selectName, setSelectName] = React.useState(props.name);
    const [isChoose, setIsChoose] = React.useState(props.choose);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    const section = [selectName];
    const [activeSections, setActiveSections] = React.useState([]);

    function _renderHeader (section, index, isActive) {
        return (
            <SelectView>
                <Row style={{flex: 1, alignItems: 'center'}}>
                    <MaterialIcons onPress={()=>{ sendChoose(!isChoose);
                                                setIsChoose(!isChoose);}} name={isChoose===false?"check-box-outline-blank": "check-box"} size={35} color= 'gray'></MaterialIcons>
                    <SelectName>{props.children}</SelectName>
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
        <Accordion
            sections={section}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            underlayColor='transparent'
            />
    )
}

export default ExpandSelect;