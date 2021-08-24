import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { ScrollView, Text,View } from 'react-native';
//constants
import Color from '../constants/Color';
//pages
import TintingDetail from './TintingDetail';
import BlackBoxDetail from './BlackBoxDetail';

const merchadiseList= [
{
    name: '틴팅',
    title: 'Tinting',
},{
    name: '블랙박스',
    title: 'BlackBox',
},{
    name: '유리막코팅',
    title: 'GlassCoating',
},{
    name: '하부코팅',
    title: 'UnderCoating',
},{
    name: 'PPF',
    title: 'PPF',
},{
    name: '하부방음',
    title: 'UnderDeafening',
},
];

const Total = styled.View``;

const Option = styled.ScrollView`
    height: 70px;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: white;
`;
const OptionView = styled.View`
    width: 90px;
    height: 60px;
    justify-content: center;
    align-items: center;
`;
const OptionName = styled.TouchableOpacity`
    padding: 5px;
    border-radius: 10px;
    border: 2px solid gray;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
`;

function Merchandise_2(){
    //shopName으로 서버에 정보 요청해서 각 페이지에 나눠줘도 됨.
    const [shopName, setShopName] = React.useState('ALL THAT CARNIVAL');
    const [show, setShow] = React.useState('Tinting');

    return(
        <Total>
            <Option horizontal={true} contentContainerStyle={{alignItems: 'center'}}>
                {_.map(merchadiseList, (item) => {
                    return(
                        <OptionView key={item.title}>
                            <OptionName style={{borderColor: show === item.title ? Color.main : 'gray'}} onPress={()=>{setShow(item.title)}}>
                                <Text style={{color: show === item.title ? Color.main : 'gray'}}>{item.name}</Text>
                            </OptionName>
                        </OptionView>
                    );}
                )}
            </Option>
            {show === 'Tinting' && <TintingDetail>{shopName}</TintingDetail>}
            {show === 'BlackBox' && <BlackBoxDetail>{shopName}</BlackBoxDetail>}
        </Total>
    )
}

export default Merchandise_2;