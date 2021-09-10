import React from 'react';
import styled from 'styled-components/native';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash';
import ExpandBlackBox from './ExpandBlackBox';

const DATA=[{
    name: '파인뷰LX5000',
    price: 230000,
    text: '더 빠른 DUAL CORE CPU AI 충격안내 시스템 및 졸음운전 예방 시스템 탑재'
},{
    name: '파인뷰 GX3000',
    price: 350000,
    text: '전후방 QHD 초고화질 블랙박스 HD화질보다 4배 더 선명한 녹화'
},{
    name: '파인뷰 LX3 ',
    price: 380000,
    text: '룸미러와 블랙박스의 만남\n전후방 FHD, SONY STARVIS\n후방사각지대 시야확보'
}];

const TitleView = styled.View`
    width: 100%;
    padding: 10px;
`;
const Title = styled.Text`
    font-size: 30px;
    font-family: 'DoHyeon-Regular';
`;
const ContentView = styled.View`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
`;

function BlackBoxDetail(props){
    //props로 받은 shopName으로 서버에 그 shop의 정보 요청
    //이후 asyncstorage 캐시도 필요할듯.
    const [shopName, setShopName] = React.useState(props.children);

    return (
        <View style={{backgroundColor: 'white'}}>
            <TitleView>
                <Title>블랙박스</Title>
            </TitleView>
            <ContentView>
                {_.map(DATA , (item) => {
                    return(
                        <ExpandBlackBox item={[item]} key={item.name}></ExpandBlackBox>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default BlackBoxDetail;