import React from 'react';
import styled from 'styled-components';
import { Text,View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Tinting_renderContent from './Tinting_renderContent';

const merchadiseList= [
{
    title: 'Tinting',
},{
    title: 'BlackBox',
},{
    title: 'GlassCoating',
},{
    title: 'UnderCoating',
},{
    title: 'PPF',
},{
    title: 'UnderDeafening',
},
];

const OptionName = styled.View`
    border-bottom-width: 1px;
    height: 50px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const Total = styled.ScrollView``;

function Merchandise(){
    const [shopName, setShopName] = React.useState('ALL THAT CARNIVAL');

    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);

    function _renderHeader (section, index, isActive) {
        return (
            <OptionName>
                <Text style={{fontSize: 20}}>{section.title}</Text>
                <MaterialIcons name={isActive?"expand-less": "expand-more"} size={35} color= 'black'></MaterialIcons>
            </OptionName>
        );
    };

    const _renderContent = section => {
        switch(section.title){
            case 'Tinting':
                return (
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
            case 'BlackBox':
                return(
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
            case 'GlassCoating':
                return(
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
            case 'UnderCoating':
                return(
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
            case 'PPF':
                return(
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
            case 'UnderDeafening':
                return(
                    <Tinting_renderContent>{shopName}</Tinting_renderContent>
                );
        }
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <Total>
            <Accordion
                sections={merchadiseList}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
                underlayColor='transparent'
                />
        </Total>
    )
}

export default Merchandise;