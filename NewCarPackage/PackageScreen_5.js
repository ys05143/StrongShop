import React from 'react';
import styled from 'styled-components';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Shop from './Shop';

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
    border: 1px solid #00ff00;
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
    border: 1px solid #0000ff;
    align-items: center;
`;

function PackageScreen_5(props){
    return(
        <TotalView>
            <TitleView>
                <Text style={{fontSize: 30}}>참여중인 업체</Text>
                <TimeView>
                    <Text style={{fontSize: 25}}>23:59:58</Text>
                </TimeView>
            </TitleView>
            <ContentView>
                <Filter>-최신순</Filter>
                <ShopList>
                    <Shop name="올댓 카니발" simpleRegion="서울/광진" price="20,000,000"></Shop>
                    <Shop name="대천 카샵" simpleRegion="충남/보령" price="15,000,000"></Shop>
                </ShopList>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={"#B2EBF4"}>홈으로</Button>
                    </Row>
                </BtnView>
            </ContentView>
            
        </TotalView>
    );
}

export default PackageScreen_5;