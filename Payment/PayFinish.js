import React from 'react';
import TotalView from '../components/TotalView';
import { View, Alert, ActivityIndicator } from 'react-native';
import IMP from 'iamport-react-native';
import { Button } from 'react-native-paper';
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

function PayFinish(props){
    const [response, setResponse] = React.useState(props.route.params.response);
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);
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

    return(
        <TotalView>
            <Button mode={"contained"} disabled={isSending} color={Color.main} onPress={()=>{sendData()}}>결제완료</Button>
            {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'small' color= {Color.main}/>
            </View>}
        </TotalView>
    )
}

export default PayFinish;