import React from 'react';
import styled from 'styled-components/native';
import AppWindow from '../constants/AppWindow';
import { Platform,Dimensions } from 'react-native';
import { isIphoneX } from "react-native-iphone-x-helper";

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
const NOTCH = AppWindow.IOS_notch;
const HOMEINDICATOR = AppWindow.HomeIndicator;
const Total = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
`;
const Notch = styled.View`
    width: ${WIDTH}px;
    height: ${Platform.OS === 'ios'? isIphoneX() ? NOTCH: 0 : 0}px;
`;
const HomeIndicator = styled.View`
    width: ${WIDTH}px;
    height: ${Platform.OS === 'ios'? isIphoneX() ? HOMEINDICATOR: 0 : 0}px;
`;
const AllWindow = styled.View`
    flex: 1;
`;

function TotalView (props){
    return (
        <AllWindow>
            <Notch style={{backgroundColor: props.notchColor}}/>
            <Total style={{backgroundColor: props.color}}>
                {props.children}
            </Total>
            <HomeIndicator style={{backgroundColor: props.homeIndicatorColor}}/>
        </AllWindow>
    );
}

export default TotalView;