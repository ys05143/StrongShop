import React from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
//component
import TotalView from '../components/TotalView';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

function CareProgressScreen(props){
    const[orderId, setOrderId] = React.useState(props.route.params.orderId);
    const[state,setState] = React.useState(props.route.params.state);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/contract/care/1/${orderId}`,
                    headers : {Auth: auth},
                })
                .then(res=>console.log(res));
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen");}},
                    ],
                    { cancelable: false }
                );
            }
            setIsLoading(false);
        }
        catch{
            Alert.alert(
                '정보 조회 실패',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.navigate("MainScreen");}},
                ],
                { cancelable: false }
            );
        }
    
    }
    return(
        <TotalView notchColor={'white'} homeIndicatorColor={'white'}>

        </TotalView>
    )
}

export default CareProgressScreen;