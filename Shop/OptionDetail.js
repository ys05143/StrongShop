import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import _ from 'lodash';
import ExpandOptions from './ExpandOptions';

const TitleView = styled.View`
    width: 100%;
    padding: 10px;
`;
const Title = styled.Text`
    font-size: 35px;
    font-family: 'EastSeaDokdo-Regular';
`;
const ContentView = styled.View`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
`;


function OptionDetail(props){

    return (
        <View style={{backgroundColor: 'white'}}>
            <TitleView>
                <Title>{props.title}</Title>
            </TitleView>
            <ContentView>
                {_.map(props.list , (item) => {
                    return(
                        <ExpandOptions item={[item]} key={item.name}></ExpandOptions>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default OptionDetail;