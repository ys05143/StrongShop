import React from 'react';
import styled from 'styled-components';
import { View, ScrollView, Text, FlatList } from 'react-native';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
import ExpandTinting from './ExpandTinting';

const DATA=[{
    name: 'T70 05',
    penetration: 6,
    block: 70,
    price: 100000
},{
    name: 'T70 15',
    penetration: 15,
    block: 68,
    price: 200000
},{
    name: 'T70 35',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 36',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 37',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 38',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 39',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 40',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 41',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 42',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 43',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 44',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 45',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 46',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 47',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 48',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 49',
    penetration: 35,
    block: 68,
    price: 300000
},{
    name: 'T70 50',
    penetration: 35,
    block: 68,
    price: 300000
}];

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
    //props로 받은 shopName으로 서버에 그 shop의 정보 요청
    //이후 asyncstorage 캐시도 필요할듯.
    const [shopName, setShopName] = React.useState(props.children);

    return (
        <View style={{backgroundColor: 'white'}}>
            <TitleView>
                <Title>틴팅</Title>
            </TitleView>
            <ContentView>
                {_.map(DATA , (item) => {
                    return(
                        <ExpandTinting item={[item]} key={item.name}></ExpandTinting>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default TintingDetail;