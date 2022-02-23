import React from 'react';
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import styled from 'styled-components/native';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
//constant
import Color from '../constants/Color';
import storage from '../function/storage';
import checkJwt from '../function/checkJwt';
import Icon  from "react-native-vector-icons/Ionicons";
//server
import server from '../server';
import Order from '../components/Order';

const Total = styled.View`
    width: 100%;
    height: 500px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
`;
const SearchView = styled.ScrollView`
    width: 100%;
    margin-bottom: 5px;
`;
const DetailOptions = styled.View`
    height: 40px;
    padding: 0px 5px;
    margin-right: 5px;;
    border-radius: 20px;
    background-color: lightgray;
    justify-content: center;
`;

function FinalOrder(props){
    const [receipt, setReceipt] = React.useState(null);
    const [region, setRegion] = React.useState(null);
    const [isSending, setIsSending] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    async function finishOrder(){ // 서버에 오더 전송
        try{
            setIsSending(true);
            if(receipt !== null){
                const auth = await checkJwt();
                if(auth !== null){
                    const response = await axios({
                        method: 'POST',
                        url : `${server.url}/api/orders/ncp` ,
                        data : {
                            details: JSON.stringify(receipt),
                            region: region,
                        },
                        headers : {Auth: auth},
                    })
                    await AsyncStorage.removeItem('BidOrder', ()=>{
                        Alert.alert(
                            '완료',
                            '지금부터 입찰이 시작됩니다!',
                            [
                                {text: '확인', onPress: () => {
                                        console.log("remove async Bid")
                                        props.navigation.popToTop();
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    });
                    props.getModal(false);
                    setIsSending(false);
                }
                else{
                    Alert.alert(
                        '실패',
                        '로그인이 필요합니다.',
                        [
                            {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen"), props.getModal(false); setIsSending(false);}},
                        ],
                        { cancelable: false }
                    );
                }
            }
            else{
                Alert.alert(
                    '실패',
                    '작성한 견적이 없습니다.',
                    [
                        {text: '확인', onPress: () => { props.getModal(false); setIsSending(false)}},
                    ],
                    { cancelable: false }
                );
            }
            setIsSending(false); 
        }
        catch{
            Alert.alert(
                '견적 등록을 실패했습니다.',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => { props.getModal(false); setIsSending(false)}},
                ],
                { cancelable: false }
            );
        } 
    }

    function finalCheck(){
        Alert.alert(
            '최종 확인',
            '입찰을 시작하시겠습니까',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    finishOrder();
                }}
            ],
            { cancelable: false }
        );
    }


    const isFocused = useIsFocused();
    React.useEffect( ()=>{
        //console.log(isFocused);
        if(isFocused){
            setIsLoading(true);
            storage.fetch('BidOrder')
            .then(res =>{
                setReceipt(res);
                setRegion(res.region);
                setIsLoading(false);
            })
            .catch(e => {
                //console.log(e);
                Alert.alert(
                    '주문 불러오기 실패',
                    '다시 시도해주세요.',
                    [
                        {text: '확인', onPress: () => {props.getModal(false);}}
                    ],
                    { cancelable: false }
                );
            })
        }
    },[]);

    return (
        <>
        <Total>
            { receipt !== null && !isLoading && 
            <><Order item={receipt} kind={'NewCarPackage'}/>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button mode="contained" disabled={isSending} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{props.getModal(false);}}>
                    <Text>이전</Text>
                </Button>
                <Button mode="contained" disabled={isSending} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10 }} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{finalCheck();}}>
                    <Text>등록하기</Text>
                </Button>
            </View></>}
            {isSending && 
            <View style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: 500, backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </Total>
        {isLoading && 
            <View style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: 500, backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </>
    );
}

export default FinalOrder;