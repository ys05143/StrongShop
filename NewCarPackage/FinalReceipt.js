import React from "react";
import styled from "styled-components/native";
import { Title, Button }  from 'react-native-paper';
import { View, Text } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Row from '../components/Row';
import Color from "../constants/Color";
import Receipt from "../components/Receipt";

const InfoView = styled.View`
    width: 95%;
    border-radius: 10px;
    padding: 5px 10px;
    border: 3px solid gray;
`;
const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;

function FinalReceipt(props){
    const [isModal, setIsModal] = React.useState(props.isModal);
    const shopData = props.receipt;
    const kind = props.kind;
    return(
        <View style={{alignItems: 'center'}}>
            <InfoView>
                <RowCenter>
                    <Icon name={'ellipse'} style={{marginRight: 5}}/>
                    <Title>시공내역</Title>
                </RowCenter>
                <Receipt item={shopData} kind={kind}/>
            </InfoView>
            {isModal && 
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{props.getModal(false);}}>
                    <Text>이전</Text>
                </Button>
            </View>}
        </View>
    );
}

export default FinalReceipt;