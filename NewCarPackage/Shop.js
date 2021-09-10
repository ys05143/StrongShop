import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import Row from '../components/Row';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ShopView = styled.TouchableOpacity`
    width: 95%;
    height: 55px;
    border-bottom-width: 1px;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 5px;
    flex-direction: row;
`;
const NameView = styled.View`
    flex-direction: row;
    align-items: flex-end;
`;

function Shop(props) {
    return(
        <ShopView>
            <NameView> 
                <Text style={{fontSize: 25}}>{props.name}</Text>
                <Text style={{fontSize: 15, marginBottom: 3, marginLeft: 10, color: 'gray'}}>{props.simpleRegion}</Text>
            </NameView>
            <Text style={{fontSize: 20}}>{props.price}</Text>
        </ShopView>
    );
}

export default Shop;
