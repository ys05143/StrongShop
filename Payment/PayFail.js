import React from 'react';
import TotalView from '../components/TotalView';
import { View, Alert, ActivityIndicator, Text } from 'react-native';
import IMP from 'iamport-react-native';
import { Button, Title } from 'react-native-paper';
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

function PayFail(props){
    const [isSending, setIsSending] = React.useState(false);

    return(
        <TotalView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Title>결제 중 오류가 발생하였습니다.</Title>
                <Title>다시 시도해주세요.</Title>
                <Button mode={"contained"} disabled={isSending} color={Color.main} onPress={()=>{props.navigation.popToTop()}} style={{marginTop: 10, width: 120, height: 50, justifyContent: 'center', alignItems: 'center'}} contentStyle={{width: 120, height: 50}}>홈으로</Button>
                {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: 'transparent'}}>
                    <ActivityIndicator size = 'small' color= {Color.main}/>
                </View>}
            </View>
        </TotalView>
    )
}

export default PayFail;