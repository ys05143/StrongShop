import React from 'react';
import styled from 'styled-components/native';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const Total = styled.SafeAreaView`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
`;
const AllWindow = styled.View`
    flex: 1;
`;

function TotalView (props){
    return (
        <AllWindow style={{backgroundColor: props.notchColor}}>
            <Total style={{backgroundColor: props.color}}>
                {props.children}
            </Total>
        </AllWindow>
    );
}

export default TotalView;