import styled from "styled-components/native";
import React from "react";
import { ActivityIndicator } from "react-native";

const BackView = styled.View`
    width: 100%;
    height: 100%;
    background-color: 'rgba(0,0,0,0.3)';
    position: absolute;
    align-items: center;
    justify-content: center;
`;

function TotalIndicator(props) {
    return (
        <BackView>
            <ActivityIndicator size = {props.size === null || props.size === undefined ? 'small' : props.size} color={props.color === null || props.color === undefined ? 'black' : props.color}/>
        </BackView>
    )
}

export default TotalIndicator;