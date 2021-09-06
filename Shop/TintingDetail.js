import React from 'react';
import styled from 'styled-components';
import { View, ScrollView, Text, FlatList } from 'react-native';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
import ExpandTinting from './ExpandTinting';

const TitleView = styled.View`
    width: 100%;
    padding: 10px;
`;
const Title = styled.Text`
    font-size: 25px;
`;
const ContentView = styled.View`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
`;
/*
{_.map(DATA , (item) => {
                    return(
                        <ExpandTinting item={[item]} key={item.name}></ExpandTinting>
                    );
                })}
*/ 

function TintingDetail(props){

    return (
        <View style={{backgroundColor: 'white'}}>
            <TitleView>
                <Title>틴팅</Title>
            </TitleView>
            <ContentView>
                {_.map(props.list , (item) => {
                    return(
                        <ExpandTinting item={[item]} key={item.name}></ExpandTinting>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default TintingDetail;