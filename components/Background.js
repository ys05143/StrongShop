import React from "react";
import styled from "styled-components/native"
import { View, Text, Platform, Dimensions, ScrollView } from "react-native"
import { isIphoneX } from "react-native-iphone-x-helper";
import { getStatusBarHeight } from 'react-native-status-bar-height';
//constant
import Color from "../constants/Color";
import AppWindow from "../constants/AppWindow";

const WIDTH = AppWindow.width;
const NOTCH = AppWindow.IOS_notch;
const REALHEIGHT = AppWindow.realHeight;

const LargeCircleWidth = 1000;
const SmallCircleWidth = 970;
const TopValue = -770;

const SmallCircle = styled.View`
    width : ${SmallCircleWidth}px;
    height : ${SmallCircleWidth}px;
    border-radius: ${SmallCircleWidth/2}px;
    background-color: ${Color.main};
`;
const LargeCircle = styled.View`
    width : ${LargeCircleWidth}px;
    height : ${LargeCircleWidth}px;
    border-radius: ${LargeCircleWidth/2}px;
    background-color: ${Color.sub};
    align-items: center;
    justify-content: center ;
    top: ${TopValue}px;
    position: absolute;
`;
const Total = styled.View`
    width: ${WIDTH}px;
    top: ${TopValue}px;
`;
const TopBox = styled.View`
    width: 100%;
    height: ${(LargeCircleWidth+TopValue)-NOTCH}px;
    position: absolute;
    margin-top: ${NOTCH}px;
`;
const TotalView = styled.View`
    width: 100%;
    height: ${REALHEIGHT - (LargeCircleWidth+TopValue)}px;
    /* margin-top: ${NOTCH}px; */
    /* padding-top: ${(LargeCircleWidth+TopValue)}px; */
    margin-top: ${(LargeCircleWidth+TopValue)}px;
`;

function Background(props){
    return(
        <View style={{alignItems: 'center', backgroundColor: props.backgroundColor === null || props.backgroundColor === undefined ? 'white' : props.backgroundColor}}>
            <TotalView style={{backgroundColor: props.backgroundColor === null || props.backgroundColor === undefined ? 'white' : props.backgroundColor}}>
                {props.children}
            </TotalView>
            <LargeCircle>
                <SmallCircle/>
            </LargeCircle>
            <TopBox>
                {props.topbox}
            </TopBox>
        </View>
    )
}

export default Background;