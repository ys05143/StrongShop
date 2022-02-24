import React from 'react';
import styled from 'styled-components/native';
import { Alert, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Button, Title } from 'react-native-paper';
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from "react-native-vector-icons/Ionicons";
//component
import Receipt from '../components/Receipt';
import Row from '../components/Row';
import TotalView from '../components/TotalView';
//constant
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const WIDTH = AppWindow.width;

const DATA = {
    pg: '',
    pay_method: '',
    name: '',
    merchant_uid: '',
    amount: '',
    buyer_name: '',
    buyer_tel: '',
    buyer_email: '',
    buyer_addr: '',
    buyer_postcode: '',
    app_scheme: '',
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
const PolicySeperator = styled.View`
    width: 1px;
    height: 13px;
    border-right-width: 1px;
    border-color: gray;
    margin-right: 5px;
    margin-left: 5px;
`;
const PolicyText = styled.Text`
    color: gray;
`;

const Pay = [
    {id: 0, label: '신용카드', pg: 'uplus', pay_method: 'card'},
    {id: 1, label: '무통장입금', pg: 'uplus', pay_method: 'vbank'},
    {id: 2, label: '카카오페이', pg: 'kakaopay', pay_method: 'card'},
    {id: 3, label: '토스페이', pg: 'tosspay', pay_method: 'card'},
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
    const [kind, setKind] = React.useState(props.route.params.kind);
    const [payData, setPayData] = React.useState(DATA);
    const [baseData, setBaseData] = React.useState(null);
    const [payName, setPayName] = React.useState('');
    const [payIndex, setPayIndex] = React.useState()
    const [isLoading, setIsLoading] = React.useState(false);
    const [activeSections, setActiveSections] = React.useState([]);
    const [test, setTest] = React.useState(true);

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
                });
                const rawData = response.data.data;
                console.log(rawData);
                setBaseData({
                    pg: null,
                    pay_method: null,
                    name: '아임포트 결제데이터 분석',
                    merchant_uid: `mid_${new Date().getTime()}`,
                    amount: rawData.role === 'DEALER' ? (JSON.parse(receipt[0].quote).totalPrice * 10000) *0.05 : (JSON.parse(receipt[0].quote).totalPrice * 10000) *0.1,
                    buyer_name: rawData.nickname,
                    buyer_tel: rawData.phonenumber,
                    buyer_email: 'example@naver.com',
                    buyer_addr: '서울시 강남구 신사동 661-16',
                    buyer_postcode: '06018',
                    app_scheme: 'example',
                    // [Deprecated v1.0.3]: m_redirect_url
                });
                setPayData({
                    pg: 'uplus',
                    pay_method: 'card',
                    name: '아임포트 결제데이터 분석',
                    merchant_uid: `mid_${new Date().getTime()}`,
                    amount: rawData.role === 'Dealer' ? (JSON.parse(receipt[0].quote).totalPrice * 10000) *0.05 : (JSON.parse(receipt[0].quote).totalPrice * 10000) *0.1,
                    buyer_name: rawData.nickname,
                    buyer_tel: rawData.phonenumber,
                    buyer_email: 'example@naver.com',
                    buyer_addr: '서울시 강남구 신사동 661-16',
                    buyer_postcode: '06018',
                    app_scheme: 'example',
                    // [Deprecated v1.0.3]: m_redirect_url
                });
                setPayName('신용카드');
                setPayIndex(0);
                // console.log({
                //     pg: 'uplus',
                //     pay_method: 'card',
                //     name: '아임포트 결제데이터 분석',
                //     merchant_uid: `mid_${new Date().getTime()}`,
                //     amount: JSON.parse(receipt[0].quote).totalPrice,
                //     buyer_name: rawData.nickname,
                //     buyer_tel: rawData.phonenumber,
                //     buyer_email: 'example@naver.com',
                //     buyer_addr: '서울시 강남구 신사동 661-16',
                //     buyer_postcode: '06018',
                //     app_scheme: 'example',
                //     // [Deprecated v1.0.3]: m_redirect_url
                // });
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '정보 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.goBack();}},
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
                props.navigation.replace("ProgressScreen_2", {orderId: orderId, state: 3, bidId: bidId});
                setIsLoading(false);
            }
        }
        catch{
            Alert.alert(
                '오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.goBack();}},
                ],
                { cancelable: false }
            );
        }
    }

    function changePayData(key, item){
        let newData = {...baseData};
        if(key === 'pg') {newData.pg = item.pg; newData.pay_method = item.pay_method}
        console.log(newData);
        setPayData(newData);
        setPayName(item.label);
        setPayIndex(item.id)
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
            props.navigation.replace("Pay", {payData: payData, orderId: orderId, bidId: bidId, kind: kind});
        }
    }

    function OnePayMode(item, index){
        return(
            // <View key={item.label} style={{width: WIDTH/3, height: 70, justifyContent: 'center', alignItems: 'center'}}>
            //     <PayMode style={{borderColor: payName === item.label ? Color.main : 'lightgray', backgroundColor: payName === item.label ? Color.main : 'white'}} onPress={()=>{changePayData('pg', item)}}>
            //         <Text style={{color: payName === item.label ? 'white' : 'black'}}>{item.label}</Text>
            //     </PayMode>
            // </View>
            <TouchableOpacity key={item.label} style={{paddingHorizontal: 10, flexDirection: 'row', width: '100%', height: 50, alignItems: 'center', borderColor: payName === item.label? Color.main : 'lightgray', borderBottomWidth: index === payIndex -1 ? 0 : 2, borderLeftWidth: 2, borderRightWidth: 2, borderTopWidth: index === 0 || payName === item.label ? 2 : 0}} onPress={()=>{changePayData('pg', item)}}>
                <Icon name={payName === item.label ? "radio-button-on-outline" : "radio-button-off-outline"} size={20} style={{color: Color.main}}/>
                <Text style={{marginLeft: 10, color: payName === item.label ? Color.main : 'black'}}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    function _renderHeader (section, index, isActive) {
        return (
            <Row style={{width: '100%', alignItems: 'center'}}>
                <Title style={{paddingHorizontal: 10, fontWeight: 'bold'}}>시공 항목</Title>
                <Icon name={isActive ? "chevron-up-outline" : "chevron-down-outline"} size={25}/>
            </Row>
        )
    }

    const _renderContent = (section)=>{
        const item = JSON.parse(section.quote);
        return(
            <View style={{alignItems: 'center'}}>
                <View style={{width: '95%'}}>
                    <Receipt item={item} kind={kind}/>
                </View>
            </View>
        )
    }

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <>
        <TotalView notchColor={'white'} homeIndicatorColor={'white'}>
            <ScrollView>
                <View style={{borderBottomWidth: 1, borderColor: 'lightgray'}}>
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
                </View>
                <View style={{marginBottom: 10, backgroundColor: 'white'}}>
                    <Row style={{height: 50, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                        <Text style={styles.receiptTitle}>{"수수료 금액: "}</Text>
                        <Text style={styles.receiptPrice}>{Platform.OS ==='ios' ? payData.amount.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' }) : parseInt(payData.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원'}</Text>
                    </Row>
                    <View style={{alignItems: 'flex-end', justifyContent: 'center', marginBottom: 10, paddingRight: 5}}>
                        <Text style={{color: 'red'}}>시공가격은 현장결재 하시면 됩니다.</Text>
                    </View>
                </View>
                <View style={{backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 15}}>
                    <Title style={{fontWeight: 'bold', marginTop: 15, marginBottom: 10}}>수수료 결제 방법</Title>
                    <Row style={{width: '100%', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20}}>
                        {_.map(Pay , (item, index)=>{
                            return( 
                                OnePayMode(item, index) 
                            )})}
                    </Row>
                </View>
                <View style={{alignItems: 'center', width: '100%', paddingVertical: 30}}>
                    <Row style={{alignItems: 'center'}}>
                        <TouchableOpacity style={{paddingHorizontal: 10}}>
                            <Text>이용약관</Text>
                        </TouchableOpacity>
                        <PolicySeperator style={{borderColor: 'black'}}/>
                        <TouchableOpacity style={{paddingHorizontal: 10}}>
                            <Text>개인정보처리방침</Text>
                        </TouchableOpacity>
                        <PolicySeperator style={{borderColor: 'black'}}/>
                        <TouchableOpacity style={{paddingHorizontal: 10}}>
                            <Text>청소년보호정책</Text>
                        </TouchableOpacity>
                    </Row>
                    <Text style={{marginTop: 10}}>어메이킹스튜디오</Text>
                    <View style={{marginTop: 10, alignItems: 'center'}}>
                        <Row style={{alignItems: 'center'}}>
                            <PolicyText>주소</PolicyText>
                            <PolicySeperator/>
                            <PolicyText>{'경기도 화성시 동탄첨단산업1로 27, stay S921호'}</PolicyText>
                        </Row>
                        <PolicyText>{'(영천동, 금강펜테리움 IX타워)'}</PolicyText>
                    </View>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>대표</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>김용희</PolicyText>
                    </Row>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>사업자등록번호</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>437-07-02325</PolicyText>
                    </Row>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>제공자</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>어메이킹스튜디오</PolicyText>
                    </Row>
                </View>
                {false && <Button mode={"contained"} color={Color.main} onPress={()=>{sendData()}} style={{margin: 5, height: 50, justifyContent: 'center'}}>넘어가기</Button>}
            </ScrollView>
            <View style={{width: '100%', height: 80, backgroundColor: 'white', paddingVertical: 10, borderTopStartRadius: 15, borderTopEndRadius: 15}}>
                <Button mode={"contained"} color={Color.main} disabled={isLoading} onPress={()=>{MoveToPay()}} style={{margin: 5, height: 50, justifyContent: 'center'}} contentStyle={{width: '100%', height: '100%'}}>결제하기</Button>
            </View>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
        
        </>
    )
}

export default PaymentScreen;