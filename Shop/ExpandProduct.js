import React from 'react';
import { Text,View } from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NameView = styled.View`
    flex-direction: row;
    height: 50px;
    align-items: center;
`;
const DetailView = styled.View`
    border: 1px;
    border-radius: 5px;
    width: 100%;
    padding: 15px;
`;
    
function ExpandProduct(props){
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);

    function _renderHeader (section, index, isActive) {
        return (
            <NameView>
                <Text style={{fontSize: 18}}>{section.name}</Text>
                <MaterialIcons name={isActive?"expand-less": "expand-more"} size={20} color= 'black'></MaterialIcons>
            </NameView>
        );
    };

    const _renderContent = section => {
        return(
            <DetailView>
                <Text>{section.additionalInfo}</Text>
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

export default ExpandProduct;