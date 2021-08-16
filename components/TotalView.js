import React from 'react';
import styled from 'styled-components';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const Total = styled.SafeAreaView`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background-color: white;
`;
const AllWindow = styled.View`
    flex: 1;
    background-color: white;
`;

function TotalView (props){
    return (
        <AllWindow>
            <Total>
                {props.children}
            </Total>
        </AllWindow>
    );
}

export default TotalView;