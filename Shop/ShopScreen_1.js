import React from 'react';
import styled from 'styled-components';
import { Text, View, SafeAreaView, Button } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//pages
import IntroduceShop from './IntroduceShop';
import Gallery from './Gallery';
import Merchandise from './Merchandise';
import Merchandise_2 from './Merchandise_2';
import ReviewList from './ReviewList';
//components
import TotalView from '../components/TotalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const WIDTH = AppWindow.width;
///////////////////////////////
const IntroView = styled.View`
    flex: 3;
    width: 100%;
    padding: 5px;
    background-color: ${Color.main};
`;
const Intro = styled.View`
    width: 80%;
`;
const ContentView = styled.View`
    flex: 6;
    width: 100%;
    border: 1px solid #00ff00;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
    margin-left: 20px;
    color: #ffffff;
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

const Tab = createMaterialTopTabNavigator();
  
function ShopScreen_1(props){
   
    return(
        <TotalView>
            <IntroView>
                <Icon name="chevron-back-outline" size={35} color={'white'} onPress={()=>{ props.navigation.goBack() }}></Icon>
                <Intro>
                    <IntroText>ALL THAT AUTOMOBILE</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
              <Tab.Navigator backBehavior={'none'} screenOptions={{ swipeEnabled: false, 
                                                                    tabBarIndicatorStyle: {backgroundColor: Color.main},
                                                                    tabBarActiveTintColor: Color.main }}>
                <Tab.Screen name="소개" component={IntroduceShop} />
                <Tab.Screen name="작업갤러리" component={Gallery} />
                <Tab.Screen name="취급상품" component={Merchandise_2} />
                <Tab.Screen name="리뷰" component={ReviewList} />
              </Tab.Navigator>
            </ContentView>
        </TotalView>
    );
}

export default ShopScreen_1;