import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import _ from 'lodash';
import ExpandProduct from './ExpandProduct';

const TitleView = styled.View`
    width: 100%;
    margin-left: 10px;
    margin-top: 10px;
`;
const Title = styled.Text`
    font-size: 30px;
    font-family: 'DoHyeon-Regular';
`;
const ContentView = styled.View`
    padding: 10px 20px;
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
                        <ExpandProduct item={[item]} key={item.id}></ExpandProduct>
                    );
                })}
            </ContentView>
        </View>
    );
}

export default ProductDetail;