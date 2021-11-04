import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import _ from 'lodash';
//pages
import Shop from './Shop';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const WIDTH = AppWindow.width;
///////////////////////////////
const IntroView = styled.View`
    flex: 2;
    border: 1px solid #ff0000;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const Intro = styled.View`
    width: 80%;
`;
const ContentView = styled.View`
    flex: 5;
    justify-content: space-between;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const Btn = styled.TouchableOpacity`
    border-radius: 50px;
    background-color: #B2EBF4;
    width: 120px;
    height: 60px;
    align-items : center;
    justify-content: center;
`;
///////////////////////////////////
const TitleView = styled.View`
    width: 100%;
    height: 80px;
    padding: 5px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`;
const TimeView = styled.View`
    border: 2px solid #000000;
    border-radius: 15px;
    width: 150px;
    height: 60px;
    align-items: center;
    justify-content: center;
`;
const Filter = styled.Text`
    margin-left: 10px;
    font-size: 15px;
`;
//ShopList는 추후 FlatList로 변경 해야함
const ShopList = styled.View`
    flex: 1;
    width: 100%;
`;
//현재 입찰에 참여중인 업체들
const DATA = [{
    id:1,
    name: '올댓 오토모빌',
    simpleRegion: '서울 광진',
    price: 20000000,
    contents: '구체 견적들 ex) 썬팅: T70 15, 블랙박스: 파인뷰LX5000 ...',
},{
    id:2,
    name: '카샵1',
    simpleRegion: '서울 금천',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:3,
    name: '카샵2',
    simpleRegion: '서울 서초',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:4,
    name: '카샵3',
    simpleRegion: '서울 송파',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:5,
    name: '카샵4',
    simpleRegion: '서울 강남',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:6,
    name: '카샵5',
    simpleRegion: '서울 종로',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:7,
    name: '카샵6',
    simpleRegion: '서울 은평',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:8,
    name: '카샵7',
    simpleRegion: '서울 마포',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:9,
    name: '카샵8',
    simpleRegion: '서울 금천',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:10,
    name: '카샵9',
    simpleRegion: '서울 금천',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:11,
    name: '카샵10',
    simpleRegion: '서울 금천',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    id:12,
    name: '카샵11',
    simpleRegion: '서울 금천',
    price: 15000000,
    contents: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
}];

function PackageScreen_5(props){
    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TitleView>
                <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>{props.route.params.carName}</Text>
                <TimeView>
                    <Text style={{fontSize: 25}}>23:59:58</Text>
                </TimeView>
            </TitleView>
            <ContentView>
                <Filter>-최신순</Filter>
                <ShopList>
                    <ScrollView>
                        {_.map(DATA, (item)=>{
                            return(
                                <Shop key={item.id} item={[item]} navigation={props.navigation}></Shop>
                            )
                        })}
                    </ScrollView>
                </ShopList>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>홈으로</Button>
                    </Row>
                </BtnView>
            </ContentView>

        </TotalView>
    );
}

export default PackageScreen_5;