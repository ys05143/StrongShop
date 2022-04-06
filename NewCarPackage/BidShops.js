import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { Button, List, Divider, Title } from 'react-native-paper';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from "react-native-vector-icons/Ionicons";
import Row from '../components/Row';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import Receipt from '../components/Receipt';

const styles = {
    listAccordionStyle : {
        backgroundColor: 'white' ,
        borderTopWidth: 1 ,
        borderTopColor: 'lightgray'        
    } ,
    listStyle1 : {
        fontSize: 17 , 
        fontWeight: 'bold'
    } ,
    listStyle : {
        fontWeight: 'bold',
        fontSize: 15 , 
    } ,
    itemText: {
        fontSize: 15 ,
        fontWeight: 'bold' ,
        alignSelf: 'center'
    } ,
    labelStyle : {
        borderWidth: 1 , 
        borderColor: 'lightgray' 
    },
    receiptTitle:{
        fontSize: 15,
        fontWeight: 'bold',
    },
    receiptSubTitle:{
        fontSize: 13,
        marginLeft: 5,
    },
    receiptPrice:{
        fontSize: 15,
        fontWeight: 'bold'
    }
}
const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;
const ReceiptMatrixLine = styled.View`
    height: 1px;
    width: 100%;
    border-bottom-width: 1px;
    border-color: gray;
`;
const ReceiptItemView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    align-items: center;
`;

const ShopView = styled.View`
    width: 95%;
    border-bottom-width: 1px;
    border-color: gray;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const ShopView2 = styled.View`
    width: 95%;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const NameView = styled.View`
    width: 70%;
`;
const NameView2 = styled.TouchableOpacity`
    height: 35px;
    flex-direction: row;
    margin-left: 10px;
    align-items: center;
`;
const PriceView = styled.View`
    height: 35px;
    flex-direction: row;
    margin-left: 10px;
    align-items: center;
`;
const DetailView = styled.View`
    width: 95%;
    padding: 5px 5px 10px 5px;
    margin-bottom: 5px;
    background-color: 'rgb(246,246,246)';
`;

function BidShop(props, {navigation}) {
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);
    const [isSending, setIsSending] = React.useState(false);

    function finalCheck(orderId, bidId, kind){
        Alert.alert(
            '최종 확인',
            '이 업체로 선택하시겠습니까?',
            [
                {text: '취소', onPress: () => {
                    props.getSending(false);
                }},
                {text: '확인', onPress: async () => {
                    //sendData(orderId, bidId);
                    props.navigation.replace("PaymentScreen", {orderId: orderId, bidId: bidId, receipt: props.item, kind: kind});
                }}
            ],
            { cancelable: false }
        );
    }

    function _renderHeader (section, index, isActive) {
        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} style={{width: '95%', height: 50, justifyContent: 'center'}} contentStyle={{width: '95%', height: 50,}}>상세 견적</Button>
            </View>
        );
    };

    const _renderContent = section => {
        const item = JSON.parse(section.quote);
        return(
            <View style={{width: '100%', alignItems: 'center'}}>
                <DetailView>
                    <Receipt item={item} kind={props.kind}/>
                    <Button mode={'outlined'} disabled={isSending} color={'black'} style={{alignSelf: 'flex-end', borderRadius: 15, borderWidth: 2, borderColor: Color.main, backgroundColor: 'white'}} onPress={()=>{finalCheck(props.orderId, section.bidId, props.kind)}}>{isSending? '입찰등록중...':'선택하기' }</Button>
                </DetailView>
                
            </View>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <Accordion
        sections={props.item}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor='transparent'
        touchableComponent={TouchableOpacity}
        />
    );
}

export default BidShop;
