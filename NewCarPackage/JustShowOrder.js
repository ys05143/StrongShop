import React from 'react';
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import styled from 'styled-components/native';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
//constant
import Color from '../constants/Color';
import storage from '../function/storage';
import Icon  from "react-native-vector-icons/Ionicons";
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from "../function/checkErrorCode";
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

function JustShowReceipt(props){
    const [receipt, setReceipt] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    async function getData(){
        try{
            setIsLoading(true);
            //console.log(props.orderId);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/orders/${props.orderId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                setReceipt(JSON.parse(rawData.detail));
                //console.log(JSON.parse(rawData.detail));
            }
            else{
                console.log("no login");
            }
            setIsLoading(false);
        }
        catch{e=>{
            console.log(e);
            Alert.alert(
                '정보 조회 실패',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.getModal(false);}},
                ],
                { cancelable: false }
            );
            }
        }  
    }

    //서버요청으로 변경해야함.
    const isFocused = useIsFocused();
    React.useEffect( ()=>{
        //console.log(isFocused);
        if(isFocused){
            getData();
        }
    },[]);

    return (
        <>
        <Total>
            { receipt !== null && !isLoading ? <Order item={receipt}/> : 
            <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
                <ActivityIndicator size = 'small' color= {Color.main}/>
            </View>}
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
                <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{props.getModal(false);}}>
                    <Text>이전</Text>
                </Button>
            </View>
        </Total>
        </>
    );
}

export default JustShowReceipt;