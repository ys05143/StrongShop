import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';

const ShopView = styled.View`
    width: 95%;
    height: 55px;
    border-bottom-width: 1px;
    border-color: gray;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 5px;
    flex-direction: row;
`;
const NameView = styled.View`
    flex-direction: row;
    align-items: flex-end;
`;
const DetailView = styled.View`
    width: 95%;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
`;

function Shop(props) {
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);

    function _renderHeader (section, index, isActive) {
        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <ShopView>
                    <NameView> 
                        <Text style={{fontSize: 20}}>{section.name}</Text>
                        <Text style={{fontSize: 12, marginBottom: 3, marginLeft: 10, color: 'gray'}}>{section.simpleRegion}</Text>
                        <MaterialIcons name={isActive?"expand-less": "expand-more"} size={20} color= 'black' style={{marginLeft: 5}}></MaterialIcons>
                    </NameView>
                    <Text style={{fontSize: 15}}>{section.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
                </ShopView>
            </View>
        );
    };

    const _renderContent = section => {
        return(
            <View style={{width: '100%', alignItems: 'center'}}>
                <DetailView>
                    <Text>{section.contents}</Text>
                </DetailView>
            </View>
        );
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

export default Shop;
