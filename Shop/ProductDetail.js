import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import _ from 'lodash';
import ExpandProduct from './ExpandProduct';

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


function ProductDetail(props){

    return (
        <View style={{backgroundColor: 'white'}}>
            <TitleView>
                <Title>{props.title}</Title>
            </TitleView>
            <ContentView>
                {_.map(props.list , (item) => {
                    return(
                        <ExpandProduct item={[item]} key={item.name}></ExpandProduct>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default ProductDetail;