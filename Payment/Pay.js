import React from 'react';
import TotalView from '../components/TotalView';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import IMP from 'iamport-react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

function Pay(props){
    const [payData, setPayData] = React.useState(props.route.params.payData);
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);
    const [isSending, setIsSending] = React.useState(false);

    function callback(response) {
        console.log("imp_success "+imp_success);
        if(response.imp_success){
            sendData();
        }
        else{
            props.navigation.replace("PayFinish", {response: response, orderId: orderId, bidId: bidId});
        }
    }

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
            <View style= {{flex: 1}}>
                <IMP.Payment 
                    userCode={'imp01457748'}
                    // tierCode={'AAA'}
                    data = {payData}
                    callback= {callback}
                />
                <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                    <TouchableOpacity onPress={()=>{props.navigation.replace("PaymentScreen")}}>
                        <Icon name="close-outline" size={35} color={'black'}></Icon>
                    </TouchableOpacity>    
                </View>
            </View>
            {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    )
}

export default Pay;