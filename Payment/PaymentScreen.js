import React from 'react';
import styled from 'styled-components/native';
import TotalView from '../components/TotalView';
import { Alert, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Title } from 'react-native-paper';
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';
import _ from 'lodash';
import Row from '../components/Row';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from "react-native-vector-icons/Ionicons";
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const WIDTH = AppWindow.width;

const DATA = {
    pg: 'html5_inicis',
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
    border: 1px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;

const Pay = [
    {label: '신용카드', mode: 'html5_inicis'},
    {label: '무통장입금', mode: 'temp'},
    {label: '네이버페이', mode: 'naverpay'},
    {label: '카카오페이', mode: 'kakaopay'},
    {label: '토스페이', mode: 'tosspay'},
]

const styles = {
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
    border-color: lightgray;
`;
const ReceiptItemView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    align-items: center;
`;

function PaymentScreen(props){
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);
    const [receipt, setReceipt] = React.useState(props.route.params.receipt);
    const [payData, setPayData] = React.useState(DATA);
    const [isLoading, setIsLoading] = React.useState(false);
    const [activeSections, setActiveSections] = React.useState([]);
    const [test, setTest] = React.useState(false);

    React.useEffect(()=>{
        getData();
    },[])

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/user`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                setPayData({
                    pg: 'html5_inicis',
                    pay_method: 'card',
                    name: '아임포트 결제데이터 분석',
                    merchant_uid: `mid_${new Date().getTime()}`,
                    amount: JSON.parse(receipt[0].quote).totalPrice,
                    buyer_name: rawData.nickname,
                    buyer_tel: rawData.phonenumber,
                    buyer_email: 'example@naver.com',
                    buyer_addr: '서울시 강남구 신사동 661-16',
                    buyer_postcode: '06018',
                    app_scheme: 'example',
                    // [Deprecated v1.0.3]: m_redirect_url
                })
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '오류',
                '정보 불러오기에 실패했습니다.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    async function sendData(){
        try{
            setIsLoading(true);
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
                setIsLoading(false);
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
        let newData = {...payData};
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
                <PayMode style={{borderColor: payData.pg === item.mode ? Color.main : 'lightgray', backgroundColor: payData.pg === item.mode ? Color.main : 'white'}} onPress={()=>{changePayData('pg', item.mode)}}>
                    <Text style={{color: payData.pg === item.mode ? 'white' : 'black'}}>{item.label}</Text>
                </PayMode>
            </View>
        )
    }

    function _renderHeader (section, index, isActive) {
        return (
            <Row style={{width: '100%', alignItems: 'center',}}>
                <Title style={{paddingHorizontal: 10, fontWeight: 'bold'}}>결제 항목</Title>
                <Icon name={isActive ? "chevron-down-outline" : "chevron-forward-outline"} size={25}/>
            </Row>
        )
    }

    const _renderContent = (section)=>{
        const item = JSON.parse(section.quote);
        return(
            <View style={{alignItems: 'center'}}>
            <View style={{width: '95%'}}>
                <Row style={{height: 30, justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Row>
                        <Text style={{fontSize: 13}}>{"시 공"}</Text>
                        <Text style={{fontSize: 13, marginLeft: 20}}>{'상 품 명'}</Text>
                    </Row>
                    <Text style={{fontSize: 13}}>{'금  액'}</Text>
                </Row>
                <ReceiptMatrixLine/>
                {
                    item.tinting != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[틴팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.tinting}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.tintingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.ppf != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[PPF]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.ppf}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.ppfPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.blackbox != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[블랙박스]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.blackbox}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.blackboxPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.battery != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[보조배터리]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.battery}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.batteryPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.afterblow != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[애프터블로우]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.afterblow}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.afterblowPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.soundproof != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[방음]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.soundproof}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.soundproofPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.wrapping != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[랩핑]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.wrapping}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.wrappingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.glasscoating != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[유리막코팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.glasscoating}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{item.glasscoatingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    item.undercoating != null && (
                        <ReceiptItemView>
                            <Row>
                                <Text style={styles.receiptTitle}>{"[언더코팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{item.undercoating}</Text>
                            </Row>
                            <Text style={styles.receiptPrice}>{item.undercoatingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                <ReceiptMatrixLine/>
            </View>
            </View>
        )
    }

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <TotalView notchColor={'white'}>
            <ScrollView>
            <Accordion
                containerStyle={{backgroundColor: 'white', paddingVertical: 10}}
                sections={receipt}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
                underlayColor='transparent'
                touchableComponent={TouchableOpacity}
                />
            <Row style={{height: 50, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', marginBottom: 10, paddingHorizontal: 10}}>
                <Text style={styles.receiptTitle}>{"최 종 가 격: "}</Text>
                <Text style={styles.receiptPrice}>{JSON.parse(receipt[0].quote).totalPrice+' 만원'}</Text>
            </Row>
            <View style={{backgroundColor: 'white', paddingVertical: 10, marginBottom: 10}}>
                <Title style={{paddingHorizontal: 10, fontWeight: 'bold'}}>결제 방법</Title>
                <Row style={{width: '100%', flexWrap: 'wrap'}}>
                    {_.map(Pay , (item)=>{
                        return( 
                            OnePayMode(item) 
                        )})}
                </Row>
            </View>
            <Button mode={"contained"} color={Color.main} disabled={isLoading} onPress={()=>{MoveToPay()}} style={{margin: 5, height: 50, justifyContent: 'center'}}>결제하기</Button>
            {test && <Button mode={"contained"} color={Color.main} onPress={()=>{sendData()}} style={{margin: 5, height: 50, justifyContent: 'center'}}>넘어가기</Button>}
            </ScrollView>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    )
}

export default PaymentScreen;