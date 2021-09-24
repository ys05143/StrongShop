import React from 'react'
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
//component
import TotalView from '../components/TotalView';

const TopBar = styled.View`
    height: 60px;
    width: 100%;
    padding-right: 10px;
    border-bottom-width: 1px;
    border-color: lightgray;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
`;

function RecordScreen(props) {
    return(
        <TotalView color={'white'} notchColor={'white'}>
            <TopBar>
                <View style={{width: '100%', position: 'absolute'}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>과거 시공 기록</Text>
            </TopBar>
        </TotalView>
    );
}

export default RecordScreen;