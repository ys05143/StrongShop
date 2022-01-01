import React from 'react';
import styled from 'styled-components/native';
import TotalView from '../components/TotalView';
import { Alert, Text, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';
import _ from 'lodash';
import Row from '../components/Row';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const WIDTH = AppWindow.width;

const DATA = {
    pg: null,
    pay_method: 'card',
    name: '아임포트 결제데이터 분석',
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: '100',
    buyer_name: '홍길동',
    buyer_tel: '01012345678',
    buyer_email: 'example@naver.com',
    buyer_addr: '서울시 강남구 신사동 661-16',
    buyer_postcode: '06018',
    app_scheme: 'example',
    // [Deprecated v1.0.3]: m_redirect_url
};

const PayMode = styled.TouchableOpacity`
    width: 100px;
    height: 50px;
    border: 1px solid lightgray;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

const Pay = [
    {label: '카카오페이', mode: 'kakaopay'},
    {label: '무통장입금', mode: 'temp'},
    {label: '신용카드', mode: 'html5_inicis'},
    {label: '네이버페이', mode: 'naverpay'},
]

function PaymentScreen(props){
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);
    const [payData, setPayData] = React.useState(DATA);
    const [isSending, setIsSending] = React.useState(false);

    async function sendData(){
        try{
            setIsSending(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'POST',
                    url : `${server.url}/api/contract` ,
                    data : {
                        order_id: orderId,
                        bidding_id: bidId,
                    },
                    headers : {Auth: auth},
                })
                .catch(e=>{
                    checkErrorCode(e, props.navigation);
                })
                //console.log(response);
                props.navigation.replace("ProgressScreen", {orderId: orderId, state: 3, bidId: bidId});
                setIsSending(false);
            }
        }
        catch{
            Alert.alert(
                '오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    }

    function changePayData(key, value){
        let newData = {...DATA};
        if(key === 'pg') newData.pg = value;
        console.log(newData);
        setPayData(newData);
    }

    function MoveToPay(){
        //check null
        if(payData.pg === null){
            Alert.alert(
                '오류',
                '결제 방법을 선택해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
        else{
            // //move
            // if(payData.pg === 'kakaopay') props.navigation.navigate("KakaoPay", {payData: payData});
            // else if(payData.pg === 'html5_inicis') props.navigation.navigate("Inicis", {payData: payData});
            // else console.log('else');
            props.navigation.replace("Pay", {payData: payData, orderId: orderId, bidId: bidId});
        }
    }

    function OnePayMode(item){
        return(
            <View key={item.mode} style={{width: WIDTH/3, height: 70, justifyContent: 'center', alignItems: 'center'}}>
                <PayMode onPress={()=>{changePayData('pg', item.mode)}}>
                    <Text>{item.label}</Text>
                </PayMode>
            </View>
        )
    }

    return(
        <TotalView notchColor={'white'}>
            <View style={{backgroundColor: 'white', paddingVertical: 10, marginBottom: 15}}>
                <Title style={{paddingHorizontal: 10}}>결제 방법</Title>
                <Row style={{width: '100%', flexWrap: 'wrap'}}>
                    {_.map(Pay , (item)=>{
                        return( 
                            OnePayMode(item) 
                        )})}
                </Row>
            </View>
            <Button mode={"contained"} color={Color.main} onPress={()=>{MoveToPay()}}>결제(테스트)하기</Button>
            <Button mode={"contained"} color={Color.main} onPress={()=>{sendData()}}>선택하기</Button>
        </TotalView>
    )
}

export default PaymentScreen;