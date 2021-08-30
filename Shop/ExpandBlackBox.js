import React from 'react';
import { Text,View } from 'react-native';
import styled from 'styled-components';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NameView = styled.View`
    flex-direction: row;
    align-items: flex-end;
    padding: 5px 0px;
`;
const DetailView = styled.View`
    border: 1px;
    border-radius: 10px;
    width: 100%;
    padding: 5px;
`;
    
function ExpandBlackBox(props){
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);

    function _renderHeader (section, index, isActive) {
        return (
            <NameView>
                <Text style={{fontSize: 18}}>{section.name}</Text>
                <Text style={{marginLeft: 10}}>{section.price}원</Text>
                <MaterialIcons name={isActive?"expand-less": "expand-more"} size={20} color= 'black'></MaterialIcons>
            </NameView>
        );
    };

    const _renderContent = section => {
        return(
            <DetailView>
                <Text>{section.text}</Text>
            </DetailView>
        )
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <Accordion
        sections={props.item}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor='transparent'
        />
    );
}

export default ExpandBlackBox;